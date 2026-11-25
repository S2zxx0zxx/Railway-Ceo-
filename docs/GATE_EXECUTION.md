# Sequential release gate execution

Owner update: implementation may proceed in gate order on explicit owner command even if earlier tests or blockers are unresolved. Record incomplete scope and defer verification to the final remediation phase; never label it PASS. G12 is now active for final remediation. Reopen G01–G11 and preserve their outstanding requirements. Keep all work on PR #1, feat/company-simulator-v3. Do not merge until all gates pass. License/provenance permission remains a prerequisite to importing third-party material.

| Gate | Status | Acceptance from MASTER_BUILD_SPEC.md section 10 |
|---|---|---|
| G01 | PARTIAL / VERIFICATION DEFERRED | All D01–D25 and E01–E34 mapped to implementation or expressly approved deferral; every M01–M15 panel tested; no silent omissions |
| G02 | PARTIAL / VERIFICATION DEFERRED | Pinned upstream commits, actual files, test evidence, dependencies/licenses, asset provenance |
| G03 | PARTIAL / VERIFICATION DEFERRED | Original approved UI baseline, screenshots of all panels, layout, touch and focus |
| G04 | PARTIAL / VERIFICATION DEFERRED | Balanced ledger, exactly-once posting, AR/AP/stock and financial reconciliation |
| G05 | PARTIAL / VERIFICATION DEFERRED | Manufacturing, inventory, quality and resource constraints |
| G06 | PARTIAL / VERIFICATION DEFERRED | Bounded markets, competition, reproducible events and economy |
| G07 | PARTIAL / VERIFICATION DEFERRED | Viable rescue for each difficulty; recovery and liquidation |
| G08 | PARTIAL / VERIFICATION DEFERRED | Offline parity, time anomalies, save integrity, migration and updates |
| G09 | PARTIAL / VERIFICATION DEFERRED | Manager validation, budget, authority, stop conditions and decision evidence |
| G10 | PARTIAL / VERIFICATION DEFERRED | Installable offline PWA, native APK device test, save transfer and no mandatory network |
| G11 | PARTIAL / REMEDIATION REQUIRED | Signed AAB, metadata, Play policies, notices, no secrets or high-priority defects |
| G12 | ACTIVE REMEDIATION / NOT PASSED | Exact revision and final evidence, all gates passed, authorized merge |

## G01 corporate coverage register (initial audit)

No row below is a pass. Existing commands/screens and authored tests are baseline evidence only. The implementation must satisfy the actual master scope. Refine against current head before each increment.

| ID | Panel | Baseline and remaining acceptance |
|---|---|---|
| D01 Executive | M01/M02 | Takeover, audit, metrics; morning briefing, valuation and milestones |
| D02 Governance | M02/M12 | Owner capital; ownership, board and approvals |
| D03 Finance | M12 | Ledger/reports; depreciation, AP, tax and period reports |
| D04 Treasury | M13 | Loan/interest/repayment; restructuring and amortization |
| D05 Procurement | M04 | Supplier purchase/receipt; credit and cancellation |
| D06 Supply chain | M04/M05/M09 | Timed receipts/deliveries; reliability and logistics constraints |
| D07 Inventory | M05 | Lots, expiry/disposal, reorder; capacity, reservation and costing |
| D08 Planning | M06 | Quantity/queue; schedule, pause and cancel |
| D09 Manufacturing | M06 | Staged output; full material, labor and utility lifecycle |
| D10 Engineering | M07/M14 | Research/repair; replacement, upgrades and installation |
| D11 Maintenance | M07 | Condition, wear and repair; service plans, downtime and spares |
| D12 QA | M08 | Permit, sanitation and held lots; approval and traceability |
| D13 QC | M08 | Rejections/release; testing, disposition and recalls |
| D14 HR | M03 | Hire/train/release; skill effects, shifts, attendance, promotion |
| D15 Payroll | M03/M12 | Wage accrual/payment; overtime and payroll controls |
| D16 Sales | M09 | Delivery and collection; buyer contracts and reservations |
| D17 Marketing | M10 | Campaign; budget, uncertain outcome and region progression |
| D18 Distribution | M09 | Timed delivery; carrier/cost/capacity selection |
| D19 Customer service | M09/M15 | Gap: complaints, returns/refunds, recall service |
| D20 R&D | M14 | Efficiency research; prerequisites and quality/yield improvements |
| D21 Legal | M02/M15 | Permit; inspections, contracts, legal events |
| D22 Safety | M07/M15 | Sanitation; safety training and incidents |
| D23 Environment | M06/M07/M15 | Disposal; waste/energy reporting and constraints |
| D24 Risk/internal audit | M01/M12/M15 | Takeover audit; internal controls and risk evidence |
| D25 IT/automation | M01/M14/policies | Save, clock and managers; automation levels and decision evidence |

