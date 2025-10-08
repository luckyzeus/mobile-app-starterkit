// Clear persistence + reset stores (works in Managed now; upgrades to MMKV on Native)
import { makeKV } from '../../state/client/storage';
import { useUserStore } from '../../state/client/userStore';
import { useOnboardingStore } from '../../state/client/onboardingStore';
import { queryClient } from '../../state/server/queryClient';
import { resetUsernameRegistry } from '../user/api';

export async function clearAllPersistence() {
  try {
    const kv = makeKV();
    await kv.clearAll?.();
  } catch (e) {
    console.warn('[persist] clearAll not available, falling back');
  }
  // Reset Zustand states
  useUserStore.setState({
    uid: null, username: null, isLoggedIn: false, newUser: true,
    email: ''
  });
  useOnboardingStore.setState({
    onboardingUsername: '', hasStartedOnboarding: false, hasFinishedOnboarding: false
  });
  // Clear query cache
  queryClient.clear();
  // Reset seed username registry
  resetUsernameRegistry();
}
