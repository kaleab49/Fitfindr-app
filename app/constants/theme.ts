export const theme = {
  light: {
    background: '#E1D5C9',
    surface: '#E1D5C9',
    text: '#000000',
    primary: '#000000', // Black for buttons
    secondary: '#9C27B0', // Purple for switches/highlights
    accent: '#9C27B0', // Purple for switches/highlights
    border: '#9C27B0', // Purple
    card: '#E1D5C9',
    error: '#E57373',
    success: '#81C784',
    buttonText: '#FFFFFF',
  },
  dark: {
    background: '#E1D5C9',
    surface: '#E1D5C9',
    text: '#000000',
    primary: '#000000', // Black for buttons
    secondary: '#9C27B0', // Purple for switches/highlights
    accent: '#9C27B0', // Purple for switches/highlights
    border: '#9C27B0', // Purple
    card: '#E1D5C9',
    error: '#E57373',
    success: '#81C784',
    buttonText: '#FFFFFF',
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