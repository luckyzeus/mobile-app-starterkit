// app.config.js
module.exports = () => ({
  expo: {
    name: "mobile-app-starterkit",
    slug: "mobile-app-starterkit",
    extra: {
      PATH: process.env.EXPO_PUBLIC_PATH ?? "managed",         // managed | native
      DATA_MODE: process.env.EXPO_PUBLIC_DATA_MODE ?? "seed",  // seed | live
      AUTH_MODE: process.env.EXPO_PUBLIC_AUTH_MODE ?? "mock",  // mock | firebase
      FIREBASE: {
        apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY ?? "",
        authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "",
        projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ?? "",
        storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "",
        messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "",
        appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID ?? ""
      }
    }
  }
});
