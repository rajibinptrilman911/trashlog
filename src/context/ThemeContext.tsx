import React, { createContext, useContext, useState, useEffect } from 'react';

interface ThemeContextType {
  isDark: boolean;
  toggleDark: () => void;
  isEcoMode: boolean;
  toggleEcoMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('ecotrack_dark_mode');
    if (saved !== null) {
      return saved === 'true';
    }
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [isEcoMode, setIsEcoMode] = useState<boolean>(() => {
    return localStorage.getItem('ecotrack_eco_mode') === 'true';
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('ecotrack_dark_mode', String(isDark));
  }, [isDark]);

  useEffect(() => {
    if (isEcoMode) {
      document.documentElement.classList.add('eco-mode');
    } else {
      document.documentElement.classList.remove('eco-mode');
    }
    localStorage.setItem('ecotrack_eco_mode', String(isEcoMode));
  }, [isEcoMode]);

  const toggleDark = () => setIsDark(prev => !prev);
  const toggleEcoMode = () => setIsEcoMode(prev => !prev);

  return (
    <ThemeContext.Provider value={{ isDark, toggleDark, isEcoMode, toggleEcoMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
