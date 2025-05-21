import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';

// Home screen component
export default function HomeScreen() {
  // Get theme settings
  const { isDarkMode, theme, colors } = useTheme();

  // Navigate to profile setup
  const handleProfileSetup = () => {
    router.push('/(tabs)/profile');
  };

  // Navigate to search screen
  const handleSearch = () => {
    router.push('/(tabs)/search');
  };

  // Navigate to upload screen
  const handleUpload = () => {
    router.push('/(tabs)/upload');
  };

  return (
    <View style={styles.container}>
      {/* Background gradient */}
      <LinearGradient
        colors={[theme.surface, theme.background]}
        style={styles.gradient}
      >
        <ScrollView style={styles.scrollView}>
          <View style={styles.content}>
            {/* Welcome title */}
            <Text style={styles.title}>
              Welcome to FitFindr
            </Text>

            {/* Main info card */}
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

      {/* Action buttons */}
      <TouchableOpacity 
        style={styles.button} 
        onPress={handleProfileSetup}
      >
        <Text style={styles.buttonText}>Setup Your Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.button}
        onPress={handleSearch}
      >
        <Text style={styles.buttonText}>Find Your Size</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.button}
        onPress={handleUpload}
      >
        <Text style={styles.buttonText}>Upload Photo</Text>
      </TouchableOpacity>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  // Main container
  container: {
    flex: 1,
  },

  // Gradient background
  gradient: {
    flex: 1,
  },

  // Scrollable area
  scrollView: {
    flex: 1,
  },

  // Content padding
  content: {
    padding: 20,
  },

  // Welcome title
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: isDarkMode ? colors.textLight : colors.textDark,
  },

  // Info card
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

  // Card title
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
    color: isDarkMode ? colors.textLight : colors.textDark,
  },

  // Card text
  cardText: {
    fontSize: 16,
    lineHeight: 24,
    color: isDarkMode ? colors.textLight : colors.textDark,
  },

  // Action button
  button: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 8,
    width: '100%',
    marginBottom: 16,
  },

  // Button text
  buttonText: {
    color: isDarkMode ? colors.textLight : colors.textDark,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
