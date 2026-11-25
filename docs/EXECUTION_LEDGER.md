# Execution ledger

Baseline V3.0. Status is evidence-based; no task is verified by documentation alone.

| ID | Phase | Status | Acceptance scope |
|---|---|---|---|
| RV-001 | P00 | PARTIAL | Import approved GDD + V3 plan and decision log; compare 25/34/15 coverage; owner repository and license pending |
| RV-002 | P00 | PARTIAL | Pin upstream commits, enumerate actual source files and licenses, dependency scan; no unverified copying |
| RV-003 | P00 | NOT STARTED | Run candidate smoke tests separately, document usable/failed mechanisms and golden test vectors; choose one clock/ledger |
| RV-004 | P00 | PARTIAL | Freeze original visual tokens, screenshot layout, asset whitelist and performance budgets; review prototype wireframe |
| RV-005 | P01 | PARTIAL | Initialize React/TS/Vite repo, lockfile, strict lint/typecheck/test, CI and protected branch rules |
| RV-006 | P01 | PARTIAL | Domain types, validated data catalogs, units/rounding, command/event/revision contract; invalid data rejected |
| RV-007 | P01 | PARTIAL | Deterministic clock, scheduler and seeded RNG; replay tests and priority order |
| RV-008 | P01 | PARTIAL | Dexie schema, atomic transaction and single writer; crash/stale revision/duplicate command tests |
| RV-009 | P01 | PARTIAL | Save codec, backups, migration, export/import; invalid/legacy/corrupt cases |
| RV-010 | P01 | NOT STARTED | Worker bridge and platform interfaces; no DOM in engine, deterministic worker/main parity |
| RV-011 | P02 | PARTIAL | Opening scenario and balanced seed accounts; validate assets/debt/payroll and cash source |
| RV-012 | P02 | PARTIAL | New game/identity/difficulty/onboarding; takeover once, saved correctly |
| RV-013 | P02 | PARTIAL | Audit missions, repair priorities, company profile and governance; gates work |
| RV-014 | P03 | PARTIAL | Responsive landscape shell, HUD, 12 dock actions, settings/back and focus navigation |
| RV-015 | P03 | PARTIAL | Original office first render + performance panel; references reviewed, no fake metrics |
| RV-016 | P03 | PARTIAL | Panel primitives and routes M01–M15; locked/empty states, no public dead buttons |
| RV-017 | P04 | PARTIAL | Accounting domain and Pluts compatibility adapter; balanced entries and integer precision |
| RV-018 | P04 | PARTIAL | Opening, purchase, production, sale, payment, financing, wages, depreciation posting rules; golden vectors |
| RV-019 | P04 | PARTIAL | P&L, balance sheet, cash flow, journal, aging, valuation; reconciliation tests |
| RV-020 | P05 | PARTIAL | Supplier offers, PO, lead time and receipt lifecycle; credit and dedupe |
| RV-021 | P05 | PARTIAL | Lot inventory, FEFO, reserved stock and weighted average; unit/cost conservation |
| RV-022 | P05 | PARTIAL | Reorder/safety stock/EOQ, expiry, capacity and disposal; Stockpyl comparison |
| RV-023 | P05 | PARTIAL | Procurement/warehouse UI and end-to-end receipt with ledger |
| RV-024 | P06 | PARTIAL | BOM, yield and staged batch scheduler; reservations and WIP cost |
| RV-025 | P06 | PARTIAL | Machine capacity/condition/OEE, wear and failure; deterministic fixtures |
| RV-026 | P06 | PARTIAL | Maintenance, repairs, utility and replacement; time/capital postings |
| RV-027 | P06 | PARTIAL | Incoming and finished QC, hold/release/reject/recall, traceability |
| RV-028 | P06 | PARTIAL | Production, machinery, quality UI; blocked batch cannot sell |
| RV-029 | P07 | PARTIAL | Employees, skills, morale, hiring/firing/training, shifts and attendance |
| RV-030 | P07 | PARTIAL | Payroll accrual, arrears, payment, overtime and safety interactions |
| RV-031 | P07 | PARTIAL | HR panels and manager policy schema; role/budget restrictions |
| RV-032 | P08 | PARTIAL | Market demand, pricing, competition, allocation; bounded seeded agents |
| RV-033 | P08 | PARTIAL | Buyer offers, contract and order reservations, delivery and logistics costs |
| RV-034 | P08 | PARTIAL | Invoice, cash collection, returns/refunds, complaint/recall; no duplicate postings |
| RV-035 | P08 | PARTIAL | Campaigns, reputation and region unlocks; uncertain demand, no guaranteed ROI |
| RV-036 | P08 | PARTIAL | Market/sales/marketing UI, charts and end-to-end sale cycle |
| RV-037 | P09 | PARTIAL | Loan eligibility, amortization, credit/overdraft, interest accrual |
| RV-038 | P09 | PARTIAL | Debt restructuring, owner capital/asset sale and Banking UI; principal != revenue |
| RV-039 | P10 | PARTIAL | Causal/seeded events, news inbox, deadlines, decision effects and dedupe |
| RV-040 | P10 | PARTIAL | Distress/recovery/liquidation states, difficulty and restart rules |
| RV-041 | P10 | PARTIAL | Compliance, safety, environment, risk/audit controls and event consequences |
| RV-042 | P11 | PARTIAL | Research prerequisites and timed improvements, automation unlocks |
| RV-043 | P11 | PARTIAL | Manager execution using normal commands, policy limits, explainable log |
| RV-044 | P11 | PARTIAL | Offline catch-up, cap, anomalies, pause and resume, duplicate protection |
| RV-045 | P11 | PARTIAL | Return report, five progression stages, achievements and daily loop |
| RV-046 | P12 | PARTIAL | Five original office artworks, machine/product/staff icons and selected SFX; provenance manifest |
| RV-047 | P12 | PARTIAL | All 15 panels polished with actual state/actions, responsive/a11y/reduced motion, visual regression |
| RV-048 | P12 | NOT STARTED | Modular ECharts and financial reports; charts match underlying data |
| RV-049 | P13 | PARTIAL | Full economic golden scenario, invariant/property tests, seeded multi-year simulations |
| RV-050 | P13 | NOT STARTED | Balance three difficulty modes and recovery paths; no deadlock, impossible tutorial or endless inflation |
| RV-051 | P13 | PARTIAL | Save/crash/update/import/multi-tab and time anomaly tests, repair any regressions |
| RV-052 | P13 | NOT STARTED | Check dependency licenses, vulnerability scan, asset hashes and no runtime external requests |
| RV-053 | P14 | PARTIAL | PWA manifest, icons, service worker and safe updates; install and airplane-mode tests |
| RV-054 | P14 | PARTIAL | Android Capacitor wrapper, bundled assets, lifecycle/back/safe-area and offline fresh install |
| RV-055 | P14 | NOT STARTED | Device performance, screen matrix, WebView compatibility and storage tests |
| RV-056 | P14 | NOT STARTED | PWA ↔ Android save export/import parity; shared engine/content version and golden replay |
| RV-057 | P15 | NOT STARTED | QA APK and release AAB, signing/target API checks, hashes and device evidence |
| RV-058 | P15 | NOT STARTED | Store listing/privacy/data safety/content rating/ads declarations and required testing plan; owner account access |
| RV-059 | P15 | NOT STARTED | Final 25/34/15 traceability review; E34 explicit deferred optional monetization unless approved; all P0/P1 defects resolved |
| RV-060 | P15 | NOT STARTED | Release decision, documented limitations, rollback/save compatibility and owner approval; no unauthorized merge/publication |

