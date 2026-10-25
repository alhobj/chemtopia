# Chemtopia implementation roadmap — 25 October 2026

## Inspection findings

- Runtime: dependency-free static HTML/CSS/ES modules, Node 22 static server (`scripts/serve.mjs`), local Matter.js for lab physics. No engine/framework replacement is needed.
- Six existing selected characters: C01-1–C01-6 in `docs/art/proposals/character-studies-c01.png`, each with front/back views. They were selectable designs in documentation, not playable runtime characters. All six actual appearances are reused through runtime SVG viewports; no replacement identities are generated.
- Existing town implementation: none found in runtime. H01-1–H01-6 building art and a C01-1 walking study exist. H01-1 is the chosen laboratory exterior; other buildings were retained for other locations. The current implemented room is `laboratory.html`, not a town.
- Existing labs: filtration, evaporation, chromatography, recrystallisation, solution preparation/dilution, titration, distillation, neutralisation calorimetry, ethanol combustion calorimetry, rates, conductivity, colorimetry, Zn–Cu voltaic cell (13 total).
- Existing inventory: the per-attempt apparatus drawer in `equipment-storage.js` / `equipment-menu.js`; it preserves apparatus/contents within an attempt, not ownership between sessions. Reuse its containment and physics handling.
- Existing currency, missions, persistent ownership and saves: none found in runtime. Q31 requests a later first-try reward preference but no amount/name/economy was settled. Previous no-persistence scope is superseded by the owner's explicit local-save request for this expansion; no external service is authorised.
- Existing lab completion: common three-question review callback, with an additional measured-ruler completion condition in chromatography. Chemistry, wrong actions and review contents will be preserved.

## Confirmed answers this session

- One local profile per browser for now.
- Individual equipment ownership.
- Revised direction: NPCs will give practical laboratory quests (for example, separate supplied solutions). Successful practical quest completion should earn credits or equipment. The owner explicitly deferred quest implementation; existing review completion stays operational for this playtest and must not be treated as the final quest success rule.
- Keep free restocking of complete experiment supply packets for now.
- Availability depends on equipment/materials only; no arbitrary completed-topic prerequisites.

## Priorities / status

1. **Implemented — playable onboarding:** six actual C01 avatars, validated local nickname, confirmed New Game with archived save, returning profile, navigable town, five event-based tutorial stages with replay/resume.
2. **Implemented — actual equipment audit:** all 13 experiments / 129 apparatus instances mapped; reusable counts, core/optional materials, provided facilities, assemblies and uncertainties recorded in `docs/design/experiment-equipment-audit.*`.
3. **Implemented — progression map:** shared eligibility, a data-generated graph of reusable equipment dependencies with arrows and exact additions, selectable requirements, available/completed/missing equipment/missing supplies states, zoom/pan and accessible experiment selector. No experiment-completion prerequisites.
4. **Implemented — ownership and acquisition:** persistent counted inventory; configurable prices; atomic validated purchases; idempotent future reward API; one-time testing allowance; adventure-only apparatus enforcement and per-attempt supply reservations. Review completion is saved without invented currency rewards.
5. **Rendering correction validation (previous increment):** all 264 model/save/animation/rendering tests passed; all 15 browser harnesses passed, including all thirteen practical labs, town/tutorial/save/shop/map, character animation and phone layouts. Build/static checks, the 13-lab/129-apparatus audit and whitespace checks pass. Owner feedback P01–P10 is recorded below; the rendering corrections need owner recheck.

## Reversible defaults

