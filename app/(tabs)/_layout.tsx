import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function TabLayout() {
  const { isDarkMode, colors } = useTheme();

  const HeaderIcons = () => (
    <View style={styles.headerButtons}>
      <TouchableOpacity style={styles.headerButton}>
        <Ionicons
          name="notifications-outline"
          size={24}
          color={isDarkMode ? colors.textLight : colors.textDark}
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.headerButton}>
        <Ionicons
          name="settings-outline"
          size={24}
          color={isDarkMode ? colors.textLight : colors.textDark}
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: isDarkMode ? colors.light.tabIconSelected : colors.light.tabIcon,
        tabBarInactiveTintColor: isDarkMode ? colors.dark.tabIcon : colors.light.tabIcon,
        tabBarStyle: {
          backgroundColor: isDarkMode ? colors.dark.background : colors.light.background,
        },
        headerStyle: {
          backgroundColor: isDarkMode ? colors.dark.surface : colors.light.surface,
        },
        headerTintColor: isDarkMode ? colors.textLight : colors.textDark,
        tabBarShowLabel: false,
        headerRight: () => <HeaderIcons />,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }} />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search" size={size} color={color} />
          ),
        }} />
      <Tabs.Screen
        name="upload"
        options={{
          title: 'Upload',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="camera" size={size} color={color} />
          ),
        }} />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  headerButtons: {
    flexDirection: 'row',
    marginRight: 15,
  },
  headerButton: {
    marginLeft: 15,
  },
});

