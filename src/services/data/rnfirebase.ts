// Only loads under Native path
let fs: any;
try {
  fs = require('@react-native-firebase/firestore').default;
} catch { }
const col = () => fs().collection('Users');

export const rnfirebaseData = {
  getUser: async (uid: string) => {
    const snap = await col().doc(uid).get();
    return snap.exists ? snap.data() : null;
  },
  upsertUser: async (input: any) => col().doc(input.uid).set(input, { merge: true }),
  me: async (uid: string) => rnfirebaseData.getUser(uid),
};
