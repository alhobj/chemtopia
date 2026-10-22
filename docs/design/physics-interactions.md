# Collision and tipping revision

The owner requested hitboxes for all objects, including the stand; gravity-driven falling with tipping caused by bench contact; contents pouring out when an object tips; and a higher, physically sensible funnel position in the ring. The owner also explicitly requested a Git push. These instructions supersede the first gravity revision's timed rotation and preservation of loaded contents through a tip.

## Current behaviour

- Solid glass and metal have separate collision shapes. Mouse movement is swept in small increments, so a fast drag cannot teleport through an object. Falling objects collide and can rest against other equipment.
- The stand's base, rod, arm and ring edges have hitboxes. The ring opening remains free. Vessel interiors also remain open; legitimate insertion/containment is different from solid surfaces passing through each other.
- The support arm is longer and its base is shortened on the receiving side, giving the funnel bowl clearance from the rod and a receiving beaker clearance from the base.
- A funnel dropped into ring contact seats with its mouth about 32.5 drawing units above the ring centre. Contact establishes a stable support constraint; moving the stand sweeps both stand and seated funnel through collision checks. Picking up the funnel removes that constraint.
- An upright funnel falls without a programmed in-air rotation. Contact with the bench gives the thin stem a small impact asymmetry; gravity, angular motion and subsequent contacts determine its fall and resting angle. Nearby equipment can prop it up. There is no fixed target angle or tipping timer.
- Tipped contents drain progressively from the downhill opening, with visible flow and material transferred into a receiver or a bench spill. Retained sand on an inserted filter also spills when its funnel tips far enough. Material remains conserved; a sand-only spill does not draw a water puddle.
- Picking up a loose funnel or paper holds it upright for positioning. Folded paper can be inserted into the funnel without treating its contained position as an interpenetration error. Loose paper otherwise collides normally.
- Space still toggles the pouring action. Tilting also checks collisions; a blocked tilt displays a short control message. Return the beaker to a safe position before releasing it, since it can now fall onto the setup.

## Implementation and limits

The static app uses a local copy of Matter.js 0.20.0 with its MIT licence and [source record](../../prototype/vendor/README.md). `prototype/physics.js` defines the compound shapes, swept dragging, support and spill triggers. The Node development command remains `npm start`, with no dependency installation or build step.

This is a two-dimensional rigid-body approximation, not a calibrated laboratory simulator. Ring support uses a contact-triggered constraint for stability. Folded paper is represented as a rigid shape; insertion uses a containment exception. Masses, friction, impact asymmetry and drain thresholds/rates are qualitative. Liquids are still transferable amounts rather than fluid particles. Glass breakage, impact damage and new chemical processes are outside this revision.

## Verification

`npm test` covers both experiments. Filtration checks include: material conservation, filtration with and without paper, wrong/missing receivers, overflow, interrupted transfers, loaded paper movement, no in-air tipping, bench impact, ring seating, fast-drag collisions, vessel contact, holding/release, tipped sand/water transfer, paper insertion and moving the stand/funnel assembly.

`npm run test:browser` uses real Chromium input for blocked dragging against the stand, a clear-bench fall/tip, corrected ring seating, paper insertion, Space toggling, a successful filtration and question, loaded-funnel tipping/spillage, restart and missing-paper failure. The support and tipped-spill screenshots in the review are captures of the app, not generated concept artwork.


## Stability and thermometer fixes

Following the owner's playtest, equipment and support surfaces now use consistent friction on all compound collision parts, with stronger static friction and damping. A click selects apparatus; pickup/disconnection begins only after a short drag, so touching a stand or heater does not lift or disturb it. Heater pickup also preserves its position rather than applying a vessel-height correction.

The thermometer has a shorter stem and a physical seating collar, matching the still-head opening. Near-aligned insertion seats the collar at the rim and constrains the thermometer, with the bulb at the side-arm height. No target ghost or chemistry change is introduced. Tests cover a nudged stand settling, surface friction, near-aligned thermometer seating, and clicking the assembled heater without moving the glassware.
