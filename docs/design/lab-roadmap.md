# Further labs — proposal roadmap

**Status: L05, L06, L07 and L08 are implemented. Other entries remain proposals.**

The owner considers the potassium-nitrate/sand activity sufficient for the combined separation sequence and requested moving directly to L07. See [the approved L07 specification](solution-preparation-prototype-spec.md) and [implementation review](solution-preparation-prototype-review.md). The original dependency sequence below is retained as planning history, not the current work queue.

Historical planning context: The owner asked to plan more curriculum-aligned labs and explicitly said the latest equipment-menu change has not been tested yet. The three existing labs and menu are implemented, but owner acceptance is still pending. The owner later explicitly selected evaporation/salt recovery; see [the bounded L05 specification](evaporation-prototype-spec.md). The owner then requested L06 recrystallisation; see [its bounded specification](recrystallisation-prototype-spec.md). The rest of this roadmap remains planning only.

The [curriculum evidence table](../curriculum/lab-opportunities.md) records exact sections/pages and common SL/HL versus AHL boundaries from the supplied February 2023 guide, first assessment 2025. The named samples are proposed examples rather than IB-mandated experiments; L05 and L06 now have explicitly selected bounded implementations.

The owner subsequently selected [L08 acid–base titration](titration-prototype-spec.md).

## Recommended sequence

| Wave | Proposed labs | Why this order |
| --- | --- | --- |
| Review current work | Filtration, acetone–water distillation, marker chromatography and equipment drawer | Fix practical usability and scientific-display issues found by the owner before extending the shared interactions. |
| Finish the separation set | L05 evaporation → L04 salt-and-sand recovery → L06 recrystallisation | Reuse pouring, filtering and heating. Connect solubility to technique choice, recovery and purity. L05 covers the originally selected salt-recovery activity. |
| Introduce accurate quantities | L07 solution preparation → L08 strong-acid/strong-base titration | Add balance, volumetric glassware, meniscus reading and dropwise delivery. These measurements support many later labs. |
| Add investigations | L09 calorimetry → L10 reaction rates | Reuse measured solutions, heating and thermometers; add recording, graphs, controls and evaluation. |
| Broaden the practical toolkit | L11 conductivity → L12 voltaic cells; L18 colorimetry after L07 | Add electrical connections or optical measurements in bounded steps. |
| Later reaction models | L13 equilibrium, L14 molten-salt electrolysis, L17 organic oxidation/reflux | Need more substantial reaction, energy or apparatus models than the current separation engine provides. |
| Optional HL extensions | L15 electroplating, L16 buffers, and explicitly labelled extensions to L08/L10/L12/L13/L14 | Build on the common-content labs without presenting AHL-only calculations as SL requirements. |

This is a recommended dependency order, not an approved unlock tree, deadline or commitment to implement all labs.

## Shared interaction direction

Carry forward the owner's chosen principles: all required equipment available; drag to move and assemble; click to select; Space for the selected practical action; gravity, friction and solid contacts; no correct-position ghosts; physically possible supported mistakes remain possible. Use the equipment drawer for storage. Preserve substances and contents rather than deleting material to create a lower score.

Show observations during practical work. Finish can support calculations, explanations and evaluation, with retry. More realistic instrument readings, data graphs and uncertainty are proposed additions, not features already approved by the earlier labs. No new accounts, analytics, saving, rewards, world regions, publication or final artwork is proposed.

## Near-term candidate briefs

### L05 — Recover salt from water

**Question:** How can dissolved salt be recovered when keeping the water is unnecessary?

**Proposed example:** sodium chloride solution in water. Supply a beaker, evaporating basin, electric heater, support and collecting/handling tools.

**Student work:** transfer solution, position the basin, switch heating on/off, observe solvent loss and salt remaining, then recover the residue. Reuse practical heating and pouring, rather than a single Run button.

**Supported mistakes to model:** spill feed, miss the basin, move the heater away, or stop before enough solvent has left. A wet concentrate must not be labelled a dry pure solid.

**Finish:** distinguish solution, concentrate and solid residue; explain why salt remains while water leaves. A mass-recovery task could follow once balance readings and drying endpoints are approved.

**New work:** a non-volatile-solute/volatile-solvent balance, evaporation and residue states, basin geometry. The acetone–water model cannot be reused by renaming acetone as salt.

**Decisions/data before coding:** initial concentration, observable endpoint, whether to collect water at all, wet/dry treatment and numerical versus qualitative heating. No invented decomposition or injury event.

### L04 — Recover both salt and sand

**Question:** How can both solids be recovered from a salt-and-sand mixture?

**Proposed example:** sodium chloride and sand, with water as a selective solvent. Reuse filtration plus L05.

**Student work:** add a chosen amount of water, stir to dissolve salt, filter insoluble sand, rinse retained sand if desired, and evaporate the filtrate to recover salt.

