import { createContext, useContext, useState, useEffect } from 'react';

export const THEMES = [
  {
    id: 'ocean',
    name: 'Ocean Blue',
    emoji: '🌊',
    sidebar: '#0a1628',
    accent: '#2563eb',
    preview: ['#0a1628', '#2563eb', '#0ea5e9'],
  },
  {
    id: 'forest',
    name: 'Forest Green',
    emoji: '🌿',
    sidebar: '#0c2d1e',
    accent: '#16a34a',
    preview: ['#0c2d1e', '#16a34a', '#22c55e'],
  },
  {
    id: 'purple',
    name: 'Royal Purple',
    emoji: '💜',
    sidebar: '#1e1045',
    accent: '#7c3aed',
    preview: ['#1e1045', '#7c3aed', '#a78bfa'],
  },
  {
    id: 'crimson',
    name: 'Crimson Red',
    emoji: '🔴',
    sidebar: '#1a0a0a',
    accent: '#dc2626',
    preview: ['#1a0a0a', '#dc2626', '#f97316'],
  },
  {
    id: 'slate',
    name: 'Midnight Slate',
    emoji: '🌙',
    sidebar: '#0f172a',
    accent: '#0ea5e9',
    preview: ['#0f172a', '#334155', '#0ea5e9'],
  },
  {
    id: 'white',
    name: 'Pure White',
    emoji: '🤍',
    sidebar: '#ffffff',
    accent: '#162b57',
    preview: ['#ffffff', '#162b57', '#2563eb'],
  },
];

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [themeId, setThemeId] = useState(() => {
    return localStorage.getItem('nexa_theme') || 'ocean';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeId);
    localStorage.setItem('nexa_theme', themeId);
  }, [themeId]);

  const currentTheme = THEMES.find(t => t.id === themeId) || THEMES[0];

  return (
    <ThemeContext.Provider value={{ themeId, setThemeId, currentTheme, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
