# Acid–base titration — first prototype

## Current independent choices

The latest owner request supersedes the automatic pairings described in earlier increments: students select the acid (HCl or CH₃COOH), base (NaOH or NH₃) and whether acid or base is the unknown. Every pairing is allowed. All three current indicators are available as separate droppers, without automatic selection or dosing. See the current independent-choice extension at the end of this document; the original increments below are retained as history.

## Earlier sample options

The owner subsequently requested CH₃COOH and NH₃ options. A sample selector now starts a fresh attempt with HCl/NaOH, CH₃COOH/NaOH or NH₃/HCl. Restart retains the chosen sample. These additions supersede the strong-only chemistry/model limit in the original increment below. See [the weak-titration model and curriculum note](../curriculum/weak-titrations.md).

## Authority and scope

The owner requested implementation after the proposal to find an unknown HCl concentration using known NaOH, a conical flask, volumetric pipette, burette, swirling, endpoint observation and concentration calculation. Preserve discrete additions suitable for non-gamers. This is a bounded seventh local lab, not approval for later roadmap activities or deployment.

The optional observation question offered indicator, pH probe or both. Pending an explicit preference, the first version supplies both as an implementation default, not a recorded owner selection. The example uses bromothymol blue. It does not assess indicator selection theory.

## Task and apparatus

Pipette **25.00 mL** of unknown hydrochloric acid into a conical flask. Fill a **50 mL burette** with **0.100 mol dm⁻³ NaOH**, prime its tip into waste, record the initial reading, titrate while swirling, then record the final reading and calculate the acid concentration.

The hidden example concentration is 0.0800 mol dm⁻³, giving 20.00 mL at equivalence. The concentration is not displayed as a target during practical work. These are project example values, not an IB-prescribed recipe. All apparatus is available: acid/base bottles, water wash bottle, 25 mL pipette/filler, conical flask, burette and stand, filling funnel, indicator dropper, pH probe and waste beaker.

Use the shared drawer, large workbench, click/drag, gravity/friction, solid glassware, Space actions, Restart, Finish and compact links to every existing lab. The burette has a physical collider while clamped; matching stand/clamp contacts are intentional. Its tall shape requires a higher equipment-retrieval range than ordinary vessels. Funnel insertion is a contained attachment.

## Actions without timing pressure

- Clamp a nearby burette using Space or its clamp button. Fit/remove the filling funnel near its mouth.
- Bring NaOH beside the assembled burette and use its fill action. Each press transfers up to 10 mL. This control abstracts the bottle tilt rather than requiring a precarious timed pour. Filling is limited by actual source contents and barrel capacity.
- Fill the pipette with its tip in the acid, lift above the flask and deliver the aliquot. Filling and delivery stop independently.
- Deliver **1 mL**, **0.1 mL**, or **one 0.05 mL drop** per press. No continuing stream, repeated Space hold or automatic endpoint stop. Extra additions can overshoot.
- Record the initial and final readings explicitly. The graduation increases downwards; display an enlarged meniscus with 0.01 mL numerical reporting. Display resolution is not a certified uncertainty estimate.
- Add indicator using its dropper. Select the flask to swirl after additions. Observe the yellow/green/blue qualitative colour or immerse the probe in mixed liquid for pH.
- Record trials for comparison. Drain vessels into nearby waste, rinse and prepare a fresh aliquot to repeat. Draining moves existing liquid, not deletes it. Restart begins a fresh local attempt.

## Chemistry and material model

HCl and NaOH react in a 1:1 mole ratio. Track liquid volume and both analytical acid/base equivalents through bottles, pipette, barrel, tip, flask, waste, spills and storage. Neutralisation changes free H⁺/OH⁻, not the tracked totals of acid-derived chloride and base-derived sodium equivalents.

