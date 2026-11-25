# G12 individual acceptance register

Reviewed source baseline 09c8f148d3298394a79d8a8af8d293a300cf2211. All 134 IDs mapped individually to implementation/test locations and outstanding acceptance. This is a coverage register, not proof of complete feature delivery. Test names without an explicit run refer to authored coverage. The exact 58217bc test run 45616719358 passed 121 tests in 31 files, including buyer contracts. Earlier 3e474e1 browser and worker acceptance are historical evidence only. Release audit 45614466081 passed zero vulnerabilities. New labor implementation at 09c8f14 needs CI. No gate PASS.

## Corporate systems (25)
| ID | Scope | Evidence location | Status | Remaining |
|---|---|---|---|---|
| D01 | Executive | executive.ts; CEO dashboard; g01-company | PARTIAL | Morning brief/valuation/audit/real KPIs; visual and action acceptance |
| D02 | Governance | governance.ts; Company; g07-governance | PARTIAL | Single owner decision log; board voting and equipment disposal outstanding |
| D03 | Finance | ledger.ts; finance.ts; reports.ts; g04-*; g12-labor | PARTIAL | Labor increment awaiting tests; period reconciliation and overhead allocation |
| D04 | Treasury | banking.ts; Banking; g04-banking | PARTIAL | Amortization and restructuring; overdraft/credit-rating policy incomplete |
| D05 | Procurement | game.ts purchase; Procurement; g01-procurement | PARTIAL | Supplier invoice and receipt lifecycle; rejection credit/returns incomplete |
| D06 | Supply chain | operations.ts; g05-operations; g06-regions | PARTIAL | Timed logistics; carrier choice and capacity missing |
| D07 | Inventory | costing.ts; planning.ts; contracts.ts; g04-costing; g12-contracts | PARTIAL | Reservation and pooled cost; long-run conservation and legacy tests |
| D08 | Production planning | planning.ts; g05-planning | PARTIAL | Reservations and scheduled starts; future manager-budgeted plans missing |
| D09 | Manufacturing | game.ts batch; g05-cost-time; g12-labor | PARTIAL | Stage data and direct labor; overhead/stage-specific resource rates incomplete |
| D10 | Engineering | game.ts upgradeMachine; g01-engineering | PARTIAL | Upgrade history; machine replacement and spare parts incomplete |
| D11 | Maintenance | serviceHistory; g05-operations | PARTIAL | Actual downtime; complete OEE/spares incomplete |
| D12 | QA | traceability.ts; Quality; g05-traceability | PARTIAL | Permit/sanitation/held lots; inspection/rework procedures incomplete |
| D13 | QC | release/recallBatch; g05-traceability | PARTIAL | Reject/recall; granular compensation and rework missing |
| D14 | HR | employeeDailyPay/laborAvailability; g01-hr | PARTIAL | Staffing, fatigue, shifts and training; individual candidate selection missing |
| D15 | Payroll | scheduledPayroll; g01-hr; g12-labor | PARTIAL | Daily accrual and settlement; test new allocation and exact fractional balance |
| D16 | Sales | contracts.ts; g12-contracts; g01-customer | PARTIAL | Contract tests pass at 58217bc; expanded buyer profiles/partial returns missing |
| D17 | Marketing | market.ts; g06-economy | PARTIAL | Campaign budget, duration and uncertainty; campaign analytics/calibration |
| D18 | Distribution | regionAvailability; g06-regions | PARTIAL | Regional freight/time; independent carrier capacity/choice missing |
| D19 | Customer service | refundSale/complaint; g01-customer | PARTIAL | Full refunds and recall; partial returns and buyer feedback missing |
| D20 | R&D | research command; Research | PARTIAL | Timed energy/quality level; research tree, pause and other upgrades missing |
| D21 | Legal/compliance | renewPermit; governance.ts; g07-governance | PARTIAL | Fictional permit/crises; more inspection/contracts and legal responses |
| D22 | Safety | safetyTraining; pauseUnsafe; g09-managers | PARTIAL | Fatigue, utilities and permit checks; safety incident lifecycle incomplete |
| D23 | Environment | traceability.ts; Quality; g05-traceability | PARTIAL | Waste grams/pieces and energy expense; measured water/kWh incomplete |
| D24 | Risk/internal audit | executive.ts; rescue.ts; g07-rescue | PARTIAL | Risk deadlines and controls; three actual rescue paths pending |
| D25 | IT/automation | managers.ts; save.ts; g09-managers; G08 browser | PARTIAL | Four roles and atomic saves; future scheduled budgets and device tests |

