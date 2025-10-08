import { isNative } from '../../config/runtime';

export interface KV {
  getItem: (k: string) => Promise<string | null> | string | null;
  setItem: (k: string, v: string) => Promise<void> | void;
  removeItem: (k: string) => Promise<void> | void;
  clearAll?: () => Promise<void> | void;
}

export const makeKV = (): KV => {
  if (isNative) {
    try {
      // Only works after you add react-native-mmkv in the Native path
      const { MMKV } = require('react-native-mmkv');
      const store = new MMKV({ id: 'app-kv' });
      return {
        getItem: (k) => store.getString(k) ?? null,
        setItem: (k, v) => store.set(k, v),
        removeItem: (k) => store.delete(k),
        clearAll: () => store.clearAll(),
      };
    } catch (e) {
      console.warn('[kv] MMKV not available; falling back to AsyncStorage');
    }
  }
  const AsyncStorage = require('@react-native-async-storage/async-storage').default;
  return {
    getItem: (k) => AsyncStorage.getItem(k),
    setItem: (k, v) => AsyncStorage.setItem(k, v),
    removeItem: (k) => AsyncStorage.removeItem(k),
    clearAll: () => AsyncStorage.clear(),
  };
};
