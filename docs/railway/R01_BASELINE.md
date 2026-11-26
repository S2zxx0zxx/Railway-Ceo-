# R01 — Baseline repo and approved scope
Acceptance from V4: Actual commit, status, architecture and test logs recorded; no unrelated changes.
Observed on 2026-11-26 IST; source HEAD fefd995fd189506502ae59230b9ee9c408faa544 unchanged from V5 plan. PR #1 63 commits, 121 changed files, draft/open/unmerged; main 8268c8dcd6ef46fc35e300c14d8491bfbb3656e1. Git commit tree f0a6d2d577284f13dc2be45b0b8c3d306ea07a48. Selected isolated branch feat/railway-manager-v5 from source HEAD, not main (main lacks tested foundation); no merge or legacy modifications. Final repository/brand before publishing still pending.
## Actual source inspection
- package.json: React 19, TypeScript, Vite 6.4.6, Dexie 4, Capacitor 8.6.2, Vitest 5.1.2; Node >=22.12.0. npm ci lockfile, typecheck, tests, build.
- src/engine/ledger.ts: integer paise BigInt, balanced postings, duplicate entry IDs rejected. Reuse candidate subject to R05: railway accounts, period cutoffs, scale.
- src/engine/elapsed.ts: bounded wall clock with MIT notice; minute policy adapted to railway seconds; preserve attribution.
- src/worker/protocol.ts: typed catchUp request/reply, coupled to manufacturing Game; adapt rather than import duplicate engine.
- src/persistence/save.ts: Dexie the-ceo-simulator namespace, revision CAS, CRC, receipts and three rotating backups; isolate railway namespace, retain legacy.
- src/engine/game.ts and scenario.ts: legacy biscuit domain not railway truth. UI App.tsx/office artwork not railway UI. Existing platform and workflows reusable after review.
- Core architecture: React portrait UI -> typed application commands -> deterministic railway graph/economy/scheduler -> transactional storage -> platform adapters. Real map data factory separate from runtime. No second authoritative state.
## Source evidence
Original archive hash and CRC, V5 pack CRC and 23 screenshot hashes/dimensions verified independently in available container. All raw evidence remains private; original 54 task IDs, 35 GP rules, 28 E contracts, 23 UI references and 21 candidates retained in private V5 pack. No copied proprietary code/assets.
## Historical CI (not a fresh railway test)
Repository actions runs: 45617958426 Verify game (job 139218180298), 45617958448 release audit (139218180531), 45617958362 browser (139218180674), 45617958340 save/worker (139218180502), 45617958393 Android QA (139218180106), all completed success. Verify checkout log shows merge 062f01d of source HEAD into main. 35/35 files, 134/134 tests, npm ci, npm run typecheck, npm test, npm run build successful. Android debug APK/unsigned AAB build only, no physical test. Historical source CI is not railway verification.
## Fresh baseline status
Local Node v22.16.0, npm 10.9.2; git ls-remote failed DNS for github.com exit 128. No local checkout/test rerun. A documentation-only commit on isolated branch and draft PR against legacy feature branch allows fresh CI without modifying PR #1. Required: observe actual test logs; compare exact source tree except docs/railway; record status and verify protected refs. Until then R01 IMPLEMENTED_UNVERIFIED. No unrelated changes intended; verify comparison.
