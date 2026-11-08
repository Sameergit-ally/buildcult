// Add / edit messages here. Use {name} for the visitor's name.

export type MessageContext = 'greet' | 'auto' | 'click' | 'hover' | 'wake';

const MESSAGES = {
  greeting: [
    'Hello {name}! I\'m Pitti Pitti 🐰',
    'Hi hi {name}! Pitti Pitti reporting for cuddle duty 🖤',
    'Psst... {name}, I\'m Pitti Pitti. Remember me? 😌',
  ],
  care: [
    'Hello {name}, you look tired... here, have a dance! 💃',
    'Drink some water, {name}. Pitti Pitti insists 💧',
    'Blink slowly, {name}. Your eyes need a break 👀',
    'Sit straight! Pitti Pitti is watching your back 🐰',
    'Time for a 2-minute stretch, {name}? I\'ll stretch too 🤸',
  ],
  encouragement: [
    'You\'re doing great, {name}. Seriously. 🖤',
    'Bugs are just carrots in disguise. Keep going! 🥕',
    'One small step at a time, {name}. I believe in you ✨',
    'Even slow hops reach the finish line 🐇',
  ],
  funny: [
    'I put the \'hop\' in \'hope\' 🐰',
    'Boop! You clicked my nose 👃',
    'I\'m 100% fluff and 0% bugs. Can\'t say the same for your code 😜',
    'Carrots are my love language 🥕',
    'Do I look chubby? Don\'t answer that 🙈',
  ],
  dance: [
    'Dance break! 🎶',
    'Wiggle wiggle wiggle ~ 💃',
    'This one\'s just for you, {name} 🖤',
  ],
  woken: [
    'Mmm... five more minutes... oh hi {name}! 😴',
    'Huh? I wasn\'t sleeping... 👀 hi {name}!',
    '*yawn* Oh! You\'re back, {name} 🐰',
  ],
  morning: ['Good morning {name}! Fresh carrots, fresh start ☀️'],
  afternoon: ['Lunch time, {name}? Don\'t skip it 🍱'],
  night: ['It\'s late, {name}. Sleep soon, okay? 🌙'],
  lateNight: ['Even Pitti Pitti is sleepy... go rest 😴'],
} as const satisfies Record<string, readonly string[]>;

function timePool(hour: number): readonly string[] | null {
  if (hour >= 1 && hour < 5) return MESSAGES.lateNight;
  if (hour >= 5 && hour < 12) return MESSAGES.morning;
  if (hour >= 12 && hour < 17) return MESSAGES.afternoon;
  if (hour >= 21 || hour === 0) return MESSAGES.night;
  return null;
}

let lastTemplate = '';

export function pickMessage(
  context: MessageContext,
  name: string,
  now: Date = new Date(),
): string {
  const time = timePool(now.getHours()) ?? [];
  let pool: readonly string[];

  switch (context) {
    case 'greet':
      pool = [...time, ...time, ...MESSAGES.greeting];
      break;
    case 'hover':
      pool = [...MESSAGES.dance, MESSAGES.care[0]];
      break;
    case 'click':
      pool = [...MESSAGES.funny, ...MESSAGES.greeting, ...MESSAGES.encouragement];
      break;
    case 'wake':
      pool = MESSAGES.woken;
      break;
    case 'auto':
      pool = [...MESSAGES.care, ...MESSAGES.encouragement, ...MESSAGES.funny, ...time];
      break;
  }

  const fresh = pool.filter((m) => m !== lastTemplate);
  const options = fresh.length > 0 ? fresh : pool;
  const chosen = options[Math.floor(Math.random() * options.length)] ?? 'Hello! 🐰';
  lastTemplate = chosen;
  return chosen.replaceAll('{name}', name);
}
