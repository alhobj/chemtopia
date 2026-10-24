# Run and edit in VS Code

Install Node.js 22 or newer and Git if they are not already available. Node.js runs the small local development server. The browser runs the game; no JavaScript framework or package installation is needed.

## Open your copy

In VS Code choose **File → Open Folder** and select your `chemtopia` repository folder. Choose **Terminal → New Terminal**. This is a regular terminal, not the interactive Node.js `>` prompt. If you opened that prompt separately, `.exit` leaves it.

In the VS Code terminal, update your copy and start the game:

```bash
git pull
npm start
```

Open **http://127.0.0.1:4173** in your browser. Keep the terminal running. After editing a file, save it and refresh the browser. Press **Ctrl+C** in the terminal to stop the server. To restart, run `npm start` again.

Alternatively, run the same server directly:

```bash
node scripts/serve.mjs
```

VS Code also has **Terminal → Run Task → Chemtopia: run prototype**, which runs that Node command from the correct folder.

If you have not cloned the project, use a terminal in a parent folder first:

```bash
git clone https://github.com/alhobj/chemtopia.git
cd chemtopia
code .
```

If the `code` command is unavailable, open the folder through VS Code's File menu instead.

## Where to edit

| File | Purpose |
| --- | --- |
| `prototype/index.html` | Page structure, labels and laboratory background |
| `prototype/style.css` | Colours, typography and layout |
| `prototype/app.js` | Mouse and Space controls, drawing apparatus, results |
| `prototype/model.js` | Material transfers, paper containment and experiment results |
| `prototype/physics.js` | Hitboxes, gravity, contacts, ring support and tipping |
| `prototype/distillation.html` | Distillation page and temporary return navigation |
| `prototype/distillation-app.js` | Distillation controls, equipment drawing and review |
| `prototype/distillation-model.js` | Acetone/water balance, coolant circuit and joints |
| `prototype/chromatography.html` | Paper chromatography page and experiment navigation |
| `prototype/chromatography-app.js` | Direct marker/pencil actions, drawing and R_F task |
| `prototype/chromatography-model.js` | Solvent contact, marker development, material and measurement model |
| `prototype/equipment-menu.js` | Shared hover drawer, drag handling and keyboard retrieval |
| `prototype/equipment-storage.js` | Object-preserving storage, retrieval and initial shelf replacement |
| `prototype/evaporation.html` | Evaporation page and lab links |
| `prototype/evaporation-app.js` | Pouring/heating controls, residue drawing and review |
| `prototype/evaporation-model.js` | Non-volatile salt, liquid water, vapour and basin physics |
| `prototype/recrystallisation-model.js` | Solubility phases, hot filtration, cooling and wet crystal recovery |
| `prototype/recrystallisation-app.js` | Recrystallisation controls and material review |
| `prototype/recrystallisation-art.js` | Functional equipment and phase artwork |
| `scripts/serve.mjs` | Node.js static file server |
| `tests/model.test.mjs` | Chemistry/material and movement checks |

HTML and CSS work as usual. JavaScript is needed for the browser's interactive behaviour; Node.js is the program running the local server, rather than a separate game engine. There is no Python runtime requirement. No build step is required.

## Check changes

```bash
npm test
```

This runs with Node alone. The optional `npm run test:browser` needs a Chromium executable; see [the prototype guide](../prototype/README.md). It is not required just to play or edit the game.

The server is local, with no accounts, analytics or saved student data. It only serves the `prototype/` folder.

Review-question prompts, choices, numerical example data and marking live in `prototype/review-questions.js`. Each successful lab uses its three-question set. See [the question inventory](design/review-questions.md) for progression, solutions and source boundaries.

`prototype/workbench-layout.js` fits the room to the available pane while preserving equipment proportions and existing physics coordinates. Shared pane/drawer styling is in `prototype/style.css`, with the drawer hosted between objective and bench by `prototype/equipment-menu.js`. `tests/layout-browser.mjs` checks all five labs at desktop, wide-screen and mobile sizes.

## Editing the measurement labs

Run `npm start` from the VS Code terminal as before, then choose Conductivity, Colorimetry or Zn–Cu cell in the room. There is no separate build step or server for these activities. Save a file and refresh the page to start a new attempt with the changed code.

| File | What to edit |
| --- | --- |
| [conductivity-model.js](../prototype/conductivity-model.js) | Supplied sample amounts, weak/strong electrolyte response, probe contact/films and conductance records. |
| [colorimetry-model.js](../prototype/colorimetry-model.js) | Stock/unknown amounts, filter response defaults, blanking and measured calibration fitting. |
| [voltaic-model.js](../prototype/voltaic-model.js) | Half-cell supplies, rounded potentials, load/resistance defaults and finite metal/ion accounting. |
| [measurement-common.js](../prototype/measurement-common.js) | Finite liquid transfers, spills, apparatus contact, clipping and common physics handling for these three labs. |
| [measurement-app.js](../prototype/measurement-app.js) | Their practical controls, dragging, lead connections and observation tables. |
| [measurement-art.js](../prototype/measurement-art.js) | Original instrument drawings, LCD digits, cuvette views and wire rendering. |
| [measurement-review.js](../prototype/measurement-review.js) | Three-question reviews and the plotted calibration. |
| [measurement.css](../prototype/measurement.css) | Their controls, tables and responsive display. |

The HTML files select the lab through `data-measurement`; they reuse the shared app without a framework. Scientific assumptions and the provenance of numerical defaults are in [the specification](design/measurement-labs-prototype-spec.md). Update that explanation when changing the model, and distinguish a teaching coefficient from real measured data.

For a focused model check, run `node --test tests/measurement-labs.test.mjs`. With Chromium available, `node tests/measurement-labs-browser.mjs` exercises all three through their actual UI. `npm test` and `npm run test:browser` remain the complete project checks.