**Supported mistakes to model:** too little water leaves undissolved salt with the sand; insufficient washing leaves soluble material with the retained sand; excessive washing increases the water that must later be removed; missing paper transfers sand into the filtrate.

**Finish:** account for both solids across products, vessels and spills; compare recovery with purity; explain the sequence using solubility. Retained wet sand remains wet until a separately represented drying step.

**New work:** dissolved versus undissolved salt, stirring, wash transfer and multi-step material tracking. Existing filter-paper retention must not accidentally trap dissolved salt.

**Decisions/data before coding:** feed proportions, solubility limit, mixing behaviour, washing controls, drying scope and product-quality reporting. This example is proposed; it is not a recorded owner selection of materials.

### L06 — Purify a crystalline solid

**Question:** Why can cooling a hot solution separate crystals from dissolved material?

**Proposed example:** potassium nitrate with an insoluble sand impurity, using water. This is a candidate, not a final substance choice.

**Student work:** add a measured solvent amount, heat and dissolve the soluble component, hot-filter insoluble impurity, cool to crystallise, then separate crystals from mother liquor.

**Supported mistakes to model:** too much solvent leaves more solute in the mother liquor; premature cooling in the filter loses desired material there; collecting before sufficient cooling gives lower crystal recovery. In this proposed example, dissolved mother liquor remains a material pool, not discarded mass.

**Finish:** explain temperature-dependent solubility and distinguish crystallisation from evaporation to dryness; compare purity and recovery.

**New work:** verified temperature–solubility data, cooling, crystal formation and mother-liquor retention. Do not reuse the distillation display's fixed boiling plateau as a solubility curve.

**Decisions/data before coding:** confirm the substance/impurity, source the solubility curve, choose qualitative versus quantitative nucleation/crystal growth and wet/dry recovery. A more complex soluble impurity should be a separately reviewed extension.

### L07 — Prepare a solution and a dilution

**Question:** How do mass and final solution volume determine concentration?

**Proposed example:** prepare a sodium chloride solution from a specified solid mass, then dilute an aliquot. Supply balance, weighing boat, spatula, beaker, funnel, wash bottle, volumetric flask, stopper and pipette/filler.

**Student work:** weigh solute, dissolve it, transfer quantitatively, rinse into the flask, approach the calibration mark, stopper/invert to mix, then prepare a dilution.

**Supported mistakes to model:** incomplete transfer or dissolution, filling beyond the mark, using an imprecise vessel, and mixing up solvent volume with final solution volume. An overfilled flask must not simply have its concentration corrected automatically.

**Finish:** use n = m/M and c = n/V with consistent units; use conservation of solute amount for dilution. Introduce appropriate recorded precision without pretending the current qualitative state is already calibrated.

**New work:** balances, calibrated glassware, meniscus reading, controlled additions and mixing. This is the strongest reusable measurement foundation for later chemistry.

**Decisions/data before coding:** target mass/concentration/volume, instrument graduations and uncertainty, transfer-loss representation, mixing assumptions and answer tolerance.

### L08 — Determine an acid concentration

**Question:** How can a measured neutralisation volume reveal an unknown concentration?

**Proposed first version:** hydrochloric acid and sodium hydroxide, with a pH probe. A suitable indicator such as bromothymol blue could provide an additional endpoint observation if selected. Use a strong monoprotic acid/base first.

**Student work:** rinse/fill a burette, remove a tip bubble if represented, pipette the sample, assemble the stand, add reagent while mixing, approach the endpoint dropwise, and repeat to compare titres.

**Supported mistakes to model:** overshoot, an unfilled burette tip, incorrect initial/final readings, poor mixing or inappropriate rinsing. Actual effects on delivered moles/concentration should cause the result, rather than a fixed score deduction.

**Finish:** calculate delivered volume from readings and apply the balanced equation to find concentration. Distinguish the stoichiometric equivalence point from an observed indicator endpoint.

**New work:** burette tap and delivery, pipette operation, a neutralisation/pH model, optional indicator response and repeat-run data.

**Decisions/data before coding:** concentrations and sample volume, indicator/probe choice, cleaning/rinsing scope, bubble and mixing model, replicate handling and calculation tolerance. Weak-acid curves, indicator selection theory and buffers are separate AHL extensions; stoichiometry alone does not make a titration HL.

### L09 — Where did the reaction energy go?

**Question:** How can a temperature change estimate heat released by neutralisation?

**Proposed example:** the same strong acid/base pair as L08 in an insulated cup with lid, probe and stirrer.

**Student work:** measure solutions and initial temperatures, mix, record the changing temperature, identify a justified temperature rise and calculate heat/enthalpy per amount reacted.

**Supported mistakes to model:** unequal initial temperatures, delayed readings, incorrect reacting amount, poor mixing and heat exchange with surroundings. Removing the lid may affect a selected heat-loss model; no fixed percentage penalty is assumed.

**Finish:** apply Q = mcΔT; distinguish heat gained by the measured surroundings from heat lost by the reaction; divide by the correct reacting amount and explain limitations.

