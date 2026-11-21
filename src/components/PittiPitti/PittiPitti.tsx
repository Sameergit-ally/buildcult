import { useCallback, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import './pitti.css';
import { PITTI_CONFIG as C } from './config';
import { RabbitSvg } from './RabbitSvg';
import { SpeechBubble } from './SpeechBubble';
import { useTheme } from './useTheme';
import type { Theme } from './useTheme';
import { usePittiBrain } from './usePittiBrain';

function readLS(key: string): string | null {
  try {
    return typeof window === 'undefined' ? null : window.localStorage.getItem(key);
  } catch {
    return null;
  }
}
function writeLS(key: string, value: string | null): void {
  try {
    if (value === null) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, value);
  } catch {
    /* storage unavailable: ignore */
  }
}

function themeStyle(theme: Theme): CSSProperties {
  const c = C.colors[theme];
  return {
    '--pitti-size': `${C.size}px`,
    '--pitti-z': C.zIndex,
    '--pitti-body': c.body,
    '--pitti-belly': c.belly,
    '--pitti-ear-inner': c.earInner,
    '--pitti-rim': c.rim,
    '--pitti-eyelid': c.eyeLid,
    '--pitti-nose': c.nose,
    '--pitti-blush': c.blush,
    '--pitti-tail': c.tail,
    '--pitti-bubble-bg': c.bubbleBg,
    '--pitti-bubble-fg': c.bubbleFg,
    '--pitti-bubble-border': c.bubbleBorder,
    '--pitti-shadow': c.shadow,
  } as CSSProperties;
}

export function PittiPitti() {
  const theme = useTheme();
  const rootRef = useRef<HTMLDivElement>(null);
  const flipRef = useRef<HTMLDivElement>(null);
  const pupilsRef = useRef<SVGGElement>(null);

  const [hidden, setHidden] = useState(() => readLS(C.storage.hidden) === '1');
  const [storedName, setStoredName] = useState(() => readLS(C.storage.name));
  
  // Pitti Pitti won't activate interactions unless a name has been entered
  const isUnlocked = Boolean(storedName && storedName.trim().length > 0);
  const displayName = storedName?.trim() || '';

  const brain = usePittiBrain({
    rootRef, flipRef, pupilsRef,
    displayName,
    askNameOnStart: !isUnlocked,
    enabled: !hidden,
    isUnlocked,
  });
  const { bubble, mood, clearBubble, say } = brain;

  const hide = useCallback(() => {
    clearBubble();
    setHidden(true);
    writeLS(C.storage.hidden, '1');
  }, [clearBubble]);

  const show = useCallback(() => {
    setHidden(false);
    writeLS(C.storage.hidden, null);
  }, []);

  const submitName = useCallback((raw: string) => {
    const n = raw.trim().slice(0, 24);
    if (!n) return;
    writeLS(C.storage.name, n);
    writeLS(C.storage.asked, '1');
    setStoredName(n);
    // After unlocking, greet with flirty/roast line
    setTimeout(() => {
      say('greet', n);
    }, 150);
  }, [say]);

  const style = themeStyle(theme);

  if (hidden) {
    return (
      <button type="button" className="pitti-restore pitti-scope" style={style}
        aria-label="Bring Pitti Pitti back" onClick={show}>
        🐰
      </button>
    );
  }

  // If not unlocked, keep the ask bubble open permanently until submitted!
  const activeBubble = isUnlocked
    ? bubble
    : (bubble || { id: 1, kind: 'ask' as const, text: C.askText });

  return (
    <div ref={rootRef} className="pitti-root pitti-scope" data-mood={mood} style={style}>
      {activeBubble && (
        <SpeechBubble
          key={activeBubble.id}
          kind={activeBubble.kind}
          text={activeBubble.text}
          onSubmitName={submitName}
        />
      )}

      <div ref={flipRef} className="pitti-flip">
        <button type="button" className="pitti-hit"
          aria-label="Pitti Pitti, a small rabbit. Enter your name to interact!"
          onPointerEnter={brain.onHover}
          onPointerLeave={brain.onLeave}
          onPointerDown={brain.onPointerDown}
          onPointerUp={brain.onPointerUp}
          onClick={brain.onClick}
          onContextMenu={(e) => { e.preventDefault(); hide(); }}>
          <span className="pitti-ground-shadow" aria-hidden="true" />
          <span className="pitti-actor">
            <RabbitSvg mood={mood} pupilsRef={pupilsRef} />
          </span>
        </button>
      </div>

      {isUnlocked && mood === 'dance' && (
        <>
          <span className="pitti-heart pitti-h1" aria-hidden="true">♥</span>
          <span className="pitti-heart pitti-h2" aria-hidden="true">✦</span>
          <span className="pitti-heart pitti-h3" aria-hidden="true">♥</span>
        </>
      )}
      {isUnlocked && mood === 'sleep' && (
        <span className="pitti-zzz" aria-hidden="true">
          <i>z</i><i>z</i><i>Z</i>
        </span>
      )}

      <button type="button" className="pitti-close" aria-label="Hide Pitti Pitti" onClick={hide}>
        ×
      </button>
    </div>
  );
}

export default PittiPitti;
