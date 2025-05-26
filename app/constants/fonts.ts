import { useFonts } from 'expo-font';

export const useAppFonts = () => {
  const [fontsLoaded] = useFonts({
    'Sora-Regular': require('../../assets/fonts/Sora-Regular.ttf'),
    'Sora-Medium': require('../../assets/fonts/Sora-Medium.ttf'),
    'Sora-SemiBold': require('../../assets/fonts/Sora-SemiBold.ttf'),
    'Sora-Bold': require('../../assets/fonts/Sora-Bold.ttf'),
  });

  return fontsLoaded;
}; 