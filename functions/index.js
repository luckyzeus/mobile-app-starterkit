/**
 * Minimal example onboarding callable used by the starter.
 * - In DEMO_MODE it returns early to allow for testing wihout setting/calling your DB.
 * - When you’re ready, set DEMO_MODE=false and run in emulators or deploy.
 * - Remember to replace with your actual function name, and update to meet your data needs.
 */

require('dotenv').config();
const { onCall, HttpsError } = require('firebase-functions/v2/https');
const { initializeApp } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');
const { getStorage } = require('firebase-admin/storage');

// ---- config from env (functions/.env or runtime config) ----
const REGION = process.env.FUNCTIONS_REGION || 'us-central1';
const DEMO_MODE = String(process.env.DEMO_MODE || 'true').toLowerCase() === 'true';
const STORAGE_BUCKET = process.env.STORAGE_BUCKET || ''; // optional


// ---- initialize admin (no cert — let Functions/emulator manage auth) ----
initializeApp(STORAGE_BUCKET ? { storageBucket: STORAGE_BUCKET } : {});
const db = getFirestore();
const storage = getStorage(); // available if you passed storageBucket

exports.onboardingUser = onCall({ region: REGION }, async (request) => {
  const auth = request.auth;
  if (!auth) throw new HttpsError('unauthenticated', 'Login required');

  const { username, email, subscribeToEmail } = request.data || {};
  if (!username || !email) {
    throw new HttpsError('invalid-argument', 'Missing username or email');
  }

  // demo guard — keep the starter safe by default
  if (DEMO_MODE) {
    return { success: true, demo: true };
  }

  const lower = String(username).toLowerCase().trim();
  const unameRef = db.collection('Usernames').doc(lower);
  const userRef  = db.collection('Users').doc(auth.uid);

  const exists = await unameRef.get();
  if (exists.exists) {
    throw new HttpsError('already-exists', 'Username already taken');
  }

  // ---- create/update user doc & reserve username atomically ----
  const batch = db.batch();

  batch.set(unameRef, {
    uid: auth.uid, createdAt: FieldValue.serverTimestamp() 
  });

  batch.set(userRef, {
    uid: auth.uid,
    username,
    email,
    hasStartedOnboarding: true,
    hasFinishedOnboarding: false,
    isLoggedIn: true,
    newUser: true,
    ...(subscribeToEmail ? { subscribedToEmail: true } : {}),
    createdAt: FieldValue.serverTimestamp()
  }, { merge: true });

  await batch.commit();
  
  return { success: true };
});