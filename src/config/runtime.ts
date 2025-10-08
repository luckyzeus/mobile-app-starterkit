import Constants from 'expo-constants';

type Extra = {
  PATH?: 'managed' | 'native';
  DATA_MODE?: 'seed' | 'live';
  AUTH_MODE?: 'mock' | 'firebase';
  FIREBASE?: Record<string, unknown>;
};

const extra: Extra = (Constants.expoConfig?.extra as Extra) ?? {};

export const runtime = {
  PATH: extra.PATH ?? 'managed',
  DATA_MODE: extra.DATA_MODE ?? 'seed',
  AUTH_MODE: extra.AUTH_MODE ?? 'mock',
  FIREBASE: extra.FIREBASE ?? {}
};

export const isNative = runtime.PATH === 'native';
export const isLive = runtime.DATA_MODE === 'live';
export const isFirebaseAuth = runtime.AUTH_MODE === 'firebase';
