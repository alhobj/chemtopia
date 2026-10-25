# Existing Chemtopia world art

These files are unchanged runtime copies of the existing project art proposals:

- `characters-c01.png`: `docs/art/proposals/character-studies-c01.png`, the six C01 appearances selected by the owner.
- `buildings-h01.png`: `docs/art/proposals/building-studies-h01.png`, H01-1 selected as the laboratory, other buildings retained for town use.

Original proposal authorship/source records remain with the art documents. These are project-generated concept assets, not downloaded third-party game sprites. Runtime SVG clipping selects the existing front/back appearances and building silhouettes without modifying the source sheets. The six players now also have dedicated directional walking atlases, described below.

## Directional walking atlases

`walk-c01-1.png` through `walk-c01-6.png` are new `image_gen` adaptations of the corresponding selected C01 character, made for the owner's four-direction walking request. They are unchanged generated transparent PNGs, each a four-column, three-row atlas: down/front, up/back, right. Left uses a mirrored right frame. The original selection portraits remain unchanged. Generation sources and layout are recorded in `walk-atlases.json`; original generated files remain in the workspace's `generated_images` directory. These are generated project assets rather than third-party sprites.

Run the game and open `/walking-preview.html` to inspect all six identities in all four directions. Each cycle has four art frames; actual town travel drives its cadence. Atlas refinement remains subject to owner playtesting.

## Additional NPC appearances

`npc-children-n01.png`, `npc-adults-n02.png` and `npc-chemists-n03.png` are new, unchanged `image_gen` character sheets: six distinct NPCs per group, with front/back views. They reference C01 for the detailed B style and add new identities. `npc-sources.json` records briefs, original source filenames, dimensions and checksums. The SVG catalogue uses inspected per-column row boundaries to display portraits without altering source pixels. `/npc-preview.html` is the review gallery. These are static appearance assets; NPC animation, town placement, names and quest assignments remain later work.

## Four-direction NPC standing revision

The `npc-*-directions-n0*.png` sheets update all eighteen existing NPCs to south, north, east and west standing views. Column identity order is unchanged. East and west are separate drawings, not runtime reflections, so asymmetric accessories can remain consistent. Original two-view sheets above are retained as source history. `npc-atlases.js` stores inspected source-pixel frame bounds; `npcArt()` supports cardinal directions and legacy front/back calls. The gallery now shows all 72 views, with direction labels. Generation prompts and checksums are recorded in `npc-direction-sources.json`. No NPC walking, town placements or quests are introduced.

## Idle animation frames

Nine `idle-*.png` atlases add 192 matching full-body frames: neutral four-direction player standing, four-direction blink frames for players and all NPC groups, and three-step south-facing personality gestures for each actor. Source PNGs are unchanged generated files. `idle-sources.json` records exact prompts, reference sheets, original generated filenames, dimensions and checksums. `idle-atlases.js` stores inspected cell/silhouette coordinates; runtime SVG registers feet and clips upper/lower body for subtle breathing. `/idle-preview.html` demonstrates the shared idle renderer and controls. See `docs/art/idle-animations.md` for actions and current direction support.
