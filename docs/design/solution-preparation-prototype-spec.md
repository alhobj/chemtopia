# Solution preparation and dilution — first prototype

## Status and authority

The owner selected L07: “Start with solution preparation and dilution”. They pointed out that the potassium-nitrate/sand recrystallisation activity already covers the combined separation sequence; a separate salt-and-sand lab is not the next step.

The owner approved this recipe and procedure with “Yes”, adding that pouring must be easy for non-gamers and must not depend on millisecond timing. The bounded local implementation is authorised. Numerical instrument tolerances and simulation coefficients below are implementation defaults, not certified apparatus specifications.

## Selected task

Prepare **100.0 mL of 0.100 mol dm⁻³ sodium chloride solution**, then transfer **10.00 mL** of that stock to a second **100.0 mL** volumetric flask and dilute to the mark. The diluted target is **0.0100 mol dm⁻³**.

Provide M(NaCl) = 58.44 g mol⁻¹. The calculated stock mass is 0.5844 g; a balance reading of 0.584 g gives approximately 0.0999 mol dm⁻³. Keep that rounding visible in the model and review rather than silently substituting the exact target. Students calculate the mass; the objective does not supply the answer.

All apparatus is available from the shared drawer: solid NaCl bottle, spatula, weighing boat, digital balance, dissolving beaker, stirring rod, funnel, water wash bottle, two labelled volumetric flasks, stoppers, 10.00 mL volumetric pipette with filler, and a waste beaker. No heater is needed.

## Student-operated sequence and controls

1. Place the boat on the balance and press its Tare control. Read grams to 0.001 g. Moving the boat off the pan removes its reading; taring is a display offset, not a change in material mass.
2. Drag the spatula to the salt bottle; Space loads a small portion. Above the boat or another vessel, Space releases it. A selectable fine portion permits approaching the target without an automatic correct-mass button. Material removed from the finite bottle remains in the boat, other vessels, on the spatula or in spills.
3. Pour salt into the beaker, add water with the wash bottle, and stir using the rod and Space. Dissolving changes solid to dissolved solute without changing total solute. The model uses an explicitly qualitative stirring rate for these dilute preparations; it does not claim a measured solubility curve.
4. Assemble the funnel over the stock flask and pour. Rinse the boat, beaker and funnel into the flask using the wash bottle. Residual material and rinse transfers are represented explicitly, so omitting a rinse can leave solute behind.
5. Remove the funnel and add water near the calibration mark. Space or the Add button delivers one finite portion; each 1 mL or 0.1 mL press adds once and stops. Bulk additions to a flask pause at 95 mL. Fine additions can cross the mark, so overfilling remains possible. Holding Space does not repeat additions. Display an enlarged meniscus view when the flask is selected, with the bottom of the meniscus and calibration line. It must be possible to overfill.
6. Fit the stopper and use Space to invert/mix. Stoppering blocks pouring. Inversion requires a fitted stopper and dissolved solute; it records homogenisation without moving material out of the flask.
7. Use the pipette/filler to take 10.00 mL from the stock, deliver into the second flask, add water to its mark and mix. The student operates filling and delivery; no mouth-pipetting action. Filling the pipette requires its tip in liquid. Early stopping can leave a partial aliquot; the bulb has a clear full-volume mark.

Retain click/drag placement, Space action toggling, gravity, friction, solid contacts, contents-preserving storage, Restart and Finish. No placement ghosts or automatic correction of wrong setups. Put links to the new lab in every existing lab and reciprocal links in the new one. Keep the current large-workbench layout and drawer position.

## Quantities and mistakes

Track solute mass in grams and solution volume in mL in every vessel, pipette, retained transfer residue and spill. Concentration follows dissolved moles divided by final solution volume, never water added alone. Assume constant room temperature and additive transferred solution volumes for this bounded dilute-solution model. No evaporation or chemical reaction.

