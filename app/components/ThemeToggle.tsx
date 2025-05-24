import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle() {
  const { isDarkMode, toggleTheme, colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 8,
      marginRight: 8,
    },
    iconButton: {
      padding: 4,
      borderRadius: 50,
      backgroundColor: isDarkMode ? colors.dark.surface : colors.light.surface,
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
          color={isDarkMode ? colors.textLight : colors.textDark}
        />
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.iconButton} 
        onPress={() => router.push('/(tabs)/settings')}
      >
        <Ionicons
          name="settings-outline"
          size={24}
          color={isDarkMode ? colors.textLight : colors.textDark}
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconButton} onPress={toggleTheme}>
        <Ionicons
          name={isDarkMode ? "sunny-outline" : "moon-outline"}
          size={24}
          color={isDarkMode ? colors.textLight : colors.textDark}
        />
      </TouchableOpacity>
    </View>
  );
} 