- Local save schema v2 under `chemtopia.player`; validated migration for a v1-shaped local save, protected unrecognised/corrupt data, backup/recovery keys and confirmed New Game. No previous runtime save system exists to migrate automatically.
- Names are local nicknames, 1–24 characters starting with a letter; Unicode supported. No identity is sent to a server.
- Town controls: WASD/arrows, click-to-walk with obstacle routing, E / Interact, and touch controls. Existing lab Space/drag controls remain independent.
- Smallest core setup identified so far: evaporation requires one beaker, basin and electric heater, plus a salt-solution batch; its extra receiving beaker is optional. Starter supply: two batches, with free packet restocking available to prevent tutorial softlocks.
- Currency placeholder: “Lab credits”, starting 20. Prices and an optional one-time 1000-credit testing allowance are configurable, not permanent mission rewards. No completion rewards or mission campaign is being invented. The current combined core apparatus beyond the starter kit costs 695 credits, so the testing allowance covers all 13 core setups.
- Character selection keeps actual concept-sheet portraits. Town walking uses new matching directional atlases for all six identities; the older W01 remains a one-character motion study.
- Lab ownership enforcement will apply to explicitly launched adventure attempts. Bare lab URLs and bare laboratory selection remain a clearly separate practice/playtest route so existing labs/tests remain usable.
- Supplies represent complete premeasured experiment batches in the units already used by each chemistry model, not invented conversions from qualitative state to real millilitres. They are reserved once per attempt; per-pour chemistry remains unchanged.

## Questions

No blocking question remains for this increment. Confirmed choices above settle save slots, ownership and prerequisites. The owner initially retained review rules, then revised the future design to practical NPC quests with credit/equipment rewards, explicitly deferring implementation. Free supply-packet restocking remains confirmed. Later decisions: final currency name/balance/prices; mission rewards and first-try bonus amounts; character customisation/production animations; future upgrades versus distinct apparatus; town size and NPC roles. Defaults remain configurable and are not presented as final selections.

## Known limitations / next concrete step

- Town now uses dedicated four-frame front/back/right walk atlases for all six selected C01 identities, with mirrored left-facing frames. Gait follows actual travel distance and stops when idle, blocked or in a dialog. Four-direction facing persists with existing saves. Original character-selection portraits are preserved.
- Live lab physics is not serialised. Reopening an active reservation restarts its setup with the reserved supplies; town/tutorial/inventory/completion persist. Starting another attempt reserves another packet.
- Consumable stocks are activity packets, not persisted per-pour mL/g. Free supply-packet restocking is owner-confirmed for now; no per-pour stock accounting or supply charges are introduced.
- Current implemented completion follows the existing successful review (and chromatography ruler condition) pending future quest work. The newly selected future direction is NPC-issued practical tasks with credit/equipment rewards; no quests, new success checks or rewards are implemented in this walking increment.
- The map connects strictly smaller reusable equipment kits to larger kits, assuming the minimal starter kit remains owned. Shared apparatus counts across branches. Links show equipment reuse, not mandatory earlier experiment completion; consumables are checked separately.
- Bare laboratory pages remain separate unrestricted practice, without progression recording. Adventure attempts enforce ownership.
- Corrupt/future saves are protected; a confirmed New Game archives the original. Local-only saves can still be lost if browser storage is cleared. No export/cloud service is added.
- Next concrete step after validation: owner plays the town/tutorial and starter evaporation, then tests a shop branch and reviews the new walking cycles. Supply packets remain freely restockable; economy balancing and practical quest design remain future work. Future implementation: design NPC-issued practical quests and success criteria before implementing quest/reward integration; owner explicitly deferred quests.

## Architecture and progression

- `characters.js`, `town-model.js`: existing-art identities and navigable town.
- `equipment-catalog.js`, `experiment-definitions.js`: stable IDs, configurable prices, all requirements/assemblies/facilities; one shared `eligibility()` for map, room and launch.
- `player-store.js`, `tutorial.js`, `progression.js`: versioned local profile, protected migration, transactional ownership/currency/reservations, tutorial events and reward claims.
- `adventure-app.js`, `progression-ui.js`: onboarding/town/dialogues/map/shop and shared requirements.
- `adventure-lab.js`: ownership adapter around existing labs; original chemistry/physics models unchanged.

Starter: evaporation (beaker + basin + heater; two salt-solution supplies). Branches include filtration (second beaker/funnel/stand), paper chromatography (chamber/support/pencil/markers/ruler), measurement (balance/volumetric glassware/pipettes), heating/distillation (flask/head/condenser/stands/thermometer), calorimetry, gas collection, and optical/electrical instruments. Every exact count and material is visible in the map and audit; acquisition in one branch contributes to all others.

## Prioritised questions for the owner

