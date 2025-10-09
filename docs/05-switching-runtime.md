# Switching runtime

This project centralizes backend choice in **env flags** and the **switchboard**.

## Flags (set via env or scripts)

- `EXPO_PUBLIC_PATH` → `managed` | `native`
- `EXPO_PUBLIC_DATA_MODE` → `seed` | `live`
- `EXPO_PUBLIC_AUTH_MODE` → `mock` | `firebase`

`app.config.js` injects these into `Constants.expoConfig.extra`.

## Switchboard

`src/services/switchboard.ts` lazily picks adapters:
- Data: `seed` → `seedData`; `live` → `firebaseWeb` (managed) or `rnfirebase` (native)
- Auth: `mock` → `mockAuth`; `firebase` → `firebaseWebAuth` (managed) or `rnfirebaseAuth` (native)

Screens call `auth.*` / `data.*` / `useMe(uid)`; no UI rewrites.

## Optional env switcher

Create `.env.managed` / `.env.native` (or use the provided `.example` files) and use:

```bash
npm run env:managed && npm run dev:seed
npm run env:native && expo start --dev-client
```