E01–E34 and M01–M15 mappings are in master spec sections 3 and 8. Add an individual acceptance record for each; E34 optional monetization is expressly tracked as deferred by the existing spec. For every active feature require real state, UI path, validated commands, persistence where relevant, and observed tests. Record commit and evidence before promotion. A green general CI run alone is insufficient. No gate or row can be closed on planning alone.

### G01 implementation increment — procurement/payables
D03/D05/D06: implemented credit purchases, pending-order cancellation, invoice creation/settlement, AP reconciliation and due-date restrictions. UI controls in Procurement and Finance; tests/g01-procurement.test.ts authored. Acceptance still partial until CI and complete scope verified. Credit limit ₹1 lakh, 7/15-day terms, no economy supplier credit and free pending cancellation are scenario tuning defaults, not real supplier terms.

### G01 customer-service increment
D16/D19 now have persisted delivered sale records and actual complaint/refund commands in Sales. Paid refund and unpaid credit note reverse recognized revenue; food is not restocked; duplicate refunds rejected. tests/g01-customer.test.ts authored. Full automatic complaint/recall/partial returns acceptance remains open. No gate pass.

### G01 HR increment
D14/D15/D22: real shifts, safety training, fatigue/attendance, overtime, promotions, effective labor and payroll projection; tests/g01-hr.test.ts authored. Partial pending tests and remaining scope. No promotion to G02.

### G01 engineering increment
D08/D10/D11: implemented capitalized timed upgrades, machine levels and service timestamps, preventive service and active batch writeoff. UI in Machinery/Production, tests/g01-engineering.test.ts authored. Not a complete engineering/planning gate; remaining scope and tests still open.

### G01 observed verification
At c0d20aa: web/unit workflow 45597960788 succeeded; browser 45597960836 failed on obsolete procurement selector; Android QA build 45597960767 succeeded (not device verification). At b2b9abf: web/unit 45598050912 succeeded. At 27c2be0: web/unit 45598164190 succeeded. Corrected stale smoke test and expanded route traversal; latest evidence pending. Earlier successes do not pass G01 or later gates.

### G02 implementation checkpoint
G01 unresolved functional work and test evidence retained above; no pass inferred. G02: adapted MIT wall-time planning into live catch-up path, retained full upstream license, added three regression tests and installed-resolution/asset inventory command. ERPNext confirmed GPL-3.0 (reference only); Pluts README and package declare MIT but full notice not located at pin, so no code import. Economia order matching lacks a price-crossing guard and uses unseeded randomness; reject direct import. TeamDay economy is coupled to global state and office configuration; no renderer or SaaS logic import. Full dependency lock, actual audit output, upstream smoke tests, visual and audio assets and remaining selected modules still open. Tests deferred under owner instruction; CI may run automatically.

G02 additional increment: distributable license notice added under public/licenses. SimCorp demand/distress source reviewed; calibration deferred to G06 instead of replacing current INR model without evidence. Bundle verification pending.

### G03 visual implementation checkpoint
Original five-stage static SVG office scenes, stage-driven asset routing, compact real HUD, 12-button circular dock, distinct CEO dashboard, shared management dialog, status/feedback and destructive-action confirmation, landscape/portrait styles, PWA precache and asset inventory added. Existing command engine and save format unchanged. Art is authored vector illustration, not final photorealistic WebP; owner visual sign-off, physical touch/focus checks, full per-panel interactions, final artwork/sound and screenshot tests still pending. No gate passed.

G03 follow-up: persistent reduced-motion preference, small landscape auto-collapse on initial load, legal notice access and browser acceptance/screenshot coverage for all 15 panels, six viewport sizes and offline office assets. Full interaction and visual review not yet executed; no pass.

### G04 accounting increment
Separate returns, depreciation/contra-asset, tax expense/payable and accrued interest accounts; daily straight-line depreciation, 30-day fictional tax assessment, tax settlement, interest-first repayments, net revenue, before/after-tax reports, aging and cash reconciliation. Legacy entries unchanged; future postings use new accounts. Six tests authored, existing refund tests updated to assert net revenue rather than gross account. Pending: full loan schedules, weighted-average allocation, idempotency and full verification. Scenario tax and useful-life defaults are fictional, not jurisdictional rules.