## Player experiences (34)
| ID | Scope | Evidence location | Status | Remaining |
|---|---|---|---|---|
| E01 | Opening | intro; initialGame | PARTIAL | Actual takeover route; owner visual approval |
| E02 | Business profile | identity; Company; g01-company | PARTIAL | Name/brand; logo/avatar/color selection incomplete |
| E03 | Takeover | initialGame; takeover; g01-company | PARTIAL | Balanced opening and single acceptance; full walkthrough |
| E04 | Factory overview | offices/stage-*.svg; g03-office | PARTIAL | Static office; factory-specific visual and owner approval |
| E05 | Navigation | App.tsx dock; browser smoke | PARTIAL | 15 routes/six sizes on 3e474e1; full actions and latest rerun |
| E06 | Audit | audit; g01-company | PARTIAL | Checklist gates; broader audit interactions |
| E07 | Debt negotiation | restructureLoan; extendSupplier; g04-banking | PARTIAL | Eligibility and extension; broader creditor negotiation |
| E08 | Employee recovery | Employees; g01-hr | PARTIAL | Hiring/fatigue/shift; candidate/notice depth |
| E09 | Repair | Machinery; g01-engineering | PARTIAL | Service and upgrade; spare/replacement depth |
| E10 | Branding | identity; Company | PARTIAL | Brand name; custom logo/color/avatar incomplete |
| E11 | Supplier market | supplierQuote; g01-procurement | PARTIAL | Price/credit/quality; rejected PO returns |
| E12 | Warehouse | planning.ts; Warehouse; g05-planning | PARTIAL | Lots, expiry, reservations; full interaction tests |
| E13 | Production order | planBatch; g05-planning | PARTIAL | Scheduled start; budgeted manager scheduling |
| E14 | Manufacturing stages | runJob; g05-cost-time; g12-labor | PARTIAL | Five stages; full stage-specific resource use |
| E15 | Quality | Quality; g05-traceability | PARTIAL | Hold/release/recall; rework/partial returns |
| E16 | Market expansion | expandRegion; g06-regions | PARTIAL | Sequential regions; independent regional rival dynamics |
| E17 | Sales | contracts.ts; g12-contracts | PARTIAL | Three contract tests passed at 58217bc; full buyer lifecycle |
| E18 | Logistics | g06-regions | PARTIAL | Region freight/transit; carrier selection/capacity |
| E19 | Advertising | campaign; g06-economy | PARTIAL | Seeded preference; campaign ROI reporting |
| E20 | AI competitors | market.ts; g06-market | PARTIAL | Three deterministic rivals; long-run balancing |
| E21 | Financial reports | reports.ts; g04-finance | PARTIAL | Derived statements; full end-to-end golden vector |
| E22 | Corporate bank | banking.ts; g04-banking | PARTIAL | Debt schedule; credit/overdraft depth |
| E23 | CEO governance | governance.ts; g07-governance | PARTIAL | Single owner approvals; board and equipment disposal |
| E24 | R&D | research; Research | PARTIAL | Energy level; research tree and pause |
| E25 | Compliance | renewPermit; g07-governance | PARTIAL | Fictional legal controls; deeper inspections |
| E26 | Crises | reviewCrises; Business news; g07-governance | PARTIAL | Deadlines; event balance and complete responses |
| E27 | Bankruptcy | rescue.ts; restartCompany; g07-restart | PARTIAL | Freeze and restart; statutory distribution not implemented |
| E28 | Offline report | offline.ts; g08-clock; G08 browser | PARTIAL | Browser acceptance at 3e474e1; native and persistent report |
| E29 | Managers | managers.ts; g09-managers | PARTIAL | Four roles; future reservations/authority expansion |
| E30 | Progression | stage; office stage files; g03-office | PARTIAL | Five levels; actual playthrough and visual acceptance |
| E31 | Achievements | updateMilestones; g07-rescue | PARTIAL | 10 milestones; full progression tests |
| E32 | Daily routine | CEO dashboard; scheduled events | PARTIAL | Real daily obligations; daily gameplay usability |
| E33 | Difficulty | config.rescue; g07-rescue | PARTIAL | Separate thresholds; successful command-only playthroughs pending |
| E34 | Optional monetization | Master spec E34 | DEFERRED BY SPEC | Explicitly deferred; no ads/IAP SDK |

