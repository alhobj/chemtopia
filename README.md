# Chemtopia

A chemistry learning game for students aged 16–19 studying IB Diploma Programme Chemistry.

The local prototype includes sand-and-water filtration and acetone–water distillation workbenches. English is the project's working language. The larger game remains in design.

## Try the prototype

With Node.js 22 or newer, run `npm start` from this repository and open `http://127.0.0.1:4173` on the same machine. No dependency installation is needed. Hold a beaker above a receiver while dragging, and press Space to start or stop pouring. Equipment and the stand have solid hitboxes. Unsupported equipment falls, and contact can cause tipping and spills. Controls and limitations are in [the prototype guide](prototype/README.md).

Run `npm test` for the material-model checks and `npm run test:browser` for Chromium mouse/keyboard checks. See the [filtration review](docs/design/filtration-prototype-review.md) and [distillation review](docs/design/distillation-prototype-review.md).

For step-by-step terminal instructions and a file guide, see [Run and edit in VS Code](docs/development.md).

## Start here

- [Decisions and requirements](docs/design/decisions.md)
- [First activity: separation techniques](docs/design/separation-activity.md)
- [Approved filtration prototype specification](docs/design/filtration-prototype-spec.md)
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

The owner approved the first filtration specification with “Yes”. This increment uses functional placeholder artwork and a qualitative material model. It has no accounts, analytics, saving, backend or deployment. The owner also approved the revised acetone–water distillation increment with “Implement it”, then selected a 50:50 feed. Use the bottom button to switch experiments. Further techniques, production artwork and room navigation await review.
