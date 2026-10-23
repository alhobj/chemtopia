# Weak titration reference for Chemtopia

The owner explicitly requested CH₃COOH and NH₃ as alternatives in the titration activity. These examples extend the HCl/NaOH practical; they are not a new claim that all calculations or curve interpretation are common SL/HL requirements.

## Verified curriculum boundary

Source: owner-supplied IB *Chemistry guide*, first assessment 2025, published February 2023. Reactivity **3.1.13–3.1.15**, printed p. **58** / physical PDF p. **64**, is additional HL (AHL): interpreting strong/weak titration features, buffer regions, half-equivalence relationships, indicators and endpoint/equivalence distinctions. The common strong-acid/base/practical foundation remains mapped in [lab opportunities](lab-opportunities.md). This extension does not implement a plotted curve or claim to cover every listed outcome. Later online revisions remain unchecked; see [source status](README.md).

## Model choices, not prescribed IB recipes

| Sample | Standard titrant | Supplied indicator | Example equivalence pH |
| --- | --- | --- | --- |
| HCl | 0.100 M NaOH | Bromothymol blue | 7.00 |
| CH₃COOH (ethanoic/acetic acid) | 0.100 M NaOH | Phenolphthalein | 8.70 |
| NH₃ (ammonia) | 0.100 M HCl | Methyl red | 5.30 |

Each unknown example is 0.0800 M and the pipette delivers 25.00 mL, giving a 20.00 mL stoichiometric titre. These are project example values; concentrations are hidden during practical work. Equivalence pH depends on concentration/dilution and is not a fixed boiling-style plateau. The probe shows the result of the current material inventory.

## Equilibrium calculation

Track strong-acid counterion equivalents, strong-base counterion equivalents, total ethanoic species and total ammonia species. At each pH candidate, use:

- [CH₃COO⁻] = C(ethanoic species) × Ka / (Ka + [H⁺]).
- [NH₄⁺] = C(ammonia species) × [H⁺] / ([H⁺] + Ka(NH₄⁺)).
- [OH⁻] = Kw / [H⁺].
- [H⁺] + [Na⁺] + [NH₄⁺] = [OH⁻] + [Cl⁻] + [CH₃COO⁻].

A bracketed logarithmic solve enforces charge balance while material transfers preserve all analytical totals. It includes both weak families when contamination mixes them. This avoids imposing full ionisation, neutral equivalence or a piecewise curve that loses the buffer region.

Rounded teaching constants at 25 °C are Ka(CH₃COOH) = 1.8 × 10⁻⁵ and Kb(NH₃) = 1.8 × 10⁻⁵, Kw = 10⁻¹⁴. Derive Ka(NH₄⁺) = Kw/Kb. These explicitly selected numerical defaults are not claimed as measured property data, a verified database citation or a quotation from the supplied guide. The model assumes ideal dilute solutions and additive volumes; activities, temperature dependence, volatility and heat remain outside scope.

Independent checks compare initial pH with weak dissociation estimates, half-equivalence with pKa or 14 − pKb, and equivalence with conjugate-species hydrolysis. In the example, initial CH₃COOH pH ≈ 2.924 and half-equivalence ≈ 4.745; initial NH₃ pH ≈ 11.076 and half-equivalence ≈ 9.255. Water dilution changes those readings without changing the stoichiometric titrant amount.
