# Upstream candidate audit — initial pin register

Repository metadata and root listing checked through GitHub API. These pins establish a review target, not completed adoption. No source copied yet.

| Candidate | Pinned commit | Reported license | Decision |
|---|---|---|---|
| ciefa/idle-game-template | a91cd5f8a26cdffd3f1803297c9a92c0a7f850c4 | MIT | inspect clock/save code; original foundation active |
| Splortch/Simcorp | b43880ec0b8a2f081b2b336b037df1128c237a59 | MIT | inspect economic tests and port compatible vectors |
| Jimimimi/economia | e5737e83b95651efe8920bad0c6f48ce5758ed12 | MIT | inspect agent pricing; original model active |
| TeamDay-AI/business-tycoon | 7da41dcb664088ba793c45d00df294915eb550aa | MIT | inspect recruitment/events/research; reject renderer |
| frappe/erpnext | 7a7afecef5f5844a0c4aa1853f1291923a85ae7d | GPL-3.0 | workflow reference only |
| LarrySnyder/stockpyl | 0bae176c9671ad73bbe1f2fbe34f503fdf48349d | MIT | inspect replenishment vectors |
| adamburmister/pluts | 171093c9f11ca5ce68090c41b8e5d133be724694 | not reported; no root LICENSE | no code reuse without permission |

Other metadata: shadcn/ui MIT; ReUI MIT; ECharts Apache-2.0; Dexie Apache-2.0; Capacitor MIT. Asset provenance, exact library dependency versions, full licenses, source-file audit and upstream test execution remain pending. No user-provided assertion substitutes for third-party license.

## Pinned source inspection checkpoint

Five candidates' root MIT license files were read at their pinned commits (not just repository metadata). Their complete notices must accompany any copied/ported code. No upstream code is introduced in this checkpoint.

| Candidate | License blob | Inspected implementation path | Compatibility decision |
|---|---|---|---|
| Idle Game Template | cb848cc6ff77a2d4e0b930ea34a7bbc82057301b | src/game/engine/offline.ts (62b5c3bf03c212cacc8da72d47d8ca59d5c1c89f); offline.test.ts (0b78d6a7e0e1880005f7ac53879a1d3436caf0c4) | Adapt bounded chunk/cap and online/offline parity patterns; keep single current scheduler; no combat or Tauri imports |
| SimCorp | 324fca513244f71fc70809ca057ea08f3e785459 | backend/simcorp/engine/simulation.py (d9259d96c4a3312b7804fda2c6da3d86f458ac99) | Evaluate demand, distress and daily advance vectors against integer-paise engine; no Python/SQLite runtime or float ledger |
| Economia.js | 5dcb9dbf36d8aa8d00bdca4041c26dc8f64ba66c | src/Economy.js (032bec7da11eff9b7858d1e88919ee25ab3cbcbf) | Evaluate market-agent mechanisms; do not introduce separate market state or old build toolchain |
| TeamDay | 54b4b57836dccbe8c0aee88ed3bd02910a8f45a8 | src/economy.js (8c1ba903f59331638486f2d5e4efbf50d62458b2); src/events.js (09668906b14d26cc6ac9390b803eac637268a6ea) | Adapt workforce quality/cost and causal event patterns, not DOM-bound event modals, AI subscription economics or renderer |
| Stockpyl | 8a27c6c156cffda5075eaf9ac3038d5330c84e3c | src/stockpyl/eoq.py (7a4ceb9ad557ddcde3b23246b9a47ab82f616362) | Compare EOQ/EPQ mathematical vectors; no Python runtime |

Pluts: recursive pinned tree confirms domain ledger and unit tests but no root LICENSE; no code reuse approved. ERPNext remains workflow reference only. Full transitive dependency and asset provenance audit, actual candidate smoke execution, golden-vector comparisons, and direct adoption decisions remain pending. RV-002 and RV-003 must not be marked verified.


## G02 implementation checkpoint
- Idle Game Template: adapted the elapsed/cap/anomaly planning fragment from pinned `src/game/engine/offline.ts` into `src/engine/elapsed.ts`; `catchUp` calls it. Full original MIT notice preserved in `docs/third-party/idle-game-template-LICENSE.txt`. No upstream state or tick runtime, and no skill-only uncapped progress. Tests authored in `tests/g02-elapsed.test.ts`; execution deferred.
- ERPNext: pinned `license.txt` blob f288702d2fa16d3cdf0035b15a9fcbc552cd88e7 confirms GPL-3.0. Work order blob d555cfe06fa25bed690cead31c31e60e9ee1ef18 and purchase receipt blob 9ad9c7a8394b35c919d019194e1aa071436070f1 identify Frappe-coupled GPL modules. Reference workflows only; no source imported.
- Pluts: pinned README blob 066355c1472b972dc5e7d42d4e40f2006b7c494b and package.json blob b7c43cce66c0ab781f6ea59143901b0c3af4c5498 declare MIT; ledger blob 466abd1081dc9c9b56321637677591cdd65449b2 has repository/schema dependencies. Full notice not located; retain original ledger and no direct code import pending clearance.
- Economia: inspected resolveOffers/shuffle in pinned Economy.js; direct matching lacks a bid>=ask check and uses Math.random. Reject direct engine import; retain deterministic independent model; later market implementation must enforce clearing and conservation.
- TeamDay: getWorkforceQuality/calculateFunnel depend on global G, map and event state; reference bounded workforce/marketing concepts only; no incompatible UI or SaaS funnel imported.
- `npm run audit:resources` produces installed-resolution license/integrity/file-hash inventory and hashes known SVG assets. It is not an approval or vulnerability scan. Lockfile and actual audit output still pending; no third-party art downloaded or approved here.

- SimCorp `calculate_product_demand` uses a cost-based fair price, bounded elasticity, quality/reputation and seeded random noise. Its distress thresholds are absolute currency amounts. Do not substitute these parameters into the current INR game without scenario calibration; no Python code imported. Preserve existing single engine and record demand calibration under G06.
- The adapted MIT notice is present under `public/licenses/` for web and Android packaging; final bundle inclusion verification remains deferred.