## Blockers
- Upstream license, pinned source and dependency verification pending.
- Local runtime cannot resolve GitHub/npm hosts; connector writes available; build evidence pending.
- Original final artwork, Android toolchain/device/signing and release validation pending.

## Evidence checkpoint
- Commit 80235ae78b35d2af7fb2319a3a760e750fac3364: GitHub Actions run 45595860042 completed successfully, 6 engine tests passed, TypeScript and Vite build passed; web-dist uploaded. This validates only that commit and its initial tests, not complete scope.
- Subsequent changes add bounded manager policies, crisis checks, competitor price, training, severance, emergency capital and elapsed-time fix; new tests pending CI.
- All 12 release gates remain OPEN. Do not merge.

- Follow-up: original financial reconciliation reports, replenishment forecast, bounded save codec, transactional previous-save backup, explicit import/recovery controls and regression tests authored. CI and browser persistence validation pending; EOQ/Stockpyl adoption and ECharts pending. No gate promoted.

- RV-022: Added independent classical EOQ implementation, bounded advisory value in procurement, and three regression tests including the documented Stockpyl Example 3.1 vector. Assumptions are disclosed; not an auto-order policy. CI, shelf-life/capacity-aware optimization and upstream execution remain pending.

- Operational follow-up: permit renewal, sanitation restrictions, rejected/disposed output, daily market commitment limit, corresponding controls and invariant tests. CI pending. Still missing full supplier/credit models, recalls, detailed safety/environment and balancing. All release gates open.

