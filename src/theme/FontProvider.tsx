import React, { useEffect, PropsWithChildren } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts as useInter } from '@expo-google-fonts/inter';
import { useFonts as useBarlow } from '@expo-google-fonts/barlow-condensed';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import {
  BarlowCondensed_700Bold_Italic,
} from '@expo-google-fonts/barlow-condensed';
import { useFonts as useLocalFonts } from 'expo-font';

// Don’t auto-hide until fonts are ready
SplashScreen.preventAutoHideAsync().catch(() => { });

export default function FontProvider({ children }: PropsWithChildren) {
  const [interLoaded] = useInter({
    Inter_400Regular,
    Inter_500Medium,
    Inter_700Bold,
  });

  const [barlowLoaded] = useBarlow({
    BarlowCondensed_700Bold_Italic,
  });

  const [localLoaded] = useLocalFonts({
    RoadRage: require('../../assets/fonts/RoadRage.otf'),
    // If you later want your other local fonts, add here the same way.
  });

  const fontsReady = interLoaded && barlowLoaded && localLoaded;

  useEffect(() => {
    if (fontsReady) {
      SplashScreen.hideAsync().catch(() => { });
    }
  }, [fontsReady]);

  if (!fontsReady) return null; // Block UI until fonts are ready (Splash stays up)

  return <>{children}</>;
}
