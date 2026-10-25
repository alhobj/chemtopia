# Chemtopia laboratory prototypes

Approved first increment: a standalone sand-and-water filtration workbench. See [the approved specification](../docs/design/filtration-prototype-spec.md).

## Run

From the repository root, with Node.js 22 or newer:

```bash
npm start
```

The local root now opens character selection and the saved town adventure; see [the playtest guide](../docs/design/adventure-playtest.md). For unrestricted practical testing, open `/laboratory.html`: it shows the selected L01-1 laboratory with thirteen clickable experiment previews on its benches. **All experiments** opens larger choices and is open by default on phones. Each workbench has **← Laboratory** to return. Direct lab URLs still work; filtration is `index.html`. The development server reports port 4173. Open that port in a desktop browser on the same machine. Set `PORT` to use another port. The server serves only the `prototype/` directory, not private curriculum documents.

No dependency installation is needed. The application is static and uses local HTML, CSS, JavaScript and SVG. It has no accounts, analytics, remote requests, database or saved progress. The Node server is only a local static development server, not an application backend.

For VS Code terminal instructions and a file guide, see [Run and edit in VS Code](../docs/development.md).

## Filtration controls

- Drag apparatus to hold and move it. Solid parts block overlap, including the stand. On release, unsupported objects fall and collide. The funnel seats in the ring; on the bench its thin stem is unstable and contact causes it to tip.
- Hold a beaker above an opening with room to tilt while dragging, press **Space** once to start pouring, then press it again to stop. Releasing the mouse also stops pouring and lets the beaker fall. Holding Space does not repeatedly toggle the action. Stop pouring and move the beaker to a safe resting place before releasing it.
- The **Start pouring / Stop pouring** button also toggles pouring for the selected beaker. Arrow-key movement, Enter placement and Escape cancellation are removed for now at the owner's request. Normal keyboard use of buttons and answer choices remains available.
- Changing selection, finishing, restarting, losing focus or hiding the page stops pouring. An empty beaker stops automatically.
- **Restart** resets the whole task. **Finish** ends practical work and shows material distribution. A successful result opens the approved explanation question.

Return with **← Laboratory**, then select the distillation setup. Switching experiments starts a fresh attempt. The room selects experiments; avatar movement and currency rewards are not implemented.

## Representation and limitations

The prototype now uses a [detailed B pixel-art sprite adaptation](assets/design-b/README.md), selected by the owner to replace the earlier smooth SVG placeholders. Contents, meaningful scales and readings remain live SVG overlays. Other scene elements remain prototype artwork.

Amounts are internal qualitative state, not calibrated readings. Sand stays represented as insoluble particles; filter paper retains it while water passes through. Pour flow is simplified, including the homogeneous transfer of the represented batch during a pour; settling and decantation are not simulated. Filtration is represented without detailed hydraulic rates or paper moisture retention. Retained sand is described as wet, not dried.

Equipment now uses local two-dimensional rigid-body collisions. The stand has separate base, rod, arm and ring shapes, and the funnel seats above the ring on contact. Falling contact causes tipping; dry sand can spill; filtration retains water when no receiver can catch it. Other labs retain their own tipping/spill rules. Moving a seated stand also checks its funnel against other equipment. See [the interaction details and limits](../docs/design/physics-interactions.md).

Collision shapes, masses, friction, ring support constraints and tipping/drain thresholds are qualitative approximations. Folded paper has a containment exception while being inserted in its funnel. No glass breakage, impact damage or additional chemistry process is simulated. Matter.js 0.20.0 is bundled locally with its [MIT licence and source record](vendor/README.md); no runtime network access is needed.

## Verification

```bash
npm test
npm run test:browser
```

Model checks use Node's built-in test runner. Browser checks need Chromium at `/usr/bin/chromium`, or set `CHROMIUM` to its executable path. They launch a disposable headless browser and a temporary static server, exercise real mouse/keyboard input and close both afterwards. They do not install browser packages.

Browser screenshots are written to the operating system temporary directory for inspection. Browser support beyond the tested Chromium environment is not yet verified.