- Supplier follow-up: three priced/reliable quality tiers, deterministic delayed receipts, committed warehouse capacity limits, lot quality/source, production quality scoring and failed-quality release guard. Credit suppliers and complete traceability/recall remain open. Tests authored, CI pending.

- Owner requires strict G01 → G12 sequence. See docs/GATE_EXECUTION.md for the active gate and initial D01–D25 gap register. G01 is not passed; G02–G12 locked. Preserve all prior implementation; no merge until final verification.

- G01 increment: added company/brand identity decision, backward-compatible brand save migration, executive metrics and internal risk indicators, and four regression tests. Full governance and corporate coverage remain open. CI not yet verified for this change.

- G01 D03/D05/D06: supplier credit terms and committed limit, cancellable prepaid/credit purchase orders, payable recognition at receipt, due dates, settlement, overdue credit restriction, save validation, UI and six regression tests added. CI pending. Full purchase-document lifecycle and incoming QC remain partial.

- G01 D16/D19: delivered sale records, manual complaint entry, delay resolution, paid refunds/unpaid credit notes, collection linkage, receivable reconciliation, migration and Sales panel controls. Four tests authored. CI pending. Partial refunds, automatic complaint generation, batch recall and physical return logistics remain open; existing historical sales without records are not fabricated.

- G01 D14/D15/D22: persisted staff shifts, overtime pay, fatigue/attendance, training prerequisite, skill/morale/fatigue-dependent labor availability, promotions with recurring salary, actual UI actions and four regression tests. CI pending; incident handling, paid leave, full payroll allocations and role hierarchy remain partial. Scenario defaults (8/10/12h, 1.5x overtime) are fictional balancing values, not labor-law advice.

- G01 D08/D10/D11: engineering levels 1–3, timed capital improvements, bottleneck-dependent throughput, preventive service timestamps and overdue wear, active batch cancellation with consumed WIP writeoff and no raw stock restoration, save migration/validation, UI and three tests. CI pending. Replacement/disposal accounting, spares, planned reservations, pause/resume and full OEE remain open. Costs/intervals are scenario defaults.

- G01 test maintenance: run 45597960836 failed on obsolete 'Place prepaid order' locator after the procurement UI change (build succeeded). Updated browser smoke to use current order labels, exercise credit order cancellation/prepaid ordering, and reach remaining management routes. New CI pending; no claim of full UI action coverage.

- Owner authorizes G02 implementation before G01 verification; G01 incomplete scope and test blockers retained. No gate pass or merge. G02 elapsed-time adaptation with original MIT notice, regression tests, actual installed-resource inventory command, ERPNext/Pluts source/license decisions and incompatibility findings committed. Verification deferred; no claim of complete resource adoption.

- G02: added distributable MIT notice files and documented SimCorp demand/distress compatibility decision; package output verification pending.

- G03 authorized; G01/G02 incomplete scope retained. Added five original static stage office SVGs, real executive dashboard, compact HUD, circular game dock, panel hierarchy and status feedback, confirmation for destructive actions, responsive skin, cache coverage and asset provenance. No engine/save modifications. Final photoreal render, owner visual sign-off and test evidence pending.

