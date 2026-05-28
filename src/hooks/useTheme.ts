import { useState, useEffect } from 'react';

type Theme = 'dark' | 'light';

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Check localStorage first
    const saved = localStorage.getItem('theme') as Theme | null;
    if (saved) return saved;

    // Check system preference
    if (typeof window !== 'undefined' && window.matchMedia) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return prefersDark ? 'dark' : 'light';
    }

    return 'dark'; // Default to dark for AI Arena aesthetic
  });

  useEffect(() => {
    // Save to localStorage
    localStorage.setItem('theme', theme);

    // Update HTML class
    const html = document.documentElement;
    html.classList.remove('light-mode', 'dark-mode');
    html.classList.add(`${theme}-mode`);

    // Update CSS variables
    if (theme === 'light') {
      html.style.setProperty('--bg-primary', '#F8FAFC');
      html.style.setProperty('--bg-secondary', '#F1F5F9');
      html.style.setProperty('--text-primary', '#0F172A');
      html.style.setProperty('--text-secondary', '#64748B');
      html.style.setProperty('--border-color', '#E2E8F0');
    } else {
      html.style.setProperty('--bg-primary', '#070B14');
      html.style.setProperty('--bg-secondary', '#0D1220');
      html.style.setProperty('--text-primary', '#E2E8F0');
      html.style.setProperty('--text-secondary', '#94A3B8');
      html.style.setProperty('--border-color', 'rgba(255,255,255,0.08)');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return { theme, toggleTheme, setTheme };
};
