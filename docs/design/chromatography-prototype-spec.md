# Paper chromatography — approved first prototype

**Status:** the owner requested the next experiment using the existing ideas, then selected “Solvent water, sample markers of different colors. Calculate rf, yes”. This resolves the two requested choices and authorises the bounded workflow below. The paper chromatography workbench is implemented, with links from both existing labs.

## Carry forward the existing interaction

All required equipment is available. Use the existing local HTML/CSS/JavaScript and Node development server, functional placeholder artwork, selection outlines, drag-to-move, Space-to-toggle practical actions, gravity, friction, support and spills. Clicking selects; dragging picks up. Keep solid equipment hitboxes while allowing legitimate paper insertion inside the developing chamber. No correct-position ghosts or single Run Experiment button.

Supported physically possible mistakes remain possible and have visible consequences. Explain chemistry after Finish. Restart resets the experiment. Switching experiments starts a fresh attempt. No rewards, accounts, analytics, saving, backend or publication.

## Selected sample and objective

**Selected sample:** different coloured water-soluble marker inks, developed with water on chromatography paper. The initial examples are green, purple and black. Visible coloured components avoid a locating-agent step. Component labels and movement rates are explicitly qualitative; no fabricated identification of commercial inks or measured R_F values.

**Objective:** separate the ink components and explain their different migration distances. Measure migration distances and calculate R_F in this version.

## Apparatus and practical actions

Supply a developing beaker/chamber, solvent source beaker, removable lid, paper strip, pencil, three coloured markers, support bar/clip, and a ruler. Apparatus begins unassembled.

1. Drag and pour solvent into the chamber using the existing Space pouring control.
2. Hold the pencil over the paper and use Space to mark a baseline at the chosen height.
3. Hold a marker tip over the paper and use Space to apply a sample spot. Allow spotting in the wrong place and repeated applications.
4. Drag the paper into the chamber and support it with the clip/bar. Place/remove the lid manually.
5. Development follows actual solvent contact with the lower paper edge; there is no Run button. Solvent rises through the paper and components migrate from the starting spot.
6. Remove the paper to stop development. Mark the solvent-front position with the pencil.
7. Drag/align a ruler, enter baseline-to-spot and baseline-to-front distances, then calculate R_F.

The paper can fall if unsupported and remain immersed too deeply. The clip supports the paper at physical contact, without revealing a correct target location. There is no heater in this experiment.

## Qualitative development model

Represent solvent uptake/capillary rise and two or three visible component spots per marker with different relative migration rates. Explain this through different attractions to the stationary and mobile phases; do not say simply that heavier molecules move less.

Track the baseline, sample spot, wetted region, solvent front and component centres in paper-local coordinates, so moving or tilting the paper does not reset the experiment. Preserve represented sample amounts across paper, chamber liquid and spills. Uptake/development rates, spot spread and component migration fractions are readable prototype defaults, not measured sample properties.

Pause development when the lower edge loses contact with solvent. Removing the paper preserves the developed pattern for inspection. No detailed molecular dynamics, solvent evaporation kinetics or drying/chemical reaction model is included.

## Supported wrong actions and consequences

- Immerse the starting spot: ink can dissolve into the solvent reservoir instead of producing a useful separated pattern. Preserve that ink in the chamber liquid.
- Place paper without solvent contact: no solvent front rises.
- Use too much solvent: the spot can be submerged; pouring beyond chamber capacity spills.
- Apply a large/repeated spot: broader bands reduce separation clarity rather than blocking the action.
- Leave the run until the front reaches the top: retain the visible result, with an unreliable/missing front measurement discussed at Finish.
- Tip the chamber: spill solvent and dissolved ink; update paper contact and subsequent development.
- Leave off the lid: allow the experiment to proceed. Do not invent a fixed numerical penalty or evaporation behaviour without agreement.

Do not add a pen-baseline mistake unless a pen and its solvent behaviour are separately selected. The first apparatus has a pencil only.

## Finish review

Show the developed strip, original baseline/spot, front position and component migration distances. A visible separation opens the explanation question below, with retry and no currency. An ineffective attempt remains reviewable and restartable.

