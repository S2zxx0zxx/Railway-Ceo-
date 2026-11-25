# Sequential release gate execution

Owner update: implementation may proceed in gate order on explicit owner command even if earlier tests or blockers are unresolved. Record incomplete scope and defer verification to the final remediation phase; never label it PASS. G03 is now active for implementation. G01–G02 remain incomplete; G04–G12 await owner instruction. Keep all work on PR #1, feat/company-simulator-v3. Do not merge until all gates pass. License/provenance permission remains a prerequisite to importing third-party material.

| Gate | Status | Acceptance from MASTER_BUILD_SPEC.md section 10 |
|---|---|---|
| G01 | PARTIAL / VERIFICATION DEFERRED | All D01–D25 and E01–E34 mapped to implementation or expressly approved deferral; every M01–M15 panel tested; no silent omissions |
| G02 | PARTIAL / VERIFICATION DEFERRED | Pinned upstream commits, actual files, test evidence, dependencies/licenses, asset provenance |
| G03 | ACTIVE IMPLEMENTATION / NOT PASSED | Original approved UI baseline, screenshots of all panels, layout, touch and focus |
| G04 | LOCKED | Balanced ledger, exactly-once posting, AR/AP/stock and financial reconciliation |
| G05 | LOCKED | Manufacturing, inventory, quality and resource constraints |
| G06 | LOCKED | Bounded markets, competition, reproducible events and economy |
| G07 | LOCKED | Viable rescue for each difficulty; recovery and liquidation |
| G08 | LOCKED | Offline parity, time anomalies, save integrity, migration and updates |
| G09 | LOCKED | Manager validation, budget, authority, stop conditions and decision evidence |
| G10 | LOCKED | Installable offline PWA, native APK device test, save transfer and no mandatory network |
| G11 | LOCKED | Signed AAB, metadata, Play policies, notices, no secrets or high-priority defects |
| G12 | LOCKED | Exact revision and final evidence, all gates passed, authorized merge |

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