Represent a 0.2 mL liquid film left after draining ordinary vessels and in a fitted funnel; washing transfers that film with its proportional solute. Dry solid transfer is idealised and does not add an arbitrary dry-residue loss. The pipette model tracks calibrated deliverable volume, up to 10.00 mL; its uncalibrated internal capacity and tip film are not separately simulated. Do not require blowing out a final tip film. Avoid silently treating it like an ordinary beaker.

Supported mistakes include weighing without taring, using the wrong mass, incomplete dissolution, transfer loss, missing rinses, overfilling, incomplete mixing, and a wrong or partial aliquot. Removing excess mixed solution does not restore an overfilled flask to the intended concentration. Wrong attempts remain reviewable.

The first version records the stock volume before sampling and the source/volume of pipette deliveries. After sampling, the stock table shows its remaining volume, not an erroneous demand to refill it to 100 mL. It records whether the stock was mixed before pipetting; it must not report an unmixed aliquot as a verified homogeneous sample. Detailed fluid stratification, parallax, temperature correction and random instrument errors are deferred. Display resolution is not presented as a full uncertainty calculation.

Practical acceptance: stock volume before sampling and final dilution volume within 0.10 mL of 100.0 mL, a 10.00 mL stock aliquot within 0.02 mL, each concentration within 1% of its target, no undissolved solid in accepted products, and both preparations mixed. These are game tolerances, not certified glassware specifications. Review reports actual quantities even when the target is missed.

## Three-question review

1. Concept: why make up to a final solution volume rather than add that volume of water? Use balanced-length shuffled choices and retry.
2. Calculation: required NaCl mass for the stock using n = cV and m = nM. Accept 0.584–0.585 g, with units explicit; explain precision and the 0.5844 g unrounded value.
3. Harder calculation: using the attempt’s measured dissolved solute, final stock volume, delivered aliquot and final dilution volume, calculate the diluted concentration. Require typed numerical work using c₂ = c₁V₁/V₂. For unmixed or undissolved attempts, use a clearly labelled supplied homogeneous example instead of claiming a reliable aliquot composition.

Separate practical completion from conceptual correctness. Do not add rewards, scores or student-data collection.

## Curriculum basis

The owner-supplied IB Chemistry guide, first assessment 2025, published February 2023: Structure 1.4.3, printed p. 36 / PDF p. 42 (molar mass), and Structure 1.4.5, printed p. 37 / PDF p. 43 (concentration and links to standard solutions/dilution), common SL/HL. See [the verified opportunity mapping](../curriculum/lab-opportunities.md) and [source status](../curriculum/README.md). This NaCl recipe and equipment behaviour are project choices, not an IB-prescribed experiment.

## Implementation and verification

First implement a quantitative material model, independently of artwork: tare/display, solid transfer/dissolution, proportional liquid transfer, retained films/rinsing, volumetric filling, homogeneous aliquots and dilution. Test solute and volume conservation including storage, spills, incomplete transfers and restart; explicitly test overfill followed by removal.

Then add matching apparatus art, hitboxes and controls to the existing local Node-served browser prototype. Verify a full real mouse/Space preparation and dilution, wrong mass/tare, overfill, partial aliquot, contents-preserving storage, three-question retry and navigation. Extend responsive layout coverage to the sixth lab and run existing lab regressions. No dependency installation, backend or publication is part of this increment.

## Non-gamer delivery revision

No new-lab action runs a continuous liquid stream. Pour transfers at most 10 mL per press (or 0.050 g dry solid); coarse water additions are at most 10 mL and stop at 95 mL in a flask. The final additions are explicit 1 mL and 0.1 mL steps. The spatula has a persistent portion selector (0.050, 0.010 or 0.001 g) that can be chosen before dragging. Filling/delivering the pipette is discrete. Students can pause between actions without changing the amount. Existing labs retain their approved controls.

The variable named `water` in the shared-style model is liquid/solution volume in mL, not a measured water mass. Transferred solution volumes are additive; solute-induced volume changes and density are not simulated. This is a dilute-solution approximation and cannot teach volume contraction or expansion. No instrument uncertainty simulation is claimed. See [the implementation review](solution-preparation-prototype-review.md).
