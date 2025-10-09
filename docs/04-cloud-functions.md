# Cloud Functions

<!-- TODO: Finish full instructions -->

Use Functions in **live/native** to:
- reserve usernames (write `Usernames/{lower}`),
- create/update a `Users/{uid}` document atomically.

Client (native) usage:
```ts
// after native Apple/Google sign-in:
import functions from '@react-native-firebase/functions';
await functions().httpsCallable('onboardingUser')({ username, email, subscribeToEmail: true });
```
