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
