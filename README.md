# Dhun 🎵

Dhun is a free music player that runs in the browser and installs on a phone's home screen like an app (a PWA). It plays songs from JioSaavn and sends downloads to the user's own Telegram chat instead of filling up phone storage.

## Features

- **Search and play** songs, albums and playlists from JioSaavn (up to 320 kbps). YouTube is used only as a fallback when a song isn't on JioSaavn.
- **Home shelves**: trending, Bollywood, Punjabi, lofi, 90s, devotional and more.
- **Queue and auto-play**: up next, shuffle, repeat, and radio that keeps playing similar songs.
- **Lock-screen controls** (Media Session) and background play.
- **Equalizer** with presets (Bass Boost, Vocal, Treble, Party…). It is off by default because on iPhone it can stop lock-screen playback.
- **Quality settings**: separate quality for Wi-Fi and mobile data, plus a quick Data saver switch.
- **Likes, playlists, recently played**.
- **Telegram downloads**: tap Download and the song arrives in the user's own chat with the bot. Each song is uploaded once to a private storage group and then forwarded from there, so repeat downloads are instant. Downloaded songs also play inside the app.
- **Per-user accounts**: after "Connect Telegram", each user's likes, playlists and history are saved on the server under their own Telegram account and come back on any device. Every request is checked with that user's random session token.
- **Admin bot panel**: the admin types `/admin` in the bot to get buttons for Stats, Users, Top songs, Broadcast (with preview, dry run and confirm), Refresh, Help and 🧪 Test log. Text commands `/stats`, `/users`, `/broadcast`, `/testlog`, `/help` also work. Only the `ADMIN_ID` can use them.
- **Logs channel (optional)**: set `LOG_CHANNEL_ID` and the bot posts a short "👤 New user" line there the first time someone starts the bot or connects Telegram from the app (name, @username, user id, time IST, and how they came in). Only new users are logged. Logging is fire-and-forget (never slows down or breaks the user's action) and capped at 20 lines/min with a "+N more" rollup. `/stats` shows whether the logs channel is reachable.

## Folder layout

```
site/
  index.html             app page
  app.js                 the whole front-end (player, screens, settings, sync)
  app.css                styles
  sw.js                  service worker (lets the app open offline)
  manifest.webmanifest   home-screen app name, colours (#000000) and icons (manifest.json is the same file)
  favicon.ico, favicon-16/32/48/64.png     browser tab icons
  apple-touch-icon.png, icon-120/152.png   iPhone home-screen icons
  icon-192/384/512.png, icon-maskable-192/512.png   Android / PWA icons
  og-image.png           link preview image (WhatsApp, Telegram, X…)
  logo-h.webp, dhun-mark.webp   Dhun logo used inside the app (header, splash, Connect Telegram)
  _worker.js             the server: JioSaavn/YouTube search, Telegram bot + webhook, user accounts, admin panel
  .assetsignore          keeps _worker.js from being served as a public file
schema.sql               database tables (the server also creates them on its own)
wrangler.toml            example Cloudflare Workers config
.env.example             the settings the server needs (placeholders only)
```

## Settings (environment variables)

No secrets are stored in this repo. The server reads them from environment variables:

| Name | What it is |
|---|---|
| `BOT_TOKEN` | Telegram bot token from @BotFather (secret) |
| `WEBHOOK_SECRET` | random string; Telegram sends it back on every webhook call (secret) |
| `ADMIN_ID` | your numeric Telegram user id (admin commands) |
| `STORAGE_CHAT_ID` | id of the private group where songs are stored once (bot must be admin) |
| `BOT_USERNAME` | bot username without `@` |
| `PUBLIC_URL` | public https address of the server, with trailing slash |
| `LOG_CHANNEL_ID` | optional: id of a Telegram channel/group for new-user logs, e.g. `-1001234567890` (bot must be admin with permission to post). Leave empty to turn logging off |
| `SUPPORT_TG` | optional: Telegram handle (without `@`) shown as "💬 Support" in the bot's welcome / connected messages. Default `Memer_guru` |

The server also needs a SQLite-style database bound as `DB` (Cloudflare D1) and the static files bound as `ASSETS`.

## Logo & icons

The Dhun brand kit is used everywhere: browser favicon, iPhone/Android home-screen icons (including maskable icons for Android), black theme and splash colour (`#000000`), a short logo splash when the app opens, the logo in the app header, Settings footer and Connect Telegram sheet, and `og-image.png` for link previews.

When you change icons, bump the cache version in `site/sw.js` (`const C = "dhun-v8"`) and the `?v=` numbers in `index.html`, so phones fetch the new files.

**iPhone note:** iOS saves the home-screen icon when the web app is added. After an icon change, the iPhone home-screen icon updates only after you **remove the web app from the home screen and add it again** (Safari → Share → Add to Home Screen). The app itself updates on its own.

Hinglish: iPhone pe naya icon dekhne ke liye home screen se Dhun hata do, phir Safari me khol ke dobara "Add to Home Screen" karo.

## Deploying (honest notes)

**GitHub Pages alone is not enough.** GitHub Pages only serves static files. It can show the app screens (`site/` without `_worker.js`), but search, playback, Telegram downloads, accounts and the bot all need the server in `_worker.js`.

**What does work for free:** the server is written as a Cloudflare Worker (`export default { fetch(req, env, ctx) }`), so the easiest home for the whole thing is **Cloudflare Workers + D1** on the free plan. There, the app and the server share one address, so nothing else needs to change. Rough steps (not tested from this repo):

1. Install Wrangler: `npm i -g wrangler` then `wrangler login`.
2. Create the database: `wrangler d1 create dhun`, put its id in `wrangler.toml`, then optionally `wrangler d1 execute dhun --remote --file=schema.sql`.
3. Set secrets: `wrangler secret put BOT_TOKEN`, `wrangler secret put WEBHOOK_SECRET`, `wrangler secret put ADMIN_ID`, `wrangler secret put STORAGE_CHAT_ID`. Put `BOT_USERNAME`, `PUBLIC_URL` (and optionally `LOG_CHANNEL_ID`) under `[vars]`.
4. Deploy: `wrangler deploy`.
5. Point the bot at the server (replace the values):
   ```
   curl "https://api.telegram.org/bot<BOT_TOKEN>/setWebhook" \
     -d "url=<PUBLIC_URL>api/tg/hook" \
     -d "secret_token=<WEBHOOK_SECRET>" \
     -d 'allowed_updates=["message","callback_query","my_chat_member"]'
   ```
   Check it with `https://api.telegram.org/bot<BOT_TOKEN>/getWebhookInfo`.
6. Optional: set the bot's Menu commands with `setMyCommands` (`/start` for everyone; `/admin`, `/stats`, `/users`, `/broadcast`, `/testlog`, `/help` with scope `{"type":"chat","chat_id":<ADMIN_ID>}`).

**Things to know:**

- **JioSaavn and region:** JioSaavn shows its full catalogue mainly to Indian addresses. The server already sends an India hint header, but some songs or links may fail when the server runs outside India. If that happens, use a host or region in India.
- **Platform-specific parts:** the code uses `env.DB` (D1 database with `prepare/bind/run/first/all/batch`), `env.ASSETS.fetch` (static files), `ctx.waitUntil` (background work for broadcasts), and `req.cf` / the `cf-connecting-ip` header (rate limits). On Cloudflare these work as-is. On another host (Vercel, Deno Deploy, a VPS with Node), those parts need small adapters: a SQLite database with the same calls, static file serving, and a client-IP header.
- **Front-end on GitHub Pages + server elsewhere:** possible, but `app.js` calls the server at relative paths like `/api/...`. You would need to add the server address in front of those calls and allow CORS on the server.
- **Telegram limits:** bots can only fetch files up to 20 MB, so very long songs at 320 kbps are sent at a lower quality.
- **iPhone:** iPhone doesn't tell websites whether you're on Wi-Fi or mobile data, so use the Data saver switch on mobile data. Keep the equalizer off if you want lock-screen playback.

## हिंदी / Hinglish summary

Dhun ek free music app hai jo browser me chalta hai aur phone ki home screen pe app ki tarah add ho jata hai. JioSaavn se gaane search aur play hote hain (320 kbps tak), queue, EQ, quality settings sab hai. Download dabane pe gaana phone storage me nahi, user ke apne Telegram bot chat me aata hai. Har user ka apna account hai (Telegram se login), aur admin bot me `/admin` likh ke stats, users aur broadcast buttons se chala sakta hai. `LOG_CHANNEL_ID` set karo to har naye user ka log ek Telegram channel me aata hai.

Dhyan rahe: GitHub Pages pe sirf app ki screens chalengi. Gaane, Telegram aur accounts ke liye server (`_worker.js`) chahiye, jo Cloudflare Workers (free plan) pe chal sakta hai. Bot token aur baaki secrets kabhi repo me mat daalna, unhe server ke environment variables / secrets me rakho (`.env.example` dekho).

## 🔄 Android in-app update (`/api/app-version`)

The Android app asks the server whether a newer APK exists:

- `GET /api/app-version` → `{ versionCode, versionName, apkUrl, notes, force, sha256, bytes }` (CORS open, never cached).
- The values come from **`site/app-version.json`** — edit that one file to announce a new version (`versionCode` must be higher than the installed app's).
- `GET /dhun.apk` serves the APK file from **`site/files/dhun-app.apk`** with the Android install content type. The APK binary is **not committed** (it is in `.gitignore`); download it from this repo's **Releases** and put it at `site/files/dhun-app.apk` before deploying. If `apkUrl` is empty, the server uses `PUBLIC_URL` + `dhun.apk`.

Naya version ship karna: Releases se APK lo → `site/files/dhun-app.apk` me rakho → `site/app-version.json` me `versionCode`/`versionName`/`sha256`/`bytes` badlo → deploy. Purane app me "update available" aa jayega.

The bot's welcome (`/start`) and "connected" messages include the web link and the Android link (`PUBLIC_URL` + `dhun.apk`) with two buttons: 🌐 Open Dhun / 📱 Android App.

## 📱 Android app (offline)

The `android/` folder is an Android app version of Dhun. Its UI is bundled inside the app, so it opens with no internet, and songs saved with **Download to phone** play in airplane mode, with lock-screen controls. GitHub Actions builds the APK automatically (`.github/workflows/android.yml`) and attaches it to a **Release**.

**APK kaise install karein:** repo me *Releases* → latest → `Dhun-v1.0.x.apk` download karo → file pe tap → "Install unknown apps" allow karo → Install. Poori steps: [`android/README.md`](android/README.md).

---
Live demo: https://dhun.sites.tab.bot/
