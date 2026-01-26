import React, { createContext, useState, useContext, ReactNode } from 'react';
import { COLORS } from '../constants/theme'; 

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
  theme: any; 
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  const theme = {
    background: isDarkMode ? COLORS.backgroundDark : COLORS.backgroundLight,
    text: isDarkMode ? COLORS.textDark : COLORS.textLight,
    cardBg: isDarkMode ? COLORS.cardBgDark : COLORS.cardBgLight,
    iconBg: isDarkMode ? COLORS.iconBgDark : COLORS.iconBgLight,
    subText: isDarkMode ? COLORS.subTextDark : COLORS.subTextLight,
    primary: COLORS.primary,
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};