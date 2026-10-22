# Filtration prototype

Approved first increment: a standalone sand-and-water filtration workbench. See [the approved specification](../docs/design/filtration-prototype-spec.md).

## Run

From the repository root, with Node.js 22 or newer:

```bash
npm start
```

The development server reports port 4173. Open that port in a desktop browser on the same machine. Set `PORT` to use another port. The server serves only the `prototype/` directory, not private curriculum documents.

No dependency installation is needed. The application is static and uses local HTML, CSS, JavaScript and SVG. It has no accounts, analytics, remote requests, database or saved progress. The Node server is only a local static development server, not an application backend.

For VS Code terminal instructions and a file guide, see [Run and edit in VS Code](../docs/development.md).

## Controls

- Drag apparatus to hold and move it. Solid parts block overlap, including the stand. On release, unsupported objects fall and collide. The funnel seats in the ring; on the bench its thin stem is unstable and contact causes it to tip.
- Hold a beaker above an opening with room to tilt while dragging, press **Space** once to start pouring, then press it again to stop. Releasing the mouse also stops pouring and lets the beaker fall. Holding Space does not repeatedly toggle the action. Stop pouring and move the beaker to a safe resting place before releasing it.
- The **Start pouring / Stop pouring** button also toggles pouring for the selected beaker. Arrow-key movement, Enter placement and Escape cancellation are removed for now at the owner's request. Normal keyboard use of buttons and answer choices remains available.
- Changing selection, finishing, restarting, losing focus or hiding the page stops pouring. An empty beaker stops automatically.
- **Restart** resets the whole task. **Finish** ends practical work and shows material distribution. A successful result opens the approved explanation question.

There are no currency rewards, room navigation, avatar selection or additional separation activities in this increment.

## Representation and limitations

The prototype uses explicitly labelled **functional placeholder artwork**, with the palette and clarity of design B as direction. It does not yet use final production pixel sprites.

Amounts are internal qualitative state, not calibrated readings. Sand stays represented as insoluble particles; filter paper retains it while water passes through. Pour flow is simplified, including the homogeneous transfer of the represented batch during a pour; settling and decantation are not simulated. Filtration is represented without detailed hydraulic rates or paper moisture retention. Retained sand is described as wet, not dried.

Equipment now uses local two-dimensional rigid-body collisions. The stand has separate base, rod, arm and ring shapes, and the funnel seats above the ring on contact. Falling contact causes tipping; tipped water and sand drain into actual receivers or spills. Moving a seated stand also checks its funnel against other equipment. See [the interaction details and limits](../docs/design/physics-interactions.md).

Collision shapes, masses, friction, ring support constraints and tipping/drain thresholds are qualitative approximations. Folded paper has a containment exception while being inserted in its funnel. No glass breakage, impact damage or additional chemistry process is simulated. Matter.js 0.20.0 is bundled locally with its [MIT licence and source record](vendor/README.md); no runtime network access is needed.

## Verification

```bash
npm test
npm run test:browser
```

Model checks use Node's built-in test runner. Browser checks need Chromium at `/usr/bin/chromium`, or set `CHROMIUM` to its executable path. They launch a disposable headless browser and a temporary static server, exercise real mouse/keyboard input and close both afterwards. They do not install browser packages.

Browser screenshots are written to the operating system temporary directory for inspection. Browser support beyond the tested Chromium environment is not yet verified.
