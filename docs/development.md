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
