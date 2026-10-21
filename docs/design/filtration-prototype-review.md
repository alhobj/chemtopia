# First filtration prototype review

Implemented after the owner's “Yes” approval of [the specification](filtration-prototype-spec.md) on 21 October 2026.

![Initial filtration workbench](../art/previews/filtration-prototype.png)

This image is a screenshot of the implemented interface, captured in Chromium at 1440 × 1100. The SVG apparatus are original functional placeholder drawings, not adopted reference images or production pixel sprites.

## Try it

With Node.js 22 or newer, run `npm start` from the repository root, then open `http://127.0.0.1:4173` on the same machine. No dependency installation is needed. See [controls and limitations](../../prototype/README.md).

Position apparatus by dragging or keyboard movement, align receiving openings, then hold Pour while a beaker is selected. All six apparatus items are available immediately. Finish stops the attempt and reviews material distribution; a successful separation opens the approved explanation question. Restart creates a fresh attempt.

## Verification

- `npm test`: all 12 model checks passed. They cover correct filtration, absent paper, missed receivers, direct transfers, overflow, interrupted pouring, loaded paper removal, attached equipment movement, conservation across repeated transfers, reset and finished-state protection.
- `npm run test:browser`: passed in real headless Chromium using mouse and keyboard input. Tested a successful two-receiver mouse experiment, question retry and completion, restart, missing-paper/overflow failure, and a complete keyboard experiment including the question.
- No browser runtime exceptions occurred in these flows. Initial and completed screenshots were visually reviewed.
- The static server exposes only the prototype directory; private curriculum documents remain ignored and untracked.

## Limits and next review

The approved first increment uses a qualitative sand/water model, simplified pouring/filtration and finite attachment/alignment tolerances. Retained sand is wet. There is no settling/decantation simulation or calibrated measurement. The artwork is explicitly labelled as functional placeholder artwork.

Desktop Chromium is verified; other browsers and touch devices are not yet verified. There are no avatars, room navigation, further techniques, currency, saving, accounts, analytics or public deployment in this increment.

The owner should now assess placement tolerances, pouring control and visual clarity by playing. Additional mechanics, techniques or art changes need a further approved step.
