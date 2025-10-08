import { useUserStore } from '../../state/client/userStore';

type UserDoc = { uid: string; username: string; hasFinishedOnboarding?: boolean; newUser?: boolean; isLoggedIn?: boolean; email?: string };

const _db: { users: Record<string, UserDoc> } = {
  users: { dev_001: { uid: 'dev_001', username: 'DevUser', hasFinishedOnboarding: false, newUser: true, isLoggedIn: false } }
};

export const seedData = {
  getUser: async (uid: string) => _db.users[uid] ?? null,
  upsertUser: async (doc: UserDoc) => { _db.users[doc.uid] = { ..._db.users[doc.uid], ...doc }; },
  me: async (uid: string) => (uid ? _db.users[uid] ?? null : null),
};

// Recreate an in-memory doc from the persisted store so `useMe(uid)` matches on reloads.
export function hydrateSeedFromStore() {
  const s = useUserStore.getState();
  if (!s.uid) return;
  _db.users[s.uid] = {
    uid: s.uid,
    username: s.username ?? 'User',
    hasFinishedOnboarding: s.newUser ? false : true, // infer if you like
    newUser: s.newUser ?? true,
    isLoggedIn: s.isLoggedIn ?? false,
    email: s.email ?? undefined,
  };
}
