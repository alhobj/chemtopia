# Filtration prototype

Approved first increment: a standalone sand-and-water filtration workbench. See [the approved specification](../docs/design/filtration-prototype-spec.md).

## Run

From the repository root, with Node.js 22 or newer:

```bash
npm start
```

The development server reports port 4173. Open that port in a desktop browser on the same machine. Set `PORT` to use another port. The server serves only the `prototype/` directory, not private curriculum documents.

No dependency installation is needed. The application is static and uses local HTML, CSS, JavaScript and SVG. It has no accounts, analytics, remote requests, database or saved progress. The Node server is only a local static development server, not an application backend.

## Controls

- Drag apparatus; release it to place it. Compatible physical attachments are available without correct-position guides.
- Select a beaker, put it above a receiving opening or the bench, and hold **Hold to pour**. Release to stop. Use a clear part of an object's outline or body to select it; an inserted paper can be selected separately from its funnel.
- For keyboard operation, Tab to an apparatus button, use arrows to move it (Shift + arrow for smaller movements), and Enter to place it. Escape cancels the current placement. Tab to the Pour control and hold Space to pour.
- **Restart** resets the whole task. **Finish** ends practical work and shows the resulting material distribution. A successful result opens the approved explanation question.

There are no currency rewards, room navigation, avatar selection or additional separation activities in this increment.

## Representation and limitations

The prototype uses explicitly labelled **functional placeholder artwork**, with the palette and clarity of design B as direction. It does not yet use final production pixel sprites.

Amounts are internal qualitative state, not calibrated readings. Sand stays represented as insoluble particles; filter paper retains it while water passes through. Pour flow is simplified, including the homogeneous transfer of the represented batch during a pour; settling and decantation are not simulated. Filtration is represented without detailed hydraulic rates or paper moisture retention. Retained sand is described as wet, not dried.

The small supported action set covers beakers, funnel, paper, stand, pouring, removal/movement, spills, overflow and reset. It is not a general-purpose physics engine: arbitrary collisions, glass breakage, heaters and other chemical processes are outside this approved increment. Physical alignment and receiving openings use finite geometric tolerances; these may need refinement after the owner's playtest.

## Verification

```bash
npm test
npm run test:browser
```

Model checks use Node's built-in test runner. Browser checks need Chromium at `/usr/bin/chromium`, or set `CHROMIUM` to its executable path. They launch a disposable headless browser and a temporary static server, exercise real mouse/keyboard input and close both afterwards. They do not install browser packages.

Browser screenshots are written to the operating system temporary directory for inspection. Browser support beyond the tested Chromium environment is not yet verified.
