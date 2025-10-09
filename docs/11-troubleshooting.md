# Troubleshooting

**Expo Go can’t open**
- Use tunnel: `npm run dev:seed:tunnel -- -c`
- Update Expo Go to match your SDK
- Windows firewall: allow Node/Expo on Private networks

**Name still “taken” after clear**
- “Clear persistence (dev)” also resets the seed username registry.

**Live Web not connecting**
- `npm i firebase`
- Provide all `EXPO_PUBLIC_FIREBASE_*` keys
- Use `npm run dev:live:web`

**Native swtich not working (see other docs)**
- Be sure to read all docs on how to properly switch off of a managed project and set up an EAS dev build.
- Install and set up react-native-firebase.
- use the runtime switch to utilize the native path.

**Other Issues**
- This project isn't 100% optimized and uses quite a few packages. Thus you may run into dependency or other undocumented issues.
- Run `npx expo-doctor` to see if your issue is specific to expo.
- If you are hitting a wall and need assistance: either submit a formal issue request or reach out to me directly
and I will do my best to get back to you to help (contact@indemni.io).