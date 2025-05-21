import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

// Theme toggle button component
export default function ThemeToggle() {
  // Get theme functions
  const { isDarkMode, toggleTheme, colors } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: colors.surface }]}
      onPress={toggleTheme}
    >
      {isDarkMode ? (
        <Ionicons name="sunny" size={24} color={colors.text} />
      ) : (
        <Ionicons name="moon" size={24} color={colors.text} />
      )}
    </TouchableOpacity>
  );
}

// Styles
const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    ...theme.shadows.sm,
  },
}); 