import { useFonts } from 'expo-font';

export const useAppFonts = () => {
  const [fontsLoaded] = useFonts({
    'Sora-Regular': require('../../assets/fonts/Sora-Regular.ttf'),
    'Sora-Medium': require('../../assets/fonts/Sora-Medium.ttf'),
    'playsans': require('../../assets/fonts/playsans.ttf'),
  });

  return fontsLoaded;
}; 