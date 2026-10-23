# Separation-lab review questions

The owner requested two harder questions after each existing first question, less predictable answer lengths, and numerical R_F calculation. Each successful lab now opens three ordered questions. The original first-question prompt is retained; its choices are edited to comparable lengths. Choice order is shuffled independently for each question. Numeric answers are typed, not selected from a list. All three answers must be correct, with feedback and retry. Chromatography additionally requires the existing ruler measurements and R_F entries for the student's developed paper.

These are original practice examples. Numerical values are provided in the questions, not presented as measurements from the qualitative simulation or verified potassium-nitrate solubility data. No textbook questions are reproduced.

| Lab | Question 1: retained concept | Question 2: application | Question 3: harder calculation |
| --- | --- | --- | --- |
| Filtration | Why filtration separates sand and water | Predict the filtrate when sand and dissolved salt are both present | Recover 6.4 g sand from an initial 8.0 g sand plus 5.0 g dissolved salt: sand recovery = **80.0%**; salt is excluded from the denominator |
| Distillation | Why acetone is collected first in the model | Explain lower recovery with upper-port coolant supply | Initial acetone 0.50 mol; collected 0.30 mol acetone and 0.10 mol water: acetone recovery = **60.0%**, collected acetone mole percentage = **75.0%** |
| Paper chromatography | How to calculate R_F from ruler measurements | Spot travels 3.6 cm and front 8.0 cm from baseline: R_F = **0.45** | Baseline at 1.0 cm, front at 9.0 cm, R_F = 0.65: band height above bottom = **6.2 cm**; baseline-relative travel = 5.2 cm |
| Evaporation | Why salt remains after heating | Explain why wet salt overestimates dry-salt recovery | 12.0 g solution at 20.0% salt by mass contains 2.40 g salt; 2.10 g dry salt recovered gives **87.5%** recovery |
| Recrystallisation | Why crystals form when hot filtrate cools | Explain why excess solvent can reduce crystal formation | Hypothetical 10.0 g solute in 25.0 g water; cold solubility 20.0 g per 100 g water: 5.0 g stays dissolved, maximum crystals = **5.0 g** |

For calculations, the displayed unit belongs to the input label. R_F is dimensionless. Numerical marking allows small rounding differences: ±0.005 for the two-decimal R_F example and ±0.05 in the displayed unit for the other examples. Empty or non-finite inputs are rejected. Distillation recovery and composition must both be correct. The band-position question requires adding the baseline offset; entering 5.2 cm is insufficient.

The reviewed IB guide's Structure 1.1.1 covers the separation techniques; Tool 1 covers practical separation and measurement. Structure 2.2.10 explicitly includes calculating and interpreting R_F (common SL/HL). See [the verified curriculum mapping](../curriculum/separation-techniques.md). The chosen examples and progression are project exercises, not IB-prescribed questions or a complete assessment rubric.

Implementation: `prototype/review-questions.js`. Tests check all five three-question sets, balanced answer lengths, numerical denominators, baseline offsets, invalid inputs and real browser retry/completion. See [the beaker endpoint revision](recrystallisation-prototype-spec.md) for recrystallisation success; these questions do not require a second filtration.


## Solution preparation and dilution

1. Explain why concentration uses final solution volume rather than added water volume. Balanced shuffled choices; correct meaning: the final solution volume includes the dissolved solute.
2. Calculate NaCl mass for 100.0 mL of 0.100 mol dm⁻³, using M = 58.44 g mol⁻¹: 0.5844 g, accepting appropriate rounding to 0.584–0.585 g.
3. Calculate the final diluted concentration from the attempt's displayed dissolved mass and final volume. If the attempt is incomplete/unmixed, use a clearly labelled supplied example: 10.00 mL of 0.100 mol dm⁻³ stock made up to 100.0 mL gives 0.0100 mol dm⁻³. Typed answers and retry are required; practical completion is reported separately.


## Acid–base titration

1. Explain the 1:1 mole relationship between HCl and NaOH at equivalence. Balanced shuffled choices distinguish moles from equal volumes or masses.
2. Calculate titre from recorded final minus initial burette readings.
3. Use the titre, 0.100 mol dm⁻³ NaOH and recorded aliquot volume to calculate apparent HCl concentration. A bad endpoint/technique can bias this estimate; it is not an automatically corrected true concentration. Without a usable trial, the supplied example uses 1.20 → 21.20 mL and a 25.00 mL aliquot, giving 20.00 mL and 0.0800 mol dm⁻³. All three require correct answers with retry.


The owner-requested CH₃COOH and NH₃ modes retain these three titration questions, adapting sample/titrant names and balanced 1:1 reactions. NH₃ uses HCl as the standard. Their feedback distinguishes alkaline ethanoate equivalence from acidic ammonium equivalence; pH 7 is not a completion requirement.


Independent acid/base choices now adapt the same three titration questions to all four pairings in either unknown role. Indicator mistakes do not replace recorded titres with ideal ones: a 10.00 mL early endpoint for a 25.00 mL sample and 0.100 M standard gives a calculated 0.0400 M apparent concentration. The post-attempt explanation distinguishes this from a reliable endpoint and allows every indicator choice. Weak–weak observations remain reviewable.

## Neutralisation and combustion calorimetry

Both workbenches use the same three-step progression with their actual recorded attempt where usable:

1. Explain exothermic energy transfer from reaction to measured surroundings, with balanced shuffled choices.
2. Calculate heat from the measured temperature rise and total liquid mass. Neutralisation uses Q = mcΔT, explicitly neglecting cup heat capacity; combustion includes the 50.0 g aluminium container with c = 0.900 J g⁻¹ K⁻¹.
3. Calculate the signed apparent molar enthalpy, −Q/n in kJ mol⁻¹. Neutralisation uses the amount reacting between temperature readings; combustion uses recorded burner mass loss / 46.07 g mol⁻¹.

Poor readings remain poor readings; heat loss and lag are not silently corrected. Incomplete numerical records use a labelled example (100 g liquid, 10 °C rise; 0.050 mol reacting or 0.500 g ethanol lost). Each numerical question requires typed work with rounding tolerance and retry. See [the model and curriculum limits](calorimetry-prototype-spec.md).
