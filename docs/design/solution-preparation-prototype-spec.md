# Solution preparation and dilution — first prototype

## Status and authority

The owner selected L07: “Start with solution preparation and dilution”. They pointed out that the potassium-nitrate/sand recrystallisation activity already covers the combined separation sequence; a separate salt-and-sand lab is not the next step.

The activity is selected. The concrete recipe, new instrument controls and numerical assumptions below are proposals awaiting review under AGENTS.md, not recorded owner answers. This specification makes the first implementation step reviewable before those choices are encoded.

## Proposed task

Prepare **100.0 mL of 0.100 mol dm⁻³ sodium chloride solution**, then transfer **10.00 mL** of that stock to a second **100.0 mL** volumetric flask and dilute to the mark. The diluted target is **0.0100 mol dm⁻³**.

Provide M(NaCl) = 58.44 g mol⁻¹. The calculated stock mass is 0.5844 g; a balance reading of 0.584 g gives approximately 0.0999 mol dm⁻³. Keep that rounding visible in the model and review rather than silently substituting the exact target. Students calculate the mass; the objective does not supply the answer.

All apparatus is available from the shared drawer: solid NaCl bottle, spatula, weighing boat, digital balance, dissolving beaker, stirring rod, funnel, water wash bottle, two labelled volumetric flasks, stoppers, 10.00 mL volumetric pipette with filler, and a waste beaker. No heater is needed.

## Student-operated sequence and proposed controls

1. Place the boat on the balance and press its Tare control. Read grams to 0.001 g. Moving the boat off the pan removes its reading; taring is a display offset, not a change in material mass.
2. Drag the spatula to the salt bottle; Space loads a small portion. Above the boat or another vessel, Space releases it. A held fine-addition control permits approaching the target without an automatic correct-mass button. Material removed from the finite bottle remains in the boat, other vessels, on the spatula or in spills.
3. Pour salt into the beaker, add water with the wash bottle, and stir using the rod and Space. Dissolving changes solid to dissolved solute without changing total solute. The model uses an explicitly qualitative stirring rate for these dilute preparations; it does not claim a measured solubility curve.
4. Assemble the funnel over the stock flask and pour. Rinse the boat, beaker and funnel into the flask using the wash bottle. Residual material and rinse transfers are represented explicitly, so omitting a rinse can leave solute behind.
5. Remove the funnel and add water near the calibration mark. Space toggles water delivery; a fine-delivery control adds drops. Display an enlarged meniscus view when the flask is selected, with the bottom of the meniscus and calibration line. It must be possible to overfill.
6. Fit the stopper and use Space to invert/mix. Stoppering blocks pouring. Inversion requires a fitted stopper and dissolved solute; it records homogenisation without moving material out of the flask.
7. Use the pipette/filler to take 10.00 mL from the stock, deliver into the second flask, add water to its mark and mix. The student operates filling and delivery; no mouth-pipetting action. Filling the pipette requires its tip in liquid. Early stopping can leave a partial aliquot; the bulb has a clear full-volume mark.

Retain click/drag placement, Space action toggling, gravity, friction, solid contacts, contents-preserving storage, Restart and Finish. No placement ghosts or automatic correction of wrong setups. Put links to the new lab in every existing lab and reciprocal links in the new one. Keep the current large-workbench layout and drawer position.

## Quantities and mistakes

Track solute mass in grams and solution volume in mL in every vessel, pipette, retained transfer residue and spill. Concentration follows dissolved moles divided by final solution volume, never water added alone. Assume constant room temperature and additive transferred solution volumes for this bounded dilute-solution model. No evaporation or chemical reaction.

Represent a small, documented liquid film left after draining glassware; washing transfers that film with its proportional solute. The pipette is calibrated to deliver its stated volume while retaining its final tip film; do not require blowing that film out. Avoid silently treating it like an ordinary beaker.

Supported mistakes include weighing without taring, using the wrong mass, incomplete dissolution, transfer loss, missing rinses, overfilling, incomplete mixing, and a wrong or partial aliquot. Removing excess mixed solution does not restore an overfilled flask to the intended concentration. Wrong attempts remain reviewable.

The first version records whether the stock was mixed before pipetting; it must not report an unmixed aliquot as a verified homogeneous sample. Detailed fluid stratification, parallax, temperature correction and random instrument errors are deferred. Display resolution is not presented as a full uncertainty calculation.

Proposed practical acceptance: each final volume within 0.10 mL of 100.0 mL, each concentration within 1% of its target, no undissolved solid in accepted products, and both preparations mixed. These are game tolerances, not certified glassware specifications. Review reports actual quantities even when the target is missed.

## Three-question review

1. Concept: why make up to a final solution volume rather than add that volume of water? Use balanced-length shuffled choices and retry.
2. Calculation: required NaCl mass for the stock using n = cV and m = nM. Accept 0.584–0.585 g, with units explicit; explain precision and the 0.5844 g unrounded value.
3. Harder calculation: using the attempt’s measured dissolved solute, final stock volume, delivered aliquot and final dilution volume, calculate the diluted concentration. Require typed numerical work using c₂ = c₁V₁/V₂. For unmixed or undissolved attempts, use a clearly labelled supplied homogeneous example instead of claiming a reliable aliquot composition.

Separate practical completion from conceptual correctness. Do not add rewards, scores or student-data collection.

## Curriculum basis

The owner-supplied IB Chemistry guide, first assessment 2025, published February 2023: Structure 1.4.3, printed p. 36 / PDF p. 42 (molar mass), and Structure 1.4.5, printed p. 37 / PDF p. 43 (concentration and links to standard solutions/dilution), common SL/HL. See [the verified opportunity mapping](../curriculum/lab-opportunities.md) and [source status](../curriculum/README.md). This NaCl recipe and equipment behaviour are project proposals, not an IB-prescribed experiment.

## Implementation and verification plan

First implement a quantitative material model, independently of artwork: tare/display, solid transfer/dissolution, proportional liquid transfer, retained films/rinsing, volumetric filling, homogeneous aliquots and dilution. Test solute and volume conservation including storage, spills, incomplete transfers and restart; explicitly test overfill followed by removal.

Then add matching apparatus art, hitboxes and controls to the existing local Node-served browser prototype. Verify a full real mouse/Space preparation and dilution, wrong mass/tare, overfill, partial aliquot, contents-preserving storage, three-question retry and navigation. Extend responsive layout coverage to the sixth lab and run existing lab regressions. No dependency installation, backend or publication is part of this increment.
