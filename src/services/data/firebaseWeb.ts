// src/services/data/firebaseWeb.ts
import { runtime } from '../../config/runtime';

// Lazily initialize the Firebase Web SDK only if/when called.
let _initialized = false;

async function ensureInit() {
  const app = await import('firebase/app');
  if (!_initialized) {
    if (!app.getApps().length) app.initializeApp(runtime.FIREBASE);
    _initialized = true;
  }
}

export const firebaseData = {
  async getUser(uid: string) {
    await ensureInit();
    const fs = await import('firebase/firestore');
    const db = fs.getFirestore();
    const snap = await fs.getDoc(fs.doc(db, 'Users', uid));
    return snap.exists() ? snap.data() : null;
  },

  async upsertUser(input: any) {
    await ensureInit();
    const fs = await import('firebase/firestore');
    const db = fs.getFirestore();
    await fs.setDoc(fs.doc(db, 'Users', input.uid), input, { merge: true });
  },

  async me(uid: string) {
    return this.getUser(uid);
  },
};
