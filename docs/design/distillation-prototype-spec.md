# Simple distillation — concrete prototype proposal

**Status: distillation and a temporary bottom-of-page navigation button are requested; the new apparatus, heating/cooling model and completion question below are proposed for owner review before coding.** This is the next experiment alongside the existing filtration activity, not a replacement for it.

## Already selected by the owner

- Simple distillation of salt solution to collect water, recorded in S01.
- Add this experiment now using the current interaction principles.
- Use a button at the bottom of the page to enter distillation; a more complete navigation system comes later.
- All required apparatus is available from the outset. Students arrange and operate it themselves, without correct-position guides.
- Retain mouse dragging, solid equipment/stand hitboxes, gravity, contact-driven tipping and spilled contents. Space toggles the selected object's practical action. Movement shortcuts remain removed for now.
- Keep the local Node.js/static-browser workflow and clearly labelled functional placeholder artwork.

## Source boundary

The supplied IB Chemistry guide, first assessment 2025, published February 2023, names distillation in Structure 1.1.1 (printed p. 33 / PDF p. 39) and Tool 1 (printed p. 29 / PDF p. 35), in common SL/HL coverage. See [the verified mapping](../curriculum/separation-techniques.md). The specific salt-solution example is owner-selected. The implementation details below are proposals, not syllabus quotations or claims that this prototype covers all IB practical skills.

## Proposed task and apparatus

**Objective:** “Collect water from the salt solution by simple distillation.”

Start with an aqueous salt solution in a source beaker. Supply an empty distillation flask, still head, thermometer, Liebig condenser, two stands with compatible clamps, an electric heater and two empty collecting beakers. Apparatus begins unassembled. There are no shop locks or consumable limits.

The student pours the solution into the flask, assembles and supports the apparatus, positions a receiver, turns cooling on and applies heat. The apparatus has an open collection path rather than a sealed receiver.

Connections use compatible glass joints and physical contact/alignment; they do not check an answer-key layout. Stand clamps support the apparatus at compatible contact positions. The flask, condenser and collecting vessel remain separate objects. Selecting an item outlines that item only; no target ghosts reveal the solution.

## Proposed controls

- Drag to hold/move an object; release it to place or connect it. Unsupported equipment falls and can collide, tip and spill.
- Select a liquid-containing vessel and press Space to start/stop pouring while positioning it with the mouse, as in filtration.
- Select the electric heater and press Space, or click its action button, to turn heating on/off.
- Select the condenser and press Space, or click its action button, to turn cooling water on/off.
- **Cooling simplification to approve:** this toggle represents a laboratory cold-water circuit through the condenser jacket. Movable hose routing, water taps and plumbing are deferred; do not depict a disconnected condenser as cooling itself without identifying this model.
- Restart resets the current experiment. Finish ends its practical attempt and reviews the observed result.

## Proposed material and thermal model

Represent liquid water and dissolved, non-volatile salt separately. Ordinary pouring transfers the solution, including its salt; it does not separate it. Represent salt in the liquid, not as the insoluble sand particles from filtration. If all water leaves the flask, the remaining salt is residue; crystallisation detail is outside this task.

Use a qualitative warming/boiling/cooling model, without numerical temperature readings, calibrated heat rates or an exact concentration/boiling-point calculation. Heat acts through physical heater/flask contact. The thermometer can occupy the vapour path; its display is qualitative in this increment.

When heated sufficiently, water changes to vapour while salt remains in the boiling vessel. Vapour follows the connected glass path. With cooling on, water condenses in the condenser and exits through its outlet. It collects only if a receiving opening is underneath. Water and salt must be conserved across vessels, liquid spills, apparatus hold-up and escaped vapour.

**Scientific simplifications to approve:** neglect passive air condensation, detailed heat transfer, boiling-point elevation, entrainment, bumping and pressure dynamics. Heating/condensing proceeds at readable prototype speeds, not real laboratory times. No explosions, breakage, injuries, scores or penalties are added. This is a qualitative separation model, not a real-lab procedure simulator.

## Physically possible wrong actions

- Heat with no connected condenser: water vapour escapes, leaving salt behind.
- Keep condenser cooling off: vapour passing through is not recovered as liquid under this simplified model.
- Miss the collecting vessel or overflow it: condensed water spills.
- Pour salt solution straight into a collecting beaker: the salt transfers too; no separation occurs.
- Put the heater away from the flask or turn it off: the action is allowed, but it does not supply heat to that flask. Residual warming/cooling continues qualitatively rather than boiling stopping instantaneously.
- Disconnect, move or tip equipment during use: physical connections and supported contents update; tipped liquid/material transfers into a receiver or spill state rather than disappearing.

Changing the setup is not blocked because it is wrong. Outcomes remain visible, with chemistry explanations reserved for Finish. Control instructions and selected equipment names remain available throughout.

## Proposed completion and explanation

Success requires some water collected by condensation in a collecting vessel, no salt in that collected water, and all initial salt retained in the distillation flask. Directly poured source solution cannot count as distilled water. Salt lost to a spill makes recovery incomplete. Water-only spills and escaped vapour are reported but do not automatically fail a successful separation. Complete recovery of all initial water is not required, and running the flask dry is not required.

If incomplete, show the actual locations of water and salt and offer Restart, without an automatic step-by-step solution.

If successful, ask:

**Why can water be collected separately from the salt?**

- **A.** Water vaporises and then condenses, while the non-volatile salt remains in the flask. **Correct.**
- **B.** The condenser filters dissolved salt particles out of the liquid solution.
- **C.** Heating changes salt into water.

After submission, explain the evaporation/condensation distinction and the retained non-volatile salt. A wrong answer permits retry. No currency is awarded in this increment.

The success criterion, wording and distractors are proposed assessment content requiring the owner's review.

## Temporary navigation

A **Go to distillation** button appears at the bottom of the filtration page. Distillation has a **Back to filtration** button at the bottom. Each destination starts a fresh attempt; the button text states that switching resets the current attempt. There is no save file, account, map or room navigation. This explicitly temporary mechanism can be replaced later.

## Acceptance and verification

1. Filtration still starts, plays and finishes as before; the bottom button opens distillation.
2. All distillation apparatus is available, with separate controllable actions and no correct-position guides.
3. Solid shapes prevent visible interpenetration; compatible joints, clamp contacts and openings remain usable.
4. A complete mouse/Space workflow transfers solution, heats, transports vapour, condenses water and collects it separately from salt.
5. Cooling-off, disconnected, missed-receiver, overflow, direct-transfer and tipped-content cases remain possible and follow the represented state.
6. Water and salt are conserved, including escaped vapour; reset and switching produce clean initial states.
7. No action-by-action chemistry hint or success marker appears before Finish.
8. The approved explanation question follows successful practical separation.
9. The local `npm start` and VS Code run task continue working without installation, accounts, analytics or publication.

Use meaningful material/thermal and collision regression tests, then an actual Chromium playthrough of both experiments, switching, wrong setups and the explanation. Visually review apparatus support, joints, flows and outcomes.

## Review boundary

The owner's latest request authorises adding distillation and the temporary button. It does not resolve the newly proposed heating/cooling model, apparatus detail, success criterion and question. Review this concrete increment before implementing that new chemistry behaviour, following the project's existing owner-decision rules.
