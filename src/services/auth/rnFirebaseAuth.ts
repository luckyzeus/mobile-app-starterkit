import { useUserStore } from '../../state/client/userStore';

let auth: any;
try { auth = require('@react-native-firebase/auth').default; } catch { }

const setFrom = (u: any) => {
  if (!u) { useUserStore.getState().setLoggedIn(false); return null; }
  useUserStore.getState().setUid(u.uid);
  useUserStore.getState().setUsername(u.email?.split('@')[0] ?? 'User');
  useUserStore.getState().setLoggedIn(true);
  return { uid: u.uid };
};

export const rnfirebaseAuth = {
  signInEmail: async (email: string, password: string) => {
    const { user } = await auth().signInWithEmailAndPassword(email, password);
    return setFrom(user);
  },
  signOut: async () => { await auth().signOut(); useUserStore.getState().setLoggedIn(false); },
  currentUser: () => setFrom(auth().currentUser),
  listen: () => auth().onAuthStateChanged(setFrom),
};
