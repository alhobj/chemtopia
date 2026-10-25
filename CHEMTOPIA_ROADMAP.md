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
- Keep existing review-based completion rules for now, including existing lab-specific conditions; do not add a new practical-success gate.
- Keep free restocking of complete experiment supply packets for now.
- Availability depends on equipment/materials only; no arbitrary completed-topic prerequisites.

## Priorities / status

1. **Implemented — playable onboarding:** six actual C01 avatars, validated local nickname, confirmed New Game with archived save, returning profile, navigable town, five event-based tutorial stages with replay/resume.
2. **Implemented — actual equipment audit:** all 13 experiments / 129 apparatus instances mapped; reusable counts, core/optional materials, provided facilities, assemblies and uncertainties recorded in `docs/design/experiment-equipment-audit.*`.
3. **Implemented — progression map:** shared eligibility, data-generated acquisition-kit branches, selectable requirements, available/completed/missing equipment/missing supplies states, zoom/pan and accessible experiment selector. No experiment-completion prerequisites.
4. **Implemented — ownership and acquisition:** persistent counted inventory; configurable prices; atomic validated purchases; idempotent future reward API; one-time testing allowance; adventure-only apparatus enforcement and per-attempt supply reservations. Review completion is saved without invented currency rewards.
5. **Validated:** all 249 model/save/progression tests pass; all 14 browser harnesses pass, including the existing practical workflows, all six selected characters, confirmed/cancelled New Game, tutorial resume, actual starter evaporation/review completion, purchases, one-time grant and phone map. Static checks, build, audit regeneration and whitespace checks pass. Production animation and owner playtesting remain.

## Reversible defaults

- Local save schema v2 under `chemtopia.player`; validated migration for a v1-shaped local save, protected unrecognised/corrupt data, backup/recovery keys and confirmed New Game. No previous runtime save system exists to migrate automatically.
- Names are local nicknames, 1–24 characters starting with a letter; Unicode supported. No identity is sent to a server.
- Town controls: WASD/arrows, click-to-walk with obstacle routing, E / Interact, and touch controls. Existing lab Space/drag controls remain independent.
- Smallest core setup identified so far: evaporation requires one beaker, basin and electric heater, plus a salt-solution batch; its extra receiving beaker is optional. Starter supply: two batches, with free packet restocking available to prevent tutorial softlocks.
- Currency placeholder: “Lab credits”, starting 20. Prices and an optional one-time 1000-credit testing allowance are configurable, not permanent mission rewards. No completion rewards or mission campaign is being invented. The current combined core apparatus beyond the starter kit costs 695 credits, so the testing allowance covers all 13 core setups.
- Character art is the actual concept-sheet appearance, displayed through cropped viewports on matching ground. A final directional walking sprite atlas remains a visual refinement; do not claim W01 provides all-six four-direction cycles.
- Lab ownership enforcement will apply to explicitly launched adventure attempts. Bare lab URLs and bare laboratory selection remain a clearly separate practice/playtest route so existing labs/tests remain usable.
- Supplies represent complete premeasured experiment batches in the units already used by each chemistry model, not invented conversions from qualitative state to real millilitres. They are reserved once per attempt; per-pour chemistry remains unchanged.

## Questions

No blocking question remains for this increment. Confirmed choices above settle save slots, ownership and prerequisites. The owner subsequently confirmed retaining existing review rules and free supply-packet restocking for now. Later decisions: final currency name/balance/prices; mission rewards and first-try bonus amounts; character customisation/production animations; future upgrades versus distinct apparatus; town size and NPC roles. Defaults remain configurable and are not presented as final selections.

## Known limitations / next concrete step

- Town uses the approved C01 front/back concept appearances with a walking bob; full directional sprite animations are still future art work.
- Live lab physics is not serialised. Reopening an active reservation restarts its setup with the reserved supplies; town/tutorial/inventory/completion persist. Starting another attempt reserves another packet.
- Consumable stocks are activity packets, not persisted per-pour mL/g. Free supply-packet restocking is owner-confirmed for now; no per-pour stock accounting or supply charges are introduced.
- Completion follows the existing successful review (and chromatography ruler condition). No new chemistry/practical success condition or mission reward has been invented.
- The map shows per-experiment acquisition milestones. Shared apparatus counts across branches, so these are shopping requirements, not separate mandatory kit purchases or a linear curriculum sequence.
- Bare laboratory pages remain separate unrestricted practice, without progression recording. Adventure attempts enforce ownership.
- Corrupt/future saves are protected; a confirmed New Game archives the original. Local-only saves can still be lost if browser storage is cleared. No export/cloud service is added.
- Next concrete step after validation: owner plays the town/tutorial and starter evaporation, then tests a shop branch and reviews provisional supply/economy policy. Future implementation: production character walk cycles and mission reward integration after design answers.

## Architecture and progression

- `characters.js`, `town-model.js`: existing-art identities and navigable town.
- `equipment-catalog.js`, `experiment-definitions.js`: stable IDs, configurable prices, all requirements/assemblies/facilities; one shared `eligibility()` for map, room and launch.
- `player-store.js`, `tutorial.js`, `progression.js`: versioned local profile, protected migration, transactional ownership/currency/reservations, tutorial events and reward claims.
- `adventure-app.js`, `progression-ui.js`: onboarding/town/dialogues/map/shop and shared requirements.
- `adventure-lab.js`: ownership adapter around existing labs; original chemistry/physics models unchanged.

Starter: evaporation (beaker + basin + heater; two salt-solution supplies). Branches include filtration (second beaker/funnel/stand), paper chromatography (chamber/support/pencil/markers/ruler), measurement (balance/volumetric glassware/pipettes), heating/distillation (flask/head/condenser/stands/thermometer), calorimetry, gas collection, and optical/electrical instruments. Every exact count and material is visible in the map and audit; acquisition in one branch contributes to all others.

## Prioritised questions for the owner

1. What should final equipment prices, initial credit balance, mission rewards and first-try bonuses be? Current equipment prices and the testing grant are replaceable; supplies remain freely restockable for now.
2. Which NPC roles/town destinations and character customisation should come next? Full walk cycles need final art, not additional character identities.

## Continuation prompt

Read AGENTS.md and CHEMTOPIA_ROADMAP.md. Preserve existing lab chemistry and the one-local-profile/individual-ownership/equipment-only unlock decisions. Inspect current tests and owner playtest feedback, then work on the next approved refinement. All thirteen canonical experiment definitions and the generated apparatus audit already exist; do not rebuild them or invent mission rewards.

## Commands

- `npm start` — local game, port 4173.
- `npm test` — 249 chemistry/model/save/progression tests.
- `npm run test:browser` — existing Chromium practical workflows plus six-character/town/tutorial/shop checks.
- `npm run check` — JavaScript syntax and catalogue validation.
- `npm run build` — static files in `dist/`; serve through HTTP and open `adventure.html`.
- `npm run audit:labs` — regenerate and validate every actual model apparatus mapping.

## Latest verification

- `npm test`: 249 passed, 0 failed.
- `npm run test:browser`: all 14 harnesses passed; no browser runtime exceptions. Includes the existing practical lab regressions and actual adventure evaporation completion persisted after review.
- `npm run build`: passed, including JavaScript syntax and definition checks.
- `npm run audit:labs`: 13 experiments / 129 apparatus instances validated.
- `git diff --check`: passed.
- Manual visual inspection: six-character selection, town with selected avatar/buildings, and phone progression-map screenshots generated by the browser harness.