G04 banking increment: loan records and schedules reconcile to the debt account, repayments allocate after accrued interest, late principal blocks new borrowing and eligible facilities can restructure once. Banking UI displays installments. Tests authored, not verified; full banking scope remains partial.

G04 costing increment: moving weighted-average inventory issue, deterministic residual allocation, receipt pool revaluation, exact tax settlement and loan tie-break correction. Tests authored. Historical lots retain prior valuation until first affected receipt/issue; no retroactive journal changes. Full cost lifecycle and evidence remain open.

G04 final implementation increment for this session: bounded command receipt persistence, exact debt settlement, JSON financial exports. Unit tests authored, no new tests executed on request. Remaining: real IndexedDB concurrency/retry verification, accounting golden vectors and full end-to-end reconciliation, production labor/overhead allocation, credit/overdraft and risk-based lending, asset disposals, tax migration edge cases and authorized reversals. G04 stays partial; all prior gates retain verification debt.

### G05 planning increment
Added real persisted lot reservations, scheduling, cancellation, pause/resume and stage-boundary operating guard; accounting preserved. Three tests authored, execution pending. Continuous within-stage outage handling and complete traceability/waste still open.

G05 traceability increment: new batches and shipments carry lot genealogy, incoming/finished holds and recall actions, in-transit expiry checks, linked customer complaints, waste/energy spend reporting. Tests authored. Legacy history cannot be reconstructed; recall compensation remains manual and whole order. Full supplier lifecycle, physical returns, granular recall and test evidence remain open.

G05 operations increment: supplier constraints, purchase history, service history and explicit utility controls with immediate pause. Three tests authored; final verification deferred. Supplier quantities/limits and single-line operation are provisional scenario assumptions.

G05 final increment: persisted materials/energy cost components and active operating minutes for new batches, UI yield and elapsed time, exact permit expiry interruption and post-command operating guard. Two tests authored. Complete labor/overhead allocation, stage-specific resource consumption and OEE, spares/replacement, supplier returns, finished-goods reservations independent of immediate dispatch, historical traceability and exhaustive accounting/operational tests remain incomplete. G05 not passed. All tests deferred under owner direction; no later gate started.

### G06 market increment
Single market state with normalized integer quota, bounded rival agents, daily settlement and seeded price changes, sequential regional market entry and market UI. Four tests authored. No pass; complete verification and calibration pending.

G06 economic increment: dynamic bounded commodity indices and procurement quote integration, seeded shocks with three-day duration and news, difficulty-specific shock rates, budgeted campaigns with uncertain bounded preference and cancellation. Four tests authored; verification deferred. No PASS.

G06 regional increment: regional order routing and commitment conservation, actual freight/time, destination history and pre-dispatch expiry guard. Three tests authored. G06 incomplete: full buyer contracts, region-specific rival dynamics, accounting/recovery viability and comprehensive deterministic/balancing checks deferred. Parameters are fictional, uncalibrated; no gate passed or merge.

### G07 rescue increment
Persisted rescue phase progression, due-obligation distress model, difficulty windows, terminal operations freeze, beginner equity assistance and milestone history; CEO/Banking/News UI. Four tests authored, deferred. No PASS; legal liquidation distribution and viable playthroughs unverified.

G07 governance increment: owner decision records and identity, supplier extension, raw inventory rescue sale, event causes/deadlines/acknowledgment and once-only penalties. Four tests authored, not run. Existing legacy crises retain records without retrospective penalties. Full equipment disposal, statutory liquidation distribution, board voting and viability checks remain open.

G07 restart increment: fresh takeover allowed only after liquidation, old company archived in the same Dexie transaction, latest archive export, read-only terminal command guard and difficulty hints. Three tests authored. Full rescue path viability for all difficulties, archive integration testing, equipment disposals and true creditor distribution remain open. G07 partial; no PASS or merge.

### G08 clock increment
Refactored elapsed planning and single-revision catch-up, in-place bounded simulation chunks, milestone evaluation at scheduler boundaries, bounded minimum-event scan, pure worker request/reply and chunked fallback when worker unavailable. Four tests authored, deferred. Worker proposal is not yet connected to persistence in this commit. Actual chunk parity, event ordering, worker precache and device performance remain unverified.

G08 persistence increment: actual worker bridge integrated into open/command/resume, stale proposals rejected at atomic commit, bounded receipts preserved, portable envelope and database checksums, three rotating backups and explicit newest-valid recovery. Four tests authored; real IndexedDB concurrent tabs, crash recovery, quota and platform import/export verification pending. Legacy raw saves still accepted. No gate pass.

