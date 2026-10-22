# Acetone–water distillation — approved prototype

**Status:** the owner approved the revised proposal with “Implement it”, then explicitly chose **equal amounts (50:50)** for the starting mixture. Implemented as a local experiment alongside filtration. This approval supersedes the earlier pending-review status; the rejected salt-solution/cooling-switch proposal remains historical.

## Approved objective and apparatus

Collect an acetone-rich distillate from an acetone–water mixture. Acetone is the desired recovered component; one simple distillation does not promise pure acetone.

Provide a feed beaker, empty distillation flask, still head, thermometer, Liebig condenser, two clamp stands, electric heater, two collecting beakers, a removable filling funnel, two movable water hoses, supply tap and drain. The apparatus begins unassembled. All equipment is available, without target ghosts or correct-position guides.

Students drag, assemble, pour, connect water, open the tap and heat. Space toggles the selected practical action; ordinary buttons remain keyboard operable. Unsupported equipment falls, collides, tips and spills. Picking up an item disconnects its glass/clamp joints. Hose ends follow their connected fittings and can be dragged off again. Restart resets the attempt; Finish ends practical work and opens review.

## Cooling circuit and wrong actions

Both jacket ports accept supply or return hoses. Upper-port supply remains possible and operable. Lower/upper are determined by actual port elevations. A complete tap–jacket–drain circuit is needed for forced condensation.

The owner specifically requested reduced recovery with upper-port supply. This prototype represents that through reduced jacket filling and condensation, with additional process vapour entering an escaped-material pool. This is a qualitative representation, not a universal measured penalty for real top-fed condensers. Coolant never enters the process sample.

Missing glass connections, an open head, missing coolant, a missed receiver, overflow, tipping and direct transfer of feed remain possible. Both components are conserved across vessels, spills and escaped vapour. Recovery falls through actual material loss/uncollected material, without points deductions.

## Implemented model and explicit limits

The 50:50 feed uses model amounts of 0.5 acetone and 0.5 water. Ordinary pouring transfers the mixture proportionally. Following the owner's 22 October correction, **this is an explicitly simplified two-stage model**: acetone alone vaporises at 56°C until depleted; the entire starting water amount remains in the flask while the temperature rises, and water starts vaporising only at 100°C. Switch-off or lost heater contact cools towards 20°C; vaporisation stops below the current component's boiling point. The display and material transfer use the same flask temperature.

This intentionally replaces the earlier constant-relative-volatility balance. It is **not a real acetone–water vapour–liquid equilibrium calculation** and does not predict mixture boiling temperature, composition or achievable purity. Both represented components remain conserved across the flask, distillate, spills and escaped vapour.

Readable simulation defaults in `prototype/distillation-model.js`:

| Parameter | Prototype value |
| --- | --- |
| Material-transfer thresholds | Acetone 56°C; water 100°C |
| Vaporisation rate | 0.075 model amount per second |
| Lower-fed / upper-fed jacket target | 1 / 0.35 |
| Jacket fill/drain rate | 0.6 per second |
| Full / partial jacket condensation efficiency | 0.94 / 0.48 |
| Open thermometer joint path fraction | 0.4 |
| Temperature display | 20°C ambient, 56°C plateau, 100°C upper limit |
| Display warming / cooling limit | 5 / 4°C per simulation second |
| End of acetone plateau | No remaining acetone above numerical tolerance |

These implementation defaults are tunable qualitative approximations, not owner-selected numerical measurements, real experimental times or calibrated yield predictions. The owner subsequently requested an analogue thermometer with a circular digital °C readout: 20°C initially, a 56°C acetone collection plateau, then a rise towards 100°C, and cooling towards 20°C after switch-off. This supersedes the original qualitative-only thermometer. It is a simplified teaching curve, not a prediction of the boiling temperature of a real acetone–water mixture. There is no pressure, entrainment, bumping, breakage or injury model. Jacket water and process water are separate.

Heat requires heater/flask contact; heat decays after switch-off or separation. Compatible glass joints and clamps attach on close alignment. Local rigid-body hitboxes represent solid equipment; insertion/contact exceptions represent opening clamps and mating glass joints. Constraints approximate the connected assembly. Hoses flex visually without tension or fluid dynamics. The movable heater begins on the bench with no connection.

