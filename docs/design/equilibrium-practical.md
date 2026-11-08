# Iron–thiocyanate equilibrium through colorimetry

Implemented local activity: `equilibrium.html`, also in the laboratory room and adventure equipment network. Uses the existing colorimeter, two cuvettes, eight beakers, finite solution transfers/films, blanking, measured calibration, graph, records, storage, physics, review and reservation adapter. New activity supply: `iron-thiocyanate-kit`; no new reusable equipment or prices. All previous experiment/item IDs are retained.

## Student route

1. Retrieve reference vessels, waste and cuvettes from Equipment. Prepare Mixture 1 with 5 mL each of 0.00200 M Fe³⁺ and SCN⁻ stock plus 10 mL matched solvent. Other measured amounts and mistakes remain possible. The controls deliver finite assisted metered portions, not precision measurements made by a beaker.
2. Fill/wipe/seat a cuvette containing solvent, close the lid and blank at blue 470 nm. Record its zero calibration point. Open the lid before removing it.
3. Condition/rinse another cuvette with each supplied reference before the final 3 mL fill. A 0.05 mL film remains on drainage. Use the original reference certificate only if that source was not modified; record its measured absorbance. The editable entered concentration is used for fitting; a mislabelled source is not silently corrected.
4. Measure an aliquot of the student-prepared mixture with matching optical conditions. The graph estimates complex concentration using the measured calibration, not hidden mixture truth. The three-question basic review uses the student's usable recorded calibration/absorbance and aliquot total, or explicitly labelled supplied examples.
5. Add Fe stock, SCN stock or matched solvent to a mixture. Its composition and colour are recomputed consistently. Optional HL work uses analytical totals, measured complex concentration and pre-relaxation concentrations after the last mixture addition for free concentrations, Kc, Q and direction prediction. It is separate from the basic completion review.

## Scientific model and limits

Fe³⁺ + SCN⁻ ⇌ FeSCN²⁺. For analytical totals F and S, solve x = Kc(F−x)(S−x), with 0 ≤ x ≤ min(F,S), using a stable smaller quadratic root. Total Fe and SCN moles are transported with every aliquot; spills/overflow are accounted for. Added volume always dilutes the analytical totals. Immediately-after-addition Q uses the transported pre-relaxation complex amount and new total volume, then the algebraic equilibrium is solved. Equilibration is instantaneous in this prototype, not a transient kinetic model.

Conditions: fixed 25 °C, ideal concentrations, one dominant 1:1 complex and matrix-matched 0.10 M HNO₃ in every stock, reference and solvent addition. The acid background is a fixed carrier-medium assumption, not a pH investigation. The solvent is acidified water, **not pure water**. Colour and absorbance are attributed only to the complex; free-iron, thiocyanate and carrier-background absorption are omitted. Hydrolysis, other complexes, activity/ionic-strength effects and temperature variation are omitted. The model is not a complete description of real Fe–SCN chemistry.

**Illustrative teaching constants**, not measured or experimentally validated data: Kc = 890 dm³ mol⁻¹; 1 cm path; ε = 4700, 1600 and 100 dm³ mol⁻¹ cm⁻¹ at the blue/green/red teaching filters. The existing colorimeter's finite beam fill, fingerprints, orientation, lid/stray-light and blank/filter errors remain. Consequently measured Kc can differ from the model value even with a linear fit.

References contain 0.0500 M analytical Fe and 0.0000400 or 0.000160 M analytical SCN (40 mL supplied each). Their certificates are the **calculated equilibrium complex concentrations**, including the small unconverted SCN fraction, not an assumption of complete conversion. Using certificates derived from this same teaching model makes the exercise a demonstration of calibration/equilibrium analysis; it cannot independently validate that model's Kc or establish an experimental property of the real system.

The guide explains dynamic equilibrium: microscopic forward and reverse reactions continue at equal rates. A stable colour establishes only no observable net concentration change; it does not independently demonstrate continuing reaction. No fake particle animation or measured-rate claim is made.

## Persistence and completion

The new activity reserves one reagent kit and one water/preparation supply through the existing adventure path. Reset/reload reuses that reservation; live apparatus/records still reset as in existing labs. Successful basic review emits the existing completion event. Optional HL answers do not gate completion, award mastery, create assessment records or give quest rewards.
