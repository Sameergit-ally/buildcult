import { useSyncExternalStore } from 'react';

export type Theme = 'light' | 'dark';

function readTheme(): Theme {
  const targets: HTMLElement[] = [document.documentElement];
  if (document.body) targets.push(document.body);

  for (const el of targets) {
    if (el.classList.contains('dark') || el.dataset.theme === 'dark') return 'dark';
  }
  for (const el of targets) {
    if (el.classList.contains('light') || el.dataset.theme === 'light') return 'light';
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function subscribe(onChange: () => void): () => void {
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  mq.addEventListener('change', onChange);

  const observer = new MutationObserver(onChange);
  const opts = { attributes: true, attributeFilter: ['class', 'data-theme'] };
  observer.observe(document.documentElement, opts);
  if (document.body) observer.observe(document.body, opts);

  return () => {
    mq.removeEventListener('change', onChange);
    observer.disconnect();
  };
}

/** Live light/dark detection: system preference, `.dark` class, or data-theme attribute. */
export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, readTheme, () => 'light');
}