- G03 follow-up: reduced-motion preference with OS preference preserved, settings notices link, small landscape default collapsed performance card, and expanded Chromium acceptance script covering executive dashboard, all management routes, destructive-action confirmation, all five offline assets and six viewport screenshots. Script authored, not executed in this turn; owner visual sign-off pending.

- G04 authorized; G01–G03 incomplete. Added separate accounting accounts, prospective depreciation, fictional period tax, tax settlement, interest accrual/payment split, net revenue and expanded reports/aging. Authored six tests; execution deferred. Legacy entries preserved, no backdated migration. Remaining schedule, costing and idempotency work open.

- G04 banking: persisted individual principal balances, equal-principal 30-day installment schedules with exact paise remainder, due/maturity UI, oldest-first principal allocation, overdue lending restriction and one-time 360-day restructuring without debt forgiveness. Legacy aggregate debt migrates to a single facility; prior interest embedded in principal is not reconstructed. Four tests authored; execution deferred. Collateral/overdraft, risk-based rates, separate contractual interest deadlines and asset sales remain open.

- G04 inventory costing: FEFO physical selection retained; issue value uses pooled weighted-average carrying amount, residual allocated deterministically to remaining lots, receipts revalue item pool without changing quality or source. Added exact-paise tax settlement and same-minute oldest-first loan ordering fix. Three tests authored, execution deferred. Lot cost denotes carrying value rather than original invoice cost; complete receipt history, reservation and cost allocation tests pending.

- G04 transaction boundary: bounded persistent request receipts (512) alongside active save in same Dexie transaction, duplicate payload replay returns current state, conflicting request IDs rejected; stale revisions still rejected. Import/recovery starts new receipt history. Added exact debt settlement and JSON financial report export with integer-paise values and underlying journal. Three tests authored; IndexedDB integration/concurrency and retry-after-crash tests still pending. No gate passed.

- G05: lot-level FEFO reservations, scheduled start/cancel, atomic planned material consumption, pause/resume and automatic operating-condition interruption at stage boundaries, reservation-aware stock/reorder UI, save migration/validation and three tests authored. Tests deferred. Scheduled start cancels on resource failure rather than silently rescheduling. G01–G04 incomplete; G06–G12 await instruction.

- G05 traceability: persisted consumed lot portions, batch input/output/cost records, delivery genealogy and expiry protection for new shipments, incoming/finished holds, whole-batch recall (quarantine, cancel/write off affected shipments, link delivered complaints to refund workflow), environmental counters and Quality UI. Three tests authored; deferred execution. Legacy genealogy is not fabricated; whole affected shipment/order is treated conservatively, not partial compensation. Recipe mass loss is a fictional 115g input / 100g packet model. Energy figure is spend, not measured kWh.

- G05 operations: persisted purchase lifecycle history and receipt links, fictional supplier order/in-transit limits, completed service/upgrade history, separate power/water isolation and guarded restoration with immediate active-batch pause. Procurement and Machinery UI updated; three tests authored. Legacy records not invented. Supplier inspection rejection credit/return workflow, replacement/spares, utility consumption units and measured OEE remain open. Tests deferred.

- G05 final increment: actual materials/energy breakdown and active-vs-elapsed batch minutes, quality yield, permit expiry as scheduler boundary, pause on unsafe conditions after daily events or commands, two tests authored. Labor/overhead capitalization, continuous stage-specific rates, full OEE, water/energy physical consumption, spare parts/replacement and supplier return credits remain open. Verification deferred. No gate passed or merge.

- G06 authorized. Added single seeded market model, stable logit integer allocations, bounded competitor cash/stock/production and daily pricing strategies, commitments cap, fictional seasonal/difficulty demand and sequential paid expansion effective next day, Market UI and four tests authored. Competitor accounts are independent simplified external-agent state, not company ledger. No upstream code copied. Tests deferred; regional per-order allocation, shocks/campaign budget and calibrated economy remain open.

