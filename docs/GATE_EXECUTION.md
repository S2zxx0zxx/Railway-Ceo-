# Sequential release gate execution

Owner instruction: G01 is the only active gate. Complete and verify it before G02; then proceed in order through G12. Existing work related to later gates is retained, but is not a pass. Dependencies needed for the current gate may be addressed only to enable its acceptance. Keep all work on PR #1, feat/company-simulator-v3. Never merge on partial work. A blocker must be recorded and resolved before promoting the active gate. Continue independent work within that gate.

| Gate | Status | Acceptance from MASTER_BUILD_SPEC.md section 10 |
|---|---|---|
| G01 | ACTIVE / NOT PASSED | All D01–D25 and E01–E34 mapped to implementation or expressly approved deferral; every M01–M15 panel tested; no silent omissions |
| G02 | LOCKED | Pinned upstream commits, actual files, test evidence, dependencies/licenses, asset provenance |
| G03 | LOCKED | Original approved UI baseline, screenshots of all panels, layout, touch and focus |
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