## Distillation

The [approved distillation specification](../docs/design/distillation-prototype-spec.md) uses equal model mole amounts of acetone and water. Pour feed into the flask, assemble and support the glass path, place a collecting beaker beneath the condenser outlet, and drag both ends of each water hose onto fittings. Select the heater or tap and use Space or the action button to switch it on/off. Picking up apparatus disconnects its joints; connected hose ends follow their fittings until dragged away.

Both sample liquids can vaporise. The requested simplified model now collects acetone at 56°C and retains water until 100°C; it does not predict real-mixture purity. Finish reports acetone recovery separately from collected composition, together with vessels, spills and escaped vapour. Direct feed transfer does not count as distilled recovery.

Either coolant port accepts the supply. In this qualitative model, upper-port supply fills the jacket less effectively and collects less acetone under comparable heating conditions. Coolant stays separate from the sample. Jacket fill and heating rates are readable prototype approximations, not calibrated laboratory predictions.

Clamps and compatible glass joints attach at close contact. Temporary collision exceptions represent opening clamps and inserting joints; connected equipment forms a constrained assembly. Flexible hoses are visual connections, without hose tension or fluid-pressure simulation. The heater begins on the bench, unconnected; it remains movable. The analogue thermometer now includes a circular digital °C reading: 20°C initially, 56°C during the main acetone collection stage, then rising towards 100°C as acetone is depleted. Turning off the heater cools it towards 20°C. A detached thermometer also cools towards ambient. This is the owner-requested simplified temperature curve, not calibrated mixture thermometry. No pressure, bumping, breakage or injuries are simulated.


## Stability and thermometer fixes

Following the owner's playtest, equipment and support surfaces now use consistent friction on all compound collision parts, with stronger static friction and damping. A click selects apparatus; pickup/disconnection begins only after a short drag, so touching a stand or heater does not lift or disturb it. Heater pickup also preserves its position rather than applying a vessel-height correction.

The thermometer has a shorter stem and a physical seating collar, matching the still-head opening. Near-aligned insertion seats the collar at the rim and constrains the thermometer, with the bulb at the side-arm height. No target ghost or chemistry change is introduced. Tests cover a nudged stand settling, surface friction, near-aligned thermometer seating, and clicking the assembled heater without moving the glassware.


## Paper chromatography

Choose Chromatography in the laboratory room, or open `chromatography.html`. Use a pencil tip over the paper and press Space to make a baseline, then apply different marker tips with Space. Pour water into the chamber, put the support bar across its rim, and clip the top of the paper to the bar. Development follows actual paper/water contact. Remove the paper to stop, use the pencil to mark the solvent front, and move the ruler beside the strip.

Finish shows the developed paper and the ruler, with separate inputs for component distance, solvent-front distance and R_F. Measure from the same pencil baseline, using spot centres. Correct measurements and the explanation complete the activity; wrong answers can be retried. Submerged spots dissolve into the chamber, missed pours and overflow spill, unsupported paper falls, and a front that reaches the paper top cannot provide a reliable front-distance measurement.

The green, purple and black markers are fictional water-soluble examples. Their band colours and migration fractions are qualitative, not measurements of particular commercial brands. Paper is a rigid strip in this two-dimensional prototype. Marking tools can overlay its face; the paper can enter the hollow chamber, and a bar/clip supports it at close alignment. Lid omission does not impose an invented penalty. The ruler uses 10 drawing units per cm. See [the specification and model defaults](../docs/design/chromatography-prototype-spec.md).

Switching starts a fresh attempt. All apparatus is available and there are no placement ghosts, scores or saved student data.


## Collapsible equipment menu

The owner requested replacing the apparatus shelf with an equipment menu on the left that hides when the mouse leaves and accepts equipment dragged back into it. All three labs now use the shared drawer. Hover over the visible Equipment tab to expand it; drag a stored row to open bench space, or drag a bench object back over the drawer to store it. Shelf apparatus starts in the drawer. Other initial bench equipment stays available and can be returned. “On bench” rows select existing apparatus; “Stored” rows can be dragged out. Fixed tap/drain fittings remain on the bench.

