# Recrystallisation — first playable increment

**Status:** the owner requested “Make recrystallisation” after the L06 roadmap proposal. This implements that bounded workflow using its potassium-nitrate/sand/water example. The user did not supply a separate numerical solubility dataset or laboratory recipe.

## Objective and workflow

Recover potassium nitrate crystals separated from the represented sand impurity, using water as solvent. Add water, heat to dissolve the desired solid, hot-filter the insoluble sand, cool the filtrate, then filter the crystals from mother liquor using clean paper. Products are **wet collected crystals**, not a dry weighed yield.

Supply the impure solid beaker, water beaker, electric heater, stand, funnel, two interchangeable filter papers and two receiving beakers. Labels distinguish the items without revealing placement targets. Both papers are available in the shared equipment drawer. Either can be used at either stage; the model does not force the correct order.

Reuse existing selection, dragging, Space pouring/heating, solid hitboxes, friction, gravity, contact-based funnel seating, tipped spills, contents-preserving storage, restart and Finish. All earlier labs link here; this lab links back to them. Switching starts a fresh attempt.

## Species and temperature-dependent model

Track liquid water, undissolved starting potassium nitrate, dissolved potassium nitrate, recrystallised potassium nitrate and insoluble sand separately in every vessel, paper and spill.

Solute which dissolves enters the dissolved pool. When cooling reduces represented capacity below the dissolved amount, the excess becomes recrystallised solid. Undissolved starting material is never counted as recrystallised product merely because it is caught on paper. Reheating or additional water can redissolve solids.

**This first version is qualitative.** The capacity is water amount × (0.3 + 1.3 × normalised heat). This increasing function illustrates temperature dependence; it is **not a verified potassium-nitrate solubility curve**, calibrated temperature scale, equilibrium dataset or quantitative prediction of laboratory recovery. The roadmap's proposed data-calibrated curve remains a future refinement requiring a sourced dataset. No temperatures in °C or measured solubilities are claimed.

Initial amounts are 0.2 desired solid, 0.02 sand and 0.8 available water. Vessel capacity is 1.4 model amount. These dimensionless prototype amounts are not a prescribed mass, molarity or experimental recipe. Warming/cooling rates are 0.22/0.035 normalised heat units per simulation second. Dissolution and phase adjustment are instantaneous within a step; stirring, nucleation delays, crystal sizes and detailed kinetic/energy balances are not modelled.

Any beaker can be heated through actual heater contact. Heat travels with transferred liquid, mixes approximately by water amount and decays away from the heater. This is a qualitative thermal model, not the distillation display's pure-component plateau.

## Filtration, mother liquor and wet product

Filter paper retains sand, undissolved starting solid and crystals; dissolved solute and water can pass. Missing paper lets the entire mixture pass. A paper retains up to 0.002 model water amount and its dissolved solute, so its product is wet.

Cold filter paper can cool a small incoming portion and retain desired crystals early. Incoming hot liquid warms it. Reusing paper carrying sand can contaminate the final product. Pouring water through loaded paper can redissolve desired solid and carry it into the receiver. All represented material remains accounted for.

There is no solvent evaporation, gas generation, decomposition, injury, breakage, final drying or balance in this increment. A later soluble-impurity model is not silently inferred from this insoluble-sand example.

## Supported mistakes

- Too little water or inadequate heat leaves desired starting material undissolved.
- Too much water leaves more desired material dissolved after cooling and can prevent crystal formation.
- Filtering a cooled mixture catches desired solid early with the impurity.
- Omitting paper passes sand into the receiving vessel.
- Reusing contaminated paper leaves sand with the collected product.
- Collecting before sufficient cooling gives fewer crystals.
- Missed receivers, overflow and tipped contents transfer material to spills or other vessels.
- Storing apparatus preserves its contents and pauses its hidden thermal/phase changes.

## Finish and explanation

Report all five material pools by location, including mother liquor, loaded papers and spills. Recovery means recrystallised potassium nitrate collected on paper free of represented sand/undissolved starting material, divided by initial potassium nitrate. There is no arbitrary percentage pass threshold.

Success requires a positive amount of such collected crystals. Dissolved solute in retained moisture is reported separately and is not added to the crystal-recovery numerator. This is solute recovery in a wet product, not measured dry crystal mass or a claim of purity against unrepresented contaminants.

**Why did crystals form when the hot filtrate cooled?**

- **A.** The solute is less soluble in colder water, so some dissolved material forms crystals while some remains in the mother liquor. **Correct.**
- **B.** Cooling turns the sand into potassium nitrate.
- **C.** All the dissolved solute must leave the water whenever it cools.

Allow retry, without scores or currency. Explain the difference from evaporating all solvent. Incomplete and contaminated attempts remain reviewable and restartable.

## Curriculum and verification boundary

The owner-supplied IB Chemistry guide, first assessment 2025, published February 2023, names recrystallisation in **Structure 1.1.1**, printed p. 33 / PDF p. 39, and Tool 1, printed p. 29 / PDF p. 35. This is common SL/HL separation/practical coverage. The particular sample and qualitative model are project examples, not a prescribed IB experiment. See [the verified mapping](../curriculum/separation-techniques.md).

Checks cover hot filtration, cooling and mother liquor, excess solvent, premature collection, contaminated paper, raw-solid provenance, transfers/spills and conservation, storage, finished/reset state, and a real mouse/Space playthrough. Existing labs remain regression coverage. No backend, accounts, saving, analytics or public deployment.
