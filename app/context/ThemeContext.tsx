import React, { createContext, useContext } from 'react';
import { colors } from '../../constants/colors';
import { theme } from '../constants/theme';

type ThemeType = typeof theme.light;

type ThemeContextType = {
  isDarkMode: boolean;
  theme: ThemeType;
  colors: typeof colors;
};

export const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: true,
  theme: theme.dark,
  colors: colors,
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const contextValue = {
    isDarkMode: true,
    theme: theme.dark,
    colors
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 