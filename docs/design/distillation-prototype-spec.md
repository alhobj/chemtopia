# Acetone–water distillation — revised prototype proposal

**Status: the owner rejected the previous specification.** Acetone and water, acetone as the desired collected component, movable condenser-water connections and reduced yield for upper-port water entry are explicit owner choices. The revised scientific model, apparatus details, assessment and numerical parameters remain for review. No distillation simulation has been implemented.

## Owner-selected direction

- Use a mixture of **acetone and water**. Collect acetone by distillation. This replaces the earlier salt-solution/water-recovery example for this experiment; the original S01 record remains historical.
- Let students connect cooling-water hoses to either condenser port. They must be able to make the mistake of connecting supply water to the upper port and obtain a lower yield.
- The earlier proposal to replace hoses with a condenser cooling switch is rejected.
- Add this experiment alongside filtration, using a temporary **Go to distillation** button at the bottom of the page. A more complete navigation system comes later.
- All required apparatus is available. Students assemble and operate it without correct-position guides.
- Retain dragging, solid equipment/stand hitboxes, gravity, contact-driven tipping and spilling. Space toggles the selected practical action; movement shortcuts remain removed for now.
- Keep the local Node.js/static-browser workflow and clearly labelled functional placeholder artwork.

## Source boundary

The supplied IB Chemistry guide, first assessment 2025, published February 2023, names distillation in Structure 1.1.1 (printed p. 33 / PDF p. 39) and Tool 1 (printed p. 29 / PDF p. 35), in common SL/HL coverage. See [the verified mapping](../curriculum/separation-techniques.md).

The acetone–water example and condenser-connection mistake are owner-selected, not claims about a specifically prescribed IB experiment. The scientific modelling proposals below are supporting chemistry, not quotations from the guide or a validated quantitative vapour–liquid equilibrium model.

## Proposed objective and apparatus

**Objective:** “Collect an acetone-rich distillate from the acetone–water mixture.”

Acetone is the desired recovered component. The wording must not promise perfectly pure acetone from one simple distillation.

Start with the mixture in a source beaker. Supply an empty distillation flask, still head, thermometer, Liebig condenser, two stands with compatible clamps, an electric heater, two collecting beakers, two movable water hoses, a cold-water supply tap and a drain. Apparatus begins unassembled.

The student pours the mixture into the flask, supports and connects the glassware, positions a receiver, connects the water hoses, opens the tap and applies heat. The collection path remains open rather than sealed.

Compatible joints and clamp contacts follow physical alignment rather than a solution-only layout. Selection outlines identify an item only; no target ghosts reveal the correct arrangement.

## Cooling-water connections

Students drag hose ends onto either jacket port, the supply tap or the drain. Ports accept physically compatible hose ends regardless of whether the connection is effective. Connecting supply to the upper port must not be rejected, silently corrected or assigned full cooling automatically.

- **Supply at the lower port, outlet at the upper port:** the proposed model fills the jacket more effectively and provides more effective condensation.
- **Supply at the upper port, outlet at the lower port:** the owner's requested outcome is lower collected acetone yield under otherwise comparable conditions. The proposed explanation is less effective jacket filling/cooling, allowing more process vapour to escape.
- **Tap off or missing supply/return connection:** cooling follows the represented circuit; the condenser does not cool itself magically.

“Upper” and “lower” refer to the ports' physical elevations in the supported condenser arrangement, not fixed screen labels that remain unchanged if the apparatus is moved.

The exact jacket-fill dynamics and efficiency values remain undecided. Do not invent a numerical penalty. Reverse-flow performance depends on flow, filling and apparatus geometry in a real setup; do not claim every top-fed condenser has the same measured yield loss. The prototype's reduced-yield case is a qualitative representation requested by the owner.

Cooling water stays in a **separate jacket circuit**. It is not the water component of the acetone–water sample and must not enter the distillate or inflate the recovered amount through correct operation.

## Proposed controls

- Drag apparatus and hose ends to hold, move, place or connect them. Unsupported rigid apparatus falls and can collide, tip and spill. Hoses must accommodate connected apparatus movement rather than behave as rigid glass rods.
- Select a liquid-containing vessel and press Space to start/stop pouring while holding it with the mouse.
- Select the heater and press Space, or click its action button, to switch heating on/off.
- Select the water tap and press Space, or click its action button, to start/stop water flow. Hose connections determine the cooling route; there is no substitute condenser cooling switch.
- Restart resets the current attempt. Finish stops practical work and reviews the observed result.

## Revised material and thermal model — proposed, pending review

Track **acetone and water separately in both liquid and vapour**. Both are volatile. Ordinary pouring transfers the mixture without separating it. There is no non-volatile salt or insoluble sand in this experiment.

Acetone is more volatile than water. Model the early vapour and resulting distillate as enriched in acetone relative to the starting liquid. Some water can co-distil; it must not be treated as a completely non-volatile residue. As acetone is removed, the remaining liquid becomes more water-rich and subsequent distillate composition can change. Neither vessel should be labelled “pure acetone” or “pure water” without a justified model and composition result.

