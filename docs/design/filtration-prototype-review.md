# First filtration prototype review

Implemented after the owner's “Yes” approval of [the specification](filtration-prototype-spec.md) on 21 October 2026.

![Initial filtration workbench](../art/previews/filtration-prototype.png)

This image is a screenshot of the implemented interface, captured in Chromium at 1440 × 1100. The SVG apparatus are original functional placeholder drawings, not adopted reference images or production pixel sprites.

## Try it

With Node.js 22 or newer, run `npm start` from the repository root, then open `http://127.0.0.1:4173` on the same machine. No dependency installation is needed. See [controls and limitations](../../prototype/README.md).

Hold a beaker above a receiving opening by dragging, then press Space to start or stop pouring. Released unsupported objects fall to the bench, and funnels tip unless placed in the stand. Arrow-key movement is removed for now. All six apparatus items are available immediately. Finish stops the attempt and reviews material distribution; a successful separation opens the approved explanation question. Restart creates a fresh attempt.

## Verification

- `npm test`: all 14 model checks passed. They cover correct filtration, absent paper, missed receivers, direct transfers, overflow, interrupted pouring, loaded paper removal, attached equipment movement, conservation across repeated transfers, reset, finished-state protection, gravity and unsupported funnel tipping.
- `npm run test:browser`: passed in real headless Chromium using mouse and keyboard input. Tested a successful two-receiver mouse-held experiment with Space toggling, key-repeat protection, release safety, question retry/completion, native keyboard answers, restart, missing-paper/overflow failure, falling objects and tipped funnels. Verified that arrow/Enter keys no longer move/place equipment.
- No browser runtime exceptions occurred in these flows. Initial and completed screenshots were visually reviewed.
- The static server exposes only the prototype directory; private curriculum documents remain ignored and untracked.

## Limits and next review

The approved first increment uses a qualitative sand/water model, simplified pouring/filtration and finite attachment/alignment tolerances. Gravity and tipping are simple positional dynamics without impact damage; attached paper preserves its represented sand. Retained sand is wet. There is no settling/decantation simulation or calibrated measurement. The artwork is explicitly labelled as functional placeholder artwork.

Desktop Chromium is verified; other browsers and touch devices are not yet verified. There are no avatars, room navigation, further techniques, currency, saving, accounts, analytics or public deployment in this increment.

The owner should now assess placement tolerances, pouring control and visual clarity by playing. Additional mechanics, techniques or art changes need a further approved step.

The owner's subsequent Node.js/VS Code request is supported by [the development guide](../development.md) and a VS Code run task. The existing dependency-free Node server is retained; HTML, CSS and browser JavaScript remain directly editable without a build step.
