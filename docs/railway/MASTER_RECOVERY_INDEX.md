# Railway CEO — canonical master recovery index

Last reconciled: 2026-11-28. Verified basis: 8b76d70cbfa57d6f910d827dcb4b2041dcd154e9. Always fetch the actual live branch HEAD before resuming; this file's basis is historical, not a replacement for newer commits.

Repository S2zxx0zxx/Railway-Ceo-, PR #2, branch feat/railway-manager-v5, draft and unmerged. Protected main 8268c8dcd6ef46fc35e300c14d8491bfbb3656e1; protected PR #1 branch feat/company-simulator-v3 fefd995fd189506502ae59230b9ee9c408faa544.

## Source of truth
- OWNER_EXECUTION_PROTOCOL.md: execution boundaries and sequential owner authorization.
- STATE.md: cumulative historical checkpoints; newer dated entries supersede stale historical statuses.
- EXECUTION_LEDGER.csv: 54 original tasks (14 PASS, 22 implemented-unverified, 9 blocked, 9 not started).
- REMAINING_IMPLEMENTATION_LEDGER.csv: 43 tasks (1 blocked, 42 not started for production acceptance).
- DEFERRED_VERIFICATION.csv: 44 open and 44 closed entries.
- C01_C04_RECOVERY_CHECKPOINT.json: original archive hashes, 49 exact source identities and source preservation reconciliation.
- C04_FIX_01_INDEPENDENT_REVIEW.json: bounded fix verification, limitations, test evidence.
- C01_CIVILIAN_MAP_SCOPE.json, R03_SOURCE_LOCK.json, R04_DATA_ACQUISITION_POLICY.json, R51_DISTRIBUTION_REQUIREMENTS.json: controlling scope, resource pins and rights gates.

## Recoverable source
- verification/railway/c04-baseline/ (49/49 source identities previously verified).
- verification/railway/c04-fix-01/ (49/49 identities previously verified, six changed sources, 43 unchanged). Use the corrected snapshot for C05; retain original.
- Root runtime adoption is NOT_STARTED. Source preservation does not equal production integration.

## Private recovery bundle
Owner has a private backup named RAILWAY_CEO_MASTER_RECOVERY_2026-11-28.zip; 65,665,824 bytes; SHA256 3a81934f8ec798af7128d968d58ca059e43d7c99421dd3e43f619e8543795154; outer 16/16 manifest matches and CRC clean. It includes seven original ZIPs with hashes below, historical independent verification outputs, RECOVERY_INDEX.json and README.md. All seven nested archives rehashed and CRC checked during this recovery action, not fresh test execution. Backup successfully saved to owner's ChatGPT Library; private IDs and archive bytes intentionally not committed to this public repository.

| Original archive | SHA256 |
|---|---|
| Train_Manager_Final_V4_Agent_Implementation_Pack.zip | ebd171202005b8a680540c7f9add297298feb69ea11acc1b36f5c86c46b9f4ea |
| Railway_Manager_Master_Build_Pack_V5.zip | ba177fb4ecbc7247696459e4794fec878adf2c0f0b6ebc07903339653376e41d |
| RAILWAY_CEO_C02_FINAL_INTAKE_VERIFICATION.zip | a203a32f87f3d5bd8cd75deb95ff88104947d9be4330bf9cbad8f44fb80ff858 |
| RAILWAY_CEO_C03_GRAPH_VERIFICATION.zip | 6038d87485ca1de5da980f9f66afde83a510de8923bf655fa2649197bf3f9381 |
| RAILWAY_CEO_C04_OFFLINE_MAP_VERIFICATION.zip | 71994a80663ba30606f29ae3d9ab8dcc488424ea643e7a0800160c5d8bd9c20a |
| RAILWAY_CEO_C01_C04_SOURCE_RECOVERY.zip | d5d08d5c023db2b49759209a363d9c980c162711196029b492078fb738c6a529 |
| RAILWAY_CEO_C04_FIX_01_OFFLINE_URL_VERIFICATION.zip | eca7bdbbd9fc398fb61d91a2924ba476a5cef0e967b080fc87faa7c3e9caf8b1 |

## Current gates
C01 BLOCKED: owner-reported DST email sent; determination, accurate certification if applicable, actual territory/screening pending. C02/C03 synthetic preparation verified, real data not started. C04 synthetic artifacts and bounded FIX-01 accepted; independent review 379 executed cases, full browser rerun Gemini-reported. C05 synthetic-only preparation eligible on separate owner START. C06–C08 actual production not started. Real PBF processing and release prohibited by current project gates. R54 and broad FIX IT HOLD. Preserve unresolved C02 metadata/C03 real turn and station validation, SoI asset/rights, root dependency license and CI integration, Windows routing p95 660.35 ms versus 300 ms, software renderer 23.3/22.9 FPS versus 30; physical Android verification pending.

## Cross-chat resume
Fetch live PR #2 and protected refs; read this index and the canonical records; locate the exact original archives in the owner's private backup and verify actual bytes before using them. Reconcile newer commits, reopen immutable requirements and relevant task rows, preserve existing sources and blockers. Do not repeat accepted work or claim unavailable tests passed. At each authorized task checkpoint preserve reviewed sources, test evidence, archive hashes, exact remote SHA and updated ledgers; refresh this index when needed. Do not rely exclusively on chat memory; never claim a separate persistent memory write based on repository or Library updates.

Next eligible command: START C05 — production-grade offline region installation, atomic activation, rollback and region portals (synthetic preparation only). This recovery update is not authorization to start C05.
