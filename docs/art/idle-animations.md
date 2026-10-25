# Character idle animations

The owner requested breathing, blinking and occasional logical personal actions for players and NPCs. The shared idle system covers all six C01 players and eighteen N01–N03 NPCs.

## Behaviour

- Subtle upper-body breathing leaves the feet planted. Each identity has a different timing offset.
- Brief blinks occur about every 3.2–4.8 seconds where eyes are visible. Back-facing characters breathe without a visible-eye blink.
- Personality gestures begin after roughly 7–11 idle seconds, with a 14–20 second repeat interval. They use anticipation, action and recovery art.
- The current personality gesture drawings face south. Other facings retain breathing and visible-eye blinking. Turning is controlled by the existing movement system.
- Movement immediately returns the player to the existing walk cycle. Dialogue and attempted movement suppress longer personality gestures.
- Reduced-motion preference leaves a still standing pose. Hidden pages pause idle clocks; offscreen gallery portraits avoid continuous rendering.
- Balls, leaves, gum, watches and notebooks in these animations are cosmetic props. They do not create stock, purchases, quests or lab actions.

## Assigned visual actions

| Group | 1 | 2 | 3 | 4 | 5 | 6 |
| --- | --- | --- | --- | --- | --- | --- |
| C01 players | Check watch | Chew gum | Stretch shoulders | Quick underarm check | Adjust glasses | Tuck hair |
| N01 children | Toss/catch ball | Inspect leaf | Adjust glasses | Chew gum | Check watch | Quick underarm check |
| N02 adults | Straighten cardigan | Wipe hands on apron | Check watch | Adjust glasses | Stretch shoulder | Quick underarm check |
| N03 lab staff | Check notebook | Check watch | Adjust goggles | Stretch wrist | Turn notebook page | Adjust goggles |

These assignments are reversible art defaults following the owner's examples, not fixed character biographies. Goggles remain on during adjustment.

## Try it

Run `npm start`, then open **http://127.0.0.1:4173/idle-preview.html**. The page shows all 24 actors, a facing selector, natural timing, a pause control and **Show gestures** to demonstrate actions immediately. Town Options and the other character previews link here. The actual town player and existing guide use the same renderer.

`npc-preview.html` retains the four-direction comparison and now animates its portraits. `walking-preview.html` remains focused on walking.

## Implementation and sources

- `idle-definitions.js`: per-identity actions, direction eligibility and seeded timing.
- `idle-animation.js`: atlas selection, registered standing sprites, clipped upper-body breathing and image preloading.
- `idle-controller.js`: shared preview/gallery clock, visibility handling, pause and demonstration controls.
- `idle-atlases.js`: inspected source-pixel frame and silhouette bounds.
- `assets/world/idle-sources.json`: generator, original source files, reference sheets, prompts and checksums. Generated PNGs remain unchanged; runtime clipping and transforms animate them.

Existing player selections, saved progress, lab chemistry, apparatus physics and deferred quest design remain in place.
