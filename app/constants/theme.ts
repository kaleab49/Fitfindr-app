// Theme configuration for the app
export const theme = {
  // Light mode colors
  light: {
    // Main colors
    primary: '#007AFF',
    secondary: '#5856D6',
    accent1: '#FF2D55',
    accent2: '#5AC8FA',
    
    // Background colors
    background: '#F2F2F7',
    surface: '#FFFFFF',
    card: '#FFFFFF',
    
    // Text colors
    text: '#000000',
    textSecondary: '#666666',
    textTertiary: '#999999',
    
    // Status colors
    success: '#34C759',
    warning: '#FF9500',
    error: '#FF3B30',
    
    // Border colors
    border: '#E5E5EA',
    
    // Tab bar colors
    tabBar: '#FFFFFF',
    tabIcon: '#8E8E93',
    tabIconSelected: '#007AFF',
  },
  
  // Dark mode colors
  dark: {
    // Main colors
    primary: '#0A84FF',
    secondary: '#5E5CE6',
    accent1: '#FF375F',
    accent2: '#64D2FF',
    
    // Background colors
    background: '#000000',
    surface: '#1C1C1E',
    card: '#2C2C2E',
    
    // Text colors
    text: '#FFFFFF',
    textSecondary: '#EBEBF5',
    textTertiary: '#8E8E93',
    
    // Status colors
    success: '#30D158',
    warning: '#FF9F0A',
    error: '#FF453A',
    
    // Border colors
    border: '#38383A',
    
    // Tab bar colors
    tabBar: '#1C1C1E',
    tabIcon: '#8E8E93',
    tabIconSelected: '#0A84FF',
  },
  
  // Common styles
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  
  // Typography
  typography: {
    h1: {
      fontSize: 32,
      fontWeight: 'bold',
    },
    h2: {
      fontSize: 24,
      fontWeight: 'bold',
    },
    h3: {
      fontSize: 20,
      fontWeight: '600',
    },
    body: {
      fontSize: 16,
    },
    caption: {
      fontSize: 14,
    },
  },
  
  // Border radius
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    round: 9999,
  },
  
  // Shadows
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.18,
      shadowRadius: 1.0,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.30,
      shadowRadius: 4.65,
      elevation: 8,
    },
  },
}; 