export const theme = {
  light: {
    background: '#FFFFFF',
    text: '#000000',
    primary: '#000000',
    secondary: '#000000',
    accent: '#000000',
    border: '#000000',
    card: '#FFFFFF',
    error: '#000000',
    success: '#000000',
    buttonText: '#FFFFFF',
  },
  dark: {
    background: '#000000',
    text: '#FFFFFF',
    primary: '#FFFFFF',
    secondary: '#FFFFFF',
    accent: '#FFFFFF',
    border: '#FFFFFF',
    card: '#000000',
    error: '#FFFFFF',
    success: '#FFFFFF',
    buttonText: '#000000',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 16,
    xl: 24,
  },
  typography: {
    h1: {
      fontSize: 32,
      fontFamily: 'Montserrat_700Bold',
      letterSpacing: 0.5,
    },
    h2: {
      fontSize: 24,
      fontFamily: 'Montserrat_700Bold',
      letterSpacing: 0.3,
    },
    h3: {
      fontSize: 20,
      fontFamily: 'Montserrat_700Bold',
      letterSpacing: 0.2,
    },
    body: {
      fontSize: 16,
      fontFamily: 'Inter_400Regular',
      letterSpacing: 0.1,
    },
    caption: {
      fontSize: 14,
      fontFamily: 'Lato_400Regular',
      letterSpacing: 0.1,
    },
    accent: {
      fontSize: 16,
      fontFamily: 'Lato_700Bold',
      letterSpacing: 0.1,
    }
  },
} as const; 