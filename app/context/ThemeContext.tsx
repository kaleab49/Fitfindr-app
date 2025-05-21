import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '../constants/theme';

// Theme context type
type ThemeContextType = {
  isDarkMode: boolean;
  colors: typeof theme.light | typeof theme.dark;
  toggleTheme: () => void;
  setTheme: (isDark: boolean) => void;
};

// Create theme context
const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: false,
  colors: theme.light,
  toggleTheme: () => {},
  setTheme: () => {},
});

// Theme provider component
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Get system color scheme
  const systemColorScheme = useColorScheme();
  
  // State for dark mode
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark');

  // Load saved theme preference
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('theme');
        if (savedTheme !== null) {
          setIsDarkMode(savedTheme === 'dark');
        } else {
          // Use system theme if no saved preference
          setIsDarkMode(systemColorScheme === 'dark');
        }
      } catch (error) {
        console.error('Error loading theme:', error);
      }
    };

    loadTheme();
  }, [systemColorScheme]);

  // Toggle between light and dark mode
  const toggleTheme = async () => {
    try {
      const newTheme = !isDarkMode;
      setIsDarkMode(newTheme);
      await AsyncStorage.setItem('theme', newTheme ? 'dark' : 'light');
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  // Set specific theme
  const setTheme = async (isDark: boolean) => {
    try {
      setIsDarkMode(isDark);
      await AsyncStorage.setItem('theme', isDark ? 'dark' : 'light');
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  // Get current theme colors
  const colors = isDarkMode ? theme.dark : theme.light;

  return (
    <ThemeContext.Provider
      value={{
        isDarkMode,
        colors,
        toggleTheme,
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

// Hook to use theme
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 