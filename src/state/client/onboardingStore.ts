import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { makeKV } from './storage';

type OnboardingState = {
  onboardingUsername: string;
  hasStartedOnboarding: boolean;
  hasFinishedOnboarding: boolean;
  setOnboardingUsername: (u: string) => void;
  setHasStarted: (v: boolean) => void;
  setHasFinished: (v: boolean) => void;
};

const kv = makeKV();

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      onboardingUsername: '',
      hasStartedOnboarding: false,
      hasFinishedOnboarding: false,
      setOnboardingUsername: (u) => set({ onboardingUsername: u }),
      setHasStarted: (v) => set({ hasStartedOnboarding: v }),
      setHasFinished: (v) => set({ hasFinishedOnboarding: v }),
    }),
    {
      name: 'onboarding-data',
      storage: createJSONStorage(() => ({
        getItem: kv.getItem, setItem: kv.setItem, removeItem: kv.removeItem,
      })),
    }
  )
);