1. What should final equipment prices, initial credit balance, mission rewards and first-try bonuses be? Current equipment prices and the testing grant are replaceable; supplies remain freely restockable for now.
2. Which NPC roles/town destinations and character customisation should come next? Four-direction walking is now implemented; future art feedback may refine it without replacing identities.

## Continuation prompt

Read AGENTS.md and CHEMTOPIA_ROADMAP.md. Preserve existing lab chemistry and the one-local-profile/individual-ownership/equipment-only unlock decisions. Inspect current tests and owner playtest feedback, then work on the next approved refinement. All thirteen canonical experiment definitions and the generated apparatus audit already exist; do not rebuild them or invent mission rewards.

## Commands

- `npm start` — local game, port 4173.
- `npm test` — 268 chemistry/model/save/progression/animation/rendering/network tests.
- `npm run test:browser` — existing Chromium practical workflows plus six-character/town/tutorial/shop checks.
- `npm run check` — JavaScript syntax and catalogue validation.
- `npm run build` — static files in `dist/`; serve through HTTP and open `adventure.html`.
- `npm run audit:labs` — regenerate and validate every actual model apparatus mapping.

## Foundation verification (before directional walking)

- `npm test`: 249 passed, 0 failed.
- `npm run test:browser`: all 14 harnesses passed; no browser runtime exceptions. Includes the existing practical lab regressions and actual adventure evaporation completion persisted after review.
- `npm run build`: passed, including JavaScript syntax and definition checks.
- `npm run audit:labs`: 13 experiments / 129 apparatus instances validated.
- `git diff --check`: passed.
- Manual visual inspection: six-character selection, town with selected avatar/buildings, and phone progression-map screenshots generated by the browser harness.

## Four-direction walking increment

Owner requested four-direction walking and deferred quests. All six identities receive twelve generated animation poses (four down/front, four up/back, four right); left mirrors right. Actual motion controls the animation, idle pose is stable, reduced-motion preference freezes gait while retaining directional facing. Dominant actual travel direction controls facing for keyboard, touch and routed walking; blocked movement does not walk in place. Existing front/back save values remain compatible and left/right now persist too.

Quest direction only: NPC gives a practical task → player completes laboratory outcome → credits or new apparatus reward. Do not implement quests or reinterpret old review completion as completed quests without a later authorised design step. Exact practical checks, quest stock handover and rewards remain to be decided.

### Walking verification

- `npm test`: 252 passed, 0 failed (includes directional movement, blocked facing, distance-based frame cycling, mirrored left, reduced-motion pose and all six saved directional identities).
- `node tests/adventure-browser.mjs`: passed native walking/frame/idle and atlas-loading checks for all six characters in all four directions, the existing town/tutorial/shop/starter practical workflow, all 24 preview combinations, preview pause and reduced-motion movement. No runtime exceptions.
- `npm run build` / syntax and definition checks: passed.
- `git diff --check`: passed.
- Preview: `http://127.0.0.1:4173/walking-preview.html` after `npm start`.
- The prior full 14-harness lab regression run remains recorded above; this walking-only increment reran the full model suite and relevant adventure browser workflow rather than claiming another full lab-browser run.

## NPC character art increment

Owner requested more NPCs, including children, adults and chemists. N01–N03 provide eighteen new static front/back designs (six per group), with a reusable stable-ID catalogue in `npc-characters.js` and `/npc-preview.html` gallery. See `docs/art/npc-character-studies.md`. Roles are suggestions for review; no new town actors, dialogue, quests or rewards are implemented. Existing six playable characters and their walking cycles are unchanged. Next: owner chooses design IDs and later assigns town roles/quest premises before quest implementation.

NPC verification: build/static checks passed; all 18 stable IDs and front/back mappings validated; native Chromium gallery check passed for 36 clipped portraits, all three PNG decodes, phone layout and no runtime exceptions. Source sheets remain unchanged, with inspected display boundaries and recorded checksums. This art/gallery-only increment does not change laboratory or save logic.

## Four-direction NPC graphics revision

