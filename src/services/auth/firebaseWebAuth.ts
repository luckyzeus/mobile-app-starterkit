import { initializeApp, getApps } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { runtime } from '../../config/runtime';
import { useUserStore } from '../../state/client/userStore';

if (!getApps().length) initializeApp(runtime.FIREBASE);
const auth = getAuth();

export const firebaseWebAuth = {
  signIn: async (email: string, password: string) => {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    useUserStore.getState().setUid(user.uid);
    useUserStore.getState().setUsername(email.split('@')[0]);
    useUserStore.getState().setLoggedIn(true);
    return { uid: user.uid };
  },
  signOut: async () => { await signOut(auth); useUserStore.getState().setLoggedIn(false); },
  currentUser: () => auth.currentUser,
  listen: () => onAuthStateChanged(auth, (u) => {
    if (!u) return useUserStore.getState().setLoggedIn(false);
    useUserStore.getState().setUid(u.uid);
    useUserStore.getState().setLoggedIn(true);
  }),
};
