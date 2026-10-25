# Existing experiment equipment audit

Generated from the current model constructors and progression definitions. The JSON records every apparatus ID, actual initial contents, capacity, core/optional classification and required assemblies. No runtime safety/PPE or completion prerequisites existed; none are invented here.

All apparatus was supplied by the original standalone practice labs. Adventure ownership controls apparatus availability around those unchanged models. Supplies are per-attempt activity batches, not universal real-world-volume stock. Replays/restarts of a reserved attempt use the same batch; unused in-lab quantities are not transferred back to town stock.

| Experiment | Required reusable equipment | Consumable activity supplies | Additional equipment beyond starter | Starter compatible |
| --- | --- | --- | --- | --- |
| Evaporation & salt recovery | Beaker × 1; Evaporating basin × 1; Electric heater × 1 | Salt-solution batch × 1 | None | Yes |
| Filtration | Beaker × 2; Filtration funnel × 1; Clamp / ring stand × 1 | Sand–water mixture × 1; Filter paper × 1 | Beaker × 1; Filtration funnel × 1; Clamp / ring stand × 1 | No |
| Paper chromatography | Beaker × 1; Chromatography chamber × 1; Paper support bar and clip × 1; Pencil × 1; Marker set × 1; Ruler × 1 | Water supply × 1; Chromatography paper × 1 | Chromatography chamber × 1; Paper support bar and clip × 1; Pencil × 1; Marker set × 1; Ruler × 1 | No |
| Recrystallisation | Beaker × 3; Electric heater × 1; Filtration funnel × 1; Clamp / ring stand × 1 | Impure potassium nitrate batch × 1; Water supply × 1; Filter paper × 1 | Beaker × 2; Filtration funnel × 1; Clamp / ring stand × 1 | No |
| Solution preparation & dilution | Beaker × 1; Digital balance × 1; Weighing boat × 1; Spatula × 1; Stirring rod × 1; Water wash bottle × 1; 100 mL volumetric flask × 2; Volumetric flask stopper × 2; 10 mL pipette and filler × 1 | Sodium chloride batch × 1; Water supply × 1 | Digital balance × 1; Weighing boat × 1; Spatula × 1; Stirring rod × 1; Water wash bottle × 1; 100 mL volumetric flask × 2; Volumetric flask stopper × 2; 10 mL pipette and filler × 1 | No |
| Acid–base titration | Water wash bottle × 1; 25 mL pipette and filler × 1; Conical flask × 1; 50 mL burette × 1; Clamp / ring stand × 1; Beaker × 1 | Titration solutions and indicators × 1; Water supply × 1 | Water wash bottle × 1; 25 mL pipette and filler × 1; Conical flask × 1; 50 mL burette × 1; Clamp / ring stand × 1 | No |
| Neutralisation calorimetry | Beaker × 2; Insulated calorimetry cup × 1; Analogue thermometer × 1; Stirring rod × 1 | Neutralisation solutions × 1 | Beaker × 1; Insulated calorimetry cup × 1; Analogue thermometer × 1; Stirring rod × 1 | No |
| Ethanol combustion calorimetry | Beaker × 1; Aluminium calorimeter × 1; Clamp / ring stand × 1; Ethanol spirit burner × 1; Digital balance × 1; Analogue thermometer × 1; Stirring rod × 1 | Water supply × 1; Ethanol fuel × 1 | Aluminium calorimeter × 1; Clamp / ring stand × 1; Ethanol spirit burner × 1; Digital balance × 1; Analogue thermometer × 1; Stirring rod × 1 | No |
| Acetone–water distillation | Beaker × 2; Round-bottom flask × 1; Angled still head × 1; Liebig condenser and hoses × 1; Analogue thermometer × 1; Electric heater × 1; Clamp / ring stand × 2; Small transfer funnel × 1 | Acetone–water feed × 1 | Beaker × 1; Round-bottom flask × 1; Angled still head × 1; Liebig condenser and hoses × 1; Analogue thermometer × 1; Clamp / ring stand × 2; Small transfer funnel × 1 | No |
| Reaction rates | Beaker × 1; Conical flask × 1; Bung and delivery tube × 1; 100 mL gas syringe × 1; Clamp / ring stand × 1 | Carbonate and acid batch × 1 | Conical flask × 1; Bung and delivery tube × 1; 100 mL gas syringe × 1; Clamp / ring stand × 1 | No |
| Conductivity | Beaker × 6; Conductivity meter and leads × 1; Conductivity probe × 2 | Conductivity sample set × 1; Water supply × 1 | Beaker × 5; Conductivity meter and leads × 1; Conductivity probe × 2 | No |
| Colorimetry | Beaker × 6; Cuvette × 2; Colorimeter × 1 | Colorimetry stock and unknown × 1; Water supply × 1 | Beaker × 5; Cuvette × 2; Colorimeter × 1 | No |
| Zinc–copper voltaic cell | Beaker × 2; Voltmeter / load and leads × 1; Salt-bridge tube × 1 | Zinc/copper sulfate solutions × 1; Zinc strip supply × 1; Copper strip supply × 1; KNO₃ bridge electrolyte × 1 | Beaker × 1; Voltmeter / load and leads × 1; Salt-bridge tube × 1 | No |

## Important boundaries

- Evaporation has three core reusable items: source beaker, basin and heater. Its second collecting beaker is optional. It is the only starting activity.
- Requirements support the intended approved practical, not the supplied-example review shortcut; a review can sometimes be answered without conducting the experiment.
- Filtration needs two beakers, not the optional third receiver. Recrystallisation can finish with crystals in its beaker; a second filter and fourth beaker are optional.
- Solution preparation retains its weighing/mixing objective; its small funnel is recommended rather than a gate because direct transfer is implemented.
- Titration does not require the optional pH probe; all current indicator choices stay in the reagent set.
- Neutralisation does not require cylinders or the optional lid: direct finite additions and uncovered heat-loss behaviour exist in code.
- Rates permits direct solid/acid additions: the spatula and inner vial are recommended, not mandatory. The controlled vial route becomes available as those tools are acquired.
- Conductivity requirements cover the four solution samples plus clean-rinse water/waste. The two additional dry/mixing vessels are optional.
- Colorimetry needs at least three distinct calibration concentrations: a solvent point plus two non-zero standards is a valid implemented route. Extra standard vessels are optional.
- Zinc and copper strips are materials, because redox consumes/changes them. The bridge body is reusable; its KNO₃ electrolyte is consumed from a separate activity supply.
- General beaker ownership currently covers lab-specific vessel sizes. Specific volume/size variants and disposable boats are not resolved in the original models; these are documented catalogue abstractions.
- Tap/drain, integrated leads/loads and condenser hoses are provided facilities/bundled parts, not invented independent purchases.

For per-item contents, optional flags, assemblies and remaining uncertainties, inspect [the JSON audit](experiment-equipment-audit.json) or regenerate with `npm run audit:labs`.
