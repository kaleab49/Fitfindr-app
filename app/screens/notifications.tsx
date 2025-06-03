import { View, Text } from 'react-native';
import React, { useLayoutEffect } from 'react';
import { styles } from '../styles/styles';
import { useTheme } from '../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';

export default function Notifications() {
  const { isDarkMode, theme, colors } = useTheme();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({ 
      headerShown: true,
      headerBackVisible: true,
      headerTitle: "Notifications",
      headerStyle: {
        backgroundColor: theme.background,
      },
      headerTintColor: isDarkMode ? colors.textLight : colors.textDark,
      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: 20,
        color: isDarkMode ? colors.textLight : colors.textDark,
      },
      headerShadowVisible: false,
      headerTitleAlign: 'center',
      headerBackTitleVisible: false,
      headerBackImage: () => (
        <Text style={{ color: isDarkMode ? colors.textLight : colors.textDark }}>Back</Text>
      ),  
    });
  }, [navigation,]);

  return (
    <View>
      <Text>Notifications</Text>
      <Text>Coming soon!</Text>
      <Text style={{fontSize: 16, color: isDarkMode ? colors.textLight : colors.textDark}}> 
        This feature is under development. Stay tuned for updates!
        </Text>
    </View>
  );
}