**Why did the components travel different distances?**

- **A.** They interact differently with the mobile and stationary phases. **Correct.**
- **B.** The paper sorts molecules only by their mass.
- **C.** Every component must move with the solvent front.

Explain that stronger relative attraction to the stationary phase generally gives less migration under the same conditions.

Use:
**R_F = distance travelled by component centre from the baseline / distance travelled by solvent front from the same baseline.**

Use distances along the same development direction and units. Let students enter incorrect measurements/calculations and retry; no hidden score deductions. Invalid zero front distance cannot produce a meaningful ratio. Do not claim a measured R_F alone proves identity, or that it is independent of experimental conditions.

## Curriculum evidence and boundary

Source: the owner-supplied IB Chemistry guide, first assessment 2025, published February 2023. [Verified reference](../curriculum/separation-techniques.md):

- Structure 1.1.1, printed p. 33 / PDF p. 39: paper chromatography among common SL/HL physical separation processes.
- Structure 2.2.10, printed p. 41 / PDF p. 47: separation through relative attractions involving intermolecular forces to mobile/stationary phases; explain, calculate and interpret R_F.
- Tool 1, printed p. 29 / PDF p. 35: paper or thin-layer chromatography. This prototype proposes paper only.
- Locating-agent knowledge is not required; GC/HPLC operational details are not added.

The marker example, apparatus, finite wrong-action model, rates and question support the requirements, not a prescribed IB experiment. Full private guide text is not reproduced.

## Implementation and verification

The implementation uses an isolated chromatography state/model and page controller using the existing shared physics and appearance. Keep current experiments working; both link to this page, which links back to both.

Checks cover paper/solvent contact, baseline and spot positions, front and component ordering, submerged spots, transfers/spills and conservation, support/containment, interrupted development, measurement mathematics, restart and real Chromium dragging/Space/navigation. Verify the complete practical sequence and an incorrect setup.

## Recorded choices and implementation defaults

The owner selected water, markers of different colours, and calculating R_F. These supersede the earlier pending-choice status. Direct marker application replaces the proposed capillary spotter because markers themselves are the selected samples.

The initial fictional examples use migration fractions: green 0.75/0.35, purple 0.65/0.40, black 0.85/0.55/0.20. These are qualitative defaults, not measured brand-specific R_F values. Solvent rises at up to 8 drawing units per simulation second; the 180-unit paper strip represents 18 cm, and the movable ruler uses 10 units per cm. Uptake retains up to 0.02 model water amount in the paper. Marker applications introduce 0.01 model ink amount per spot; unlimited marker supply is not represented as a depleting reservoir.

A pencil baseline must align within 5 drawing units of a separated sample origin; a solvent-front mark must be within 5 units of the preserved front. Front overrun remains reviewable but cannot support a valid measurement task. Distance answers allow 0.2 cm measurement tolerance, and the entered ratio is checked against the student's entered distances within 0.025. Zero/negative denominators, impossible distances, non-finite values and ratios outside 0–1 are rejected with retry, without rewards or penalties. Completion requires correct measurements for the separated bands and a correct explanation.

The rigid paper is a qualitative two-dimensional strip. Pencil, markers and ruler can overlay its face for annotation/measurement. The paper can enter the chamber's interior while its support bar contacts the rim. Clipping at close physical alignment uses the existing constrained-assembly physics. No correct-position ghost is displayed. Lid omission is allowed without an invented evaporation penalty.

## History

The first proposal offered water-soluble ink with water versus a leaf-pigment example, and asked whether to introduce R_F immediately. A preparation page and navigation were pushed first. The owner's answer selected water, coloured markers and R_F; no further approval of those same choices is required. Other separation techniques remain outside this increment.

## Review revision — 22 October 2026

The Finish image has a freely draggable ruler in centimetres. Its zero can be aligned with the pencil baseline; students measure the baseline-to-band-centre and baseline-to-marked-front distances and enter their own R_F calculations. Moving this ruler leaves the frozen experiment unchanged. The explanation now asks how R_F is calculated from these measurements, with retry and shuffled option order. Completion still requires correct measurements/calculations as well as the explanation.
