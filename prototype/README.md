# Separation prototypes

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

Use the bottom **Go to distillation** button for the second experiment. Switching experiments starts a fresh attempt. There are no currency rewards, room navigation or avatar selection.

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


## Distillation

The [approved distillation specification](../docs/design/distillation-prototype-spec.md) uses equal model mole amounts of acetone and water. Pour feed into the flask, assemble and support the glass path, place a collecting beaker beneath the condenser outlet, and drag both ends of each water hose onto fittings. Select the heater or tap and use Space or the action button to switch it on/off. Picking up apparatus disconnects its joints; connected hose ends follow their fittings until dragged away.

Both sample liquids can vaporise. Early collected liquid is acetone-enriched, rather than pure acetone. Finish reports acetone recovery separately from collected composition, together with vessels, spills and escaped vapour. Direct feed transfer does not count as distilled recovery.

Either coolant port accepts the supply. In this qualitative model, upper-port supply fills the jacket less effectively and collects less acetone under comparable heating conditions. Coolant stays separate from the sample. Jacket fill, relative volatility and heating rates are readable prototype approximations, not calibrated laboratory predictions.

Clamps and compatible glass joints attach at close contact. Temporary collision exceptions represent opening clamps and inserting joints; connected equipment forms a constrained assembly. Flexible hoses are visual connections, without hose tension or fluid-pressure simulation. The heater begins on the bench, unconnected; it remains movable. The thermometer shows qualitative heat, without numerical temperature. No pressure, bumping, breakage or injuries are simulated.