G08 UI increment: visible return report and stale-tab recovery UI, visibility lifecycle routing, checksummed export controls and dedicated browser acceptance workflow. Eight unit tests plus browser workflow authored across G08, not executed here. Full worker/cache/device checks, storage quota, durable interrupted checkpoint, cross-platform save transfer, safe PWA update and long-run parity remain open. G08 partial; no later gate started, no merge.

### G09 engine increment
Four departmental authorities, real candidate command validation and actual ledger cash-debit limits, same-day CEO approval queue, assignment/availability checks, cash reserve/risk stops and persistent logs. Legacy saves retain records but require explicit redelegation. UI/tests and approval-time margin/price safeguards pending. No PASS.

G09 UI increment: assigned authority controls, company/department limits, CEO approval queue, emergency stop and execution history. Approval rechecks margin, quantity policy, repair need, actual ledger debit and all normal command constraints. Eight tests authored and existing manager test adapted. Verification deferred; broader authority scope, future scheduling budget reservations and comprehensive offline/approval tests remain open. G09 partial; no later gate started.

G09 final increment: stale procurement approval rejection, explicit expiration records and documented authority/limits. Ten tests authored total; all runtime evidence deferred. Current supported delegation covers four departments, not complete automated corporate coverage. Future budgeted scheduling, detailed qualification and additional risk/authority scope remain incomplete. No G10 execution.

G09 boundary review: stop on direct safety/permit/recall conditions at scheduler boundaries, corrected legacy test fixture audit, added three cases. Total 13 newly authored tests, unexecuted. No PASS.

### G10 PWA increment
Build-generated original PNG launcher icons (192/512/maskable), manifest and byte-hashed full dist precache including workers and public assets. Cache-first versioned app shell; failed install removes candidate cache; explicit waiting-worker activation, previous caches retained. Capacitor 8.0.0 baseline pinned for API 36 with matching plugins, not installed or tested here. Native and update UI integration follow. Cache pruning and multi-tab update compatibility remain open.

G10 platform adapter increment: native App lifecycle/back, portable save and report export via cache/share, existing file picker, native scheme config and safe areas, UI save-before-update and multi-window activation guard. Device behavior, plugin resolution, update event/race and native file transfer tests pending. No PASS.

G10 build increment: reproducible-in-intent native generation scripts and CI QA APK/unsigned AAB outputs, signature/target evidence, byte/hash budget audit and platform contract. No artifact generation claimed until CI/local evidence. Owner app ID/versionCode and signing, real device/transfer/update and lockfile verification remain open. No PASS.

G10 observed CI evidence: runs 45610920923 (web), 45610920864 (G08 browser), 45610920840 (Android) on 6dffa7985c051dfb9764dcaaa471973b4ca01a35 failed before build due to TS2367 in offline.ts and TS2307 in g06-regions.test.ts. Corrected both source anchors and added update activation timeout; rerun confirmation pending. No APK/AAB from those failed runs. No PASS.

### G11 release increment
Observed G10 74ed771: 118 tests pass, web and G08 offline acceptance pass, debug APK and unsigned AAB built and artifact hashes independently matched; browser smoke failed small-landscape takeover interception. Corrected stacking and added policy draft, store metadata/declaration checklist, exact lockfile promotion workflow, runtime license text generator, advisory audit workflow and local expected-certificate signing script. See G11_RELEASE_READINESS.md. Lock promotion/advisory/license runs, final build and signed AAB not yet verified. No gate PASS.

G11 lock promotion verified: run 45612480252 succeeded, c97d1d7 added exact 257-entry lockfile. Temporary write workflow removed, npm ci enforced in existing CI, source/asset and native packaging audit added. First audit failed before lock commit, rerun needed; G11 source build succeeded at d499d66. Signed artifact, final audit, native device and actual Play declarations pending. No PASS or merge.

### G12 baseline
Reopened G01–G11. Exact 3e474e1 CI: 118 tests, browser, worker and APK/AAB package audit pass; release dependency audit fails (runtime 1 critical; full 4 critical, 1 high, 1 moderate). Security upgrades and lock regeneration initiated, not verified. See G12_REMEDIATION.md. No merge.

G12 security lock resolution passed 118 tests and audit 0 vulnerabilities at 4367345 lock promotion; bot-triggered checks action_required, full rebuild required. Buyer reservation and contract lifecycle added; tests pending. No gate pass.

- G12 continuation baseline c952660: release audit 45614466081 passed, runtime/full npm audit both zero. Verify 45614465957 and Android 45614466012 failed TS2451/TS2339 (duplicate block-scoped c in recall handler). Browser and worker runs also failed. Renamed contract variable without changing accounting; fresh CI required. No new artifact verified.
