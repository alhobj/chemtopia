# Conductivity, colorimetry and voltaic-cell reference

Source: the owner-supplied IB *Chemistry guide*, **published February 2023, first assessment 2025**. Checked against the private local extraction for this implementation. Later online revisions have not been verified. Full source/extraction remain Git-ignored. These are original summaries, not a reproduced guide.

| Implemented context | Verified anchor, printed / PDF page | Scope boundary |
| --- | --- | --- |
| Conductivity comparison of solid salt and aqueous samples | Structure 2.1.3, p. 38 / PDF 44 | Common SL/HL ionic lattice properties, conductivity and solubility. NaCl/sucrose/water/acid samples and quantitative meter response are chosen practical examples, not a prescribed IB recipe. |
| Molecular solution as a contrasting sample | Structure 2.2.9, p. 40 / PDF 46; Structure 1.4.5, p. 37 / PDF 43 | Practical contrast between mobile ions and molecules. The prototype does not imply that all covalent substances are insulators in every state or that every soluble molecular substance remains un-ionised. |
| Calibration and unknown concentration | Tool 1, p. 29 / PDF 35; Structure 1.4.5 and its calibration-curve linking question, p. 37 / PDF 43 | Practical-skill/concentration context. Tool 1 names colorimetry or spectrophotometry. The CuSO₄ recipe, optical coefficients, least-squares algorithm and this Beer–Lambert teaching example are not asserted as a separately verified compulsory practical. |
| Redox and primary-cell construction | Reactivity 3.2.1–3.2.2, p. 59 / PDF 65; 3.2.5–3.2.6, p. 60 / PDF 66 | Common SL/HL oxidation/reduction, anode/cathode, metal/ion half-cells, electron flow, salt bridge and ion movement. Zn/Cu is the owner-selected example. |
| Numerical standard electrode/cell potentials | Reactivity 3.2.12–3.2.13, p. 61 / PDF 67 | **AHL.** The third review question explicitly carries this label. The simulator's concentration correction is a model choice, not a claim that common content requires a Nernst calculation. |
| Given Q = It, n = Q/(2F), mass calculation | Supporting charge/redox stoichiometry exercise | Given-equation practice. This page does not claim a separately verified compulsory common-content quantitative electrolysis/Faraday assessment outcome. |

The electrochemical guide excerpt was checked directly: it calls for electron flow through the external circuit and ion movement across the bridge. The model therefore does not draw electrons traversing the bridge and does not equate a disconnected ionic path with a universal zero voltage. Standard-state E° data remain distinct from loaded terminal voltage and concentration-dependent model EMF.

The conductivity coefficients, weak-acid approximation, optical response, fingerprints/stray-light offsets, internal resistance and displacement rate are teaching defaults, not an experimentally sourced dataset. Model results should be compared with teacher-selected real data before using them to practise experimental uncertainty or fitting actual properties. See [the implementation specification](../design/measurement-labs-prototype-spec.md).
