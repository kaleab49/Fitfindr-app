import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { theme } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle() {
  const { isDarkMode, toggleTheme } = useTheme();
  const colors = isDarkMode ? theme.dark : theme.light;

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: theme.spacing.sm,
      marginRight: theme.spacing.sm,
    },
    iconButton: {
      padding: theme.spacing.xs,
      borderRadius: 50,
      backgroundColor: isDarkMode ? '#333333' : '#F5F5F5',
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 8,
    },
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.iconButton} onPress={() => {}}>
        <Ionicons
          name="notifications-outline"
          size={24}
          color={colors.text}
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconButton} onPress={() => {}}>
        <Ionicons
          name="settings-outline"
          size={24}
          color={colors.text}
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconButton} onPress={toggleTheme}>
        <Ionicons
          name={isDarkMode ? "sunny-outline" : "moon-outline"}
          size={24}
          color={colors.text}
        />
      </TouchableOpacity>
    </View>
  );
} 