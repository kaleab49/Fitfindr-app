import { Stack } from 'expo-router';
import { Text, View } from 'react-native';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// This tells the app where to start
export const unstable_settings = {
  initialRouteName: 'auth/sign-in',
};

// Main navigation component
function RootLayoutNav() {
  // Get user authentication status
  const { user, loading } = useAuth();

  // Show loading screen while checking authentication
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <Stack>
      {/* Sign In Screen */}
      <Stack.Screen 
        name="auth/sign-in" 
        options={{ 
          headerShown: false,
          gestureEnabled: false 
        }} 
      />
      
      {/* Main App Tabs */}
      <Stack.Screen 
        name="(tabs)" 
        options={{ 
          headerShown: false,
          gestureEnabled: false 
        }} 
      />
      
      {/* Profile Setup Screen */}
      <Stack.Screen
        name="profile/setup"
        options={{
          title: 'Profile Setup',
          headerBackTitle: 'Back',
        }}
      />
    </Stack>
  );
}

// Root component that wraps the entire app
export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RootLayoutNav />
      </AuthProvider>
    </ThemeProvider>
  );
}