Storage keeps the same object and its contents, including a filter contained in its funnel. It removes collision bodies, disconnects external joints/hoses and switches powered controls off. Stored vessels cannot catch a pour, pour, develop paper or generate vapour while hidden. Taking equipment out requires clear space and does not duplicate apparatus or discard material. Unsupported equipment falls after release as before.

The tab remains visible when collapsed. The drawer opens for keyboard focus; Enter on a stored row retrieves it into available bench space, and Escape closes it. Restart restores the initial arrangement, including the initially stored shelf equipment. Storage is local to the current attempt; no saving, accounts or backend are added.

Verification covers storage/retrieval, loaded contents, contained filter paper, disconnected powered/glass apparatus, blocked retrieval, real hover hiding, drag-back and drag-out, and all lab playthroughs.


## Evaporation and salt recovery

Open `evaporation.html` using the Evaporation link from any other lab. Pour the sodium chloride solution into the basin, place it on the heater, and select the heater/press Space to heat it. The collecting beaker is available for transfers, but the objective is dry salt recovery in the basin.

The visible state changes from solution to wet residue, then dry salt residue as water leaves. Finish reports material distribution and dry recovery, followed by the explanation question for a successful result. Wet residue is not counted as dry recovered salt. There is no new balance, scooping task or student calculation interface.

The model conserves water across vessels, spills and vapour, and salt across vessels/spills. Its amounts, heating speeds and dissolved/solid capacity are qualitative rather than real solubility or temperature data. Gravity, spills, drawer storage, restart and fresh navigation follow the other labs. See [the specification](../docs/design/evaporation-prototype-spec.md) and [review](../docs/design/evaporation-prototype-review.md).


## Recrystallisation

Choose Recrystallisation from any other lab. Add water to the impure potassium nitrate, heat to dissolve it, hot-filter the sand, cool the filtrate and use clean paper to collect crystals from mother liquor. Select the heater and press Space to switch it; hold a beaker and use Space to pour. The drawer supplies both filter papers and preserves loaded filters when stored.

Finish reports undissolved starting solid, dissolved solute, recrystallised solid, sand and water by location. Recovery counts crystals on paper free of the represented sand/raw-solid contamination. Collected crystals are wet; no final drying or balance is included.

The temperature-dependent capacity and thermal rates are qualitative defaults, not verified potassium-nitrate solubility data. See [the bounded specification](../docs/design/recrystallisation-prototype-spec.md) and [review](../docs/design/recrystallisation-prototype-review.md). Other roadmap labs remain proposals.

## Lab corrections — 22 October 2026

The equipment drawer now sits beside the first lab row and scrolls with it. Review answer positions are shuffled. Resting stands resist slow numerical creep.

Filtration prevents water spills: a missed/full receiver stops the transfer and leaves the remaining mixture in the source. Switch collecting beakers to finish. Dry sand can still spill.

Distillation includes a removable filling funnel. Remove it before fitting the still head. The requested teaching model collects acetone at 56°C, keeps water in the flask until 100°C and stops vaporisation below the active threshold on cooling. This is not real acetone–water equilibrium behaviour or a purity prediction.

Recrystallisation evaporates water from heated water or solution beakers and reports it separately; solute stays behind. In chromatography review, drag the review ruler to measure both baseline-relative distances and calculate R_F. The review ruler moves independently of the frozen practical setup.

## Beaker endpoint and three-question reviews

Recrystallisation can finish once crystals form in a clean beaker, even while mother liquor remains. Filtering those crystals onto paper is optional. The result separates crystals in beakers from crystals on paper and excludes dissolved solute, sand-contaminated material, original undissolved solid and spills from the crystal fraction.

Each lab keeps its existing first question and adds two harder questions. Multiple-choice options have comparable lengths and shuffled order; later numerical questions require typed calculations with feedback and retry. Chromatography retains the draggable ruler and measured R_F table, and adds numerical R_F and baseline-offset calculations. See [the complete question set](../docs/design/review-questions.md).

