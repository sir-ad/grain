const STORAGE_KEY = 'grain-theme';

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

function getStoredTheme(): 'light' | 'dark' | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(STORAGE_KEY) as 'light' | 'dark' | null;
}

export function getTheme(): 'light' | 'dark' {
  return getStoredTheme() || getSystemTheme();
}

export function setTheme(theme: 'light' | 'dark'): void {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(STORAGE_KEY, theme);
  updateToggleButton(theme);
}

function updateToggleButton(theme: 'light' | 'dark'): void {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;
  btn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`);
}

export function toggleTheme(): void {
  setTheme(getTheme() === 'dark' ? 'light' : 'dark');
}

export function initTheme(): void {
  const theme = getTheme();
  document.documentElement.setAttribute('data-theme', theme);

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!getStoredTheme()) {
      setTheme(e.matches ? 'dark' : 'light');
    }
  });

  const btn = document.getElementById('theme-toggle');
  if (btn) {
    btn.addEventListener('click', toggleTheme);
  }
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', initTheme);
}
