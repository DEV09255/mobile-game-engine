# Skyline Merge Arena Android Wrapper

This repository now contains:
- a browser-based prototype game in the root `index.html`
- an Android WebView wrapper in `app/` for packaging into an APK/AAB workflow

## Run the web prototype locally

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Android project

The Android project is located in the `app/` folder and loads the same game from `app/src/main/assets/index.html`.

### Prerequisites
- Android Studio
- Android SDK 34
- Java 17

### Build steps
1. Open the project in Android Studio.
2. Let Gradle sync.
3. Build > Generate Signed Bundle / APK.
4. Upload the resulting AAB to Google Play Console.

## Important notes
- This is a wrapper around the game UI and mock store logic.
- Real in-app purchases must be implemented with Google Play Billing and signed with a real Play Console account.
- Publishing still requires Play Console registration, app privacy policy, content rating, and store listing.
