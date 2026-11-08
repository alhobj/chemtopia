# Ethanoic acid/ethanoate buffer investigation — AHL

Implemented: `buffer.html`, laboratory selection and adventure equipment requirements. Reuses eight existing beakers, the existing pH probe, finite metered portions, storage, physics, measurement/review components and reservation/reset handling. New consumable batch: `buffer-reagents` (0.100 M ethanoic acid, sodium ethanoate, HCl and NaOH); preparation water is separately reserved. No new reusable item, price or reward.

## Playable route

Prepare 10 mL each of acid and ethanoate in Buffer preparation, and 20 mL water in Water control. Retrieve/select the probe, choose the receiver and fit it; record both baselines. Retrieve HCl or NaOH and make matched 1 mL additions, recording after each. Compare equal starting volumes and reagent amounts, not just labels. Use a fresh run for an independent acid/base comparison.

Add water to the buffer and record again. Whole-sample dilution preserves analytical moles; it reduces concentration and capacity **per volume**, not the total stoichiometric reserve if none is discarded. Add enough strong reagent to exceed the finite reserve. The graph uses measured pH against net strong-base mmol (acid negative), with separate buffer/water series. The table retains actual volume and acid/base amounts and flags preparation changes after recording; connecting points is not evidence of a controlled comparison.

The basic practical review (still AHL buffer content) uses measured pH changes and the water-control reading when usable, with labelled supplied examples otherwise. The optional calculation uses an ordinary initial recorded buffer, or a labelled equal-mole example: total analytical concentration, approximate buffer pH and ethanoate Kb = Kw/Ka. The mole-ratio pH approximation is restricted to appreciable acid/conjugate-base amounts and ordinary concentration; it is never used by the simulation to handle pure components or exhaustion.

## Scientific model

The existing `titration-model.js` numerical pH solver is called directly. For V in dm³, analytical acetate total T, sodium concentration N and chloride concentration C, solve charge balance:

H + N = Kw/H + C + T Ka/(Ka+H).

Equilibrium ethanoate is TKa/(Ka+H), and ethanoic acid is the remainder. Sodium/chloride and total acetate moles are conserved through finite transfers, spills and dilution. Strong acid/base additions alter counter-ion balances; their volume always contributes. Kw handles water and extreme dilution. This avoids applying Henderson–Hasselbalch to pure acid/salt, exhausted buffers or excess strong reagent.

Rounded teaching constants inherited from titration: Ka = 1.8×10⁻⁵, Kw = 1.0×10⁻¹⁴ at 25 °C. Ideal solutions, additive volumes, instantaneous mixing/equilibration and an ideal, rounded pH probe; no activities, thermal changes, CO₂ uptake or probe uncertainty. The stocks are at most 0.100 M; the numerical solver is not a concentrated-solution model. The probe must be active and fitted with its tip covered; its displayed geometry follows the vessel interior.

Buffering, weak-acid strength, dilution and finite capacity are explicitly distinguished. Buffers are **AHL**, not compulsory SL content. R3.1.10–12 and R3.1.16–17 are partial connections, with precise scope/pages in `../curriculum/equilibrium-buffers-rates.md`; no practical completion awards syllabus mastery.

## Verification

Tests cover shared-solver identity, water/pure acid/pure ethanoate/extreme-dilution limits, small matched acid/base additions, exhaustion in both directions, dilution, charge/mole/volume balances, overflow, records and restricted approximation. Native browser checks pass for actual preparation, pH-probe fitting, matched water comparison, graph, dilution, excess base, optional AHL calculations, recorded-data review, reset, desktop/phone, room navigation and one-charge adventure reload. No source PDF or student assessment record is added to Git.
