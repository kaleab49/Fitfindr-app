import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';
import ThemeToggle from '../components/ThemeToggle';
import { useTheme } from '../context/ThemeContext';

// Main tab navigation layout
export default function TabLayout() {
  // Get theme settings
  const { isDarkMode, colors } = useTheme();

  // Tab bar configuration
  const tabBarConfig = {
    // Active tab color
    tabBarActiveTintColor: isDarkMode ? colors.light.tabIconSelected : colors.light.tabIcon,
    // Inactive tab color
    tabBarInactiveTintColor: isDarkMode ? colors.dark.tabIcon : colors.light.tabIcon,
    // Tab bar background
    tabBarStyle: {
      backgroundColor: isDarkMode ? colors.dark.background : colors.light.background,
    },
    // Theme toggle in header
    headerRight: () => <ThemeToggle />,
    // Header style
    headerStyle: {
      backgroundColor: isDarkMode ? colors.dark.surface : colors.light.surface,
    },
    // Header text color
    headerTintColor: isDarkMode ? colors.textLight : colors.textDark,
  };

  return (
    <Tabs screenOptions={tabBarConfig}>
      {/* Home Tab */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />

      {/* Search Tab */}
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search" size={size} color={color} />
          ),
        }}
      />

      {/* Profile Tab */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />

      {/* Upload Tab */}
      <Tabs.Screen
        name="upload"
        options={{
          title: 'Upload',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="camera" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

// Styles
const styles = StyleSheet.create({
  headerButton: {
    marginRight: 15,
  },
});

