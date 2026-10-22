# Acetone–water distillation — approved prototype

**Status:** the owner approved the revised proposal with “Implement it”, then explicitly chose **equal amounts (50:50)** for the starting mixture. Implemented as a local experiment alongside filtration. This approval supersedes the earlier pending-review status; the rejected salt-solution/cooling-switch proposal remains historical.

## Approved objective and apparatus

Collect an acetone-rich distillate from an acetone–water mixture. Acetone is the desired recovered component; one simple distillation does not promise pure acetone.

Provide a feed beaker, empty distillation flask, still head, thermometer, Liebig condenser, two clamp stands, electric heater, two collecting beakers, two movable water hoses, supply tap and drain. The apparatus begins unassembled. All equipment is available, without target ghosts or correct-position guides.

Students drag, assemble, pour, connect water, open the tap and heat. Space toggles the selected practical action; ordinary buttons remain keyboard operable. Unsupported equipment falls, collides, tips and spills. Picking up an item disconnects its glass/clamp joints. Hose ends follow their connected fittings and can be dragged off again. Restart resets the attempt; Finish ends practical work and opens review.

## Cooling circuit and wrong actions

Both jacket ports accept supply or return hoses. Upper-port supply remains possible and operable. Lower/upper are determined by actual port elevations. A complete tap–jacket–drain circuit is needed for forced condensation.

The owner specifically requested reduced recovery with upper-port supply. This prototype represents that through reduced jacket filling and condensation, with additional process vapour entering an escaped-material pool. This is a qualitative representation, not a universal measured penalty for real top-fed condensers. Coolant never enters the process sample.

Missing glass connections, an open head, missing coolant, a missed receiver, overflow, tipping and direct transfer of feed remain possible. Both components are conserved across vessels, spills and escaped vapour. Recovery falls through actual material loss/uncollected material, without points deductions.

## Implemented model and explicit limits

The 50:50 feed uses **model mole amounts**: 0.5 acetone and 0.5 water. Both components are volatile. Ordinary pouring transfers the current mixture proportionally. Early vapour is acetone-enriched; continued removal changes the remaining liquid and vapour composition.

The qualitative relation is `y = αx / (1 + (α−1)x)`, using a tunable constant `α = 3`. It illustrates preferential vaporisation; it is not measured acetone–water equilibrium data and does not predict achievable laboratory purity.

Readable simulation defaults in `prototype/distillation-model.js`:

| Parameter | Prototype value |
| --- | --- |
| Warming / cooling rate | 0.13 / 0.055 normalised heat units per second |
| Boiling threshold | 1 normalised heat unit |
| Vaporisation rate | 0.075 model amount per second |
| Lower-fed / upper-fed jacket target | 1 / 0.35 |
| Jacket fill/drain rate | 0.6 per second |
| Full / partial jacket condensation efficiency | 0.94 / 0.48 |
| Open thermometer joint path fraction | 0.4 |

These implementation defaults are tunable qualitative approximations, not owner-selected numerical measurements, real experimental times or calibrated yield predictions. No numerical mixture boiling temperature is asserted. The thermometer indicates qualitative heat only. There is no pressure, entrainment, bumping, breakage or injury model. Jacket water and process water are separate.

Heat requires heater/flask contact; heat decays after switch-off or separation. Compatible glass joints and clamps attach on close alignment. Local rigid-body hitboxes represent solid equipment; insertion/contact exceptions represent opening clamps and mating glass joints. Constraints approximate the connected assembly. Hoses flex visually without tension or fluid dynamics. The movable heater begins on the bench with no connection.

## Completion and assessment

The student chooses when to Finish. Report **acetone recovery** (distilled acetone collected divided by initial acetone) separately from **composition** (acetone divided by total collected process liquid). Track distilled provenance so pouring feed directly into a receiver earns no recovery.

A result with actual distilled acetone and collected acetone fraction above the 50% feed opens the explanation question; there is no arbitrary minimum yield or purity target. Reduced-yield reversed-hose results remain reviewable and can succeed. Chemistry explanations appear after Finish.

**Why is the early distillate richer in acetone than the starting mixture?**

- **A.** Acetone is more volatile, so the vapour is enriched in acetone; cooling condenses that vapour. **Correct.**
- **B.** Water cannot enter the vapour at all.
- **C.** The condenser filters acetone molecules out of the liquid feed.

Allow retry without currency. Explain that both liquids can vaporise and recovery differs from purity.

## Navigation and local workflow

A bottom **Go to distillation** button enters from filtration; **Back to filtration** returns. Switching starts a fresh attempt, as stated beside the buttons. Use `npm start`; no accounts, backend, saving, analytics, remote runtime dependencies or publication.

## Curriculum boundary

The supplied IB Chemistry guide, first assessment 2025, published February 2023, names distillation in Structure 1.1.1 (printed p. 33 / PDF p. 39) and Tool 1 (printed p. 29 / PDF p. 35), in common SL/HL coverage. See [the verified mapping](../curriculum/separation-techniques.md).

The acetone–water example, hose mistake and qualitative model are owner-selected/supporting practical content, not a specifically prescribed IB experiment or quotations from the guide.

## Verification

Run `npm test` for both material models and physics regressions, and `npm run test:browser` for real Chromium mouse/Space playthroughs. Checks cover evolving two-component vapour, conservation, lower versus upper supply under identical conditions, disconnected/tap-off coolant, missed receivers, overflow, direct feed transfer, collisions/spills, assembly, question retry and fresh navigation. See [the prototype guide](../../prototype/README.md).

## History

The first proposal used salt solution and a cooling switch. The owner rejected it, requesting movable hoses and lower yield with upper-port supply, then selected acetone and water with acetone collected. The subsequent revised proposal was approved with “Implement it”. The follow-up composition answer explicitly selected 50:50. No other separation experiment or production artwork is authorised by this increment.
