// src/components/ThemeToggleButton.tsx
import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

type Theme = 'light' | 'dark';

// Helper to get initial theme safely (handles server-side rendering/build issues)
const getInitialTheme = (): Theme => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const storedPrefs = window.localStorage.getItem('theme');
    if (typeof storedPrefs === 'string') {
      return storedPrefs as Theme;
    }

    const userMedia = window.matchMedia('(prefers-color-scheme: dark)');
    if (userMedia.matches) {
      return 'dark';
    }
  }
  // Default to light theme if no preference found or SSR
  return 'light';
};

export const ThemeToggleButton: React.FC = () => {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  // Update <html> class and localStorage when theme state changes
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(theme === 'light' ? 'dark' : 'light');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      // Example styling - Adjust as needed to fit your header
      className="p-2 rounded-full text-slate-300 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-white transition-colors duration-200"
    >
      {theme === 'light' ? (
        <Moon className="h-5 w-5" /> // Show Moon in light mode
      ) : (
        <Sun className="h-5 w-5" /> // Show Sun in dark mode
      )}
    </button>
  );
};