## Management panels (15)
| ID | Scope | Evidence location | Status | Remaining |
|---|---|---|---|---|
| M01 | CEO Dashboard | executive.ts; offline.ts | PARTIAL | Actual report and route; full interaction/visual review |
| M02 | Company | identity/audit/governance | PARTIAL | Board, logo and asset disposal incomplete |
| M03 | Employees | HR and manager controls | PARTIAL | Candidate selection, future manager scheduling |
| M04 | Procurement | purchase/PO/AP | PARTIAL | Supplier rejection credit |
| M05 | Warehouse | stock/reserved/costing | PARTIAL | Complete UI action and long-run checks |
| M06 | Production | planBatch/runJob | PARTIAL | Labor tests pending; overhead |
| M07 | Machinery | repair/upgrade/setUtility | PARTIAL | Replacement, OEE/spares |
| M08 | Quality | inspect/release/recall | PARTIAL | Rework and granular return |
| M09 | Sales | reserveSale/dispatchContract/refundSale | PARTIAL | New contract UI action regression |
| M10 | Marketing | campaign/stopCampaign | PARTIAL | Analytics/ROI |
| M11 | Market | marketView/expandRegion | PARTIAL | Long-run calibration and region competition |
| M12 | Finance | financialReport/periodIncome/export | PARTIAL | Full golden fixture and chart verification |
| M13 | Banking | loanSchedule/repay/restructureLoan | PARTIAL | Overdraft/credit policy |
| M14 | Research | research | PARTIAL | Tree/pause and other improvements |
| M15 | Business News | crises/ackCrisis/resolveCrisis | PARTIAL | Full event interaction tests |

