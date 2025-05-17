import {
    Inter_400Regular,
    Inter_700Bold,
    useFonts as useInter,
} from '@expo-google-fonts/inter';
import {
    Lato_400Regular,
    Lato_700Bold,
    useFonts as useLato,
} from '@expo-google-fonts/lato';
import {
    Montserrat_400Regular,
    Montserrat_700Bold,
    useFonts as useMontserrat,
} from '@expo-google-fonts/montserrat';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { View } from 'react-native';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';

export {
    ErrorBoundary
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: 'auth/sign-in',
};

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { isDarkMode } = useTheme();
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace('/(tabs)');
      } else {
        router.replace('/auth/sign-in');
      }
    }
  }, [user, loading]);

  if (loading) {
    return <View style={{ flex: 1 }} />;
  }

  return (
    <NavigationThemeProvider value={isDarkMode ? DarkTheme : DefaultTheme}>
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
    </NavigationThemeProvider>
  );
}

export default function RootLayout() {
  const [fontAwesomeLoaded] = useFonts({
    ...FontAwesome.font,
  });

  const [montserratLoaded] = useMontserrat({
    Montserrat_400Regular,
    Montserrat_700Bold,
  });

  const [interLoaded] = useInter({
    Inter_400Regular,
    Inter_700Bold,
  });

  const [latoLoaded] = useLato({
    Lato_400Regular,
    Lato_700Bold,
  });

  useEffect(() => {
    if (fontAwesomeLoaded && montserratLoaded && interLoaded && latoLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontAwesomeLoaded, montserratLoaded, interLoaded, latoLoaded]);

  if (!fontAwesomeLoaded || !montserratLoaded || !interLoaded || !latoLoaded) {
    return null;
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <RootLayoutNav />
      </AuthProvider>
    </ThemeProvider>
  );
}
