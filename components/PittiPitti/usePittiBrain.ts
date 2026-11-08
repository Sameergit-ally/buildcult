import { useCallback, useEffect, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent, RefObject } from 'react';
import { PITTI_CONFIG as C } from './config';
import { pickMessage } from './messages';
import type { MessageContext } from './messages';

export type Mood = 'idle' | 'walk' | 'dance' | 'jump' | 'sleep' | 'wake';

export interface BubbleState {
  id: number;
  kind: 'say' | 'ask';
  text: string;
}

interface Vec { x: number; y: number }
interface CursorState extends Vec { active: boolean; lastMove: number; hopped: boolean }

interface Options {
  rootRef: RefObject<HTMLDivElement | null>;
  flipRef: RefObject<HTMLDivElement | null>;
  pupilsRef: RefObject<SVGGElement | null>;
  displayName: string;
  askNameOnStart: boolean;
  enabled: boolean;
}

const rand = (min: number, max: number) => min + Math.random() * (max - min);
const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

export function usePittiBrain({
  rootRef, flipRef, pupilsRef, displayName, askNameOnStart, enabled,
}: Options) {
  const [mood, setMoodState] = useState<Mood>('idle');
  const [bubble, setBubble] = useState<BubbleState | null>(null);

  // High-frequency values live in refs (no re-render at 60fps).
  const moodRef = useRef<Mood>('idle');
  const posRef = useRef<Vec | null>(null);
  const targetRef = useRef<Vec | null>(null);
  const facingRef = useRef<1 | -1>(1);
  const cursorRef = useRef<CursorState>({ x: 0, y: 0, active: false, lastMove: 0, hopped: false });
  const lastActivityRef = useRef(0);
  const pauseUntilRef = useRef(0);
  const hoveredRef = useRef(false);
  const lastHoverRef = useRef(-Infinity);
  const bubbleOpenRef = useRef(false);
  const askOpenRef = useRef(false);
  const bubbleIdRef = useRef(0);
  const nameRef = useRef(displayName);
  const startAskRef = useRef(askNameOnStart);
  const introDoneRef = useRef(false);
  const reducedRef = useRef(false);
  const timers = useRef({ bubble: 0, mood: 0, chain: 0 });

  useEffect(() => { nameRef.current = displayName; }, [displayName]);

  // prefers-reduced-motion
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => { reducedRef.current = mq.matches; };
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  // Clear every timer on unmount
  useEffect(() => {
    const t = timers.current;
    return () => {
      window.clearTimeout(t.bubble);
      window.clearTimeout(t.mood);
      window.clearTimeout(t.chain);
    };
  }, []);

  const setMood = useCallback((next: Mood, durationMs?: number) => {
    window.clearTimeout(timers.current.mood);
    window.clearTimeout(timers.current.chain);
    moodRef.current = next;
    setMoodState(next);
    if (durationMs !== undefined) {
      timers.current.mood = window.setTimeout(() => {
        if (moodRef.current !== next) return;
        moodRef.current = 'idle';
        setMoodState('idle');
        pauseUntilRef.current = performance.now() + rand(C.pauseMs.min, C.pauseMs.max);
      }, durationMs);
    }
  }, []);

  const clearBubble = useCallback(() => {
    window.clearTimeout(timers.current.bubble);
    bubbleOpenRef.current = false;
    askOpenRef.current = false;
    pauseUntilRef.current = performance.now() + 1200;
    setBubble(null);
  }, []);

  const showBubble = useCallback((kind: 'say' | 'ask', text: string) => {
    window.clearTimeout(timers.current.bubble);
    bubbleOpenRef.current = true;
    askOpenRef.current = kind === 'ask';
    bubbleIdRef.current += 1;
    setBubble({ id: bubbleIdRef.current, kind, text });
    if (kind === 'say') timers.current.bubble = window.setTimeout(clearBubble, C.bubbleMs);
  }, [clearBubble]);

  const say = useCallback((ctx: MessageContext, nameOverride?: string) => {
    showBubble('say', pickMessage(ctx, nameOverride ?? nameRef.current));
  }, [showBubble]);

  const wake = useCallback(() => {
    if (moodRef.current !== 'sleep') return;
    setMood('wake', 1000);
    say('wake');
  }, [setMood, say]);

  const markActive = useCallback(() => {
    lastActivityRef.current = performance.now();
    if (moodRef.current === 'sleep') wake();
  }, [wake]);

  // ---- UI handlers -------------------------------------------------------
  const onHover = useCallback((e: ReactPointerEvent<HTMLElement>) => {
    if (e.pointerType === 'touch') return;
    hoveredRef.current = true;
    const now = performance.now();
    lastActivityRef.current = now;
    if (moodRef.current === 'sleep') { wake(); return; }
    if (askOpenRef.current || now - lastHoverRef.current < C.hoverCooldownMs) return;
    lastHoverRef.current = now;
    targetRef.current = null;
    if (!reducedRef.current) setMood('dance', 1600);
    say('hover');
  }, [say, setMood, wake]);

  const onLeave = useCallback(() => { hoveredRef.current = false; }, []);

  const onClick = useCallback(() => {
    lastActivityRef.current = performance.now();
    if (moodRef.current === 'sleep') { wake(); return; }
    if (askOpenRef.current) return;
    targetRef.current = null;
    if (!reducedRef.current) {
      setMood('jump', 650);
      timers.current.chain = window.setTimeout(() => setMood('dance', 1500), 650);
    }
    say('click');
  }, [say, setMood, wake]);

  // ---- Main animation loop: roam, follow, look ----------------------------
  useEffect(() => {
    if (!enabled) return;
    const root = rootRef.current;
    const flip = flipRef.current;
    if (!root || !flip) return;

    const size = C.size;
    const margin = C.viewportMargin;
    const bounds = () => ({
      maxX: Math.max(margin, window.innerWidth - size - margin),
      maxY: Math.max(margin, window.innerHeight - size - margin),
    });

    const start = performance.now();
    if (!posRef.current) {
      const b = bounds();
      posRef.current = { x: b.maxX - 24, y: b.maxY };
    }
    lastActivityRef.current = start;
    pauseUntilRef.current = start + 2500;

    let appliedFacing = 0;
    const eye = { x: 0, y: 0 };

    const randomSpot = (): Vec => {
      const b = bounds();
      const cur = cursorRef.current;
      let spot: Vec = { x: rand(margin, b.maxX), y: rand(margin, b.maxY) };
      for (let i = 0; i < 3 && cur.active; i++) {
        if (Math.hypot(spot.x + size / 2 - cur.x, spot.y + size / 2 - cur.y) > 110) break;
        spot = { x: rand(margin, b.maxX), y: rand(margin, b.maxY) };
      }
      return spot;
    };

    const spotNearCursor = (p: Vec): Vec | null => {
      const cur = cursorRef.current;
      const b = bounds();
      const px = p.x + size / 2;
      const py = p.y + size / 2;
      const d = Math.hypot(px - cur.x, py - cur.y);
      if (d < C.followDistance + 60) return null;
      return {
        x: clamp(cur.x + ((px - cur.x) / d) * C.followDistance - size / 2, margin, b.maxX),
        y: clamp(cur.y + ((py - cur.y) / d) * C.followDistance - size / 2, margin, b.maxY),
      };
    };

    let raf = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const p = posRef.current;
      if (!p) return;
      const cur = cursorRef.current;
      const calm = !bubbleOpenRef.current && !hoveredRef.current;
      let m = moodRef.current;

      if (m === 'walk' && (!targetRef.current || !calm)) {
        targetRef.current = null;
        setMood('idle');
        m = 'idle';
      }

      if (m === 'walk' && targetRef.current) {
        const t = targetRef.current;
        const dx = t.x - p.x;
        const dy = t.y - p.y;
        const dist = Math.hypot(dx, dy);
        const step = C.speed * dt;
        if (dist <= step + 0.5) {
          p.x = t.x;
          p.y = t.y;
          targetRef.current = null;
          setMood('idle');
          pauseUntilRef.current = now + rand(C.pauseMs.min, C.pauseMs.max);
        } else {
          p.x += (dx / dist) * step;
          p.y += (dy / dist) * step;
          if (Math.abs(dx) > 3) facingRef.current = dx > 0 ? 1 : -1;
        }
      } else if (m === 'idle' && calm && !reducedRef.current && now >= pauseUntilRef.current) {
        let t: Vec | null = null;
        if (cur.active && !cur.hopped && now - cur.lastMove > C.cursorIdleMs) {
          cur.hopped = true;
          t = spotNearCursor(p);
        } else if (C.roam) {
          t = randomSpot();
        }
        if (t) {
          targetRef.current = t;
          setMood('walk');
        } else {
          pauseUntilRef.current = now + 1000;
        }
      }

      // eyes follow the cursor (or the walking direction)
      const pupils = pupilsRef.current;
      if (pupils) {
        let tx = 0;
        let ty = 0;
        if (cur.active) {
          const dx = cur.x - (p.x + size / 2);
          const dy = cur.y - (p.y + size * 0.45);
          const d = Math.hypot(dx, dy) || 1;
          const k = Math.min(1, d / 200);
          tx = (dx / d) * 2.6 * k * facingRef.current; // svg is mirrored when facing left
          ty = (dy / d) * 2.2 * k;
        } else if (m === 'walk') {
          tx = 2;
        }
        eye.x += (tx - eye.x) * 0.18;
        eye.y += (ty - eye.y) * 0.18;
        pupils.style.transform = `translate(${eye.x.toFixed(2)}px, ${eye.y.toFixed(2)}px)`;
      }

      const b = bounds();
      p.x = clamp(p.x, margin, b.maxX);
      p.y = clamp(p.y, margin, b.maxY);
      root.style.transform = `translate3d(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px, 0)`;
      if (appliedFacing !== facingRef.current) {
        appliedFacing = facingRef.current;
        flip.style.transform = `scaleX(${appliedFacing})`;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      const now = performance.now();
      const cur = cursorRef.current;
      if (e.pointerType === 'mouse' || e.pointerType === 'pen') {
        cur.x = e.clientX;
        cur.y = e.clientY;
        cur.active = true;
        cur.lastMove = now;
        cur.hopped = false;
      } else {
        cur.active = false; // no cursor-follow on touch
      }
      markActive();
    };

    const onResize = () => {
      const p = posRef.current;
      if (!p) return;
      const b = bounds();
      p.x = clamp(p.x, margin, b.maxX);
      p.y = clamp(p.y, margin, b.maxY);
      targetRef.current = null;
    };

    const sleepTimer = window.setInterval(() => {
      const m = moodRef.current;
      if ((m === 'idle' || m === 'walk') && !bubbleOpenRef.current &&
          performance.now() - lastActivityRef.current > C.sleepAfterMs) {
        targetRef.current = null;
        setMood('sleep');
      }
    }, 1000);

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', markActive, { passive: true });
    window.addEventListener('keydown', markActive);
    window.addEventListener('scroll', markActive, { passive: true, capture: true });
    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      window.clearInterval(sleepTimer);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', markActive);
      window.removeEventListener('keydown', markActive);
      window.removeEventListener('scroll', markActive, { capture: true });
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [enabled, rootRef, flipRef, pupilsRef, setMood, markActive]);

  // ---- Auto-talk every 2-3 minutes ---------------------------------------
  useEffect(() => {
    if (!enabled) return;
    let id = 0;
    const schedule = () => {
      id = window.setTimeout(() => {
        if (moodRef.current !== 'sleep' && !bubbleOpenRef.current && !document.hidden) {
          if (!reducedRef.current) setMood('jump', 650);
          say('auto');
        }
        schedule();
      }, rand(C.autoTalkMs.min, C.autoTalkMs.max));
    };
    schedule();
    return () => window.clearTimeout(id);
  }, [enabled, say, setMood]);

  // ---- First hello (once) -------------------------------------------------
  useEffect(() => {
    if (!enabled || introDoneRef.current) return;
    const id = window.setTimeout(() => {
      introDoneRef.current = true;
      if (!reducedRef.current) setMood('jump', 650);
      if (startAskRef.current) showBubble('ask', C.askText);
      else say('greet');
    }, 900);
    return () => window.clearTimeout(id);
  }, [enabled, say, setMood, showBubble]);

  return { mood, bubble, say, clearBubble, onHover, onLeave, onClick };
}
