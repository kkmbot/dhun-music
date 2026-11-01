# Dhun Android app

Dhun ka Android app. Isme UI phone ke andar hi hota hai, isliye **bina internet ke bhi khulta hai**. Phone me download kiye songs airplane mode me bhi chalte hain.

## Phone pe install kaise karein (APK)

1. Is repo me **Releases** kholo (GitHub app ya browser me: repo page → *Releases*). Sabse upar wala (*Latest*) release kholo.
2. Neeche **Assets** me `Dhun-v1.0.x.apk` pe tap karo. Download ho jayega.
3. Download hone ke baad us file pe tap karo.
4. Pehli baar Android poochega *"For your security, your phone is not allowed to install unknown apps from this source"*. Tab **Settings** dabao → **Allow from this source** on karo → wapas aao.
   (Kuch phones me: Settings → Apps → Special app access → **Install unknown apps** → jis app se download kiya (Chrome/Files/GitHub) → Allow.)
5. **Install** dabao. Play Protect warning aaye to **More details → Install anyway** dabao. (Ye app Play Store se nahi hai, isliye warning aati hai.)
6. App drawer me **Dhun** khol lo. 🎵

**Update:** naya release aaye to naya APK same tareeke se install kar do. Purane ke upar update ho jayega, downloaded songs bane rahenge. (App *uninstall* mat karna, warna phone me download kiye songs bhi delete ho jayenge.)

## Kya kya hai

- **Online:** search, play, queue, EQ, quality, liked songs, playlists. Telegram login/downloads/accounts website wale server se hi chalte hain.
- **Download to phone (offline):** song ke `···` menu me *Download to phone*, Now Playing pe download button, ya playlist/Liked Songs pe *Download All to phone*. Song aur cover app ke andar save hote hain.
- **Library → Downloaded:** yahan ke songs **bina internet** chalte hain. Net band karke app kholo to seedha yahi khulta hai.
- **Lock screen / notification controls:** play, pause, next, previous, seek. Screen off pe bhi chalta rehta hai, aur ek ke baad ek song apne aap.
- Back button se app band nahi hota, music chalta rehta hai.

## How it is built (for developers)

- [Capacitor](https://capacitorjs.com) app. The web UI is in `web/` (same player as the website, plus `native.js` for the Android bits). It is bundled into the APK, never loaded from the website.
- Online API calls go to the live server (`DHUN_API` in `web/native.js`). No bot token or server secret is in this app.
- Plugins: `@capacitor/filesystem` (phone downloads), `@capgo/capacitor-media-session` (lock-screen controls + foreground media service), `@capacitor/app` (back button), `@capacitor/app-launcher` (opens Telegram links in Telegram).
- Build locally: Node 22, JDK 21, Android SDK 36.
  ```
  cd android
  npm ci
  npx cap sync android
  cd android && ./gradlew assembleRelease
  ```
- **GitHub Actions** (`.github/workflows/android.yml`) builds the APK on every push that touches `android/` and on *Run workflow*. It uploads it as an artifact and publishes a GitHub Release `v1.0.<n>` with the APK attached.
- **Signing:** release builds use the repo secrets `DHUN_KEYSTORE_BASE64`, `DHUN_KEYSTORE_PASSWORD`, `DHUN_KEY_ALIAS`, `DHUN_KEY_PASSWORD`. Keep the same keystore forever, otherwise phones can't update over the old app. Without the secrets the APK is signed with a throwaway debug key (it installs, but can't update an APK signed with a different key).
