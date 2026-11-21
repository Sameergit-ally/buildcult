import { useLayoutEffect, useRef, useState } from 'react';
import type { FormEvent, KeyboardEvent } from 'react';
import { PITTI_CONFIG } from './config';

interface Props {
  kind: 'say' | 'ask';
  text: string;
  onSubmitName: (name: string) => void;
  onSkip: () => void;
}

export function SpeechBubble({ kind, text, onSubmitName, onSkip }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState('');

  // Keep the bubble inside the viewport (shift sideways, or flip below near the top).
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const place = () => {
      el.style.setProperty('--pitti-shift', '0px');
      el.dataset.below = 'false';
      const r = el.getBoundingClientRect();
      const m = 8;
      let dx = 0;
      if (r.left < m) dx = m - r.left;
      else if (r.right > window.innerWidth - m) dx = window.innerWidth - m - r.right;
      el.style.setProperty('--pitti-shift', `${dx}px`);
      el.dataset.below = String(r.top < m);
    };
    place();
    window.addEventListener('resize', place);
    return () => window.removeEventListener('resize', place);
  }, [text, kind]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    onSubmitName(value);
  };
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') onSkip();
  };

  const sayStyle =
    kind === 'say'
      ? {
          animation: `pitti-pop 0.35s ease-out both, pitti-fade 0.4s ease-in ${PITTI_CONFIG.bubbleMs - 400}ms forwards`,
        }
      : undefined;

  return (
    <div ref={ref} className="pitti-bubble">
      <div
        className="pitti-bubble-card"
        role={kind === 'say' ? 'status' : 'group'}
        aria-live={kind === 'say' ? 'polite' : undefined}
        aria-label={kind === 'ask' ? 'Tell Pitti Pitti your name' : undefined}
        style={sayStyle}
      >
        {kind === 'say' ? (
          <span>{text}</span>
        ) : (
          <form className="pitti-ask" onSubmit={submit} onKeyDown={onKey}>
            <span>{text}</span>
            <div className="pitti-ask-row">
              <input
                className="pitti-input"
                value={value}
                maxLength={24}
                placeholder="Your name"
                aria-label="Your name"
                onChange={(e) => setValue(e.target.value)}
              />
              <button className="pitti-btn" type="submit">Hi!</button>
            </div>
          </form>
        )}
        <span className="pitti-bubble-tail" aria-hidden="true" />
      </div>
    </div>
  );
}
