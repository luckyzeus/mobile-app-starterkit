# iOS setup

<!-- TODO: Finish full instructions -->

- Apple Developer account required.
- `expo.ios.bundleIdentifier` must match the App ID.
- Enable **Sign in with Apple** if you plan to use it natively.
- Add `config/GoogleService-Info.plist` and set in `app.json`:
```json
{
  "expo": { "ios": { "googleServicesFile": "./config/GoogleService-Info.plist" } }
}
```
- EAS will manage certs/profiles unless you bring your own.