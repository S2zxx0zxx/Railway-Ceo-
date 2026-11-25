# Execution ledger

Baseline V3.0. Status is evidence-based; no task is verified by documentation alone.

| ID | Phase | Status | Acceptance scope |
|---|---|---|---|
| RV-001 | P00 | NOT STARTED | Import approved GDD + V3 plan and decision log; compare 25/34/15 coverage; owner repository and license pending |
| RV-002 | P00 | NOT STARTED | Pin upstream commits, enumerate actual source files and licenses, dependency scan; no unverified copying |
| RV-003 | P00 | NOT STARTED | Run candidate smoke tests separately, document usable/failed mechanisms and golden test vectors; choose one clock/ledger |
| RV-004 | P00 | NOT STARTED | Freeze original visual tokens, screenshot layout, asset whitelist and performance budgets; review prototype wireframe |
| RV-005 | P01 | NOT STARTED | Initialize React/TS/Vite repo, lockfile, strict lint/typecheck/test, CI and protected branch rules |
| RV-006 | P01 | NOT STARTED | Domain types, validated data catalogs, units/rounding, command/event/revision contract; invalid data rejected |
| RV-007 | P01 | NOT STARTED | Deterministic clock, scheduler and seeded RNG; replay tests and priority order |
| RV-008 | P01 | NOT STARTED | Dexie schema, atomic transaction and single writer; crash/stale revision/duplicate command tests |
| RV-009 | P01 | NOT STARTED | Save codec, backups, migration, export/import; invalid/legacy/corrupt cases |
| RV-010 | P01 | NOT STARTED | Worker bridge and platform interfaces; no DOM in engine, deterministic worker/main parity |
| RV-011 | P02 | NOT STARTED | Opening scenario and balanced seed accounts; validate assets/debt/payroll and cash source |
| RV-012 | P02 | NOT STARTED | New game/identity/difficulty/onboarding; takeover once, saved correctly |
| RV-013 | P02 | NOT STARTED | Audit missions, repair priorities, company profile and governance; gates work |
| RV-014 | P03 | NOT STARTED | Responsive landscape shell, HUD, 12 dock actions, settings/back and focus navigation |
| RV-015 | P03 | NOT STARTED | Original office first render + performance panel; references reviewed, no fake metrics |
| RV-016 | P03 | NOT STARTED | Panel primitives and routes M01–M15; locked/empty states, no public dead buttons |
| RV-017 | P04 | NOT STARTED | Accounting domain and Pluts compatibility adapter; balanced entries and integer precision |
| RV-018 | P04 | NOT STARTED | Opening, purchase, production, sale, payment, financing, wages, depreciation posting rules; golden vectors |
| RV-019 | P04 | NOT STARTED | P&L, balance sheet, cash flow, journal, aging, valuation; reconciliation tests |
| RV-020 | P05 | NOT STARTED | Supplier offers, PO, lead time and receipt lifecycle; credit and dedupe |
| RV-021 | P05 | NOT STARTED | Lot inventory, FEFO, reserved stock and weighted average; unit/cost conservation |
| RV-022 | P05 | NOT STARTED | Reorder/safety stock/EOQ, expiry, capacity and disposal; Stockpyl comparison |
| RV-023 | P05 | NOT STARTED | Procurement/warehouse UI and end-to-end receipt with ledger |
| RV-024 | P06 | NOT STARTED | BOM, yield and staged batch scheduler; reservations and WIP cost |
| RV-025 | P06 | NOT STARTED | Machine capacity/condition/OEE, wear and failure; deterministic fixtures |
| RV-026 | P06 | NOT STARTED | Maintenance, repairs, utility and replacement; time/capital postings |
| RV-027 | P06 | NOT STARTED | Incoming and finished QC, hold/release/reject/recall, traceability |
| RV-028 | P06 | NOT STARTED | Production, machinery, quality UI; blocked batch cannot sell |
| RV-029 | P07 | NOT STARTED | Employees, skills, morale, hiring/firing/training, shifts and attendance |
| RV-030 | P07 | NOT STARTED | Payroll accrual, arrears, payment, overtime and safety interactions |
| RV-031 | P07 | NOT STARTED | HR panels and manager policy schema; role/budget restrictions |
| RV-032 | P08 | NOT STARTED | Market demand, pricing, competition, allocation; bounded seeded agents |
| RV-033 | P08 | NOT STARTED | Buyer offers, contract and order reservations, delivery and logistics costs |
| RV-034 | P08 | NOT STARTED | Invoice, cash collection, returns/refunds, complaint/recall; no duplicate postings |
| RV-035 | P08 | NOT STARTED | Campaigns, reputation and region unlocks; uncertain demand, no guaranteed ROI |
| RV-036 | P08 | NOT STARTED | Market/sales/marketing UI, charts and end-to-end sale cycle |
| RV-037 | P09 | NOT STARTED | Loan eligibility, amortization, credit/overdraft, interest accrual |
| RV-038 | P09 | NOT STARTED | Debt restructuring, owner capital/asset sale and Banking UI; principal != revenue |
| RV-039 | P10 | NOT STARTED | Causal/seeded events, news inbox, deadlines, decision effects and dedupe |
| RV-040 | P10 | NOT STARTED | Distress/recovery/liquidation states, difficulty and restart rules |
| RV-041 | P10 | NOT STARTED | Compliance, safety, environment, risk/audit controls and event consequences |
| RV-042 | P11 | NOT STARTED | Research prerequisites and timed improvements, automation unlocks |
| RV-043 | P11 | NOT STARTED | Manager execution using normal commands, policy limits, explainable log |
| RV-044 | P11 | NOT STARTED | Offline catch-up, cap, anomalies, pause and resume, duplicate protection |
| RV-045 | P11 | NOT STARTED | Return report, five progression stages, achievements and daily loop |
| RV-046 | P12 | NOT STARTED | Five original office artworks, machine/product/staff icons and selected SFX; provenance manifest |
| RV-047 | P12 | NOT STARTED | All 15 panels polished with actual state/actions, responsive/a11y/reduced motion, visual regression |
| RV-048 | P12 | NOT STARTED | Modular ECharts and financial reports; charts match underlying data |
| RV-049 | P13 | NOT STARTED | Full economic golden scenario, invariant/property tests, seeded multi-year simulations |
| RV-050 | P13 | NOT STARTED | Balance three difficulty modes and recovery paths; no deadlock, impossible tutorial or endless inflation |
| RV-051 | P13 | NOT STARTED | Save/crash/update/import/multi-tab and time anomaly tests, repair any regressions |
| RV-052 | P13 | NOT STARTED | Check dependency licenses, vulnerability scan, asset hashes and no runtime external requests |
| RV-053 | P14 | NOT STARTED | PWA manifest, icons, service worker and safe updates; install and airplane-mode tests |
| RV-054 | P14 | NOT STARTED | Android Capacitor wrapper, bundled assets, lifecycle/back/safe-area and offline fresh install |
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
