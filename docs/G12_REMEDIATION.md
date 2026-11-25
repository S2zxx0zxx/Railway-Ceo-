# G12 final remediation ledger
Baseline: 3e474e149497694ed51a0bc3814ddd31c0362ce3, PR #1, 25 November 2026. No gate accepted.

| Baseline evidence | Exact run | Result |
|---|---|---|
| Unit/typecheck/web | 45612688339 | 118/118, 30 files |
| Browser | 45612688345 | PASS, all 15 routes and six layout sizes, partial actions |
| Offline worker / stale tab / recovery | 45612688142 | PASS |
| Native QA APK and unsigned AAB | 45612688343 | PASS package checks, target 36, 794564 bytes web bundle, 181012 bytes gzip JS, missing cache 0 |
| Release audit | 45612689178 | FAIL: runtime 1 critical; full 4 critical, 1 high, 1 moderate |

Security priority: GHSA-rvm3-566m-v7fv affects installed Capacitor Android 8.0.0; upgrade core/android/CLI to audit-suggested 8.6.2. CLI transitive tar <=7.5.20; Vitest 3.2.7 depends on affected tinypool and mocker; upgrade Vitest to audit-suggested 5.1.2; Vite 6.4.6 already compatible (Vitest 5 requires Node >=22.12 and Vite >=6.4). No force audit fix; resolve and test before scoped lock commit. Local npm DNS unavailable (EAI_AGAIN), so use read-only CI resolution/test/audit job and separate scoped non-force lock promotion. Remove temporary promotion workflow after success. Normal CI will reject old lock until promotion. Do not release prior vulnerable APK.

External blockers: signed AAB, actual upload key, project license, final brand and UI approval, publisher contact/privacy URL, real physical device(s), actual Play Console declarations and closed testing if applicable. Official target API 36 and personal-account 12 testers/14 continuous days confirmed 2026-11-25. No publish.

Baseline artifacts (not release candidates): web 15020103484; QA APK 15021490791; unsigned AAB 15021460853; browser 15020797233; release audit 15020188326; platform evidence 15021920413. See original runs for hashes and evidence. Security status blocks distribution.
