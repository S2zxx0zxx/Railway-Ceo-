# G10 platform build contract

One React/TypeScript engine, one local Dexie schema and one portable checksummed JSON format. Browser and native storage are separate. No servers required for core gameplay.

## Web
npm install --no-audit --no-fund
npm run build
npm run audit:bundle

Serve dist over HTTPS (localhost for QA). The service worker hashes all generated content, precaches exact files, keeps navigation within the versioned shell and never caches IndexedDB records. Old caches are retained for compatibility pending safe pruning. Update action first commits/resumes the active save; refuses multiple scoped windows. If all windows close, browser lifecycle may activate a waiting worker naturally. No migration parity claim yet.

## Android
Existing provisional app ID: app.theceo.companysimulator; owner must approve before release. Version name follows package.json (0.1.0), QA versionCode defaults to 1, set CEO_VERSION_CODE for subsequent builds. No upload key is created or committed. Capacitor 8.0.0 baseline selected because official v8 target is API 36; Java 21, Node 22, Android SDK 36. Compatibility and dependencies must be verified. Docs: https://capacitorjs.com/docs/android and https://capacitorjs.com/docs/android/setting-target-sdk .

npm install --no-audit --no-fund
npm run android:apk
npm run android:aab

prepare-android generates native project from pinned installed template when absent, syncs bundled dist, asserts SDK target, sets sensorLandscape, disables Android OS backup and cleartext traffic, applies generated icons, removes packaged sw.js and rejects remote server URL. Generated native project is a build output until reviewed and committed. Existing template INTERNET permission is retained; no storage/location/contacts permission requested by app code. Merged manifest audit remains required. Native lifecycle suspends foreground timer on inactive state and catches up on return. Exit at root only after confirmation; committed data remains saved; no background runner. Export through cache/share sheet, import via WebView file input. Test real device including edge-to-edge insets, Android large-screen orientation handling, system file picker, offline launch, process kill, PWA↔Android save transfer.

GitHub QA workflow attempts debug APK, validates signature/target, uploads SHA-256 evidence, then builds unsigned release AAB. Debug signing is not Play release signing; unsigned AAB cannot be published. Release upload key, signed release bundle, device test and current policy declarations remain G11/G12 blockers. No deployment or store submission authorized.

Bundle audit enforces conservative aggregate compressed JS 500 KiB, 30 MiB offline content, 700 KiB per office asset; no device performance claim. Lockfile is not committed yet; generated lock artifact and dependency review pending. All runtime checks remain deferred unless actual workflow evidence proves them.
