import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { makeKV } from './storage';

type UserState = {
  uid: string | null;
  username: string | null;
  email: string | null;
  isLoggedIn: boolean;
  newUser: boolean;
  setLoggedIn: (v: boolean) => void;
  setNewUser: (v: boolean) => void;
  setUid: (v: string | null) => void;
  setUsername: (v: string | null) => void;
  setEmail: (v: string | null) => void;
};

const kv = makeKV();

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      uid: null,
      username: null,
      email: null,
      isLoggedIn: false,
      newUser: true,
      setLoggedIn: (v) => set({ isLoggedIn: v }),
      setNewUser: (v) => set({ newUser: v }),
      setUid: (v) => set({ uid: v }),
      setUsername: (v) => set({ username: v }),
      setEmail: (v) => set({ email: v }), // ✅ fixed
    }),
    {
      name: 'user-data',
      storage: createJSONStorage(() => ({
        getItem: kv.getItem, setItem: kv.setItem, removeItem: kv.removeItem,
      })),
    }
  )
);
