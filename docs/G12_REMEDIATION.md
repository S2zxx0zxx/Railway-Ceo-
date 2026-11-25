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

Security resolution: read-only job 139204928863 in run 45614103984 passed typecheck, 118 tests and `npm audit` found 0 vulnerabilities. Promoted lock at 4367345acfb5622afdd0aa03aeabbabc1a8a505b. Subsequent bot-triggered runs reported action_required; remove one-time workflow and require fresh full CI. G12 buyer contracts: actual reserved lots and market commitments, six-hour/same-day dispatch expiry, locked price and credit, direct sale exclusion, cancellation/recall/expiry, actual normal accounting and delivery linkage. Three tests authored. Not verified yet. No full gate accepted.

- G12 continuation baseline c952660: release audit 45614466081 passed, runtime/full npm audit both zero. Verify 45614465957 and Android 45614466012 failed TS2451/TS2339 (duplicate block-scoped c in recall handler). Browser and worker runs also failed. Renamed contract variable without changing accounting; fresh CI required. No new artifact verified.

- G12 production costing: prospective direct operator labor allocated using fixed batch-start daily operator wage rate and actual active minutes, cumulative integer rounding. Recognize at stage, pause/cancel and midnight boundaries; daily residual wages exclude amounts already capitalized. Old jobs/batches remain unallocated; no retroactive journal changes. If staff changes mid-day, allocated earned labor is retained even if it exceeds current end-of-day wage projection. Energy remains upfront; depreciation/other overhead not yet allocated. Three regression tests authored; prior cost assertion adapted. Verification pending.

- G12 individual acceptance register created: 25 D + 34 E + 15 M + 60 RV = 134 records, one per ID, linked to source/test evidence and outstanding requirement. E34 deferred per spec, all other rows partial (not certification). 58217bc verify run 45616719358 passed 121/121 incl buyer contracts. Labor implementation and all latest platform checks pending.

- G12 recovery probe: exact payroll settlement added (supports fractional paise); command-only 60-day viability test for Beginner, Realistic and Hardcore. No injected funds, reputation or modified clock; price search queries actual demand, all staff/repair/procurement/sales/payroll/creditor decisions use apply. Existing market defaults unchanged until observed results. Probe is a real acceptance test and may fail; any failure remains a balancing blocker. Prior 09c8f14 run 45616903805 passed 124 tests/32 files including three labor tests; browser 45616903961, worker 45616903798 and audit 45616903827 passed. Android still pending at observation.

- G12 R&D: existing efficiency preserved; added prerequisite-gated process-quality and shelf-life levels, one active research job, paid timed projects, pause/resume/cancel without refund, save migration and actual effects on new batch completion/lot expiry. Three regression tests authored. No recipe changes or second SKU; packaging/automation research still incomplete. No gate passed.