At 25 °C use Kw = 10⁻¹⁴ and solve [H⁺] − Kw/[H⁺] = (n(acid) − n(base))/V. Use a stable numerical expression on both sides of equivalence, including pure water. Assume complete strong-electrolyte dissociation, ideal concentrations and additive dilute-solution volumes. No activity, heat, carbonate uptake or random error. The later weak-sample extension below replaces the original strong-only pH equation when weak species are present.

The initially empty burette tip holds **0.20 mL**. Filling this from the barrel changes the reading without delivering the same volume to the receiver. Once filled, incoming liquid displaces its contents; tip composition and volume remain explicit. Priming/rinsing therefore has a material consequence. A diluted or contaminated NaOH charge is not treated as the stated 0.100 M standard automatically.

Indicator colour is a qualitative display: yellow below pH 6, green across pH 6–7.6 and blue above pH 7.6. It is not a spectral model or a claim that every green reading is exact equivalence. Its tiny indicator-volume contribution is omitted. Indicator and pH require mixing for an interpretable endpoint; detailed stratification is deferred. A clean receiving flask may contain water without changing the moles in the acid aliquot.

## Mistakes and review

Allow wrong reagent transfers, partial/wrong-source aliquots, water dilution of the titrant, unprimed tip, missed receivers, spills, recording from a nonzero or inappropriate initial reading, insufficient mixing and endpoint overshoot. Contents remain in a real material pool; there is no fixed score penalty or automatic correction.

Report recorded trials and distinguish an equivalence point from an observed indicator endpoint. A successful first practical trial requires a 25.00 mL acid aliquot, the standard titrant composition, a mixed endpoint within the indicator region, no missed delivery and agreement between barrel titre and volume reaching the sample (prototype tolerances). No automatic first-position or longest-answer cue.

Three questions, with retry:

1. Concept: equivalence uses equal HCl/NaOH moles, not necessarily equal volumes or masses.
2. Calculate titre = final − initial using the recorded readings.
3. Calculate apparent HCl concentration using the 1:1 relation and aliquot volume. Explain that a bad endpoint/technique can bias this result. An incomplete attempt uses a clearly labelled supplied example instead of invented attempt readings.

An incorrect practical attempt remains reviewable. Recording multiple readings does not itself establish experimental precision; formal uncertainty, concordance criteria, curves/graphs and weak-acid extensions are deferred.

## Curriculum basis and verification

Owner-supplied IB *Chemistry guide*, first assessment 2025, published February 2023: Reactivity 3.1.7–3.1.8, printed p. 57 / PDF p. 63; Reactivity 2.1.2, printed p. 52 / PDF p. 58; Tool 1, printed p. 29 / PDF p. 35. Common SL/HL strong-acid/base and practical/stoichiometric context. Weak-acid curve analysis and indicator selection theory remain AHL 3.1.13–3.1.15, printed p. 58 / PDF p. 64. See [the verified mapping](../curriculum/lab-opportunities.md) and [source status](../curriculum/README.md).

Verify conservation, pH near equivalence and on both sides, tip priming, overshoot, discrete drops, sample/waste handling, storage, support physics, repeated trials and frozen finished state. Use a real browser walkthrough for assembly, filling/priming, aliquot, indicator, controlled additions, pH immersion, recorded readings and all review answers. Run existing lab and responsive-layout regressions. No new dependency installation, account, backend, analytics or publication.

## Owner-requested weak sample extension

Select **HCl**, **CH₃COOH** or **NH₃**. Each uses a 25.00 mL aliquot of an unknown 0.0800 M example stock, with a 0.100 M standard. CH₃COOH uses NaOH; NH₃ uses HCl. Keeping the same stoichiometric titre makes pH behaviour comparable. Formulae, bottle labels, equipment names, objectives, indicator and all review wording follow the selected mode. Changing mode resets materials, trials, assembly, selected/held items and the review. Restart retains that mode. There are no mixed inventories from different attempts.

In addition to strong acid/base equivalents, track analytical ethanoic-acid/ethanoate and ammonia/ammonium totals through every transfer, tip, spill and stored vessel. Solve electroneutrality together with their mass-action equilibria and water, rather than treating the weak reagents as fully ionised. This also handles contamination containing both weak families. The solver includes the initial solution, buffer region, equivalence and excess titrant continuously.