**New work:** a consistent energy balance, probe response and time-series data. The current distillation teaching curve is not a general-purpose thermal model.

**Decisions/data before coding:** density/heat-capacity approximations, calorimeter heat capacity, heat-loss parameters, initial conditions, thermometer precision and whether extrapolation is included.

## Further candidate briefs

| ID | Proposed practical | Student actions and observations | Meaningful mistake / Finish focus | Main new capability |
| --- | --- | --- | --- | --- |
| L10 | Calcium carbonate chips versus powder with excess hydrochloric acid; collect CO₂ | Assemble a gas syringe, choose equal solid amounts and different surface areas, start/record gas production | Leaks lower collected gas. Under matched conditions and excess acid, faster reaction does not imply more final CO₂. Explain initial rate and controlled variables. | Gas containment, time-series graphs and collision-based rate model. Concentration/temperature investigations later; do not silently change several variables at once. |
| L11 | Compare sodium chloride solid/solution, sucrose solution and deionised water | Place probes in samples, close a circuit, compare signals and explain charge carriers | Missing contact or changing probe geometry is not automatically evidence of a non-conductor. Deionised water has very low conductivity, not an asserted perfect zero. | Wires, probes and a bounded conductivity response; choose sample concentrations and geometry. |
| L12 | Zinc/copper voltaic cell with corresponding ion solutions | Assemble half-cells, insert a salt bridge and connect a voltmeter/load; explain electron and ion directions | Reversed leads can reverse the reading sign. Missing ionic connection prevents sustained operation; do not claim every open circuit must read zero voltage. | Electrical/ionic circuit model and redox material changes. Numerical standard cell potentials are an AHL extension. |
| L13 | Iron(III)/thiocyanate equilibrium colour investigation | Add selected reagent amounts, mix and compare the red complex colour before/after a disturbance | Dilution can alter both colour intensity and composition; “darker” alone is not a complete quantitative equilibrium measurement. Explain changes using equilibrium. | Reversible reaction and colour model. Source species/conditions and distinguish common qualitative work from AHL Q/composition calculations. |
| L14 | Molten-salt electrolysis as a schematic heated cell | Connect DC supply, identify electrodes, collect/observe products and write electrode reactions | Reverse polarity and investigate changed electrode roles. Do not present aqueous products using a molten-salt rule. | Maintained molten phase, electrical energy and electrode products; a substantial later step. |
| L15 | Copper electroplating of a selected object — AHL | Choose electrode connections, pass current and inspect deposited metal | Wrong polarity changes deposition/dissolution. Explain electrode reactions; add quantitative mass/current only if separately selected and mapped. | Surface deposition/dissolution, electrode material balance; extension of L14. |
| L16 | Ethanoic acid/ethanoate buffer versus water — AHL | Prepare/compare samples, add small acid/base amounts and observe pH change | A buffer has finite capacity and does not keep pH perfectly constant. Explain composition and resistance to pH change. | Weak-acid/base equilibria and buffer-capacity model; extension of L08. |
| L17 | Ethanol oxidation with distillation versus reflux | Build the alternative arrangements and compare the intended organic transformations | Condensation returning to the flask differs from collecting distillate. Account for unreacted material and further oxidation. | A separately selected oxidant/reaction model, reflux condenser arrangement and product tracking; glassware reuse does not authorise chemistry reuse. |
| L18 | Colour/concentration calibration with copper(II) sulfate standards | Prepare/dilute standards, blank the instrument, place cuvettes consistently, measure an unknown | A bad blank, contamination or measurements beyond the chosen range can invalidate interpolation. Explain a calibration graph and estimate concentration. | Colorimeter/cuvettes, a sourced optical response and calibration plotting; natural follow-on to L07. |

## Shared systems worth designing before repeated use

- **Measured volumes and masses:** finite transfer, menisci, instrument resolution and consistent units.
- **Labels and sample identity:** distinguish solutions without turning colour into universal substance identification.
- **Recorded observations:** reusable local tables/graphs, while keeping no persistence unless separately approved.
- **Chemical and energy balances:** dissolved/solid/gas phases and reaction extent; replace display-only shortcuts where quantitative tasks demand it.
- **Circuit connections:** build once for L11/L12/L14 rather than separate incompatible wire systems.
- **Review and retry:** separate an incorrect technique, an uncertain measurement and an arithmetic error in the final feedback.

These are planning dependencies, not permission to implement infrastructure now or add data collection.

## Suggested next decision after testing

First review the current drawer and three labs. Then choose one bounded increment. **Recommendation: L05 evaporation**, followed by L04 combined salt-and-sand recovery; if measurement is the higher priority, choose **L07 solution preparation** instead. Prepare one concrete specification with agreed materials, finite actions, wrong-action consequences, model assumptions and validation before coding.

No answer is required while the owner is testing. This plan can be revised from that feedback.
