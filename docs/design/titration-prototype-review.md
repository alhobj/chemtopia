# Acid–base titration — implementation review

Run `npm start` and select **Titration**, or open `titration.html`. This is the seventh local workbench. No dependency installation is needed.

[Endpoint workbench](../art/previews/titration-endpoint.png) · [Immersed pH probe](../art/previews/titration-ph.png) · [Calculation review](../art/previews/titration-review.png)

[Unsuitable indicator example](../art/previews/titration-wrong-indicator-ph.png) · [Weak–weak example](../art/previews/titration-weak-weak-ph.png)

## Current student choices

Choose **Acid** (HCl/CH₃COOH), **Base** (NaOH/NH₃) and the **Unknown sample** role independently. Reagent/role changes restart the attempt; Restart retains all three choices. The earlier automatically paired sample menu is superseded.

Every attempt offers separate **bromothymol blue**, **phenolphthalein** and **methyl red** droppers in Equipment. Choose any, omit them, or add several. Nothing selects the appropriate indicator for you. Choosing a different dropper does not replace the dye already in a vessel.

All four acid/base pairs work in either direction. A weak–weak pairing is allowed; its gradual pH change makes visual endpoint detection unreliable with the available indicators. The review explains this after the attempt. Wrong-indicator colour changes and their biased titre calculations remain visible and reviewable.

Near-stoichiometric delivery and a reliable visual endpoint are reported separately. The current post-attempt indicator assessment uses the model pH jump within ±0.10 mL of equivalence as a prototype criterion; it is not a universal or IB-certified precision rule. Mixed dye colour is qualitative, not a measured spectrum.

## Earlier paired sample version

Use the **Sample** selector for HCl, CH₃COOH or NH₃. Changing sample starts a fresh attempt; Restart keeps the selection. CH₃COOH uses NaOH and phenolphthalein. NH₃ uses HCl and methyl red. The pH probe works with all three. Labels, objective, reaction and review questions update together. Weak-sample work is labelled as an AHL extension.

[CH₃COOH pH reading](../art/previews/titration-acetic-ph.png) · [NH₃ pH reading](../art/previews/titration-ammonia-ph.png) · [CH₃COOH review](../art/previews/titration-acetic-review.png) · [NH₃ review](../art/previews/titration-ammonia-review.png)

Weak reagents use actual dissociation/buffer/conjugate-species equilibria. Their equivalence points are not forced to pH 7: the current example gives about 8.70 for CH₃COOH and 5.30 for NH₃. See [the equilibrium reference](../curriculum/weak-titrations.md).

## Original HCl practical walkthrough

1. Retrieve the burette into an open space, bring it near the stand clamp and press Space to attach. Retrieve the funnel and fit it near the burette mouth.
2. Bring the NaOH bottle beside the upper part of the burette and press Space to fill in finite portions. Remove/store the funnel. The bottle's fill action abstracts tilting into the funnel; there is no timed stream.
3. Place waste under the tip and release a small portion until the tip bubble is gone (one 1 mL addition is sufficient). Record the actual initial reading; it need not be zero. Slide waste aside and slide the conical flask underneath along the bench. The tip is above the flask mouth, leaving room to move the flask.
4. Fill the 25.00 mL pipette from the unknown acid, lift over the flask and deliver. Add bromothymol blue with the dropper. Neither the true acid concentration nor an endpoint target volume is shown during practical work.
5. Deliver NaOH in 1 mL portions, then 0.1 mL or single 0.05 mL drops. Select the flask to swirl before reading its colour. Place the pH probe through the open neck and immerse its tip for a numerical reading. The flask neck leaves room for the probe beside the burette.
6. Record the final reading as a trial. Repeat with a fresh aliquot if desired: empty into nearby waste, rinse and prepare another sample. Finish reviews recorded readings and opens the three questions.

Space and buttons make **one addition and stop**. Holding Space does not repeat. Waiting after a drop cannot continue delivery. Extra additions can overshoot. Apparatus still has solid contacts, gravity and friction; tools must be moved around other glassware, not through it. Drawer storage preserves contents, including liquid in the burette tip.

