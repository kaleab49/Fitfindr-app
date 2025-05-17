import { FontAwesome5 } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

function ThemeToggle() {
  const { isDarkMode, toggleTheme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      marginRight: 15,
    },
    icon: {
      textShadowColor: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
      textShadowOffset: { width: 0, height: 0 },
      textShadowRadius: 10,
    },
  });

  return (
    <TouchableOpacity 
      onPress={toggleTheme} 
      style={styles.container}
      activeOpacity={0.6}
    >
      <FontAwesome5
        name={isDarkMode ? "sun" : "moon"}
        size={28}
        solid
        color={isDarkMode ? '#FFFFFF' : '#000000'}
        style={styles.icon}
      />
    </TouchableOpacity>
  );
}

export default function TabLayout() {
  const { isDarkMode } = useTheme();
  const colors = isDarkMode ? theme.dark : theme.light;

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: colors.background,
          borderBottomColor: colors.border,
          borderBottomWidth: 1,
        },
        headerTintColor: colors.text,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          headerRight: () => <ThemeToggle />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color }) => <TabBarIcon name="search" color={color} />,
          headerRight: () => <ThemeToggle />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
          headerRight: () => <ThemeToggle />,
        }}
      />
    </Tabs>
  );
}
