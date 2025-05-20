import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function TabOneScreen() {
  const { isDarkMode, theme, colors } = useTheme();

  const handleProfileSetup = () => {
    router.push('/(tabs)/profile');
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    gradient: {
      flex: 1,
    },
    scrollView: {
      flex: 1,
    },
    content: {
      padding: 20,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      marginBottom: 20,
      color: isDarkMode ? colors.textLight : colors.textDark,
    },
    card: {
      backgroundColor: isDarkMode ? colors.dark.surface : colors.accent1,
      borderRadius: 15,
      padding: 20,
      marginBottom: 15,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    },
    cardTitle: {
      fontSize: 20,
      fontWeight: '600',
      marginBottom: 10,
      color: isDarkMode ? colors.textLight : colors.textDark,
    },
    cardText: {
      fontSize: 16,
      lineHeight: 24,
      color: isDarkMode ? colors.textLight : colors.textDark,
    },
    button: {
      backgroundColor: colors.primary,
      padding: 16,
      borderRadius: 8,
      width: '100%',
      marginBottom: 16,
    },
    buttonText: {
      color: isDarkMode ? colors.textLight : colors.textDark,
      textAlign: 'center',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[
          theme.surface,
          theme.background,
        ]}
        style={styles.gradient}
      >
        <ScrollView style={styles.scrollView}>
          <View style={styles.content}>
            <Text style={styles.title}>
              Welcome to FitFindr
            </Text>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>
                Find Your Perfect Fit
              </Text>
              <Text style={styles.cardText}>
                Take a photo, paste a link, or select a brand to find your perfect size for clothes, shoes, and sports equipment.
              </Text>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>

      <TouchableOpacity style={styles.button} onPress={handleProfileSetup}>
        <Text style={styles.buttonText}>Setup Your Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, { backgroundColor: colors.primary }]}
        onPress={() => router.push('/(tabs)/search')}>
        <Text style={styles.buttonText}>Find Your Size</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, { backgroundColor: colors.primary }]}
        onPress={() => router.push('/(tabs)/upload')}>
        <Text style={styles.buttonText}>Upload Photo</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, { backgroundColor: colors.primary }]}
        onPress={() => router.push('/(tabs)/brands')}>
        <Text style={styles.buttonText}>Browse Brands</Text>
      </TouchableOpacity>
    </View>
  );
}
