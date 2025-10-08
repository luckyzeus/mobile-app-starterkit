import { isLive } from '../../config/runtime';
import { data } from '../switchboard';

// In seed mode we emulate a /Usernames collection:
const taken = new Set(['brian', 'alex', 'rachel']);

export async function checkUsernameAvailable(name: string) {
  const n = name.trim().toLowerCase();
  if (!n) return false;

  if (!isLive) {
    return !taken.has(n);
  }

  // Firestore Web / RNFirebase: /Usernames/{lowerName}
  try {
    // Web SDK
    // const { getFirestore, doc, getDoc } = await import('firebase/firestore');
    // const db = getFirestore();
    // const snap = await getDoc(doc(db, 'Usernames', n));
    // return !snap.exists();

    // For now, emulate success when live is selected but web SDK not installed:
    return true;
  } catch {
    // If Firebase not present yet, assume available for demo
    return true;
  }
}

export async function reserveUsername(uid: string, name: string) {
  const lower = name.trim().toLowerCase();
  if (!isLive) { taken.add(lower); return true; }

  try {
    // Web SDK
    // const { getFirestore, doc, setDoc, serverTimestamp } = await import('firebase/firestore');
    // const db = getFirestore();
    // await setDoc(doc(db, 'Usernames', lower), { uid, createdAt: serverTimestamp() }, { merge: true });
    return true;
  } catch {
    return true;
  }
}

export async function onboardingCreateUser(payload: {
  uid: string, username: string, email?: string
}) {
  // Seed path: upsert to "Users"
  if (!isLive) {
    await data.upsertUser({
      uid: payload.uid,
      username: payload.username,
      email: payload.email ?? `${payload.username}@demo.local`,
      hasFinishedOnboarding: false,
      newUser: true,
      isLoggedIn: true
    });
    return { success: true };
  }

  // Live path (callable example commented for Web SDK; mirrors your CF)
  try {
    // Web SDK callable (if you later add it):
    // const { getFunctions, httpsCallable } = await import('firebase/functions');
    // const fn = httpsCallable(getFunctions(), 'onboardingUser');
    // const res = await fn({ username: payload.username, email: payload.email, subscribedToEmail: true });
    // return res.data as { success: boolean };

    // Fallback: write directly to /Users when functions not wired yet
    await data.upsertUser({
      uid: payload.uid,
      username: payload.username,
      email: payload.email ?? `${payload.username}@demo.local`,
      hasFinishedOnboarding: false,
      newUser: true,
      isLoggedIn: true
    });
    return { success: true };
  } catch (e) {
    return { success: false, error: String(e) };
  }
}

export function resetUsernameRegistry() {
  taken.clear();
  // re-seed defaults if you want them to appear "taken" again:
  taken.add('brian'); taken.add('alex'); taken.add('rachel');
}

export async function deleteAccount(uid: string, username?: string | null) {
  if (!uid) return { success: false, error: 'No uid' };

  if (!isLive) {
    // Seed mode: just remove from demo registry and "clear"
    if (username) taken.delete(username.toLowerCase());
    return { success: true };
  }

  // Live: comment-ready placeholders (uncomment after adding SDKs)
  try {
    // const { getFirestore, doc, deleteDoc } = await import('firebase/firestore');
    // const db = getFirestore();
    // await deleteDoc(doc(db, 'Users', uid));
    // if (username) await deleteDoc(doc(db, 'Usernames', username.toLowerCase()));
    // Optional: Auth delete via callable admin or client if allowed
    return { success: true };
  } catch (e) {
    return { success: false, error: String(e) };
  }
}
