# Evaporation and salt recovery — bounded prototype

**Status:** the owner selected “Start with evaporation and salt recovery” after reviewing the L05 roadmap candidate. This authorises the bounded first evaporation lab. It does not approve the other roadmap labs or imply acceptance of the latest shared controls.

## Objective and scope

Recover dry sodium chloride residue in an evaporating basin from salt solution. Water leaves as vapour and is not collected. This is physical separation of a non-volatile solute from a volatile solvent, not water changing into salt.

Supply a salt-solution beaker, evaporating basin, electric heater and collecting beaker. All are available from the start and use the shared hover equipment drawer. The first recovery container is the basin itself. No new balance, weighing, scooping or mass-measurement interface is added.

Retain the existing local static HTML/CSS/JavaScript and Node workflow, functional SVG placeholders, clicking to select, dragging to move, Space actions, solid collisions, friction, gravity, contact-driven tipping, spills, storage, restart and Finish review. No target ghosts or single Run button.

## Practical actions

Students pour from a held vessel with Space, position the basin on the heater, and select/toggle the heater with Space or its action button. The heater warms the basin through actual contact. Moving the basin or heater remains possible. Clicking the heater only selects it.

Ordinary pouring transfers salt and water in their current proportions; pouring does not itself separate them. The simplified bulk-transfer model also allows pouring wet residue or loose dry salt into another vessel, or spilling it. Detailed settling, scraping and crystal adhesion are outside this increment.

A warm basin can continue evaporating briefly after switch-off through represented residual heat. Stored vessels cannot pour, receive flows or evaporate while hidden; storage retains their contents. Dry salt can spill if its basin tips.

## Material and heating model

Track water and salt separately in every vessel and spill, plus an evaporated-water pool. Salt does not enter the vapour pool. Material remains conserved even for misses, overflow, tipping and storage.

The starting feed is 0.8 model water amount plus 0.12 model salt amount. These are qualitative internal amounts, not a selected molarity, laboratory mass or calibrated concentration. Vessel capacities are 1.2 model total amount.

For the visible residue, the qualitative dissolved-salt capacity is 0.3 × remaining water amount. Salt beyond that amount is drawn as solid residue. If water remains, visible salt is labelled **wet salt residue**. Only after water is exhausted is it labelled **dry salt residue**. This is a readable state model, not measured sodium-chloride solubility, temperature-dependent solubility data or a nucleation/crystal-growth simulation.

Heating/cooling rates are 0.25/0.15 normalised heat units per simulation second. Evaporation starts at heat 0.8, at up to 0.08 water amount per second scaled by heat. Heat is bounded at 1. These rates are tunable implementation defaults, not experimental times, power ratings or a numerical boiling-temperature prediction. Cold ambient evaporation is omitted in this first bounded model.

No decomposition, bumping, spattering, breakage or injury model is introduced. The existing distillation temperature curve is not reused as an evaporation or solubility model.

## Allowed mistakes

- Pour beside a vessel or overfill it: both materials enter a tracked spill.
- Heat an empty basin, stop too early, or miss heater contact: keep the resulting state; do not force the correct sequence.
- Mistake visible wet residue for dry recovery: Finish reports it as incomplete.
- Pour feed directly into the collecting beaker: the solution remains a solution and does not count as dry recovery in the basin.
- Tip or move loaded equipment: track spilled or transferred salt and water.
- Store hot/loaded apparatus: retain its contents, stop hidden evaporation and switch a stored heater off.

## Finish, recovery and question

Finish stops practical work and switches heating off. Report vessel, spill and vapour distributions using labelled model amounts, not balance readings.

Success means the basin contains salt and no remaining water, within numerical precision. No arbitrary minimum recovery threshold is imposed. Dry salt recovery is basin salt divided by starting salt; wet residue earns no dry-recovery percentage. Salt remaining elsewhere is still accounted for.

**Why does salt remain when this solution is heated?**

- **A.** Water evaporates; the non-volatile sodium chloride stays behind. **Correct.**
- **B.** Salt evaporates; the remaining water changes into a new solid.
- **C.** Both substances evaporate; salt vapour then settles in the basin.

Allow retry without currency. Explain phase change and physical separation after submission. An incomplete attempt remains reviewable and restartable. No quantitative recovery calculation task is required from the student in this increment.

## Curriculum boundary

The supplied IB Chemistry guide, first assessment 2025, published February 2023, names evaporation in **Structure 1.1.1**, printed p. 33 / PDF p. 39, common SL/HL. Sodium chloride solution is the proposed L05 example selected through this roadmap step, not a prescribed IB experiment. Evaporation is not presented as equivalent to purification by recrystallisation.

See [the verified separation mapping](../curriculum/separation-techniques.md) and [roadmap evidence](../curriculum/lab-opportunities.md). No full private guide content is redistributed.

## Navigation and verification

All three earlier labs link to this experiment. It links back to filtration, distillation and paper chromatography. Switching starts a fresh attempt.

Model/physics tests cover salt and water conservation, vapour, wet versus dry residue, contact and switch-off, ordinary transfer, misses/overflow, storage, stable heater placement, dry-residue spills and reset/finished state. Real Chromium checks cover dragging, Space pouring/heating, visible wet/dry stages, recovery, question retry, incomplete review and navigation. Existing lab and drawer checks remain regression coverage.

## Three-question review

The current first-question prompt is retained with balanced shuffled choices. Two harder follow-ups now apply the concepts and require typed numerical work. All three must be correct. See [the full question inventory and solutions](review-questions.md); this supersedes earlier single-question completion descriptions.
