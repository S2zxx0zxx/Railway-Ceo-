# G09 delegated management contract

One hired manager can be assigned to one department; one assignment per department. Operator employees cannot receive manager authority. Skill >=60, morale >=20, present and fatigue <70 required when executing.

- Procurement: standard supplier only, prepaid, target based on batch size times reorder batches; account for available stock, incoming shipments and physical storage constraints.
- Production: daily review starts an immediate normal production command if the line, audit, stock and existing plans allow. Does not schedule future unattended spending.
- Maintenance: at most one lowest-condition available machine per daily review, below configured threshold; actual repair validation still applies.
- Sales: released unexpired goods, local cash sale, demand and contribution floor (pooled cost plus freight). No quality override or credit.
- Finance: global daily cap (default Rs 25,000), department daily cap and approval threshold (UI suggested Rs 15,000 and Rs 5,000), minimum operating cash (existing Rs 50,000 default). Integer paise actual gross cash debits of candidate command; candidate is discarded if any authority or budget check fails. No new loan, payroll, tax, asset disposal or debt authority. Caps are provisional scenario defaults.
- CEO approval: same-day only, single-use; reject, disable, reassignment or policy edit invalidates requests. Recompute current need, costs, margin and constraints; never approve a debit greater than original estimate. Neither an approval nor multiple assignments can bypass company or department caps.
- Risk stop: default/restructuring, liquidation, unresolved safety/compliance/recall crises and reserve breach disable new delegated decisions; explicit CEO enable required. Previously committed jobs remain subject to normal scheduler safeguards. No promise of background activity while closed.
- Persistent records: latest 1,000 decisions, up to 16 pending approvals, day counters and assignments in Game snapshot. Legacy generic automation requires explicit assignment before enabling; no previous journals modified. The latest 40 decisions are displayed.
- Scheduler uses same apply() commands, shared PRNG, ledger and G08 snapshot commit path. No independent manager database or autonomous worker writer.
- Remaining: future scheduled manager work orders with reserved budgets and revalidation at start, additional finance/HR/marketing authority (not automatically granted), manager progression and individualized qualifications, per-region sales, exhaustive tests and tuning. Current cap/approval choices are intentionally conservative and not owner-verified. No gate pass.
