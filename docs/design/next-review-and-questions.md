# Next review and decisions

The owner requested conductivity, colorimetry and a zinc–copper cell, plus continued useful work and a list of next steps/questions. These three local prototypes are implemented. Suggestions below remain proposals: they are not silently approved features, new laboratory recipes, data collection or publication.

## Recommended next steps, in order

1. **Playtest the three new labs and the recent art corrections.** Try one normal workflow and one deliberate mistake in each. Highest-value checks: whether probes clip where expected, cuvettes fill/drain naturally, lead ends are easy to connect, digits are readable and vessel contents stay aligned. Note the lab, apparatus and action that failed. Short screen recordings are particularly useful if available later.
2. **Make apparatus placement and action feedback consistent across all labs.** Distinguish “cannot reach”, “wrong opening”, “vessel full”, “not immersed” and “instrument off”. An optional unobtrusive valid-target highlight could help non-gamers. It needs the owner's preference; it is not enabled now.
3. **Use calibrated preparation glassware in colorimetry.** Replace or supplement assisted beaker portions with the existing pipette/volumetric-flask workflow. Keep portions deliberate and easy to operate. This would strengthen transfer/rinsing and concentration skills without adding a new topic.
4. **Add uncertainty and repeat measurements to selected existing labs.** Start with a clear instrument-resolution policy and repeat readings; then error bars, calibration interpolation uncertainty or weighing differences. Avoid adding arbitrary noise merely to make data appear realistic. A meaningful temperature/probe/calibration model should determine it.
5. **Extend reaction-rate graph skills to drawing an initial tangent.** The common SL/HL guide includes tangent-based rate work. The current mean-over-an-early-interval task should not be presented as completing that requirement. An interactive movable tangent and comparison with ΔV/Δt would address this gap.
6. **Separate common and AHL review routes.** Keep the same practical bench, but let a teacher choose common reasoning/calculations or extensions such as weak titration curves and standard cell potentials. This requires an explicit local mode choice; do not infer a student's level or collect personal data.
7. **Improve the new instrument illustrations after practical testing.** Review colorimeter well/lid visibility, frosted cuvette faces, probe clips, the salt bridge and pixel-art meters beside the original B equipment. Only generate/adopt new art after the physical anchors and controls are stable.
8. **Create a local, in-memory experiment notebook if wanted.** Reuse current tables/graphs for one attempt. Decide separately whether an export is useful. Do not add persistence, accounts, shared results, teacher dashboards or student identifiers without an explicit privacy decision.

## Next laboratory candidates — choose after playtesting

- **Equilibrium colour investigation:** disturb a reversible system with concentration/dilution changes and separate colour intensity from composition. L13 in the roadmap has common SL/HL Reactivity 2.3 context; exact reagents and conditions still need selection and appropriate data.
- **Buffer versus water:** a natural extension of the weak-acid titration work, with finite buffer capacity. The mapped Reactivity 3.1.16–3.1.17 scope is **AHL**.
- **Molten-salt electrolysis:** compare electrical energy input with the new voltaic cell. Reactivity 3.2.8 common-content molten-salt rules must not be silently applied to aqueous electrolysis; competing aqueous products are **AHL** 3.2.15.
- **Electroplating:** reuse electrode/material accounting after selecting the preceding electrolysis model. The mapped 3.2.16 scope is **AHL**.
- **Oxidation under reflux versus distillation:** reuse the condenser and organic separation apparatus, but select the oxidant, conditions and product model explicitly. The guide's 3.2.9 context supports the comparison; the current acetone–water teaching model cannot simply stand in for reaction chemistry.

Curriculum evidence is in [lab opportunities](../curriculum/lab-opportunities.md), [the new-lab mapping](../curriculum/measurement-labs.md) and the supplied-edition source record. These examples are Chemtopia proposals, not a prescribed IB practical list. Later guide revisions have not been checked online.

## Questions to answer when convenient

| ID | Question | Why it matters / a reasonable starting point |
| --- | --- | --- |
| N01 | Which feels hardest now: moving glassware, pouring, fitting parts, connecting leads, or finding the next action? | Prioritises the next usability correction. A practical failure should be fixed before adding more apparatus. |
| N02 | Should nearby compatible openings/terminals briefly highlight while an object or lead is held? | Could help non-gamers without forcing a correct setup. Wrong-target actions would remain possible. |
| N03 | Should colorimetry standards require pipettes and volumetric flasks, or offer assisted measured portions as an introductory mode? | Balances real technique against access for beginners. Current implementation uses assisted portions. |
| N04 | For conductivity, should the first objective remain a sample comparison, or become a concentration/dilution investigation? | The present model supports both, but the initial teaching route should be deliberate. Probe geometry and contamination need attention in either. |
| N05 | Would you prefer an actual conductance reading, a brightness indicator, or both for the introductory conductivity view? | Numerical G is current; a lamp might make the qualitative contrast easier, but must not confuse open contact with a non-conductor. |
| N06 | Should the cell first teach only electron/ion flow and mass changes, with E° calculation offered under a separate AHL tab? | The current third review question is explicitly AHL. A level selector has not been added. |
| N07 | Do you want tiny real-scale electrode mass changes, or an explicitly labelled accelerated demonstration option? | The current 60 s action advances model time; it does not exaggerate the mass. Visually large metal changes would need a much longer discharge or a clearly stated visual scale. |
| N08 | When should feedback appear: immediately after a mistake, only when an instrument fails, or mainly in the review? | Current diagnostics report actual instrument/contact conditions and retain incorrect attempts. |
| N09 | Which three labs should receive the most teacher review before more labs are built? | The growing collection needs depth and reliable progression, not only topic count. New optics/electrochemical coefficients are teaching defaults. |
| N10 | Is a disposable local notebook enough, or would an anonymous download of results be useful later? | Separates a learning need from any account/GDPR consequences. Neither persistence nor export is currently implemented. |
| N11 | Do you have preferred school instrument models, measurement ranges or real example data to compare with these simulations? | Helps replace illustrative coefficients and apparatus drawings with a defensible experimental reference. No upload/access is required to continue the current prototypes. |
| N12 | Which later direction is most useful: equilibrium, buffers (AHL), molten electrolysis, or polishing existing labs? | Chooses the next bounded step. No answer is assumed and none of these is being implemented automatically. |

The current prototype has no student accounts or external result collection. Any future saving, exporting or teacher-sharing request should specify the educational need and privacy constraints before implementation.

## A short playtest when you have time

- **Conductivity:** measure salt solution, then move the probes to sugar solution without rinsing. Does the film/carryover result make sense, and is it obvious how to rinse? Compare that with a fresh dry-salt contact.
- **Colorimetry:** prepare three standards and one unknown, then deliberately turn a frosted face toward the beam. Can you see what changed, record it and explain whether the calibration still applies?
- **Voltaic cell:** measure with normal leads, reverse them, then compare the loaded cell with and without a salt bridge. Is voltage versus current clear? Can you find the metal changes in the table?

The most useful first answers are **N01** (interaction difficulty), **N03** (assisted portions or calibrated glassware), **N06** (common/AHL routing) and **N08** (feedback timing). These are choices for the next increment, not prerequisites for using the three implemented labs. A useful bug report names the lab, selected apparatus, action, expected outcome and observed outcome; it need not contain student names or results.
