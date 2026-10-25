# Chemtopia

A chemistry learning game for students aged 16–19 studying IB Diploma Programme Chemistry.

The local prototype includes sand-and-water filtration, acetone–water distillation, marker-ink paper chromatography, evaporation/salt-recovery, recrystallisation, solution preparation/dilution, acid–base titration (independent HCl/CH₃COOH and NaOH/NH₃ choices), insulated-cup neutralisation calorimetry, ethanol combustion calorimetry, carbonate/HCl reaction rates, conductivity, colorimetry and zinc–copper voltaic-cell workbenches. The equipment uses the selected detailed B pixel-art sprite adaptation, with live liquid and instrument overlays. English is the project's working language. The town/adventure foundation now uses local browser saves; missions and final economic balancing remain in design.

## Try the prototype

With Node.js 22 or newer, run `npm start` from this repository and open `http://127.0.0.1:4173` on the same machine. Create a local nickname, choose one of the six existing C01 characters, and enter town. Follow the tutorial to your starter laboratory, inventory, shop and equipment progression map. Returning players resume automatically. For unrestricted laboratory playtesting, open `http://127.0.0.1:4173/laboratory.html`; choose an experiment from the illustrated benches. Use **← Laboratory** to return; switching starts a fresh attempt. No dependency installation is needed. Hold a beaker above a receiver while dragging, and press Space to start or stop pouring. Equipment and the stand have solid hitboxes. Unsupported equipment falls, and contact can cause tipping and spills. Hover over **Equipment** between the objective panel and the workbench to retrieve stored items, and drag objects back there to store them. Solution preparation, titration and calorimetry use discrete additions: each press delivers once and stops. Controls and limitations are in [the prototype guide](prototype/README.md).

Run `npm test` for the material-model checks and `npm run test:browser` for Chromium mouse/keyboard checks. See the [filtration review](docs/design/filtration-prototype-review.md), [distillation review](docs/design/distillation-prototype-review.md), [chromatography review](docs/design/chromatography-prototype-review.md), [evaporation review](docs/design/evaporation-prototype-review.md), and [recrystallisation review](docs/design/recrystallisation-prototype-review.md).

For step-by-step terminal instructions and a file guide, see [Run and edit in VS Code](docs/development.md).

## Start here

- [Three new measurement labs: walkthroughs and previews](docs/design/measurement-labs-prototype-review.md)
- [Next steps and questions N01–N12](docs/design/next-review-and-questions.md)

- [Reaction rates: chips, powder, CO₂ collection and graphs](docs/design/reaction-rates-prototype-review.md)

- [Illustrated laboratory selection and bench previews](docs/design/laboratory-selection.md)

- [Selected B equipment: art and physics checks](docs/design/design-b-equipment-review.md)

- [Calorimetry: controls and verification](docs/design/calorimetry-prototype-review.md)

- [Titration: controls and verification](docs/design/titration-prototype-review.md)

- [Solution preparation and dilution](docs/design/solution-preparation-prototype-spec.md)

- [Three-question lab reviews and calculations](docs/design/review-questions.md)
- [Solution preparation: controls and verification](docs/design/solution-preparation-prototype-review.md)
- [Equipment menu controls and preview](docs/design/equipment-menu-review.md)
- [Further labs: proposed roadmap](docs/design/lab-roadmap.md)
- [Curriculum evidence for proposed labs](docs/curriculum/lab-opportunities.md)
- [Decisions and requirements](docs/design/decisions.md)
- [First activity: separation techniques](docs/design/separation-activity.md)
- [Approved filtration prototype specification](docs/design/filtration-prototype-spec.md)
- [Recrystallisation](docs/design/recrystallisation-prototype-spec.md)
- [Evaporation and salt recovery](docs/design/evaporation-prototype-spec.md)
- [Paper chromatography specification](docs/design/chromatography-prototype-spec.md)
- [Approved distillation specification](docs/design/distillation-prototype-spec.md)
- [IB curriculum reference and source status](docs/curriculum/README.md)
- [Syllabus topic index](docs/curriculum/syllabus-index.md)
- [Verified separation-technique mapping](docs/curriculum/separation-techniques.md)
- [Recorded answers Q01–Q20](docs/design/answers.md)
- [Recorded answers Q21–Q62](docs/design/answers-21-62.md)
- [Focused follow-ups and visual choices](docs/design/follow-up-01.md)
- [Selected scope, characters, laboratory and animations](docs/design/follow-up-answers-01.md)
- [Walking animation preview W01](docs/art/walking-preview.md)
- [Open questions](docs/design/open-questions.md)
- [Option key Q21–Q62](docs/design/questionnaire-options.md)
- [Ideas for discussion](docs/design/ideas.md)
- [Next development step](docs/design/next-step.md)
- [Visual references V01–V13](docs/references/README.md)
- [Generated art proposals P01–P14 and S1–S3](docs/art/README.md)
- [Twelve additional Equipment Studies sheets P03–P14](docs/art/equipment-03-14.md)
- [Characters, laboratory, buildings and motion in style B](docs/art/world-and-motion.md)
- [Review questions R01–R10](docs/design/review-tomorrow.md)
- [Working rules](AGENTS.md)
- [Original brief](docs/design/original-brief.txt)

Approved decisions, proposals and open questions must remain distinct. Detailed chemistry activities and visual solutions require the project owner's approval before implementation.

## Status

Thirteen local laboratory activities are implemented with the selected B glassware adaptation, live contents and instrument displays, and original functional drawings for newer instruments. The latest owner-selected additions are conductivity, colorimetry and the zinc–copper voltaic cell. Owner playtesting and teacher review remain ongoing; recipes and numerical teaching-model limits are documented per lab. The prototype has no accounts, analytics, saved student records, backend or deployment.

## Adventure development

See [CHEMTOPIA_ROADMAP.md](CHEMTOPIA_ROADMAP.md) for current status, decisions, questions and continuation steps, and the [actual equipment audit](docs/design/experiment-equipment-audit.md) for all thirteen laboratories. `npm test` runs model/save/progression tests; `npm run test:browser` runs Chromium practical and adventure workflows; `npm run check` checks JavaScript syntax and catalogue definitions; `npm run build` produces a static `dist/` directory (open `adventure.html` through HTTP). No install step is needed.

Adventure supplies are reserved once per attempt; reloading restarts that attempt with its existing reservation. Town progress, inventory and review completion persist; live laboratory physics do not. Practice pages do not spend supplies or record progression. Names and progress are kept in this browser only; clearing browser storage removes them.

The six selected characters now walk up, down, left and right in town. Open `/walking-preview.html` on the local server to compare all four directions together. Future NPC-issued practical quests and equipment/credit rewards are recorded in the roadmap and remain unimplemented at the owner's request.

New NPC art: eighteen child, adult and chemist designs with standing views in all four cardinal directions are available at `/npc-preview.html`. See [the character sheets and IDs](docs/art/npc-character-studies.md). These are additional NPC appearances; town placement and quests remain deferred.
