import { View, Text } from 'react-native';
import React from 'react';
import { styles } from '../styles/styles';
import { useTheme } from '../context/ThemeContext';

export default function Notifications() {
  const { isDarkMode, theme, colors } = useTheme();

  return (
    <View>
      <Text>Notifications</Text>
      <Text>Coming soon!</Text>
      {/* You can add more notification-related components here */}
    </View>
  );
}