# Solution preparation and dilution — implementation review

The sixth local lab is [solution.html](../../prototype/solution.html). Run `npm start` and choose **Solutions & dilution** from any lab. No installation is required.

[Prepared workbench](../art/previews/solution-prepared.png) · [Calculation review](../art/previews/solution-review.png)

## What to try

1. Drag the weighing boat onto the digital balance and tare it. Select the spatula portion before dragging: 0.050, 0.010 or 0.001 g. Load it near NaCl, move above the boat, then Space deposits the portion.
2. Calculate the required mass from the objective. Transfer salt into the beaker; place the water bottle beside it to expose water buttons. Add water and use the rod to stir.
3. Fit the funnel near the stock flask mouth. Transfer the solution in discrete portions; rinse the beaker and funnel into the flask. Ordinary vessels and the funnel retain a model wet film.
4. Remove/store the funnel. Use bulk water additions to approach the mark, then 1 mL and 0.1 mL additions. Fit the stock stopper and select the flask to invert/mix.
5. Remove the stopper. Put the pipette tip inside the stock and fill it. Lift over the second flask and deliver. Make up to the mark and mix with its stopper fitted.
6. Finish shows actual volumes, dissolved salt and concentrations. Answer the concept question, mass calculation and dilution calculation. Incomplete preparations remain reviewable. An unverified/unmixed attempt receives a labelled supplied dilution example instead of a false measured result.

## Accessible pacing

Each Space press or action-button click transfers a finite portion and stops. Keeping a key down does not repeat. Coarse water delivery pauses at 95 mL; the small additions can exceed 100 mL, preserving the overfilling mistake without a reaction-time challenge. The pipette fills/delivers as a separate action. No timed stream or hidden countdown is involved.

## Checks and limits

Verification: `npm test` passes all 109 checks. `npm run test:browser` passes all eight suites, including the sixth lab and responsive layouts.

Model checks cover the full stock/dilution sequence, conservation including spills and retained films, balance tare, fine additions/overfill, incomplete dissolution, mixing provenance, partial aliquots, source identity, discarded-sample correction, storage and gravity/contact. The real Chromium walkthrough weighs 0.584 g, dissolves, transfers through the funnel, rinses, fills to volume, deliberately adds one 0.1 mL portion and waits, fits/removes stoppers, mixes, transfers the calibrated pipette aliquot and completes all three questions. It also checks incomplete Finish/restart. Existing lab/browser tests provide regression coverage. Layout tests include all six labs at desktop, wide and phone sizes.

Apparatus uses original functional SVG artwork in the existing palette. The model uses dilute-solution/additive-volume assumptions, ideal dry-solid transfer, qualitative stirring and a 0.2 mL retained liquid film; it is not a physical-property dataset or certified uncertainty model. It tracks the pipette's deliverable volume rather than modelling its extra internal tip volume. Detailed stratification, density changes, real meniscus/parallax errors and random instrument noise remain outside this increment.

No backend, accounts, analytics, saving or deployment was added.
