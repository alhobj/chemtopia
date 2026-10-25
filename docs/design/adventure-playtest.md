# Town and progression playtest

Run `npm start` with Node 22+, then open `http://127.0.0.1:4173`.

1. Choose any of the six existing C01 characters, enter a nickname and start. Reload: the same local profile returns. Options → New Game asks before replacing it; cancelling preserves progress.
2. Walk with WASD/arrows, click destinations, or use the touch arrows. E / Interact activates a nearby destination. Inspect the welcome sign and guide, then follow the saved tutorial checklist.
3. Inventory distinguishes reusable apparatus from consumable supplies. Inspect both. Open the credit balance to read the provisional economy introduction.
4. Walk to the laboratory. Inspect evaporation: its beaker, basin and heater are owned. Start it, reserving one salt-solution packet. Other labs show their exact missing requirements. The extra evaporation receiver is optional and unavailable until a second beaker is owned.
5. Pour the salt solution into the basin and heat it using the existing controls. Completing the existing review records completion locally. Reloading a reservation restarts the apparatus setup without charging another supply packet; it does not restore a running physical simulation.
6. Open the progression map. Select any experiment, inspect requirements, zoom and pan. The accessible selector brings distant nodes into view. Equipment milestones describe additional apparatus, not mandatory earlier experiments.
7. Visit the equipment shop. The one-time testing allowance is provisional. Buy a second beaker, filtration funnel and stand; obtain sand–water and filter-paper supplies. Filtration becomes available immediately without requiring evaporation completion. Apparatus stays owned after use.
8. Replay the tutorial from Options; it retains inventory, credits and completions. Existing unrestricted labs remain at `/laboratory.html` for independent chemistry playtesting, without changing adventure progress.

Names and saves stay in the current browser. There are no accounts, analytics or external progress services. Clearing browser storage deletes the local profile. The roadmap records remaining questions, limitations and implementation commands.

## Four-direction walking playtest

All six selected characters now have front/back/right walk cycles and mirrored left frames. Move in each direction using WASD/arrows, touch arrows or click-to-walk. Releasing controls, opening a dialogue or reaching an obstacle stops the animation. The last facing direction survives saving. Reduced-motion preference keeps directional facing while freezing the gait. `/walking-preview.html` shows all 24 character/direction combinations together with a Pause/Play control.

Future quest direction has changed: NPCs will give practical laboratory tasks, completed for credits or equipment. The owner explicitly deferred implementation. Existing review completion is still in place for this playtest; it does not award quest rewards or implement future practical-success checks. Free supply-packet restocking remains confirmed.

## Idle animation playtest

Stand still in town for about 7–11 seconds while facing south. The player should breathe, blink and perform a brief personal gesture; press a movement key to interrupt it immediately. The guide has independent timing. Open Options → Preview character idles or `/idle-preview.html` to compare all 24 actors and use Show gestures without waiting. Side/front-facing blinks and breathing retain direction; personality actions currently use south-facing art. Pause and reduced-motion controls keep characters still.
