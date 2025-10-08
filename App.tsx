// App.tsx
import './src/config/gesture-handler';
import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/app/AppNavigator';
import AssetsBootstrap from './src/app/AssetsBootstrap';
import { queryClient } from './src/state/server/queryClient';
import FontProvider from './src/theme/FontProvider';
import Toast from 'react-native-toast-message';
import { auth } from './src/services/switchboard';
import { useUserStore } from './src/state/client/userStore';
import { hydrateSeedFromStore } from './src/services/data/seed';
import { runtime } from './src/config/runtime';

// Mount once to mirror adapter auth state into Zustand
function AuthSync() {
  useEffect(() => {
    const unsub = (auth as any).listen?.((u: any) => {
      if (u?.uid) {
        useUserStore.getState().setUid(u.uid);
        useUserStore.getState().setLoggedIn(true);
      } else {
        useUserStore.getState().setLoggedIn(false);
        useUserStore.getState().setUid(null as any);
      }
    });
    return () => { if (typeof unsub === 'function') unsub(); };
  }, []);
  return null;
}

function SeedHydrator() {
  useEffect(() => {
    if (runtime.DATA_MODE === 'seed') hydrateSeedFromStore();
  }, []);
  return null;
}

export default function App() {
  return (
    <FontProvider>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <AssetsBootstrap holdSplash />
          <AuthSync />
          <SeedHydrator />
          <View style={styles.container}>
            <StatusBar style="light" />
            <AppNavigator />
            <Toast topOffset={48} />
          </View>
        </SafeAreaProvider>
      </QueryClientProvider>
    </FontProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    width: '100%',
  },
});
