// src/app/AppNavigator.tsx
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useUserStore } from '../state/client/userStore';
import { useOnboardingStore } from '../state/client/onboardingStore';
import AuthNavigator from './AuthNavigator';
import TabsNavigator from '../screens/tabs/TabsNavigator';
import AppLaunchScreen from '../screens/launch/AppLaunchScreen';
import { useMe } from '../services/user/queries';

export default function AppNavigator() {
  const isLoggedIn = useUserStore((s) => s.isLoggedIn);
  const uid = useUserStore((s) => s.uid);
  const [launchDone, setLaunchDone] = useState(false);
  const { data: me } = useMe(uid);

  if (!launchDone) {
    return <AppLaunchScreen onAnimationEnd={() => setLaunchDone(true)} />;
  }

  const finished = !!me?.hasFinishedOnboarding;
  return (
    <NavigationContainer>
      {isLoggedIn && finished ? <TabsNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
