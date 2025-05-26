import { StyleSheet } from 'react-native';

export const styles = (isDarkMode: boolean, theme: any, colors: any, window: any) =>
  StyleSheet.create({
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
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
    },
    title: {
      fontSize: 40,
      marginTop: 29,
      fontWeight: 'bold',
      textAlign: 'center',
      color: isDarkMode ? colors.textLight : colors.textDark,
      justifyContent: 'center',
      alignItems: 'center',
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
      color: '#FFFFFF',
      textAlign: 'center',
      fontSize: 16,
      fontWeight: 'bold',
    },
    image: {
      width: window.innerWidth * 1.15,
      height: window.innerHeight * 0.9,
      marginTop: 24,
      resizeMode: 'contain',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 6,
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
    },
  });