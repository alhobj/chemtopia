# Conductivity, colorimetry and zinc–copper cell prototypes

The owner explicitly requested these three labs together, continued implementation, and a subsequent list of suggestions/questions. This authorises the bounded local increments below. Particular quantities, instrument coefficients and sample recipes are implementation defaults for review, not additional owner answers. Existing English, B-equipment, mouse/Space, gravity/collision, finite-material, local-only and push boundaries remain. No accounts, analytics, backend, deployment or saved student records are introduced.

## Shared practical behaviour

Each lab has a workbench, equipment drawer, movable vessels and instruments, deliberate actions, an observation table, Restart and three review questions with retry. Liquids, dissolved species and dry NaCl remain finite. Spills and overflow enter tracked pools. Model time and records live only in memory. Leaving the lab or reloading discards the attempt; Restart clears it.

Portion controls deliver once, with no millisecond timing requirement. The first colorimetry preparation uses **assisted metered model portions** in beakers, not a claim that beakers measure these volumes accurately in real work. A pipette/volumetric-flask preparation workflow is a proposed refinement. Liquid volumes are additive; density/activity changes and measurement uncertainty are not fully simulated. Unsalted colorless water is still tinted for visibility in the glass, not represented as a genuinely coloured chemical.

New meter housings, cuvettes, electrodes, salt bridge and LCDs are original functional SVG artwork in the B palette. Existing beakers retain the detailed B sprite adaptation. These new drawings are not claimed to be previously selected B concept-sheet assets. Instruments have collision bodies; contained or rim-clipped parts deliberately leave the separate rigid-body simulation, as in the previous labs. Moving/removing a fitted item restores its independent body.

## Conductivity — L11

**Question:** What makes a substance conduct, and how do contact and geometry affect the observation?

Supplied samples are 80 mL each of 0.100 M NaCl, sucrose, HCl and CH₃COOH, plus 500 mL deionised water, a dry 0.005 mol NaCl sample, a test beaker and waste. This extends the roadmap's salt/sugar/water comparison with already familiar strong/weak acids. A meter and two individually movable probes begin disconnected/off. Students drag the lead ends onto terminals, or select a probe and use an accessible lead button. Both leads may be attached incorrectly. Probes clip near a vessel rim; both must contact the same sample.

The meter displays **conductance G in mS**, not conductivity under an unexplained fixed geometry. Probe spacing and immersed depth determine a teaching cell constant K. The recorded pair permits κ = GK. Display/record resolution is 0.001 mS at readings of at least 1 mS, and 0.00001 mS below that; this is a display policy, not a complete uncertainty model. A disconnected/air-contact measurement is unavailable, not fabricated as zero. Dry solid NaCl with both tips contacting the pile gives ideal zero, provided the probes carry no liquid film. A wet-probe dry-solid comparison is rejected rather than resolving conduction through locally wetted powder. No liquid cell constant is assigned to the dry-solid record; deionised water and sucrose solution give very low, non-zero values. Water added to dry salt dissolves it rapidly up to a model 0.006 mol/mL capacity. This is not a dissolution-rate investigation.

Approximate 25 °C limiting conductivities (Λc gives κ in mS/cm when c is mol/dm³) are NaCl 126.4, HCl 426 and dissociated ethanoic acid 390.5. Ka = 1.8×10⁻⁵ is used for the weak acid, including the HCl common-ion term in mixtures. A background 0.000055 mS/cm represents ideal water. These are rounded, dilute-solution teaching coefficients, not a concentration-corrected experimental dataset. Temperature, polarisation, ionic activity and frequency dependence are omitted. Sucrose remains molecular.

Each probe retains an actual 0.05 mL sample film. Moving to another sample deposits that film and takes up a fresh one, conserving species. Rinsing an unclipped probe above waste with the water vessel nearby drains the film and 2 mL rinse water into waste. This is an ideal complete wash/drain, not a resolved rinse-kinetics or residual-water model. Mixing samples and diluting them change the response; printed source labels do not certify the resulting composition.

**Review:** mobile ions versus molecules; recorded G and K calculation; a supplied strong-electrolyte dilution example under fixed geometry. Answering questions is not certification of a controlled comparison.

## Colorimetry — L18

**Question:** How can measured standards establish an unknown concentration?

Supplies: 100 mL of 0.100 M CuSO₄ stock, 500 mL water, four empty standard beakers, 50 mL of an unknown, waste, two 4 mL cuvettes and a colorimeter. The default hidden unknown is 0.0350 M before student manipulation. This recipe is a project example. The student calculates and enters standard concentrations; the app does not replace wrong entries with model truth.

A cuvette needs at least 2 mL to cover the beam. At 3 mL, the normal measurement is valid. It can be wiped, turned to a clear or frosted face, inserted/removed with the lid open, and drained above another vessel. Draining leaves 0.05 mL; retained solution really dilutes/contaminates the next fill. Containers retain finite materials. First-use optical faces have a fingerprint offset until wiped. The lid can be left open, the wrong face can face the beam, and any filled cuvette can be used as a blank.

