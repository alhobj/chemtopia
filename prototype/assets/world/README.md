# Existing Chemtopia world art

These files are unchanged runtime copies of the existing project art proposals:

- `characters-c01.png`: `docs/art/proposals/character-studies-c01.png`, the six C01 appearances selected by the owner.
- `buildings-h01.png`: `docs/art/proposals/building-studies-h01.png`, H01-1 selected as the laboratory, other buildings retained for town use.

Original proposal authorship/source records remain with the art documents. These are project-generated concept assets, not downloaded third-party game sprites. Runtime SVG clipping selects the existing front/back appearances and building silhouettes without modifying the source sheets. Full directional walk cycles remain future work.

## Directional walking atlases

`walk-c01-1.png` through `walk-c01-6.png` are new `image_gen` adaptations of the corresponding selected C01 character, made for the owner's four-direction walking request. They are unchanged generated transparent PNGs, each a four-column, three-row atlas: down/front, up/back, right. Left uses a mirrored right frame. The original selection portraits remain unchanged. Generation sources and layout are recorded in `walk-atlases.json`; original generated files remain in the workspace's `generated_images` directory. These are generated project assets rather than third-party sprites.

Run the game and open `/walking-preview.html` to inspect all six identities in all four directions. Each cycle has four art frames; actual town travel drives its cadence. Atlas refinement remains subject to owner playtesting.
