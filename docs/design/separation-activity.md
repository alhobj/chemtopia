# First chemistry activity — separation techniques

## Recorded user direction

The first topic is separation techniques. The player receives heterogeneous and homogeneous mixtures and uses appropriate techniques to separate them. All equipment needed for the included separations is initially available. The player clicks and drags beakers and apparatus into position.

Latest answers, preserved verbatim:

```text
S01 A, C, D, E paper chromatography (and the rest of the separation techniques they need to know in IB DP chemistry, look it up and store the syllabus somewhere in the project files for later reference and use it to suggest things for similar questions later)
S02 C
S03 C The student does everything. Clicks a button to turn on a heater, clicks and drags a beaker over a funnel to pour it into it. All actions that are possible should be possible to do even if they are wrong
S04 A
```

## Chosen content and interaction

- **S01:** sand/water filtration, salt recovery by evaporation, water recovery by simple distillation, and paper chromatography. The supplied guide now verifies solvation and recrystallisation as additional named common SL/HL coverage in Structure 1.1.1. Specific materials and implementation increments remain to approve.
- **Equipment:** all apparatus needed for the included activities is available immediately. This is a local exception to the broader equipment-unlock preference, not cancellation of that later system.
- **S02-C:** no placement guides. Students arrange the setup themselves. Feedback can explain a problematic arrangement, but it must not act as a hidden correct-only placement gate.
- **S03:** students perform the practical actions themselves, including heater controls and dragging a beaker over a funnel to pour. Do not substitute a single Run Experiment button, complete the procedure automatically or accept only the correct sequence.
- **Wrong actions:** physically possible actions within the supported simulation remain available even when scientifically inappropriate. Model their relevant consequences instead of rejecting them merely because they are not the solution.
- **S04-A:** retain full keyboard operation: select an object, select a destination and confirm placement, with equivalent practical controls. Pointer and touch dragging remain supported.

## Scope of the simulation still to approve

“Possible” needs a bounded, reviewable implementation: which objects can move, which vessels can receive material, how pouring is triggered and stopped, which controls exist, what apparatus can connect, and which material/temperature states are represented. A physically impossible placement is different from a physically possible but ineffective experiment. Do not turn the former into permission to block the latter.

The request authorises the interaction direction; it does not supply every observation, chemical result, spill rule, error message, safety consequence or scientific simplification. Those need approval with the relevant apparatus and mixture. Do not add arbitrary chemical reactions, explosions, penalties or protective action blocking.

No optional placement outline should reveal the correct location. The previously accepted A05 equipment-selection outline may identify the selected object, but does not override S02's rejection of placement guides.

## Research and retained references

Use [the curriculum folder](../curriculum/README.md) when proposing future chemistry activities. It distinguishes owner selections, primary-source requirements, supporting knowledge and new suggestions. The owner-supplied February 2023 guide is now retained locally in a Git-ignored folder, with a public syllabus index and verified separation mapping. This is verification against the supplied edition, not independent confirmation of later online revisions.

The earlier website block remains in the source history, but no longer blocks review of the uploaded guide. See Structure 1.1.1, printed p. 33 / PDF p. 39; Tool 1, printed p. 29 / PDF p. 35; and Structure 2.2.10, printed p. 41 / PDF p. 47. The first named list includes solvation, filtration, recrystallisation, evaporation, distillation and paper chromatography. R_F explanation, calculation and interpretation is also common SL/HL content; a specific chromatography task and calculation interface are not automatically approved.

## Proposed design premise — not yet approved as an implementation specification

A local, backend-free laboratory activity in the selected L01-1 room. The student chooses from the six C01 avatars. A mixture and desired recovered product define the task. All necessary apparatus is available. The student selects a technique by arranging and operating apparatus through dragging/clicking or equivalent keyboard controls. Relevant physically possible wrong actions remain available, producing approved simulated outcomes. The educational aim is to connect mixture properties and the desired product with technique selection and practical operation.

This paraphrases the chosen direction. Before coding, approve the finite action/state model, first task and its scientific content, handling of failed attempts, and a small implementation step. Additional researched techniques need an explicit first-version versus later boundary; do not silently promise every technique in the first increment.

## Candidate first increment — proposal only

A single sand-and-water filtration task could establish the shared interaction system first: move apparatus, assemble the filter setup, pour the mixture, observe the approved outcome, and compare an ineffective but physically possible arrangement. Equipment remains available and there are no placement guides. Which wrong arrangements and outcomes are represented must be approved before implementation.

After that review, add evaporation, distillation, paper chromatography and the verified additional coverage in solvation and recrystallisation in separately approved increments. This sequence is a recommendation, not a decision to narrow the owner's requested overall content.
