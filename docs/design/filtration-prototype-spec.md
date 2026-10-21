# Filtration prototype — proposed first build

**Status: ready for owner review; implementation not yet approved.** This specification translates the latest P01–P09 selections into a finite first increment. It does not approve itself. The P IDs in this questionnaire are contextual question IDs, not the existing P01–P14 art-sheet IDs.

## Recorded answers

```text
P01 A
P02 A
P03 A, D
P04 A
P05 A, B, C, D, E
P06 A, B, E
P07 A
P08 C, E
P09 A
```

## Selected scope

- One complete sand-and-water filtration task; the other separation processes follow after review.
- Enter directly at a close-up workbench. No avatar selection, room walking or exterior transition in this increment. The previously selected avatar roster and L01-1/H01-1 direction remain longer-term requirements.
- Computer mouse and full keyboard operation first. Tablet and phone support remain later compatibility requirements.
- Free placement with physically sensible attachment/alignment. No marked correct positions, placement guides or solution-only snapping.
- Move the source beaker above a receiver, then hold a Pour control to tilt and transfer; releasing stops pouring. Equivalent keyboard operation is required.
- Restart resets the whole task with fresh material. No undo or refill-and-continue feature.
- Show only the short objective, selected equipment name, visible experimental outcomes and control instructions during practical work. No chemistry hints or explanatory action-by-action feedback before Finish.
- Complete a successful separation and answer a short question explaining why it works. Currency is deferred.

## Source and approved chemistry model

Guide mapping: Structure 1.1.1, printed p. 33 / PDF p. 39; Tool 1, printed p. 29 / PDF p. 35. See [the verified reference](../curriculum/separation-techniques.md).

The owner approved this proposed P04 model: sand is insoluble and represented by visible particles; water is a transferable volume. Proper filter paper retains sand while water passes into a receiving vessel. Flow and particle behaviour are simplified rather than modelling individual water molecules.

**Additional implementation boundaries proposed for review:** this first task is qualitative; it does not claim calibrated filtration kinetics, precise measurement, drying or a sedimentation/decanting simulation. The retained sand is wet. These boundaries must be accepted with this specification rather than silently presented as physical completeness.

## Equipment and interaction model — proposed details

Available from the start: a source beaker containing sand and water, two empty collecting beakers, an ordinary funnel, filter paper and a stand/support for the funnel. No shop, locks or consumable limits.

The initial mixture and vessel capacities will be represented consistently; receivers must allow an overflow case to be tried. The initial task must also be completable without overflow by using the available receiving capacity. Visible fill levels, not invented quantitative readings, communicate this first model.

Supported actions:

1. Select an apparatus item and drag it to a free position or a physically compatible attachment.
2. Put filter paper into the funnel and remove it again. A loaded paper carries its retained sand with it; material must not disappear on removal.
3. Place or remove a funnel on a compatible stand/support or vessel opening. Connections follow the represented geometry, not an answer-key flag.
4. Lift/place a beaker above an opening or above the bench and hold Pour; release to stop. A beaker can transfer into another beaker, a funnel or the bench. The selected source must not pour into itself.
5. Move apparatus or change its setup after material has been transferred; represented material remains with its current container/support.
6. Press Restart to restore the original state.
7. Press Finish to end the practical attempt and receive outcome feedback; if the separation succeeded, answer the explanation question.

The details are proposed finite scope, not a promise to simulate every action possible in a real laboratory. Do not add heaters, glass breakage, chemical reactions or unapproved effects to this filtration increment.

## Wrong actions and consequences — selected direction

- Without paper, both represented sand and water pass through the funnel.
- Material poured away from a receiving opening reaches the bench as a spill.
- Filling beyond capacity produces overflow; material is transferred to the spill state rather than deleted.
- Pouring into another beaker transfers the mixture without separating it.
- An ineffective arrangement follows the actual represented connections; do not reject an action merely because it is not the correct experiment.

