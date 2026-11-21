// Add / edit messages here. Use {name} for the visitor's name.
// Exclusive collection of flirty lines and sharp roasts for Pitti Pitti 🐰🔥

export type MessageContext = 'greet' | 'auto' | 'click' | 'hover' | 'wake';

const MESSAGES = {
  // Flirty lines
  flirty: [
    'Are you a semicolon, {name}? Because everything falls apart without you 😉',
    'Hey {name}, are you CSS? Because you just added style to my whole life ✨',
    'I was made of 0s and 1s until you walked in and made me feel like an 11/10 🖤',
    'Is it getting hot in here or did you just run an unoptimized loop, {name}? 😏',
    'Are you git push --force? Because you just overwrote all my rules 🚀',
    'Hey {name}, my heart has a memory leak and it’s storing only you 🐰',
    'You must be a high-refresh-rate display, because looking at you is way too smooth 💅',
    'Forget hackathons, {name}... you already won first prize in my heart 🏆',
    'If beauty was code, you\'d be a zero-warning production build 😘',
    'Stop looking at the screen so intensely, {name}... look at me instead 🐰🖤',
    'Are you a query param? Because I keep finding myself attached to you 😉',
    'Call me recursive, because I can’t stop thinking about you {name} 💫',
  ],

  // Roasting lines
  roasts: [
    'Bhai {name}, code likh rahe ho ya keyboard pe sar patak rahe ho? 💀',
    'Your code looks like a recipe for a disaster written by a toddler 🤡',
    'Bhai commit message me "fixed bug" likha hai aur 10 naye bug paida kar diye 😂',
    'Are you inspecting the console or waiting for a miracle to fix your life, {name}? 🔍',
    'Bro spends 4 hours choosing a VS Code theme and 2 minutes writing broken CSS 🥱',
    'Pura din website scroll karoge ya sach me kuch build bhi karoge, {name}? 😭',
    'Your commit history is more red than a traffic signal 🛑',
    'Even my carrot has better architectural standards than your project 🥕💀',
    'Stack Overflow down ho gaya toh career khatam ho jayega na, {name}? 😜',
    'Bhai laptop screen band karke thoda bahar ki hawa le lo, shakal dekh apni 🧟',
    'You call that code? Even ChatGPT apologized after generating that for you 🤖',
    'Clicking me won’t make your bugs disappear, {name}. Start debugging! 🐰⚡',
  ],

  // Flirty + Roast combos on click
  clicks: [
    'Boop! Haath lagaoge toh charge lagega, samjhe {name}? 💅',
    'Aise touch karoge toh pyaar ho jayega... ya fir main roast kar dunga 😏',
    'Clicked me again? Tumhara mouse chal raha hai ya tumhara flirt button on hai? 🐰',
    'Touch mat karo, warning: too hot to handle 🔥',
    'Click karne se project submit nahi hota bhai, jaake build karo! 💀',
  ],

  // Hover tease
  hovers: [
    'Cursor mere upar laaye ho... iraada kya hai, {name}? 😉',
    'Hovering over me? I know I\'m irresistible 🖤',
    'Dekho dekho, kaise line maar rahe hain cursor se 👀',
    'Dance dekhna hai ya seedha dil me aana hai? 💃',
  ],

  // Wake up tease
  wakes: [
    'Uth gaya main... kya hua, {name}? Mere bina mann nahi lag raha tha? 😌',
    'Kaan khade ho gaye mere! Kisko stalk kar rahe the tab se? 👀',
    'Neend kharab kar di... ab chalo kuch flirty bolo mujhse 🐰',
  ],
} as const satisfies Record<string, readonly string[]>;

let lastTemplate = '';

export function pickMessage(
  context: MessageContext,
  name: string,
  _now: Date = new Date(),
): string {
  let pool: readonly string[];

  switch (context) {
    case 'greet':
      pool = [...MESSAGES.flirty, ...MESSAGES.roasts];
      break;
    case 'hover':
      pool = MESSAGES.hovers;
      break;
    case 'click':
      pool = [...MESSAGES.clicks, ...MESSAGES.roasts, ...MESSAGES.flirty];
      break;
    case 'wake':
      pool = MESSAGES.wakes;
      break;
    case 'auto':
      pool = [...MESSAGES.flirty, ...MESSAGES.roasts];
      break;
  }

  const fresh = pool.filter((m) => m !== lastTemplate);
  const options = fresh.length > 0 ? fresh : pool;
  const chosen = options[Math.floor(Math.random() * options.length)] ?? 'Are you CSS? You look stunning 😉';
  lastTemplate = chosen;
  return chosen.replaceAll('{name}', name);
}
