# State & Persistence

**Client state (Zustand)** lives in:
- `src/state/client/userStore.ts` — uid, username, isLoggedIn, etc. (persisted)
- `src/state/client/onboardingStore.ts` — onboarding flags/username (persisted)

Persistence uses:
- `src/state/client/storage.ts` → AsyncStorage in managed, MMKV in native.

**Server state (TanStack Query)**:
- `src/services/user/queries.ts` — `useMe(uid)`, `useUpsertUser()`

**Auth & Seed Sync**
- `App.tsx` mounts `AuthSync` (mirrors adapter auth → store) and `SeedHydrator`
  (mirrors persisted store → in-memory seed doc on boot so `useMe(uid)` matches).

**Clear everything**
- `src/services/dev/maintenance.ts` → `clearAllPersistence()`
  - clears AsyncStorage/MMKV,
  - resets Zustand stores,
  - clears TanStack cache,
  - resets the seed username registry.