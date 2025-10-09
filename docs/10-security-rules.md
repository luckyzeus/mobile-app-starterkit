# Firestore Security Rules (production)

<!-- TODO: Finish full instructions - make more thorough -->

```txt
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /Users/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
    match /Usernames/{uname} {
      allow read: if true;
      allow write: if false; // write via Cloud Function only
    }
    match /{document=**} { allow read, write: if false; }
  }
}
```

Use Functions for sensitive writes (username reservation, onboarding).