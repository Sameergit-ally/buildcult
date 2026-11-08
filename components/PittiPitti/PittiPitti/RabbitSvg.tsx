import type { RefObject } from 'react';
import type { Mood } from './usePittiBrain';

interface Props {
  mood: Mood;
  pupilsRef: RefObject<SVGGElement | null>;
}

export function RabbitSvg({ mood, pupilsRef }: Props) {
  const asleep = mood === 'sleep';
  const furious = mood === 'furious';

  return (
    <svg className="pitti-svg" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      {/* tail */}
      <circle className="pitti-tail pitti-tail-fill" cx="19" cy="75" r="7" />

      {/* ears */}
      <g className="pitti-ear pitti-ear-l">
        <ellipse className="pitti-fur" cx="37" cy="18" rx="7" ry="17" transform="rotate(-8 37 18)" />
        <ellipse className="pitti-ear-inner" cx="37" cy="20" rx="3.4" ry="11" transform="rotate(-8 37 20)" />
      </g>
      <g className="pitti-ear pitti-ear-r">
        <ellipse className="pitti-fur" cx="63" cy="18" rx="7" ry="17" transform="rotate(8 63 18)" />
        <ellipse className="pitti-ear-inner" cx="63" cy="20" rx="3.4" ry="11" transform="rotate(8 63 20)" />
      </g>

      {/* body, belly, feet */}
      <ellipse className="pitti-fur" cx="50" cy="72" rx="28" ry="22" />
      <ellipse className="pitti-belly" cx="50" cy="78" rx="16" ry="13" />
      <ellipse className="pitti-fur" cx="36" cy="93" rx="9" ry="5" />
      <ellipse className="pitti-fur" cx="64" cy="93" rx="9" ry="5" />

      {/* head */}
      <ellipse className="pitti-fur" cx="50" cy="46" rx="24" ry="21" />
      <circle className="pitti-blush" cx="30" cy="54" r="4" />
      <circle className="pitti-blush" cx="70" cy="54" r="4" />

      {/* furious angry symbol (anime vein pop) */}
      {furious && (
        <g className="pitti-anger-mark" stroke="#ff2d55" strokeWidth="2" strokeLinecap="round" fill="none">
          <path d="M72 28 q3 0 3 3 M75 31 q3 0 3 -3 M75 31 q0 3 -3 3 M75 31 q0 3 3 3" />
        </g>
      )}

      {/* eyes */}
      {asleep ? (
        <g className="pitti-line" fill="none" strokeWidth="2" strokeLinecap="round">
          <path d="M33 46 q6 5 12 0" />
          <path d="M55 46 q6 5 12 0" />
        </g>
      ) : furious ? (
        <g className="pitti-eyes pitti-furious-eyes">
          <ellipse cx="39" cy="45" rx="7" ry="7.5" fill="#fff" />
          <ellipse cx="61" cy="45" rx="7" ry="7.5" fill="#fff" />
          <g ref={pupilsRef}>
            <circle cx="39" cy="46" r="4.2" fill="#e6103b" />
            <circle cx="61" cy="46" r="4.2" fill="#e6103b" />
            <circle cx="39" cy="46" r="2.2" fill="#111" />
            <circle cx="61" cy="46" r="2.2" fill="#111" />
            <circle cx="40.5" cy="44.2" r="1.3" fill="#fff" />
            <circle cx="62.5" cy="44.2" r="1.3" fill="#fff" />
          </g>
          {/* Slanted furious angry brows */}
          <path d="M30 38 L47 43" stroke="var(--pitti-eyelid, #fff)" strokeWidth="3.2" strokeLinecap="round" />
          <path d="M70 38 L53 43" stroke="var(--pitti-eyelid, #fff)" strokeWidth="3.2" strokeLinecap="round" />
        </g>
      ) : (
        <g className="pitti-eyes">
          <ellipse cx="39" cy="44" rx="7" ry="7.5" fill="#fff" />
          <ellipse cx="61" cy="44" rx="7" ry="7.5" fill="#fff" />
          <g ref={pupilsRef}>
            <circle cx="39" cy="44" r="4.8" fill="#0d0d12" />
            <circle cx="61" cy="44" r="4.8" fill="#0d0d12" />
            <circle cx="40.8" cy="42.2" r="1.7" fill="#fff" />
            <circle cx="62.8" cy="42.2" r="1.7" fill="#fff" />
            <circle cx="37.8" cy="46" r="0.8" fill="#fff" />
            <circle cx="59.8" cy="46" r="0.8" fill="#fff" />
          </g>
        </g>
      )}

      {/* nose + mouth */}
      <ellipse className="pitti-nose" cx="50" cy="51" rx="3" ry="2.2" />
      {furious ? (
        /* Furious zig-zag gritted mouth */
        <path
          className="pitti-line"
          fill="none"
          strokeWidth="1.8"
          strokeLinecap="round"
          d="M44 55 L47 57 L50 54 L53 57 L56 55"
        />
      ) : (
        <path
          className="pitti-line"
          fill="none"
          strokeWidth="1.2"
          strokeLinecap="round"
          d="M50 53 v2 M50 55 q-3 3 -6 0 M50 55 q3 3 6 0"
        />
      )}
    </svg>
  );
}