The owner requested every NPC standing in east, north, west and south directions. All eighteen N01–N03 IDs retain their identities and suggested roles, now with four-direction standing atlases. Separate side views preserve asymmetric accessories; these are idle poses, not walking frames. The reusable renderer supports cardinal directions and keeps legacy front/back boolean calls compatible. The gallery displays all 72 views with direction labels and a phone layout. Original two-view source sheets remain archived; generation records distinguish the revision. Town placement and quests remain deferred.

Four-direction NPC verification: 254 model/save/art-catalogue tests passed; build/static checks passed; native Chromium verified 18 IDs, all 72 labelled and clipped directional views, image decoding, phone layout and no runtime exceptions. Standing silhouette bounds align display height and foot baseline across directions. A cropped initial child sheet was regenerated; only the complete corrected source is used. Original graphics remain archived.

## Character idle animation increment

Owner requested breathing, blinking and logical personality actions for players and NPCs. Implemented data-driven timing and a shared atlas renderer for all 24 actors, with upper-body breathing, visible-eye blinks, staggered 7–11 second initial gesture delays and interruptible anticipation/action/recovery. Gestures currently face south; four-direction standing idles preserve facing elsewhere. Town player and existing guide integrate the renderer; `/idle-preview.html` provides immediate gesture demonstration and pause/facing controls, and the NPC gallery animates its portraits. Reduced motion and hidden-page/offscreen handling are included. Nine matching atlases provide 192 original frames. Model and browser validation passed. See `docs/art/idle-animations.md`.

Idle verification: all 258 model/save/catalogue/animation tests pass. Native idle browser checks pass for 24 actor idles, real PNG decoding, breathing, gesture anticipation/action/recovery, side-facing blinks, pause, all 72 NPC gallery views, phone layout and reduced motion. The adventure browser workflow also passes, including a natural town gesture interrupted immediately by walking, all six selected avatars, tutorial/save/shop and actual starter evaporation/review completion. Build/static checks and whitespace checks pass. No full lab-browser rerun is claimed for this character-only increment.

Next concrete art refinement after owner playtesting: assess gesture frequency and scale, then consider additional east/west/north gesture keyframes. Current special actions are south-facing; breathing and appropriate blinking support all four facings.

## Owner playtest P01–P10 — 25 October 2026

Recorded answers (these supersede older open questions):

- P01: Character selection, movement controls and tutorial were clear and easy to use.
- P02/P09/P10: Prioritise town movement, animation transitions, visual consistency and lag. Lab liquid/solution and filter contents look wrong; the funnel needs improvement. Town walking skips back and forth. The progression view must show equipment relationships, such as evaporation equipment being reused for distillation with extra apparatus.
- P03: First future NPC task should recover dry salt from salt water by evaporation.
- P04/P08: Return to the NPC and submit the recovered product. NPC inspection judges the result; mistakes affect rewards.
- P05: A guaranteed basic reward with a bonus for a successful first attempt. How mistake penalties interact with that guaranteed base remains to be specified; no penalty thresholds are invented.
- P06: First quest rewards equipment that opens another experiment. Exact item and bonus amount remain undecided.
- P07: Give the goal, with optional hints on request.

**Quests remain deferred.** No quest, NPC inspection, bonus or reward was implemented in this correction. Existing review completion and free restocking remain operational for playtesting.

Follow-up performance clarification: the lag and character jumping were most noticeable **while walking in town on a laptop/desktop in a regular browser**. Prioritise this path before adding new game features.

### Implemented corrections

- Equipment graph now derives strict reusable-kit containment from the actual counted requirements plus the starter kit. Redundant transitive links are removed; equal kits cannot introduce a cycle. Evaporation leads to distillation; filtration leads to recrystallisation. Arrows and requirement details explain the additional items. These are equipment-sharing links, not new experiment-completion gates. Consumables remain separate eligibility checks.
- Walking frames are registered to measured torso centres and foot baselines, with the same visible height as standing players. The live SVG image is retained across gait frames instead of replaced each step. Click routes clamp the final step to the waypoint to avoid overshooting at low frame rates. Source PNGs are unchanged; `scripts/measure-walking.py` only reads alpha and writes metadata.
- Shared lab artwork updates retain identical SVG subtrees across physics frames, avoiding repeated parsing and image/layout churn for unchanged equipment. Vessel surfaces counter-rotate within their existing interior clips. Filter deposits are separate grains instead of a flat solid triangle. Funnel source crops separate the bowl from the narrow stem at the correct source boundary. No chemistry, material accounting, collisions or joint anchors changed.

