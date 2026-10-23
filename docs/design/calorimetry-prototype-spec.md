# Calorimetry prototypes

## Approved scope

The owner approved the proposed HCl/NaOH neutralisation calorimetry and requested combustion beneath water in an aluminium container, subsequently choosing **ethanol spirit burner**. These are two bounded local workbenches with the established equipment drawer, solid contacts, gravity/friction, Space actions, Restart, Finish and navigation. Other roadmap labs and deployment remain unapproved. Apparatus art is original functional SVG in the existing palette.

## Neutralisation

Measure portions of 1.00 mol dm⁻³ HCl and NaOH with the supplied cylinders. An example is 50 mL of each, but other amounts and wrong transfers are allowed. Put acid in the insulated cup, immerse/clip the analogue thermometer, and record the initial temperature. Add base, stir, fit the lid and record the final temperature. The thermometer has a digital reading as well as an analogue column. Recording preserves the displayed reading; there is no automatic peak correction.

A closed lid blocks receipt: liquid poured onto it spills. Removing it permits filling. Unequal amounts limit the reacting moles; extra water changes the temperature rise. Poor mixing slows the indicated response, and delayed readings lose heat. Cup contents, waste, spills and transferred warm parcels retain their material and energy accounts. Mixing releases energy immediately in this lumped model; stratification and reaction kinetics are not simulated.

## Ethanol combustion

Weigh the spirit burner on the balance and record the mass. Measure water into the aluminium can, place it on the raised support, clip the thermometer, stir and record the initial temperature. Slide the burner underneath, light it with Space or its button, then extinguish it after a useful rise. Record the final temperature and weigh the extinguished burner again. The support is open on one side so the burner can be moved underneath without crossing solid legs in this two-dimensional view.

Burning consumes actual model fuel. Placement determines the fraction of heat reaching the can; missed heat and heat lost to air remain in the energy ledger. A badly positioned flame still consumes ethanol. The can also absorbs energy. Excessive heating can boil water away, with latent and sensible vapour energy accounted for. Fuel-mass accounting is separate from the liquid-water balance; oxygen intake and combustion-product masses are outside the simulated system.

## Controls and review

Each pour delivers **10 mL** once and stops; an explicit **1 mL** button allows finer additions. Holding Space does not repeat. Stir, fit lid, clip thermometer, record initial/final temperature, record mass and light/extinguish are deliberate separate actions. There is no millisecond stopping challenge. Ordinary buttons retain native keyboard operation.

Finish presents actual readings and three questions with retry: exothermic energy transfer; a numerical heat calculation; a harder signed apparent molar enthalpy calculation. Answers are shuffled, with comparable-length concept choices. Incomplete numerical data uses a labelled supplied example; usable but poor measurements are retained rather than replaced by ideal data. The practical completion check also requires target-vessel readings in time order, stirring, a positive rise, reacting material or fuel mass loss, and the combustion burner off. This is a basic record check, not certification of an accurate experiment.

Neutralisation uses total solution mass in Q = mcΔT, neglecting cup heat capacity for the student's first estimate. Combustion includes water **and aluminium**: Q = [m(water)c(water) + m(Al)c(Al)]ΔT. Calculate ΔH = −Q/n and convert J to kJ. Ethanol moles come from recorded mass loss / 46.07 g mol⁻¹; neutralisation moles are the limiting amount reacting between readings. Wrong amounts, delayed readings and heat loss bias the apparent result.

## Numerical implementation defaults

These are selected teaching-model defaults, not additional owner answers, an IB recipe or calibrated instrument data:

| Quantity | Value |
| --- | --- |
| Initial/ambient temperature | 20 °C |
| Liquid density approximation | 1.00 g mL⁻¹ |
| Liquid specific heat capacity | 4.18 J g⁻¹ K⁻¹ |
| Aluminium mass / specific heat | 50.0 g / 0.900 J g⁻¹ K⁻¹ |
| Cup heat capacity | 12 J K⁻¹ |
| Strong neutralisation heat released | 57.0 kJ per mole reacting |
| Ethanol release / molar mass | 29.7 kJ g⁻¹ / 46.07 g mol⁻¹ |
| Burner dry mass / initial fuel | 20.0 g / 2.0 g |
| Model burn rate | 0.020 g s⁻¹ |
| Heat-loss conductance | Cup 0.25 W K⁻¹ with lid, 0.9 without; can 0.7; other vessels/spills 1.0 |
| Thermometer response time constant | 1.2 s mixed, 6 s unstirred |
| Maximum geometric capture fraction | 0.42, reduced by offset and gap |
| Recorded temperature / balance resolution | 0.01 °C / 0.001 g; records match the displayed instrument precision |
| Boiling / water latent heat | 100 °C / 2260 J g⁻¹ |

Temperatures follow stored energy and heat capacity. Transfers carry the liquid's sensible heat, while vessel walls retain their own heat. Reaction extent prevents reheating already neutralised parcels. Exponential heat loss and probe response use elapsed model time. A warmed stored vessel pauses thermal interaction, consistent with the drawer excluding apparatus from active experiments; its contents/energy are preserved. Storing the burner extinguishes it. Finishing freezes the attempt.

No full heats of dilution, temperature-dependent properties, gas/flame flow, calibrated heat-transfer prediction, instrument uncertainty, extrapolated temperature graph, oxygen supply, safety training or complete combustion chemistry is represented. The balance supports the burner and can. Display precision is not a claim of accuracy. The rounded fuel coefficient is not a sourced standard enthalpy datum.

## Curriculum evidence

The supplied IB *Chemistry guide*, published February 2023, first assessment 2025: **Reactivity 1.1.1–1.1.4**, printed pp. 48–49 / PDF pp. 54–55, supports common SL/HL energy transfer and calorimetry including Q = mcΔT. Tool 1, printed p. 29 / PDF p. 35, supports practical measurement. See [the source status and reference rules](../curriculum/README.md) and [the lab mapping](../curriculum/lab-opportunities.md). Ethanol and this apparatus are owner-selected examples; the exact recipe and model constants are not claimed to be prescribed by IB. Later guide revisions have not been checked.
