import { useSyncExternalStore } from 'react';

export type Theme = 'light' | 'dark';

function readTheme(): Theme {
  if (typeof document === 'undefined') return 'dark';
  const targets: HTMLElement[] = [document.documentElement];
  if (document.body) targets.push(document.body);

  // Check explicit localStorage theme preference first
  try {
    const saved = localStorage.getItem('theme');
    if (saved === 'light') return 'light';
    if (saved === 'dark') return 'dark';
  } catch {
    /* ignore */
  }

  for (const el of targets) {
    if (el.classList.contains('light') || el.dataset.theme === 'light') return 'light';
  }
  for (const el of targets) {
    if (el.classList.contains('dark') || el.dataset.theme === 'dark') return 'dark';
  }

  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'dark';
}

function subscribe(onChange: () => void): () => void {
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  mq.addEventListener('change', onChange);

  const observer = new MutationObserver(onChange);
  const opts = { attributes: true, attributeFilter: ['class', 'data-theme'] };
  observer.observe(document.documentElement, opts);
  if (document.body) observer.observe(document.body, opts);

  window.addEventListener('storage', onChange);

  return () => {
    mq.removeEventListener('change', onChange);
    observer.disconnect();
    window.removeEventListener('storage', onChange);
  };
}

/** Live light/dark detection: system preference, `.dark` class, or data-theme attribute. */
export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, readTheme, () => 'light');
}