Remaining visual work: owner recheck on the device that lagged; verify whether any particular gesture still changes pose/appearance abruptly. The separate generated gesture frames may still need individual art refinement. This correction is not a claim that every visual issue has been resolved.

Next concrete step: owner recheck of desktop town walking, filtration contents/funnel and the equipment dependency map after this correction. Later quest design needs the reward item, inspection criteria and first-attempt bonus definition before quest implementation.

Verification for the P01–P10 correction: `npm test` passes all **264** tests; `npm run test:browser` passes all **15** harnesses; `npm run build`, `npm run audit:labs` and `git diff --check` pass. Native browser assertions verify the same decoded walking image is retained across gait frames and unchanged stand artwork survives physics updates. Added graph tests validate exact counted equipment additions, no new completion gates, non-overlapping node layout and arrows avoiding unrelated boxes. The final routed map and town renderer also pass a separate adventure-browser rerun. Automated checks establish functional behaviour, not guaranteed frame rates on the owner's desktop.

## Equipment dependency network, available lab room and shop previews

Owner requested the branching/merging dependency idea illustrated by reference diagrams, without copying their structure, colours or design. Replaced the map's single experiment-kit view with a data-derived network of **23 reusable equipment groups and 13 experiments**. Shared equipment branches into multiple labs; all incoming required groups converge on each lab. Count milestones distinguish one, two, three and six beakers, and one/two stands. Apparatus used by precisely the same labs is bundled; there are no invented topic prerequisites or equipment-purchase prerequisites. Higher ownership counts imply lower counts, not additional purchases or consumption.

The map opens with the selected lab's requirement network so labels remain readable. **Show whole network** reveals all branches; selecting another lab and **Focus selected lab** narrows the view again. Equipment groups can be inspected to show exact ownership counts and the labs using them. Existing smaller-kit reuse relationships remain in the lab detail panel (including evaporation → distillation). Layout is derived from actual dependencies. Chemtopia's existing paper/teal/brass presentation is retained, along with pan/zoom and the accessible experiment selector. Supplies are still checked and listed separately in the shared requirements panel.

In the adventure laboratory room, both bench previews and accessible list entries are hidden unless the experiment is currently eligible. Missing consumables hide a lab too. Purchases/restocking reveal newly available experiments; storage and page-return events refresh the room. An empty-room message points back to map/shop. Future labs remain visible on the map. The unrestricted practice selector is retained for independent playtesting.

All **42** reusable equipment catalogue entries have labelled previews in the shop. They reuse the current Design-B apparatus rendering and matching measurement/rates drawings, with stable per-item coordinates. No new images, equipment, chemistry, prices, saves or quests were introduced.

Verified: **268 model tests pass**, build/static checks pass, and both the updated adventure browser workflow and unrestricted laboratory-room browser workflow pass. Model checks cover exact dependency coverage (all and only the actual equipment for every existing lab), branch/convergence validity, acyclicity, focus/layout, exact ownership states and all 42 finite labelled previews. Native browser checks pass for starting-room visibility, real purchases revealing filtration, missing supplies hiding experiments, restocking restoring both room/list entries, focused/whole map and catalogue previews. Existing unrestricted room/navigation also checked. Next: owner review of map readability and shop previews, alongside the pending desktop town walking recheck.

Map polish: desktop has an adjacent, independently scrollable requirements inspector; phone layouts stack it below the map. Equipment groups support keyboard inspection and links to their consuming labs. The initial focused view keeps labels readable; overview is intended for planning with zoom/pan. Routing checks verify no network arrow crosses an unrelated equipment or lab box. Scope validation reran the affected town/room browsers, not all fifteen lab/animation harnesses in this increment. All existing lab model tests remain in the 268-test suite; their chemistry and physics were not changed.
