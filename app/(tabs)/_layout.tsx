import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';
import ThemeToggle from '../components/ThemeToggle';
import { useTheme } from '../context/ThemeContext';

export default function TabLayout() {
  const { isDarkMode, colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: isDarkMode ? colors.light.tabIconSelected : colors.light.tabIcon,
        tabBarInactiveTintColor: isDarkMode ? colors.dark.tabIcon : colors.light.tabIcon,
        tabBarStyle: {
          backgroundColor: isDarkMode ? colors.dark.background : colors.light.background,
        },
        headerRight: () => <ThemeToggle />,
        headerStyle: {
          backgroundColor: isDarkMode ? colors.dark.surface : colors.light.surface,
        },
        headerTintColor: isDarkMode ? colors.textLight : colors.textDark,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  headerButton: {
    marginRight: 15,
  },
});
