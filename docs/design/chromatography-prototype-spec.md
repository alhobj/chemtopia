# Paper chromatography — proposed first prototype

**Status:** the owner requested starting paper chromatography using the existing ideas, with links from both filtration and distillation. The new page and navigation are scaffolded. The chemistry below is a concrete proposal for review, not implemented behaviour or an approved choice of sample/solvent.

## Carry forward the existing interaction

All required equipment is available. Use the existing local HTML/CSS/JavaScript and Node development server, functional placeholder artwork, selection outlines, drag-to-move, Space-to-toggle practical actions, gravity, friction, support and spills. Clicking selects; dragging picks up. Keep solid equipment hitboxes while allowing legitimate paper insertion inside the developing chamber. No correct-position ghosts or single Run Experiment button.

Supported physically possible mistakes remain possible and have visible consequences. Explain chemistry after Finish. Restart resets the experiment. Switching experiments starts a fresh attempt. No rewards, accounts, analytics, saving, backend or publication.

## Proposed sample and objective

**Recommended starting sample:** a fictional water-soluble ink mixture, developed with water on chromatography paper. Visible coloured components avoid a locating-agent step. Component labels and movement rates would be explicitly qualitative; no fabricated identification of commercial inks or measured R_F values.

**Objective:** separate the ink components and explain their different migration distances. If selected, add measuring and calculating R_F in this same version.

Alternative awaiting the owner's preference: leaf pigments with an agreed organic solvent. That would require a different sample/solvent model; do not silently reuse water-ink behaviour.

## Proposed apparatus and practical actions

Supply a developing beaker/chamber, solvent source beaker, removable lid, paper strip, pencil, capillary spotter loaded with the sample, support bar/clip, and a ruler if measurement is included. Apparatus begins unassembled.

1. Drag and pour solvent into the chamber using the existing Space pouring control.
2. Hold the pencil over the paper and use Space to mark a baseline at the chosen height.
3. Hold the loaded capillary tip over the paper and use Space to apply a sample spot. Allow spotting in the wrong place and repeated applications.
4. Drag the paper into the chamber and support it with the clip/bar. Place/remove the lid manually.
5. Development follows actual solvent contact with the lower paper edge; there is no Run button. Solvent rises through the paper and components migrate from the starting spot.
6. Remove the paper to stop development. Mark the solvent-front position with the pencil.
7. If measurement is selected, drag/align a ruler, enter baseline-to-spot and baseline-to-front distances, then calculate R_F.

The paper can fall if unsupported and remain immersed too deeply. The clip supports the paper at physical contact, without revealing a correct target location. There is no heater in this experiment.

## Proposed qualitative development model

Represent solvent uptake/capillary rise and two visible component spots with different relative migration rates. Explain this through different attractions to the stationary and mobile phases; do not say simply that heavier molecules move less.

Track the baseline, sample spot, wetted region, solvent front and component centres in paper-local coordinates, so moving or tilting the paper does not reset the experiment. Preserve represented sample amounts across paper, chamber liquid and spills. Uptake/development rates, spot spread and component migration fractions would be readable prototype defaults, not measured sample properties.

Pause development when the lower edge loses contact with solvent. Removing the paper preserves the developed pattern for inspection. No detailed molecular dynamics, solvent evaporation kinetics or drying/chemical reaction model is proposed.

## Proposed wrong actions and consequences

- Immerse the starting spot: ink can dissolve into the solvent reservoir instead of producing a useful separated pattern. Preserve that ink in the chamber liquid.
- Place paper without solvent contact: no solvent front rises.
- Use too much solvent: the spot can be submerged; pouring beyond chamber capacity spills.
- Apply a large/repeated spot: broader bands reduce separation clarity rather than blocking the action.
- Leave the run until the front reaches the top: retain the visible result, with an unreliable/missing front measurement discussed at Finish.
- Tip the chamber: spill solvent and dissolved ink; update paper contact and subsequent development.
- Leave off the lid: allow the experiment to proceed. Do not invent a fixed numerical penalty or evaporation behaviour without agreement.

Do not add a pen-baseline mistake unless a pen and its solvent behaviour are separately selected. The first proposed apparatus has a pencil only.

## Proposed Finish review

Show the developed strip, original baseline/spot, front position and component migration distances. A visible separation opens the explanation question below, with retry and no currency. An ineffective attempt remains reviewable and restartable.

**Why did the components travel different distances?**

- **A.** They interact differently with the mobile and stationary phases. **Correct.**
- **B.** The paper sorts molecules only by their mass.
- **C.** Every component must move with the solvent front.

Explain that stronger relative attraction to the stationary phase generally gives less migration under the same conditions.

If R_F is included, use:
**R_F = distance travelled by component centre from the baseline / distance travelled by solvent front from the same baseline.**

Use distances along the same development direction and units. Let students enter incorrect measurements/calculations and retry; no hidden score deductions. Invalid zero front distance cannot produce a meaningful ratio. Do not claim a measured R_F alone proves identity, or that it is independent of experimental conditions.

## Curriculum evidence and boundary

Source: the owner-supplied IB Chemistry guide, first assessment 2025, published February 2023. [Verified reference](../curriculum/separation-techniques.md):

- Structure 1.1.1, printed p. 33 / PDF p. 39: paper chromatography among common SL/HL physical separation processes.
- Structure 2.2.10, printed p. 41 / PDF p. 47: separation through relative attractions involving intermolecular forces to mobile/stationary phases; explain, calculate and interpret R_F.
- Tool 1, printed p. 29 / PDF p. 35: paper or thin-layer chromatography. This prototype proposes paper only.
- Locating-agent knowledge is not required; GC/HPLC operational details are not added.

The ink example, apparatus, finite wrong-action model, rates and question are proposals supporting the requirements, not a prescribed IB experiment. Full private guide text is not reproduced.

## Implementation and verification after review

Build an isolated chromatography state/model and page controller using the existing shared physics and appearance. Keep current experiments working; both link to this page, which links back to both.

Checks should cover paper/solvent contact, baseline and spot positions, front and component ordering, submerged spots, transfers/spills and conservation, support/containment, interrupted development, measurement mathematics if selected, restart and real Chromium dragging/Space/navigation. Verify the complete practical sequence and an incorrect setup.

## Choices awaiting the owner

1. Water-soluble ink with water, or a different specified sample/solvent.
2. Include measurement and R_F now, or defer it to the next increment.
3. Any changes to the proposed apparatus, wrong-action model and explanation before implementing chemistry.
