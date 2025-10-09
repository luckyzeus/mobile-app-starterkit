# Quickstart

# Install deps
```bash
npm i
npm i -D cross-env
```

## Seed (default, managed/Expo Go)
```bash
npm run dev:seed
# or with cache clear / tunnel:
npm run dev:seed:clear
```

- Mock auth, in-memory DB, persisted Zustand stores via AsyncStorage.
- Seed DB is rebuilt on boot from the persisted store via SeedHydrator.

## Live (managed + Firebase Web)
```bash
# set keys in .env or your shell
npm run dev:live:web
```

- Real Firestore/Auth (email/pw demo already included).
- Persisted via AsyncStorage.

## Native (EAS Dev Client + RNFirebase + MMKV)

- Install native deps and build a dev client; see [EAS Dev Build](06-eas-dev-build.md)

Set EXPO_PUBLIC_PATH=native.

Same screens, now calling RNFirebase adapters; persistence via MMKV.