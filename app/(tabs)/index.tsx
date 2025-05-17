import { router } from 'expo-router';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { theme } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

export default function TabOneScreen() {
  const { isDarkMode } = useTheme();
  const colors = isDarkMode ? theme.dark : theme.light;

  const handleProfileSetup = () => {
    router.push('/(tabs)/profile');
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      alignItems: 'center',
      padding: theme.spacing.md,
    },
    logo: {
      width: 200,
      height: 200,
      marginTop: theme.spacing.xl,
      marginBottom: theme.spacing.xl,
    },
    title: {
      ...theme.typography.h1,
      color: colors.text,
      marginBottom: theme.spacing.md,
      textAlign: 'center',
    },
    subtitle: {
      ...theme.typography.body,
      color: colors.text,
      textAlign: 'center',
      marginBottom: theme.spacing.xl,
    },
    button: {
      backgroundColor: colors.primary,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      width: '100%',
      marginBottom: theme.spacing.md,
    },
    buttonText: {
      color: colors.buttonText,
      textAlign: 'center',
      ...theme.typography.accent,
    },
  });

  return (
    <View style={styles.container}>
      <Image
        source={isDarkMode ? require('../../assets/mag.png') : require('../../assets/mag-dark.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Welcome to FitFindr</Text>
      <Text style={styles.subtitle}>
        Find your perfect fit in clothes, shoes, and sports equipment
      </Text>

      <TouchableOpacity style={styles.button} onPress={handleProfileSetup}>
        <Text style={styles.buttonText}>Setup Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, { backgroundColor: colors.secondary }]}
        onPress={() => router.push('/(tabs)/search')}>
        <Text style={styles.buttonText}>Find Your Size</Text>
      </TouchableOpacity>
    </View>
  );
}
