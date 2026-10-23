# Acid–base titration — first prototype

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

At 25 °C use Kw = 10⁻¹⁴ and solve [H⁺] − Kw/[H⁺] = (n(acid) − n(base))/V. Use a stable numerical expression on both sides of equivalence, including pure water. Assume complete strong-electrolyte dissociation, ideal concentrations and additive dilute-solution volumes. No activity, heat, carbonate uptake, random error or weak-acid model.

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