The response is an **illustrative optical model**, not sourced CuSO₄ spectral data. Absorbance before stray light is εlc plus an optical-face offset, with l = 1 cm and ε = 20, 5 or 1.5 dm³ mol⁻¹ cm⁻¹ for red 635 nm, green 525 nm or blue 470 nm respectively. Fingerprints add 0.06 absorbance; the frosted face adds 0.25. Transmission includes a small 0.003 stray-light fraction and a further 0.07 with the lid open, then is normalised. Blanking stores the actual transmitted reference. Displayed absorbance is −log₁₀(Tsample/Tblank), so a bad absorbing blank can cause negative readings. A filter change retains the old blank and explicitly flags the mismatch; it does not silently reblank.

Standards are recorded with the entered concentration, measured absorbance and filter/optical conditions. At least three distinct concentrations under the same filter are required for a least-squares line with a fitted intercept. This includes allowing an explicit zero-concentration solvent point. The graph plots the actual records and reports slope, intercept and R². Flat/insufficient data does not produce a fake estimate. Unknown estimates use (A − b)/m from the student's calibration, with extrapolation identified. Hidden model concentration is never used in the estimator. Wrong labels can produce a convincing but biased line. A consistent blank offset can be absorbed by a fitted intercept; not every imperfect blank necessarily biases every fitted estimate.

**Review:** optical reference; the student's recorded unknown and fitted line (or labelled supplied data); dilution-factor back-calculation. Calibration uncertainty, regression confidence intervals and a sourced spectrum remain later refinements.

## Zinc–copper voltaic cell — L12

**Question:** How do electronic and ionic paths permit spontaneous redox to supply electrical energy?

Supplies: separate 100 mL portions of 0.100 M ZnSO₄ and CuSO₄, zinc and copper strips initially containing 0.030 mol metal each, a KNO₃ gel salt bridge, water, waste and a combined high-resistance voltmeter/100 Ω load. The gel begins with 0.020 mol each of K⁺ and nitrate. Strips clip to the beaker rims. The two bridge legs must reach different liquid half-cells. The bridge is contained by its left-side attachment; actual end geometry and liquid levels are still checked after movement. This simplifies rigid mounting while preserving loss of ionic contact.

Lead-end dragging or the strip lead buttons sets meter polarity. Both leads on one strip give zero potential difference. Reversed leads give the opposite sign. A missing bridge can still produce a near-open-circuit voltage indication in this ideal meter model; it cannot sustain loaded current. This deliberately avoids teaching that an open ionic path always forces every voltage reading to zero. Under load without a bridge, the simplified terminal voltage collapses; transient charging is not resolved.

At 25 °C the model uses rounded E°cell = 1.10 V and an ideal concentration correction E = 1.10 − (0.05916/2)log₁₀([Zn²⁺]/[Cu²⁺]). This is a simulation assumption, not a claim that common SL/HL study requires quantitative Nernst calculations. A fixed 70 Ω internal resistance plus the 100 Ω load gives I = E/170 and terminal V = 100I. The high-resistance mode approximates negligible discharge. No junction potentials, activity corrections, electrode kinetics/passivation, variable internal resistance or thermal effects are resolved.

During discharge, extent = |I|Δt/(2F), bounded by zinc, Cu²⁺ and bridge-ion reserves. Zinc dissolves, Cu²⁺ is reduced and copper plates onto the copper strip. Coating tints are qualitative surface indicators, not a thickness or volume scale; numerical metal masses follow the reaction extent. Two K⁺ per extent enter the copper compartment and two nitrates enter the zinc compartment. Metal, spectator-ion and charge accounting are conserved. F = 96 485 C/mol; molar masses are rounded to Zn 65.38 and Cu 63.546 g/mol. A 60 s discharge action advances model time explicitly without requiring real-time waiting or fast reactions from the player; otherwise chemistry follows real elapsed time while the local tab runs.

Zinc placed directly into Cu²⁺ solution also displaces copper without external leads. That teaching reaction uses an uncalibrated maximum 2×10⁻⁵ mol/s; it consumes zinc/Cu²⁺ and deposits copper on the zinc strip. Mixed or wrong half-cell couples are diagnosed instead of assigning them a fictitious standard Zn/Cu-cell reading. The model does not extend to other electrode couples or reactions in spills on the bench.

**Review:** electron/ion paths; a labelled constant-current Faraday/stoichiometry calculation using the magnitude of a recorded current or supplied data; explicitly **AHL** standard-potential calculation. Real current changes with composition; the constant-current question is not substituted for the integrated attempt charge.

## Curriculum and validation boundary

See [the curriculum mapping](../curriculum/measurement-labs.md) for the supplied February 2023, first-assessment-2025 guide and common/AHL distinctions. The recipes, instrument coefficients, accelerated action and particular example calculations are project choices. Model and native-browser tests check material accounting, faults, practical assembly, observations, calculations, storage, layouts and navigation; they do not calibrate the coefficients against real equipment or replace owner/teacher playtesting.