Rounded teaching constants at 25 °C: Kw = 10⁻¹⁴, Ka(CH₃COOH) = 1.8 × 10⁻⁵, Kb(NH₃) = 1.8 × 10⁻⁵, with Ka(NH₄⁺) derived as Kw/Kb. These are explicit numerical model defaults, not a sourced precision-property dataset or constants extracted from the supplied IB guide.

The supplied indicator follows the sample: bromothymol blue for HCl, phenolphthalein for CH₃COOH (qualitative range pH 8.2–10, colourless/pale pink/pink), methyl red for NH₃ (pH 4.4–6.2, red/orange/yellow). No indicator-choice assessment or extra equipment selector is added. The existing pH probe remains available. Completion uses the selected endpoint region, not a hard-coded demand for pH 7. In this example, equivalence is approximately pH 8.70 for CH₃COOH and 5.30 for NH₃. Indicator models remain qualitative.

The three-question review keeps the 1:1 concept, measured titre and typed sample-concentration calculation, adapting reagent names and reaction equations. Feedback explains ethanoate hydrolysis or ammonium dissociation where relevant. The equilibrium-model note and learning scope distinguish the AHL weak-titration extension from the common SL/HL HCl activity. No graph, new reward, account, dependency or deployment is included.

## Independent-choice extension

There are eight setups: two acids × two bases × either unknown role. The unknown is the left bottle at hidden 0.0800 M; the selected counterpart is the 0.100 M standard in the other bottle. Their names/formulae, contents, objective and review all follow the choices. Changing a reagent/role starts a fresh attempt; Restart preserves the selections. This does not change any acid/base or indicator automatically when another choice changes.

All three implemented indicators are available in Equipment throughout each attempt: bromothymol blue, phenolphthalein and methyl red. No indicator is pre-added. Each dropper has its own identity and finite reserve. The student may choose an unsuitable indicator, omit an indicator or add several. Individual dye counts survive material transfers, tip priming, spills and storage. Mixed colour is a qualitative weighted palette blend, not a spectral/absorbance simulation; mixing dyes does not create a new certified transition range. Dye volume and pH perturbation remain omitted.

Acid/base chemistry is still solved from all strong and weak analytical species. In particular CH₃COOH/NH₃ is allowed in both directions and has a gradual equivalence region. Its proton-transfer reaction remains an equilibrium, not an assumed abrupt neutralisation jump. None of the three supplied indicators has a reliable visual endpoint for this pair. Nothing prevents running it.

Trial review records the actual titre, aliquot provenance, sample moles, titrant moles reaching the flask and dyes present. A reading near stoichiometry is reported separately from indicator suitability. Practical near-equivalence tolerance is 0.25% of delivered sample equivalents (a prototype tolerance), with existing aliquot, priming, missed-delivery, mixing and standard-composition checks. This is not a claim that a weak–weak titration gives an analytically reliable endpoint. A correct observation is not conditional on selecting a prescribed indicator.

The post-attempt indicator assessment compares each full transition range to the model pH interval within ±0.10 mL of analytical equivalence, including receiving-flask water. This is a labelled prototype resolution criterion, not an IB-mandated or universal indicator test. It finds all three current indicators suitable for the strong pair, phenolphthalein for the CH₃COOH/NaOH pair, methyl red for HCl/NH₃, and none for CH₃COOH/NH₃. Suitable alternatives are explained only in review, not used to filter controls. A mixed-indicator colour is not assessed as one pure indicator.

Wrong endpoint attempts remain available for all three questions. Example: stopping CH₃COOH/NaOH at a methyl-red colour near 10 mL gives an apparent concentration of 0.0400 M instead of the hidden 0.0800 M. The app does not substitute a corrected reading. Probe-only observations also remain possible. No new curve, automatic endpoint, scoring, dependency, account or deployment is added.