## Chemistry and supported mistakes

The first example uses a hidden 0.0800 M HCl stock, a 25.00 mL aliquot and 0.100 M NaOH, with 20.00 mL at equivalence. The initially empty tip takes 0.20 mL from the barrel before corresponding liquid reaches the receiver. Students must prime before taking the initial reading to avoid a biased titre. A water-diluted titrant retains its changed composition. Wrong transfers, missed receivers and spills remain material pools rather than arbitrary penalties.

The model tracks volume plus analytical acid/base equivalents; a stable strong-acid/strong-base calculation gives pH at 25 °C. Colours represent a qualitative bromothymol-blue transition, not exact equivalence or a spectral model. A mixed indicator endpoint and stoichiometric equivalence are distinguished in review. Receiving-flask water does not change acid moles in a measured aliquot. Probe readings require actual immersion and mixing.

## Review and limitations

Question 1 explains the 1:1 mole relationship. Question 2 calculates titre from recorded readings. Question 3 calculates apparent acid concentration, with explicit acknowledgement that technique errors can bias the estimate. No usable trial receives invented readings: the review supplies a labelled example instead. Retry remains available, with shuffled balanced choices and numerical answers.

Numerical values, delivery sizes and tolerances are prototype defaults. The model assumes complete strong-electrolyte dissociation, ideal concentrations and additive volumes. It does not simulate activity corrections, heat, carbonation, detailed stratification, indicator-drop volume, instrument noise, formal uncertainty or a titration graph. Repeat trials can be recorded; a full concordance/mean-titre assessment is deferred. Apparatus art is original functional SVG in the existing palette.

See [the specification and exact curriculum references](titration-prototype-spec.md). Both indicator and pH were supplied as the stated initial default while the optional observation preference remained unanswered; this is not recorded as an explicit owner choice. No backend, accounts, saving, analytics or deployment was added.

## Original HCl increment verification

`npm test`: **123 passing checks**, including 14 titration model checks. `npm run test:browser`: **all nine suites pass**, including a complete native mouse/keyboard titration walkthrough and all seven lab layouts at 1440×900, 2383×1000 and 390×844. Checks include a deliberate pause after one drop, observed pH 7.00 at the example equivalence point, three-question completion, incomplete review, restart and no browser runtime exceptions.

The repeated-trial checks require a fresh initial reading; merely recording the previous endpoint again does not establish a new successful trial.

## Weak-sample extension verification

The extended model tests cover initial and half-equivalence pH, conjugate-species equivalence, monotonic acid/base titration direction, overshoot, clean-flask water, analytical-material conservation through tip/spills/storage and the HCl standard required for NH₃. The native browser walkthrough is repeated for all three modes, including mode changes, labels, assembly, priming, measured aliquot, indicator, single drops, immersed probe, calculated answers and mode-preserving restart.

Current extension checks: **133 model tests pass**, including 24 titration checks. All **three native browser titration scenarios** pass (HCl, CH₃COOH and NH₃), plus responsive layout checks for all seven labs at desktop, wide and phone dimensions. The previous nine-suite result above records the original HCl increment.

## Independent-choice checks

Model checks cover every acid/base pair in both unknown roles, all three indicators available without auto-dosing, weak–weak behaviour, an early methyl-red colour with a biased CH₃COOH titre, mixed-dye transfers and finite indicator reserves. Browser scenarios cover the original three setups, an unsuitable indicator stopping point and a weak–weak setup, with all three reagent/role choices retained on Restart.

Current independent-choice verification: **146 model checks pass**, including 37 titration checks. **Five complete native browser titration scenarios pass**: HCl/NaOH, CH₃COOH/NaOH, NH₃/HCl, an early methyl-red stopping point and a weak–weak attempt. Responsive layout checks pass for all seven labs at desktop, wide and phone dimensions. The earlier verification counts above record earlier increments.
