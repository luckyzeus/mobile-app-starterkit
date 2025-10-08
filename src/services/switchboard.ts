// src/services/switchboard.ts
import { isLive, isFirebaseAuth, isNative } from '../config/runtime';
import { seedData } from './data/seed';

// Return the correct adapter only when accessed, and only require() when needed.
// This prevents Metro from resolving firebase packages in seed mode.
function getDataAdapter() {
  if (!isLive) return seedData;
  if (isNative) {
    try {
      return require('./data/rnfirebase').rnfirebaseData;
    } catch {
      return seedData;
    }
  }
  try {
    return require('./data/firebaseWeb').firebaseData;
  } catch {
    return seedData;
  }
}

function getAuthAdapter() {
  if (isNative) {
    try {
      return require('./auth/rnfirebaseAuth').rnfirebaseAuth;
    } catch {
      // fall back to web/mock
    }
  }
  if (isFirebaseAuth) {
    try {
      return require('./auth/firebaseWebAuth').firebaseWebAuth;
    } catch {
      // fall back to mock
    }
  }
  return require('./auth/mockAuth').mockAuth;
}

// Proxies let you keep `data.method()` and `auth.method()` call sites unchanged.
export const data: any = new Proxy(
  {},
  { get: (_t, prop) => (getDataAdapter() as any)[prop as any] }
);

export const auth: any = new Proxy(
  {},
  { get: (_t, prop) => (getAuthAdapter() as any)[prop as any] }
);
