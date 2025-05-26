import { Stack } from 'expo-router';
import { View } from 'react-native';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { useAppFonts } from './constants/fonts';

export const unstable_settings = {
  initialRouteName: 'auth/sign-in',
};

function RootLayoutNav() {
  const { user, loading } = useAuth();
  const fontsLoaded = useAppFonts();

  if (loading || !fontsLoaded) {
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
    <AuthProvider>
      <ThemeProvider>
        <RootLayoutNav />
      </ThemeProvider>
    </AuthProvider>
  );
}
