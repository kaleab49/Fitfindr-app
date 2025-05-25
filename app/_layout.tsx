import { Stack } from 'expo-router';
import { View } from 'react-native';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

export const unstable_settings = {
  initialRouteName: 'auth/sign-in',
};

function RootLayoutNav() {
  const { user, loading } = useAuth();

  if (loading) {
    return <View style={{ flex: 1 }} />;
  }

  return (
    <Stack>
      <Stack.Screen 
        name="auth/sign-in" 
        options={{ 
          headerShown: false,
          gestureEnabled: false 
        }} 
      />
      <Stack.Screen 
        name="(tabs)" 
        options={{ 
          headerShown: false,
          gestureEnabled: false 
        }} 
      />
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

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RootLayoutNav />
      </AuthProvider>
    </ThemeProvider>
  );
}
