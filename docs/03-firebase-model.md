# Firebase data model

## Collections

### Users — `Users/{uid}`
```jsonc
{
  "uid": "abc123",
  "username": "shadow",
  "email": "shadow@example.com",
  "hasStartedOnboarding": true,
  "hasFinishedOnboarding": false,
  "isLoggedin": false,
  "newUser": true,
  "createdAt": "<timestamp>"
}
```

### Usernames — Usernames/{usernameLower}
```jsonc
{ "uid": "abc123", "createdAt": "<timestamp>" }
```

Ensures uniqueness; write via Cloud Function during onboarding.

## Managed vs Native
- Managed seed uses src/services/data/seed.ts (hydrated from persisted store).
- Live managed uses src/services/data/firebaseWeb.ts (Firebase Web SDK).
- Native uses src/services/data/rnfirebase.ts (RNFirebase), enabled when you add those deps.