For distillation, release the filling funnel above the upright supported flask. Its narrow stem drops into the neck and the cone rests at the mouth. Lift/store it before fitting the still head.

Distillation now seats nearby matching glass joints and hose fittings more forgivingly. The still-head outlet slopes down to match the Liebig condenser. Check the live connection panel below the bench: glass joints should show connected, coolant should be flowing, and a receiving beaker should be aligned. The panel explains any open joint or missing circuit and shows flask, collected, escaped-vapour and spill amounts. Wrong setups can still lose material; upper-port water supply remains possible with reduced recovery.

## Window-filling lab layout

The lab now uses almost the entire window. Decorative branding bars, large page headings, slogans, prototype captions, availability labels and footers are removed. Objectives, selected-equipment actions, optional Controls, experiment feedback, review questions and compact lab-switch links remain. Controls start collapsed.

The equipment drawer sits between the objective panel and the workbench. Hover opens it over the bench; moving away closes it. Drag stored equipment out into clear bench space, and drag it back to the drawer to store it. The visible room resizes without stretching equipment or changing the experiment's physics coordinates. On narrow screens, the objective/actions sit above the bench, with the drawer beside it.


## Solution preparation and dilution

Open `solution.html` or choose **Prepare & dilute** in the laboratory room. Prepare 100.0 mL of 0.100 mol dm⁻³ NaCl, then dilute a 10.00 mL aliquot to 100.0 mL. Use the balance, selectable spatula portions, beaker/rod, funnel, wash bottle, two volumetric flasks, stoppers and pipette/filler.

This lab uses **discrete additions**, including Space: each press adds once and stops. Bulk water additions stop at 95 mL in a flask; use 1 mL or 0.1 mL buttons near the mark. Extra presses can overfill, but waiting cannot. Place the wash bottle beside a selected vessel to expose its water buttons. Set the spatula portion before dragging. Space fits a nearby funnel/stopper and mixes a selected stoppered flask; dragging a fitting removes it. Pipette filling and delivery are separate actions.

The review shows actual preparation measurements and three questions, including mass and concentration calculations. See [the practical walkthrough and limitations](../docs/design/solution-preparation-prototype-review.md). The stock's prepared volume is recorded before sampling; its remaining volume is lower after the aliquot is taken.


## Acid–base titration

Open `titration.html` or choose **Titration** in the laboratory room. Use a 25.00 mL HCl aliquot and 0.100 mol dm⁻³ NaOH to determine the unknown acid concentration. The seventh lab includes the stand, burette/funnel, pipette/filler, conical flask, indicator and immersed pH probe.

Each addition stops: 1 mL, 0.1 mL or one 0.05 mL drop. Prime the tip into waste, then record your initial reading. Swirl after additions, judge the endpoint and record the final reading as a trial. Finish opens three questions, including titre and concentration calculations from your readings. An incomplete attempt uses a labelled example.

For the full walkthrough, supported mistakes and model limits, see [the titration review](../docs/design/titration-prototype-review.md). No timed flow, account or new dependency is needed.


### Alternative titration samples

The Titration **Sample** dropdown now offers HCl, CH₃COOH (ethanoic acid) and NH₃ (ammonia). Choosing another sample resets the attempt; Restart retains the current sample. CH₃COOH uses 0.100 M NaOH and phenolphthalein. NH₃ uses 0.100 M HCl and methyl red. All three retain the immersed pH probe, discrete delivery and three calculation/concept questions.

The weak samples include buffer behaviour and non-neutral equivalence pH; their interpretation is labelled as an AHL extension. See [the model and curriculum reference](../docs/curriculum/weak-titrations.md).


### Independent reagents and indicators

The titration now has independent **Acid**, **Base** and **Unknown sample** controls. Select any HCl/CH₃COOH and NaOH/NH₃ pairing in either direction, including weak–weak. Reagent/role changes reset the attempt; Restart retains them.

