import { useUserStore } from '../../state/client/userStore';

export const mockAuth = {
  signIn: async () => {
    useUserStore.getState().setUid('dev_001');
    useUserStore.getState().setUsername('DevUser');
    useUserStore.getState().setLoggedIn(true);
    return { uid: 'dev_001' };
  },
  signOut: async () => { useUserStore.getState().setLoggedIn(false); useUserStore.getState().setUid(null); },
  currentUser: () => {
    const { uid, username } = useUserStore.getState() as any;
    return uid ? { uid, username } : null;
  }
};
