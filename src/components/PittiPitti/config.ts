// Everything you may want to tweak lives here.

export interface PittiColors {
  body: string;
  belly: string;
  earInner: string;
  rim: string; // soft outline so the black rabbit stays visible on dark backgrounds
  eyeLid: string;
  nose: string;
  blush: string;
  tail: string;
  bubbleBg: string;
  bubbleFg: string;
  bubbleBorder: string;
  shadow: string;
}

export interface PittiConfig {
  size: number; // px
  zIndex: number;
  roam: boolean;
  speed: number; // px per second
  pauseMs: { min: number; max: number }; // rest between walks
  autoTalkMs: { min: number; max: number }; // 2-3 minutes
  sleepAfterMs: number;
  bubbleMs: number;
  hoverCooldownMs: number;
  cursorIdleMs: number; // cursor still this long -> Pitti hops closer
  followDistance: number; // polite distance from cursor
  viewportMargin: number;
  defaultName: string;
  askText: string;
  colors: { light: PittiColors; dark: PittiColors };
  storage: { name: string; asked: string; hidden: string };
}

export const PITTI_CONFIG: PittiConfig = {
  size: 72,
  zIndex: 9999,
  roam: true,
  speed: 85,
  pauseMs: { min: 1800, max: 5000 },
  autoTalkMs: { min: 120_000, max: 180_000 },
  sleepAfterMs: 60_000,
  bubbleMs: 4800,
  hoverCooldownMs: 6000,
  cursorIdleMs: 4000,
  followDistance: 120,
  viewportMargin: 16,
  defaultName: 'friend',
  askText: "Hi! I'm Pitti Pitti 🐰 What's your name?",
  colors: {
    light: {
      body: '#222226',
      belly: '#44444e',
      earInner: '#f07e9e',
      rim: '#2c2c34',
      eyeLid: '#ffffff',
      nose: '#ff6b95',
      blush: '#ff779b',
      tail: '#ffffff',
      bubbleBg: '#ffffff',
      bubbleFg: '#16161a',
      bubbleBorder: '#2a2a32',
      shadow: 'rgba(0,0,0,0.28)',
    },
    dark: {
      body: '#15151b',
      belly: '#42405a',
      earInner: '#f08fb0',
      rim: '#cfc4ff',
      eyeLid: '#e8e4ff',
      nose: '#ff8fb1',
      blush: '#ff8fb1',
      tail: '#f7f4ff',
      bubbleBg: '#2a2838',
      bubbleFg: '#f4f0ff',
      bubbleBorder: '#cfc4ff',
      shadow: 'rgba(0,0,0,0.6)',
    },
  },
  storage: {
    name: 'pitti:name',
    asked: 'pitti:asked',
    hidden: 'pitti:hidden',
  },
};
