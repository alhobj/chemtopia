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
3. **Implemented — progression map:** shared eligibility, data-generated acquisition-kit branches, selectable requirements, available/completed/missing equipment/missing supplies states, zoom/pan and accessible experiment selector. No experiment-completion prerequisites.
4. **Implemented — ownership and acquisition:** persistent counted inventory; configurable prices; atomic validated purchases; idempotent future reward API; one-time testing allowance; adventure-only apparatus enforcement and per-attempt supply reservations. Review completion is saved without invented currency rewards.
5. **Validated:** all 249 model/save/progression tests pass; all 14 browser harnesses pass, including the existing practical workflows, all six selected characters, confirmed/cancelled New Game, tutorial resume, actual starter evaporation/review completion, purchases, one-time grant and phone map. Static checks, build, audit regeneration and whitespace checks pass. Owner playtesting remains.

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
- The map shows per-experiment acquisition milestones. Shared apparatus counts across branches, so these are shopping requirements, not separate mandatory kit purchases or a linear curriculum sequence.
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
- `npm test` — 252 chemistry/model/save/progression/walking tests.
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