- G06 economics: bounded daily commodity indices and seed-driven three-day shocks (inflation, shortage, slowdown, festival); actual procurement quote, locked PO cost, delay, EOQ and manager purchase cost updated. Campaign budget/duration, seeded preference, stop/no refund and history implemented. Four tests authored, not run. Current game uses fictional indices, shock rates and campaign values; no real market data or guaranteed ROI. Further regional order routing and long-run calibration pending.

- G06 regional order routing: per-region daily commitment caps with aggregate cap, selected destination, actual regional freight expense and transit time, expiry-before-delivery rejection, persisted destination and legacy migration. Manager defaults to local route. Three tests authored, execution deferred. G06 remains partial: no independent rival agents by region, contracted buyer offers, market feedback from all service quality or validated long-run economics. Existing legacy records remain unspecified. No later gate started.

- G07 authorized. Added persisted rescue phases, difficulty-specific default/liquidation windows, payroll/creditor risk signals, phase history and once-earned milestones, one-time Beginner equity assistance, terminal clock freeze and UI obligations. Four regression tests authored, not run. Liquidation is operational freeze, not judicial distribution; existing records/obligations preserved. Fictional thresholds uncalibrated; full restart archive, creditor approval, asset disposal and viability checks remain open.

- G07 governance/crisis: immutable company ID from opening seed/wall (legacy identity initialized on migration), single-owner approval register, seven-day supplier extension for 1% fee without forgiving liability, emergency sale of usable unreserved raw inventory at 60% carrying value with loss posting, expanded causal crisis records, acknowledgment, deadlines, one-time reputation penalty and verified resolution. Four tests authored, deferred. No equipment disposal or multi-shareholder governance implemented; creditor approval is simplified eligibility, not external negotiation. All scenario values fictional.

- G07 terminal restart: explicit liquidation-only restart command, separate company ID and opening ledger, transactionally retained per-company archive keyed by immutable company ID, latest archive export and difficulty hints. Existing financial obligations remain in frozen records; no write-off fiction. Three tests authored, execution deferred; IndexedDB archive transaction/recovery and device export unverified. Archive access is local, not cloud or permanent. Equipment disposal and statutory liquidation distribution are still pending. No later gate started.

- G08 authorized. Added single-revision elapsed plan/finish, chunked worker proposal and return-report calculation, no DB access from worker, bounded event scan and milestone timing. Four tests authored; not run. Persistence integration follows; G01–G07 partial, G09–G12 await owner instruction.

- G08 persistence: CRC32 UTF-8 checksummed portable envelope (version 1, content 1), raw legacy support, stored-record checksum including revision/receipts, full codec validation before commit, worker compute outside Dexie with compare-and-swap and receipt replay inside transaction, three rotating backup slots and newest-valid recovery, archived terminal records retained. Four codec tests authored, not run. CRC32 is corruption detection, not authentication. Existing database schema retained (new keys use same id index); storage quota and crash during transaction/worker timeout must be tested. No destructive automatic recovery.

- G08 UI and acceptance: offline return brief with actual elapsed, cap/anomaly, packets, cash/revenue/expense/profit deltas, crises/milestones and tracked completed-batch time; foreground timer avoids hidden-tab progression and visibility/pageshow use same resume authority; stale-save reload control, export error handling and local backup warnings. Dedicated Chromium acceptance workflow authored for stale-tab rejection, worker catch-up while offline, repeat reload and corrupt-save recovery. Not executed in this session; auto CI may run. Return report is a session projection, not durable history. Native lifecycle/device export, storage quotas, safe service-worker update, worker cache evidence, long-run performance and full crash/replay tests remain deferred.

- G09 authorized: departmental assignments, bounded per-department/global daily actual cash-debit budgets, approval requests, revalidated decisions, shared command transitions, cash reserve and risk stop, daily replenishment/repair/production/cash sales, persistent bounded logs. Legacy generic automation disabled until explicit delegation. No finance/quality overrides. UI and regression evidence remain pending in this increment.