All three current indicators are available as separate Equipment droppers: bromothymol blue, phenolphthalein and methyl red. They are never selected or added automatically. Students may omit them, choose an unsuitable indicator or mix them. The actual colours, pH, titre and apparent concentration remain reviewable. The review distinguishes stoichiometric delivery from a reliable visual endpoint and explains weak–weak limitations after the attempt.


## Neutralisation and ethanol combustion calorimetry

Open `neutralisation.html` or `combustion.html`, or choose them from the laboratory room. Both use discrete 10 mL / 1 mL pouring and the shared drawer. Move the thermometer near a vessel and use **Clip to vessel rim**, then record initial/final temperatures deliberately. Stir with the rod. In neutralisation, remove the lid before adding reagents, then refit it to reduce heat loss. In combustion, put the aluminium can on its raised support, slide the ethanol burner beneath, and weigh the burner before and after burning. Space or its button lights/extinguishes it. Stop heating before the final weighing.

Read [the walkthrough and verification](../docs/design/calorimetry-prototype-review.md) and [the model assumptions](../docs/design/calorimetry-prototype-spec.md). Three questions use measured temperature changes, total liquid mass, aluminium heat capacity where relevant, and the reacting amount/fuel mass loss. An incomplete attempt uses a labelled supplied example. No automatic ideal peak replaces a recorded reading.


## Reaction rates

Choose **Reaction rates** in the laboratory room, or open `rates.html`. Compare equal measured portions of calcium carbonate chips and powder with excess HCl. The shared drawer supplies a spatula, inner acid vial, flask, bung/delivery tube, supported 100 mL gas syringe and water/waste. Each solid/liquid action handles one portion. Assemble before tipping the inner vial; the first mix action can start timing simultaneously. Independent mixing/clock and loose connector controls allow mistakes.

Record readings manually or enable the two-second logger. Measurements and coloured curves appear below the workbench. Save/Fresh trial retains comparison data only within this page attempt; Restart or leaving discards it. The three questions cover collision/surface-area reasoning, mean collection rate and theoretical CO₂ with the limiting reagent. See [the walkthrough](../docs/design/reaction-rates-prototype-review.md) and [model/source limits](../docs/design/reaction-rates-prototype-spec.md).

### Apparatus corrections after owner playtesting

Beaker spouts now face the clockwise pouring direction, contents stay inside vessel interiors, and solid material is drawn as individual grains. The visible bench meets the physical resting surface. For discrete transfers, centre the source above the receiving opening or place its lip above it, then press Space; each addition stops itself. In solution preparation the salt bottle can deliver 0.050 g portions; carbonate bottles in reaction rates deliver 0.10 g portions. Spatulas remain available for finer amounts. The preparation balance now weighs/tare-corrects a beaker as well as the boat; the combustion balance also weighs a beaker. Empty beakers are modelled as 50 g, volumetric flasks as 60 g, with the existing 1 g/mL water/carrier approximation. These are teaching defaults, not calibrated real glassware masses.

## Conductivity, colorimetry and zinc–copper cells

Open `/conductivity.html`, `/colorimetry.html` or `/voltaic.html`, or choose the corresponding bench in the laboratory room. All three use drag/Space actions, finite materials, local in-memory observations and three review questions. The conductivity/cell wire ends can be dragged to terminals; selecting a probe or metal strip also offers lead buttons. Colorimetry fits measured standards with the concentrations you enter, not hidden model concentrations. The cell supports reversed leads, an open bridge and a loaded discharge.

See [the walkthroughs](../docs/design/measurement-labs-prototype-review.md), [model assumptions](../docs/design/measurement-labs-prototype-spec.md), [common/AHL mapping](../docs/curriculum/measurement-labs.md) and [next review questions](../docs/design/next-review-and-questions.md). The new meter/cuvette/electrode drawings are original functional SVGs in the B palette; existing glassware retains the detailed B sprites. Run `node tests/measurement-labs-browser.mjs` for the native three-lab workflows; `npm test` includes their conservation and fault checks.
