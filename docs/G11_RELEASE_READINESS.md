# G11 release readiness — reviewed 2026-11-25

## Evidence from exact G10 revision 74ed771671df22da976c1506ddd4f6d8cb9ff0de
- Verify game run 45611130447: 30 files, 118 tests passed; web-dist artifact 15019409699.
- G08 run 45611130375: stale-tab, cached worker offline, exactly-once elapsed, corruption/recovery acceptance passed.
- Android run 45611130371: debug APK and unsigned AAB built; target 36, min SDK 24, app ID app.theceo.companysimulator, version 0.1.0 / 1. Downloaded files match recorded SHA256: APK e3f47acfee46c255a0d6ca0c7642a68afd206421b8f2838c4c3259ad22b6fc8d; unsigned AAB 049013554a3ae569f0c2feb3f854c261db9ffcaa5247ad5284610b7700a38fca. APK v2 debug signature verified by CI. No .so entries in either archive. APK badging shows INTERNET and app-scoped DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION only. Not a physical-device or release manifest acceptance.
- Web bundle 767233 bytes; all JS gzip 180723 bytes; no missing precache. Browser smoke run 45611130407 failed on takeover click intercepted by dock at 800x360; CSS stacking fix authored, retest pending.
- Downloaded lockfile from artifact 15020915441 SHA256 4d0595b6234844517ca79bdbe03aef5c3c3e85c06dd773eb70c4a994c092cf84. 257 entries excluding root, 12 runtime entries. Scoped one-time workflow copies exact bytes only, verifies hash and dependency declaration, non-force pushes only PR branch. Lockfile promotion must be observed before claiming committed. No secret or package execution in write job.

## Official policy review
- https://developer.android.com/google/play/requirements/target-sdk : API 36 minimum for new mobile apps/updates now.
- https://developer.android.com/guide/practices/page-sizes : 16 KB compatibility. No native .so observed in QA artifacts; still verify final bundle and device.
- https://developer.android.com/studio/publish/app-signing : Play App Signing and owner upload key. Local signing script verifies expected certificate; not executed.
- https://support.google.com/googleplay/android-developer/answer/10787469 and /answer/10144311 : Data safety and public privacy policy even if no collection; confirm actual final SDK/network behavior. Local data and user-directed sharing described in draft. Do not submit until contact and policy hosting confirmed.
- https://support.google.com/googleplay/android-developer/answer/14151465 : new personal accounts require at least 12 opted-in closed testers continuously for 14 days, then production access application; account-specific status unverified.
- https://support.google.com/googleplay/android-developer/answer/13849271 : financial features declaration required; draft no real financial services (fictional in-game bookkeeping only).
- https://support.google.com/googleplay/android-developer/answer/9859655 and /answer/9867159 : IARC questionnaire and target audience, no guessed rating.
- https://support.google.com/googleplay/android-developer/answer/9859152 : listing title <=30 chars, short <=80, full <=4000; support email required.

## Draft declarations, not filed
Game / Simulation; no account or restricted access; no ad SDK, IAP or real-money transfers in source scope. Proposed Data safety: no developer collection/sharing, conditional on final package/network audit and complete disclosure; user-directed exports are explicitly described. IARC questionnaire: fictional commercial distress, no gambling, no real finance, no multiplayer/chat; review final content and answer Console questions accurately. Target audience and country availability require owner decision. No actual age rating assigned. Prepare real screenshots, store icon and feature graphic; no fabricated gameplay marketing. Developer identity, privacy contact and public policy URL, project license and app ID approval remain unresolved. Public repo does not grant redistribution rights by itself.

## Signing
Build unsigned AAB with npm run android:aab. On trusted local owner machine set CEO_UPLOAD_KEYSTORE (outside repo), CEO_UPLOAD_ALIAS, CEO_UPLOAD_STOREPASS, CEO_UPLOAD_KEYPASS, CEO_UPLOAD_CERT_SHA256 via secure local environment. Run npm run android:sign. No secret values in source, logs or chat. Verify versionCode before upload. Do not use QA debug key for Play. Final signed bundle, device smoke, final native permissions, dependency advisory resolution, full license notices, 16 KB verification, Play Console declarations and release approval remain pending. No publish or merge.


## Lock promotion and final audit increment
Run 45612480252 completed successfully and committed the exact verified lockfile at c97d1d7fc8dd7b6bf94e8edbd605805855087a4a. The one-time write-enabled workflow is removed in the next commit. Core CI now uses npm ci. Initial release audit run 45612480411 failed as designed before the lock was committed; new revision rerun required. G11 source build run 45612480353 succeeded (unlocked checkout, not final evidence). Added source heuristic secret/endpoint and asset hash scan, license link, provenance register, native APK permission allowlist, package asset byte parity, APK alignment and native library check. New scripts not yet verified. No production compliance approval.