- G09 UI and safeguards: manager selection, four departmental assignments, suspend/remove, global and departmental budgets, reorder/min-margin controls, CEO approval/rejection, emergency stop, last 40 decisions and executive summary. Revalidate sale margin, production policy and repair need on approval; invalidate pending requests on policy changes and expire at day boundary. Eight tests authored and old generic manager test updated; not manually run. Remaining: approval-time procurement target freshness, detailed per-manager qualifications/progression, auto scheduled future work orders with reserved budget, region/credit sales authority, additional departmental policies and complete replay/runtime verification. No PASS or merge.

- G09 final safeguards: recheck procurement need at approval time, explicit expired-request log, terminal stop reason, human-readable approval details, and two additional regression cases. Added G09 management contract. Future manager-scheduled work with reserved budgets remains incomplete; immediate production runs at daily review only. Tests authored, not run. No gate pass or merge.

- G09 review: old manager test fixture now completes required audit; immediate safety/permit/recall and reserve stops also checked at scheduler boundaries. Three additional tests authored for shared cap, real repair debit and permit expiry stop. No manual test run; total 13 new test cases. Existing test title about held goods still needs a real held-stock fixture and full regression execution.

- G10 authorized: build-generated launcher PNGs, manifest updates, byte-hashed dist precache and explicit update coordinator; Capacitor 8.0.0 pins selected for official API 36 baseline (previous 7.x default 35). No lockfile or runtime verification yet. Old caches retained intentionally; bounded cleanup remains pending. G01–G09 partial.

- G10 native adapters: Capacitor App lifecycle/back handler, shared cache-file export via native share sheet for save/archive/report, HTML file picker for import, safe-area CSS, PWA explicit update after saved revision preflight; waiting worker refuses activation when multiple scoped windows are open. Native WebView and update events not tested. No background service or mandatory network. Existing committed state is saved; offline progression resumes by same clock, not simulated in background.

- G10 build increment: template-driven Android generation/sync, API 36 assertion, versionCode/name, landscape, cleartext/backup settings, native launcher icons and local bundle without SW, portable npm APK/AAB scripts, debug signature/target/hash workflow and unsigned release bundle artifact configuration, bundle budget/hash audit. Generated wrapper and artifacts not yet observed. No signed AAB or device test. Owner app ID/version/signing decision, lockfile, merged permission audit and performance remain pending.

- G10 actual CI review: 6dffa79 web/worker/Android jobs failed at typecheck/build with TS2367 offline loop narrowing and TS2307 G06 test import. Corrected both; update UI now releases busy state on unconfirmed activation. No artifact or successful test claim until current revision is checked. Previous failed runs: 45610920923, 45610920864, 45610920840.

- G11 authorized: actual G10 CI evidence (118 tests, offline acceptance, API36 APK and unsigned AAB with matching hashes; one browser smoke failed) documented in G11_RELEASE_READINESS.md. Small-landscape takeover stacking corrected. Added privacy notice, draft listing/declarations, official policy references, scoped SHA-verified lockfile promotion, license text collection, dependency advisory workflow and local certificate-checked signing script. No publishing; signing, policy contact, owner metadata, physical devices, licensing final review and G12 remediation remain open.

- G11 lockfile promoted at c97d1d7 (verified exact SHA via successful run 45612480252). Removed one-off write workflow; npm ci used across core CI. Added source heuristic secret/endpoint check, asset provenance and hashes, permission allowlist, APK alignment and bundled byte equality verification for APK/AAB. New audit checks pending actual execution. Initial audit failed before lockfile; build at d499d66 succeeded but is not final revision evidence. No G12 started.

- G12 authorized. Baseline exact 3e474e1: 118 tests/30 files, browser, offline worker and Android package pass. Release audit fails on Capacitor Android, CLI/tar, Vitest/mocker/tinypool. Upgrade requested to audit-suggested patched versions and scoped CI lock resolution with regression gate. No gate passed.

- G12: actual patched lock resolution succeeded (118 tests and 0 npm audit vulnerabilities in run 45614103984), promoted 4367345. Removed temporary lock workflow. Added buyer contract lifecycle with finished goods and regional demand reservations, locked terms, dispatch/cancel/expiry/recall and save linkage. Three tests authored; actual execution pending.