The initial acetone/water proportion and its basis are not selected yet. Do not choose a concentration, fixed boiling temperature for the mixture, equilibrium curve, collection cut or purity/recovery target silently. The former salt model cannot be reused merely by renaming its components.

A qualitative warming/boiling/cooling model remains a proposal. Heat acts through heater/flask contact. Vapour follows actual connected glassware; condensation depends on cooling-water connection and jacket performance. Condensate collects only when a receiver is positioned beneath the outlet. Escaped vapour, apparatus hold-up, receivers and liquid spills must all preserve the amounts of both process components.

**Remaining model choices:** numerical versus qualitative thermometer readings; composition-dependent vapour enrichment; heat and coolant flow representation; connection-dependent condensation efficiency; and the stopping/collection condition used to compare yields. Any prototype rates must be identified as readable simulation speeds rather than real laboratory times. Pressure dynamics, entrainment and bumping are not automatically approved additions. No explosions, injuries, breakage, penalties or scoring are introduced by this revision.

## Wrong actions and visible consequences

- Reverse the cooling supply/outlet hoses: the experiment remains operable and recovers less acetone under the agreed comparison conditions.
- Heat without an effective condenser path or coolant circuit: more process vapour can escape under the proposed model. Track escaped acetone and water rather than deleting material.
- Miss the receiver or overflow it: condensate spills and recovery falls.
- Pour the original mixture directly into a collecting beaker: it remains the feed mixture and cannot count as distilled acetone recovery.
- Move the heater away or switch it off: the action remains possible; heat transfer follows contact and the chosen thermal model.
- Disconnect, move or tip loaded equipment: update connections, support and spills physically, conserving both components.

Outcomes remain visible during practical work, with chemistry explanations reserved for Finish. A lower yield must arise from lost/uncollected material in the model, not a deduction from an otherwise identical collection result.

## Completion, yield and explanation — pending review

Report acetone recovered in the collected distillate separately from its purity/composition. **Acetone recovery yield** means the amount of acetone recovered divided by the initial amount of acetone, using the same component-amount basis. It is not total collected liquid divided by initial feed, and is not the acetone fraction of the distillate. Cooling water does not belong in this calculation.

The exact success/enrichment threshold, purity target if any, collection stopping rule and yield-display format remain undecided. Reduced-yield runs with reversed hoses should remain inspectable; do not automatically force a restart or impose an unapproved pass/fail cutoff. Direct transfer of feed cannot satisfy a distillation criterion.

A replacement question for review is:

**Why is the early distillate richer in acetone than the starting mixture?**

- **A.** Acetone is more volatile, so the vapour is enriched in acetone; cooling condenses that vapour. **Correct.**
- **B.** Water cannot enter the vapour at all.
- **C.** The condenser filters acetone molecules out of the liquid feed.

Explain relative volatility and condensation after submission; allow retry without currency. This question and any explanation of yield differences still require review. The old salt/non-volatile-residue question is withdrawn.

## Temporary navigation

Proposed: a **Go to distillation** button at the bottom of filtration and a **Back to filtration** button at the bottom of distillation. Switching starts a fresh attempt, stated beside the button. No accounts, saving, map or room navigation are added. Reset-on-switch remains a proposal rather than an inferred user choice.

## Acceptance and verification

1. Preserve the filtration activity and enter distillation through the requested bottom button.
2. Make required apparatus and both hoses available, without correct-position guides or correct-only connections.
3. Preserve usable solid hitboxes, joints, openings, clamps, gravity and tipping.
4. Complete a mouse/Space workflow that transfers feed, heats, routes vapour, condenses and collects an acetone-enriched distillate.
5. Compare lower-fed and upper-fed cooling with the same initial mixture and agreed heating/collection conditions. The reversed case must remain possible and produce lower acetone recovery through the represented cooling/material balance.
6. Conserve acetone and sample water across all phases, vessels, hold-up, spills and escaped vapour; keep the coolant circuit separate.
7. Verify co-distillation and evolving composition rather than pure-acetone/non-volatile-water behaviour.
8. Test disconnected coolant, tap off, missed receivers, overflow, direct feed transfer, changed connections and tipped contents.
9. Show observations and control help during practical work, with explanatory assessment after Finish.
10. Keep `npm start` and the VS Code task local and usable without publication or student data collection.

Implement meaningful material/thermal/cooling and collision regression checks after model approval, then actual Chromium playthroughs of both experiments, switching, reversed hoses and the approved completion flow.

## Review history and outstanding decisions

The first proposal used salt solution and a cooling switch. The owner explicitly rejected it, requesting top-port water entry as an allowed lower-yield mistake, then selected acetone and water with acetone collected. Those choices are now recorded above. They do not approve the rejected specification's remaining apparatus, thermal model, question or success criterion. Starting composition, quantitative model and collection/completion conditions still need agreement before coding new chemistry behaviour.
