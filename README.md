# Mobile App Starter Kit (Expo + Zustand + TanStack + Firebase-ready)

A production-style mobile starter that runs out of the box in **Managed (Expo Go)** with seed data and **persists state** (AsyncStorage), and flips cleanly to **Native (EAS Dev Client)** with **React Native Firebase + MMKV** — without rewriting screens.

**Highlights**
- Dual runtime via flags: `PATH` (managed|native) · `DATA_MODE` (seed|live) · `AUTH_MODE` (mock|firebase)
- **Switchboard** chooses adapters (auth/data) at runtime
- **Zustand** for client state (persisted via AsyncStorage/MMKV)
- **TanStack Query** for server state (`useMe`, `useUpsertUser`)
- A simplified fully functional onboarding/auth user experience.
- Seed flow that feels real: persisted stores + in-memory DB **hydrated** on boot
- One-tap “Clear persistence (dev)” and a demo “Delete account (dev)”
- Full UI/UX, with animation examples.
- Firebase Web (managed live) and RNFirebase (native) are **optional** but pre-wired

## Demo

<p alignItems="center" justifyContent="center">
  <img src="assets/demo.gif" alt="Demo" width="350">
</p>

## Context & philosophy

This template focuses on two paths:
- **Managed (Expo Go) - Fast**: fastest to try/diff, no native modules, mock Firebase services (with quick "real" Firebase web sdk set up).
- **Native (Dev Client) - Recommended**: real backend/server logic and optimizatioon via @react-native-firebase + MMKV + callable Functions, documented but off by default.

I picked **Zustand** for ergonomic global client state, **TanStack Query** for server-state, and **Expo** for frictionless RN UX and optimizes production ops. There are certainly many great alternatives for state control, but I find Zustand/MMKV to be simple, fast, and efficient. 

The idea is for this to be a **teachable template** for newer developers or something seasoned dev can start up quickly to swap in their own data, assets, logic, and backend (Firebase, Supabase, AWS) without fighting the app skeleton. Overtime, this will be built out to have
more example components/docs/switches to easily swap in whatever dependency/stack you prefer.

Many open source repos contain great templates for UI, UX, or backend setup/integration, but very few have:
- A **realistic complete foundation** for a mobile application with consistent branded UI/UX that showcases a real product in action.
- A **modular repo**, with a tailored lightweight dependency/package list already integrated, that allows for quickly switching out frontend/backend assets and logic to meet your project specifications.
- **Comprehensive documentation**, with examples, that takes newer developers (or first time react-native/mobile devs) through the full project structure and logic construction of onboarding/auth.

## Disclaimer & Roadmap

**This repo is a small refactored slice of my upcoming mobile app/game Indemni.** I wanted to show
how a real production app is (*or can be) built and thus utilizes branded assets (feel free to use them if you want!) and some specific
tailored logic. I tried to keep things simple (removing audio, heavy assets, and niche libraries), while also showcasing some more advanced UX
(simple Reanimated animations, blurred overlay with a loader video, etc.). If you don't like/need certain assets or packages, remove
them and everything should still work fine.

The template focuses on a clean dual-runtime architecture (Expo Go + EAS Dev Client) with
seed/mock paths that **feel real**, but require you to swap in your desired logic data, and api keys. 

Some screens are intentionally minimal to keep the architecture understandable.
While this repo works as is, it still requires quite a bit more polish and is far from perfect.
I will be updating it slowly when I have time over the next few months, but until then use
your best judgment and run tests before deciding to use this repo in a production scenario.

See **ROADMAP.md** for high-level planned polish, and **TODO.md** for current tasks
PRs welcome — contributing documentation coming soon.

## Quickstart (abbreviated)

```bash
# install deps
npm i
npm i -D cross-env

# seed mode (managed + AsyncStorage persistence + mock auth + seed DB)
npm run dev:seed
# or clear Metro cache
npm run dev:seed:clear
# set keys via .env or shell env (see .env.managed.example)
npm run dev:live:web
```

A more in-depth quickstart can be seen here → [Quickstart](docs/01-quickstart.md)

## Scripts (package.json)
```json
{
  "dev:seed": "cross-env EXPO_PUBLIC_PATH=managed EXPO_PUBLIC_DATA_MODE=seed EXPO_PUBLIC_AUTH_MODE=mock expo start",
  "dev:seed:clear": "cross-env EXPO_PUBLIC_PATH=managed EXPO_PUBLIC_DATA_MODE=seed EXPO_PUBLIC_AUTH_MODE=mock expo start -c",
  "dev:live:web": "cross-env EXPO_PUBLIC_PATH=managed EXPO_PUBLIC_DATA_MODE=live EXPO_PUBLIC_AUTH_MODE=firebase expo start"
}
```

## Flags
- PATH: managed (Expo Go) or native (EAS Dev Client)
- DATA_MODE: seed (in-memory DB, persisted stores) or live (Firestore)
- AUTH_MODE: mock (no provider) or firebase (email/pw demo on web; RN providers on native)

These are injected via app.config.js from EXPO_PUBLIC_* env vars.

## Where to look in the code
- [Runtime](src/config/runtime.ts) — reads flags/keys from Constants.expoConfig.extra
- [Switchboard](src/services/switchboard.ts) — lazy proxy that picks the correct auth/data adapters
- [Seeding](src/services/data/seed.ts) — seed DB + hydrateSeedFromStore() (rebuilds in-memory doc on boot)
- [User API](src/services/user/api.ts) — username availability/reservation; onboarding create; delete
- [Client State](src/state/client/) — Zustand stores, persisted via AsyncStorage/MMKV using makeKV()
- [App](App.tsx) — AuthSync (mirrors auth → store) and SeedHydrator (mirrors store → seed DB)
- [Navigation](src/app/AppNavigator.tsx) — routes to Tabs when isLoggedIn && useMe(uid).hasFinishedOnboarding

## Docs & Advanced usage

This repo runs in **Managed (Expo Go)** by default.

- **Overview** (what this template solves)
  → see [Overview](docs/00-overview.md)

- **Quickstart** (how to run/use)
  → see [Quickstart](docs/01-quickstart.md)

- **State & Persistence**
  → see [State](docs/02-state-and-persistence.md)

- **Firebase data model (Users, Usernames, Auth)**
  → see [Firebase](docs/03-firebase-model.md)

- **Cloud Functions (Onboarding)**
  → see [Cloud Functions](docs/04-cloud-functions.md)

- **Switching Managed ↔ Native** (what to uncomment, env vars, safe templates)
  → see [Runtime Switch](docs/05-switching-runtime.md)

- **EAS Dev Build: iOS/Android step-by-step**
  → see [EAS/Native](docs/06-eas-dev-build.md)

- **Apple Developer setup (Bundle ID, Sign in with Apple)**
  → see [iOS](docs/08-ios-setup.md)

- **Android setup (package name, SHA-1, Google JSON)**
  → see [Android](docs/09-android-setup.md)

- **Production Security Rules**
  → see [Security](docs/10-security-rules.md)

- **Troubleshooting**
  → see [Troubleshooting](docs/11-troubleshooting.md)
