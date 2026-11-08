# Controlled carbonate-rate comparisons

Implemented as an extension of **Reaction rates** (`rates.html`), not a second apparatus or a new consumable packet. Existing carbonate chips/powder, spatula, inner vial, flask, bung, clamp stand, 100 mL gas syringe, finite HCl/water supplies, portion controls, clock/logger, saved trials and three-question review are retained.

## Student workflow

1. Choose the fresh-trial HCl stock: 0.10, 0.25, 0.50 or 1.00 mol dm⁻³. Click **Fresh trial at chosen concentration** to apply it. The selector never silently changes a charged reaction.
2. Use the same solid form/mass, acid volume, temperature, sealed collection and clock-start procedure for a concentration comparison. Alternatively hold concentration fixed and compare chips with powder. The inner vial permits deliberate mixing without millisecond timing.
3. Record readings, save the trial and repeat. A controlled comparison is identified only when recorded starting conditions match apart from the chosen variable. Late additions, paused clocks, collection changes or escaped gas prevent that classification.
4. Compare curve steepness with the separately calculated stoichiometric final CO₂ volume. Lower acid concentration can change speed without changing the endpoint in acid excess; in acid-limited trials it also lowers the endpoint. A 100 mL syringe can fill before all theoretical gas is collected.
5. Calculate a mean rate in the existing measured-data review. Each saved trial with three distinct-time readings also supplies a fitted early-line slope calculation. Dashed graph segments are three-point regressions, approximating early tangents, not exact instantaneous rates. Trial records stay local to the attempt; new trial/reset uses the existing reservation rules.

## Scientific boundaries

CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂. Final theoretical volume uses the smaller of carbonate moles and half the HCl moles, with the existing rounded 24 000 mL mol⁻¹ gas volume. Finite reagents, collected gas and escaped gas are balanced separately. Dilution changes acid concentration through actual moles and volume.

The existing shrinking-surface kinetics and chips/powder coefficients are uncalibrated teaching defaults. Concentration changes the illustrative rate response; neither an experimental rate law nor numerical reaction order can be inferred. Fixed 20 °C is retained. Temperature comparisons are deferred because heat transfer, temperature-dependent kinetics and gas-volume changes lack a coherent model here. No catalyst, Arrhenius fit, Maxwell–Boltzmann plot or experimentally validated dataset has been added. Gas dissolution, dead volume and detailed pressure effects remain omitted.

Curriculum connections and their actual coverage are recorded in [the source-checked mapping](../curriculum/equilibrium-buffers-rates.md). These shared rate/stoichiometry tasks do not make HL rate equations shared content.

## Verification

`tests/rates-extensions.test.mjs` checks conserved matter, faster collection at matched higher concentration, equal endpoints in acid excess, acid-limited endpoints, syringe capacity, comparison controls and early regression. The native rates browser harness exercises portion handling, apparatus assembly, surface-area and concentration comparisons, early slope, measured review, reset and a narrow viewport.
