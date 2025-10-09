# EAS Dev Build

Use the Dev Client to run RNFirebase/MMKV (native modules) with fast JS reloads.

## Steps (iOS / Android)

1) Install native deps (only when going native).
2) Ensure Firebase config files are present:
   - iOS: `config/GoogleService-Info.plist`
   - Android: `android/app/google-services.json` (+ SHA-1 in Firebase if using Google sign-in)
3) Build dev client:
```bash
eas build --profile development --platform ios
eas build --profile development --platform android
```
4) Install to device (EAS link/TestFlight/ADB).
5) Start Metro for dev client:
```bash
npm run env:native
expo start --dev-client
```

## When to rebuild
- After adding/removing native modules (RNFirebase/MMKV/plugins)
- After changing app.json capabilities (Apple Sign In, etc.)
- Upgrading Expo SDK

## No rebuild needed
- JS/TS changes, styles, images, Cloud Function logic, Firestore rules.
- After adding non-native expo compatible packages,