Spills remain visible until restart. The practical work continues after a mistake; there is no currency penalty, forced reset or mid-action chemistry explanation. Feedback after Finish describes the observed result. Exact wording is drafted below for approval.

## Completion and question — proposed content for approval

**Objective:** “Separate the sand from the water using the equipment on the bench. Recover the sand.”

**Proposed success criterion:** the original represented sand is retained on filter paper, collected liquid contains no sand, and water has passed into one or more collecting beakers. Any sand lost to a spill means recovery is incomplete. A water-only spill is reported but does not by itself cancel recovery of the sand. Do not imply that wet sand has been dried or that every spilled fraction is recovered.

This is a proposed educational criterion; it is not silently inferred from P08-C. During the practical stage, no success marker reveals which placement is correct.

After Finish, if the criterion is not met, show: “The separation is not complete. Compare where the sand and water ended up. Restart to try again.” Identify actual collected and spilled materials visually, without a step-by-step solution.

If the criterion is met, ask:

**Why did filtration separate this mixture?**

- **A.** The insoluble sand was retained by the filter paper while water passed through. **Correct.**
- **B.** The water evaporated during filtration.
- **C.** The sand dissolved and passed through the paper with the water.

The question text, distractors and criterion need owner approval as new chemistry/assessment content. Proposed feedback after submission: explain that insoluble solid particles are retained by the paper, while water passes through; if the answer is wrong, allow another answer without currency or scoring. Completion requires the correct explanation. The first-try currency rule remains deferred, not removed from the eventual design.

## Keyboard controls — proposed concrete mapping

Tab reaches apparatus choices and controls; selecting an item exposes its name. Use arrow keys to move the selected object, Enter to place/attach, and hold Space on the focused Pour control to pour, releasing to stop. Escape cancels an in-progress placement without resetting material. Restart and Finish remain keyboard-accessible buttons. Keyboard and mouse invoke the same material-transfer rules.

These mappings implement the selected full-keyboard requirement; they must not become a separate simplified chemistry path.

## Technical approach

A static browser prototype with no backend, accounts, analytics, external runtime requests or saved student information. Use a small local rendering/input layer and a separate deterministic material-transfer model. Engine/framework details are routine choices within this scope; no toolchain needs installing before approval.

Use design B as the art direction, with clear apparatus silhouettes and readable labels. Generated concept images are references, not automatically usable sprite atlases. Any functional placeholder must be explicitly labelled; do not claim pixel-perfect final art or present scientifically defective concept details as validated apparatus.

## Acceptance criteria

1. Starts at a usable workbench with the approved objective and all apparatus available.
2. Drag/place and hold/release pouring work with mouse and equivalent keyboard controls.
3. Compatible attachments work anywhere physically valid; no solution-only guides or snapping.
4. Correct filtering retains represented sand and transfers water.
5. All five selected incorrect-action cases are possible and produce the stated outcomes.
6. Water and sand are conserved across containers, filter paper and spills; no deletion, duplication or negative amounts.
7. Moving/removing apparatus preserves its contents and retained material.
8. Restart restores exactly the original material and apparatus state.
9. No chemical hints or explanatory correctness feedback appears before Finish; selected names and control instructions are allowed.
10. Finish evaluates the approved recovery criterion; a successful practical result leads to the approved explanation question.
11. No currency, account, server, saving, avatar selection or room-walking feature is added to this increment.
12. Owner receives launch instructions and a chance to try this increment before any additional technique.

## Verification plan

Run meaningful material-model checks for filtering with/without paper, wrong receiver, missing receiver, overflow, interrupted pours, removing loaded paper, conservation and reset. Test the actual browser flow for mouse and keyboard, final feedback and question completion. Check a representative desktop browser and report any unverified browser/device support. Do not substitute successful model tests for trying the interface.

## Approval gate

The owner has answered the scope questionnaire. This is the promised concrete build specification. Obtain approval of this document, including its proposed details and completion question, before creating game code. Changes requested during review must be incorporated rather than assumed approved.