## Completion and assessment

The student chooses when to Finish. Report **acetone recovery** (distilled acetone collected divided by initial acetone) separately from **composition** (acetone divided by total collected process liquid). Track distilled provenance so pouring feed directly into a receiver earns no recovery.

A result with actual distilled acetone and collected acetone fraction above the 50% feed opens the explanation question; there is no arbitrary minimum yield or purity target. Reduced-yield reversed-hose results remain reviewable and can succeed. Chemistry explanations appear after Finish.

**Why is acetone collected before water in this model?**

- **A.** Acetone boils first; the condenser cools its vapour to liquid. **Correct.**
- **B.** Water boils first; the condenser converts this water into acetone.
- **C.** Both boil together; the condenser filters only acetone from water.

Allow retry without currency. Explain that both liquids can vaporise and recovery differs from purity.

## Navigation and local workflow

A bottom **Go to distillation** button enters from filtration; **Back to filtration** returns. Switching starts a fresh attempt, as stated beside the buttons. Use `npm start`; no accounts, backend, saving, analytics, remote runtime dependencies or publication.

## Curriculum boundary

The supplied IB Chemistry guide, first assessment 2025, published February 2023, names distillation in Structure 1.1.1 (printed p. 33 / PDF p. 39) and Tool 1 (printed p. 29 / PDF p. 35), in common SL/HL coverage. See [the verified mapping](../curriculum/separation-techniques.md).

The acetone–water example, hose mistake and qualitative model are owner-selected/supporting practical content, not a specifically prescribed IB experiment or quotations from the guide.

## Verification

Run `npm test` for both material models and physics regressions, and `npm run test:browser` for real Chromium mouse/Space playthroughs. Checks cover both boiling stages, stopped flow below each threshold, filling through the removable funnel, conservation, lower versus upper supply under identical conditions, disconnected/tap-off coolant, missed receivers, overflow, direct feed transfer, collisions/spills, assembly, question retry and fresh navigation. See [the prototype guide](../../prototype/README.md).

## History

The first proposal used salt solution and a cooling switch. The owner rejected it, requesting movable hoses and lower yield with upper-port supply, then selected acetone and water with acetone collected. The subsequent revised proposal was approved with “Implement it”. The follow-up composition answer explicitly selected 50:50. No other separation experiment or production artwork is authorised by this increment.


## Temperature display revision

The circular digital badge remains above the analogue stem, follows it when moved and shares the analogue column's reading. It is an annotation rather than an extra rigid collision body. An assembled thermometer follows the flask temperature; detaching it cools its reading towards ambient. Heater contact is still required.

The display now follows the same temperature that gates vaporisation: warm from 20°C to 56°C, hold while acetone remains, rise towards 100°C after acetone depletion, then boil the remaining water. Switch-off or loss of contact cools towards 20°C. The earlier 10% tail transition and independent thermal-energy gate are superseded.

Use the removable funnel to fill the flask. Remove/store it before attaching the still head. Either component can be poured or spilled with the existing controls; coolant remains a separate circuit. Answer options are shuffled on each Finish, preserving marking and retry.

## Three-question review

The current first-question prompt is retained with balanced shuffled choices. Two harder follow-ups now apply the concepts and require typed numerical work. All three must be correct. See [the full question inventory and solutions](review-questions.md); this supersedes earlier single-question completion descriptions.

## Filling-funnel seating correction

The owner requested that the filling funnel drop into the round-bottom flask instead of balancing its tip on the rim. Its narrower stem now fits inside the neck with ordinary solid collisions. Release it above an upright supported flask: gravity lowers it until the cone meets the mouth, then a close-contact joint stabilises it with the stem inside. Releasing it high above the mouth does not snap it into position. The funnel can still be lifted out or stored before fitting the still head. Its liquid outlet routes into the neck interior, preserving both feed components.

Verification releases the funnel above the mouth, checks the fall, insertion depth and stable seating, lifts it out, and fills through it in the full browser playthrough. Other apparatus and laboratory physics are unchanged.