## Build tasks (60)
| ID | Master requirement | Evidence location | Status | Remaining |
|---|---|---|---|---|
| RV-001 | Import approved GDD + V3 plan and decision log; compare 25/34/15 coverage; owner repository and license pending | docs/MASTER_BUILD_SPEC.md; G12 register | PARTIAL | Owner license/design approval |
| RV-002 | Pin upstream commits, enumerate actual source files and licenses, dependency scan; no unverified copying | RESOURCE_ADOPTION.md; release audit | PARTIAL | Candidate-specific execution and approved exclusions |
| RV-003 | Run candidate smoke tests separately, document usable/failed mechanisms and golden test vectors; choose one clock/ledger | g02-elapsed; ordering.test.ts | PARTIAL | Independent upstream smoke evidence; no unlicensed code |
| RV-004 | Freeze original visual tokens, screenshot layout, asset whitelist and performance budgets; review prototype wireframe | UI_STATUS.md; g03-office | PARTIAL | Owner visual baseline |
| RV-005 | Initialize React/TS/Vite repo, lockfile, strict lint/typecheck/test, CI and protected branch rules | package-lock.json; workflows/verify.yml | PARTIAL | Strict lint and branch policy acceptance |
| RV-006 | Domain types, validated data catalogs, units/rounding, command/event/revision contract; invalid data rejected | game.ts; codec.ts | PARTIAL | All malformed input/event edge cases |
| RV-007 | Deterministic clock, scheduler and seeded RNG; replay tests and priority order | elapsed.ts; g08-clock | PARTIAL | Long-run all-event replay |
| RV-008 | Dexie schema, atomic transaction and single writer; crash/stale revision/duplicate command tests | save.ts; g04-receipts; G08 browser | PARTIAL | Crash/quota injection |
| RV-009 | Save codec, backups, migration, export/import; invalid/legacy/corrupt cases | codec.ts; g08-integrity | PARTIAL | Legacy and native transfer breadth |
| RV-010 | Worker bridge and platform interfaces; no DOM in engine, deterministic worker/main parity | worker/bridge.ts; g08-clock | PARTIAL | Worker real-device performance |
| RV-011 | Opening scenario and balanced seed accounts; validate assets/debt/payroll and cash source | initialGame; game.test.ts | PARTIAL | Golden opening reconciliation observed in 121 baseline |
| RV-012 | New game/identity/difficulty/onboarding; takeover once, saved correctly | takeover; g01-company | PARTIAL | Complete onboarding UI review |
| RV-013 | Audit missions, repair priorities, company profile and governance; gates work | executive.ts; g07-governance | PARTIAL | Board/equipment disposal |
| RV-014 | Responsive landscape shell, HUD, 12 dock actions, settings/back and focus navigation | App.tsx; browser smoke | PARTIAL | Touch/focus on real device |
| RV-015 | Original office first render + performance panel; references reviewed, no fake metrics | offices/stage-*.svg; g03-office | PARTIAL | Owner art approval |
| RV-016 | Panel primitives and routes M01–M15; locked/empty states, no public dead buttons | App.tsx 15 routes; browser smoke | PARTIAL | Every mutation tested |
| RV-017 | Accounting domain and Pluts compatibility adapter; balanced entries and integer precision | ledger.ts; g04-finance | PARTIAL | Pluts excluded: missing license text; owner acceptance of original ledger |
| RV-018 | Opening, purchase, production, sale, payment, financing, wages, depreciation posting rules; golden vectors | g04-finance; g12-labor | PARTIAL | Overhead and complete golden sequence |
| RV-019 | P&L, balance sheet, cash flow, journal, aging, valuation; reconciliation tests | reports.ts; reports-save.test.ts | PARTIAL | Full reports golden vector |
| RV-020 | Supplier offers, PO, lead time and receipt lifecycle; credit and dedupe | g01-procurement; g05-operations | PARTIAL | Supplier rejection/refund |
| RV-021 | Lot inventory, FEFO, reserved stock and weighted average; unit/cost conservation | costing.ts; planning.ts; g12-contracts | PARTIAL | Long-run conservation |
| RV-022 | Reorder/safety stock/EOQ, expiry, capacity and disposal; Stockpyl comparison | ordering.ts; ordering.test.ts | PARTIAL | Forecast/cap/shelf life breadth |
| RV-023 | Procurement/warehouse UI and end-to-end receipt with ledger | Procurement/Warehouse; browser smoke | PARTIAL | Full UI-to-ledger receipts |
| RV-024 | BOM, yield and staged batch scheduler; reservations and WIP cost | g05-planning; g05-cost-time; g12-labor | PARTIAL | Stage-specific rates and overhead |
| RV-025 | Machine capacity/condition/OEE, wear and failure; deterministic fixtures | throughput; g01-engineering | PARTIAL | Measured OEE |
| RV-026 | Maintenance, repairs, utility and replacement; time/capital postings | serviceHistory; g05-operations | PARTIAL | Spares/replacement |
| RV-027 | Incoming and finished QC, hold/release/reject/recall, traceability | g05-traceability | PARTIAL | Rework/granular compensation |
| RV-028 | Production, machinery, quality UI; blocked batch cannot sell | Production/Machinery/Quality; smoke | PARTIAL | Every action and blocked shipment UI |
| RV-029 | Employees, skills, morale, hiring/firing/training, shifts and attendance | g01-hr | PARTIAL | Candidate selection and progression |
| RV-030 | Payroll accrual, arrears, payment, overtime and safety interactions | g01-hr; g12-labor | PARTIAL | Exact payroll residual/partial day tests |
| RV-031 | HR panels and manager policy schema; role/budget restrictions | managers.ts; g09-managers | PARTIAL | Future scheduled budgets |
| RV-032 | Market demand, pricing, competition, allocation; bounded seeded agents | market.ts; g06-market | PARTIAL | Long-run balance |
| RV-033 | Buyer offers, contract and order reservations, delivery and logistics costs | contracts.ts; g12-contracts | PARTIAL | Contract tests 3 pass at 58217bc; carrier choice |
| RV-034 | Invoice, cash collection, returns/refunds, complaint/recall; no duplicate postings | g01-customer; g05-traceability | PARTIAL | Partial returns and all settlement paths |
| RV-035 | Campaigns, reputation and region unlocks; uncertain demand, no guaranteed ROI | g06-economy; g06-regions | PARTIAL | Campaign/market calibration |
| RV-036 | Market/sales/marketing UI, charts and end-to-end sale cycle | Market/Sales/Marketing; smoke | PARTIAL | Full interaction, charts, golden sale |
| RV-037 | Loan eligibility, amortization, credit/overdraft, interest accrual | banking.ts; g04-banking | PARTIAL | Overdraft/credit rating |
| RV-038 | Debt restructuring, owner capital/asset sale and Banking UI; principal != revenue | g07-governance; g04-banking | PARTIAL | Equipment asset disposal |
| RV-039 | Causal/seeded events, news inbox, deadlines, decision effects and dedupe | governance.ts; g07-governance | PARTIAL | Complete event response matrix |
| RV-040 | Distress/recovery/liquidation states, difficulty and restart rules | rescue.ts; g07-restart | PARTIAL | Successful difficulty playthroughs; full archive integration |
| RV-041 | Compliance, safety, environment, risk/audit controls and event consequences | g05-operations; g07-governance | PARTIAL | Water/kWh and broader compliance |
| RV-042 | Research prerequisites and timed improvements, automation unlocks | research command; Research | PARTIAL | Tree, pause, effects and unlocks |
| RV-043 | Manager execution using normal commands, policy limits, explainable log | managers.ts; g09-managers | PARTIAL | Budgeted future plans; expanded roles |
| RV-044 | Offline catch-up, cap, anomalies, pause and resume, duplicate protection | offline.ts; g08-clock; G08 browser | PARTIAL | Full event replay/crash cases |
| RV-045 | Return report, five progression stages, achievements and daily loop | stage; updateMilestones; offline report | PARTIAL | Actual recovery/progression usability |
| RV-046 | Five original office artworks, machine/product/staff icons and selected SFX; provenance manifest | ASSET_PROVENANCE.md; 5 SVGs | PARTIAL | Machine/product/staff art and SFX not complete |
| RV-047 | All 15 panels polished with actual state/actions, responsive/a11y/reduced motion, visual regression | App.tsx; game.css; browser screenshots | PARTIAL | Owner visual and action acceptance |
| RV-048 | Modular ECharts and financial reports; charts match underlying data | reports.ts; Finance | PARTIAL | Modular charting requirement outstanding |
| RV-049 | Full economic golden scenario, invariant/property tests, seeded multi-year simulations | game.test.ts; g04-*; g06-* | PARTIAL | Complete multi-year golden scenario |
| RV-050 | Balance three difficulty modes and recovery paths; no deadlock, impossible tutorial or endless inflation | g07-rescue; config.rescue | PARTIAL | Three successful playthroughs |
| RV-051 | Save/crash/update/import/multi-tab and time anomaly tests, repair any regressions | g08-integrity; scripts/g08-browser.mjs | PARTIAL | Quota, crash, update, native |
| RV-052 | Check dependency licenses, vulnerability scan, asset hashes and no runtime external requests | release audit 45614466081 | PARTIAL | 0 vulnerabilities baseline; latest audit/network proof |
| RV-053 | PWA manifest, icons, service worker and safe updates; install and airplane-mode tests | vite.config.ts; pwa.ts; G08 browser | PARTIAL | Installed safe update and physical airplane mode |
| RV-054 | Android Capacitor wrapper, bundled assets, lifecycle/back/safe-area and offline fresh install | prepare-android.mjs; native.ts | PARTIAL | Patched APK/device lifecycle |
| RV-055 | Device performance, screen matrix, WebView compatibility and storage tests | browser smoke; audit-bundle | PARTIAL | Physical device timing/storage/WebView |
| RV-056 | PWA ↔ Android save export/import parity; shared engine/content version and golden replay | codec.ts; g08-integrity | PARTIAL | PWA/Android physical file transfer |
| RV-057 | QA APK and release AAB, signing/target API checks, hashes and device evidence | android-qa.yml; prior artifacts | PARTIAL | Patched artifacts and owner signed AAB |
| RV-058 | Store listing/privacy/data safety/content rating/ads declarations and required testing plan; owner account access | G11_RELEASE_READINESS.md; listing draft | PARTIAL | Owner metadata, public privacy, Console, tester requirement |
| RV-059 | Final 25/34/15 traceability review; E34 explicit deferred optional monetization unless approved; all P0/P1 defects resolved | This 134-row register | PARTIAL | All unresolved requirements and P0/P1 defects must close |
| RV-060 | Release decision, documented limitations, rollback/save compatibility and owner approval; no unauthorized merge/publication | G12_REMEDIATION.md | PARTIAL | All gates, rollback and owner sign-off |

Owner-controlled external gates: visual approval, license/brand, publisher identity and contact, publicly hosted privacy URL, actual Play Console answers and applicable closed testing, physical Android device and signed upload bundle. No publishing or merge.
