# Overview

This starter shows a realistic app architecture that:
- boots immediately in **Expo Go** with a real-feeling flow (seed DB + persisted stores),
- flips to **Firebase Web** (managed live) with no screen rewrites,
- flips to **RNFirebase + MMKV** (native / EAS Dev Client) with no screen rewrites,
- cleanly separates **client state** (Zustand) from **server state** (TanStack Query),
- centralizes backend choice in a **switchboard**.

**Key idea:** Screens and hooks don’t know which backend is used. They call `auth.*`, `data.*`, or `useMe(uid)` and the **switchboard** picks the correct adapter for each runtime.