# Distillation prototype review

Run `npm start`, open the local address reported by the server, and use **Go to distillation** at the bottom of filtration. See [controls and limits](../../prototype/README.md#distillation).

The approved 50:50 acetone–water feed is separate from the condenser coolant. Drag and pour the feed, assemble and clamp the glassware, connect either hose end to any free water fitting, then operate the tap and electric heater. Both jacket-port supply choices work; the upper-fed route represents less effective jacket filling and lower recovery. Finish separates acetone recovery from collected composition, and offers the explanation question after collecting enriched distillate.

![Assembled distillation during collection](../art/previews/distillation-running.png)

![Finish review with component balance and explanation](../art/previews/distillation-review.png)

Screenshots are generated from the local Chromium playthrough using project-owned functional SVG placeholders. They illustrate one attempt, not a prescribed layout or calibrated numerical prediction. Final pixel artwork, more realistic glass geometry, pressure and quantitative vapour–liquid equilibrium are outside this increment.

Verification includes both component balances, evolving vapour composition, cooling circuits, matched lower/upper-fed model runs, a heated rigid assembly and filtration regressions. Chromium tests exercise actual apparatus dragging, Space pouring, glass and clamp contacts, four hose-end connections, tap/heater controls, collection, question retry, restart and fresh return to filtration.

The implementation passed 41 Node material/physics checks and both Chromium suites. A matched browser comparison recovered approximately 67% versus 34% of starting acetone for lower-fed versus upper-fed coolant. These numbers describe a test attempt under qualitative parameters, not real laboratory performance.

![Upper-port supply remains connected and operable](../art/previews/distillation-reversed.png)

Review this experiment before starting another activity.


## Stability revision

The subsequent owner playtest identified stand sliding, thermometer insertion failure and heater clicks lifting the apparatus. The fixes apply friction to individual collision parts and supporting surfaces, defer pickup until a drag, preserve heater height and give the thermometer a fitting stem and seating collar. The collar cannot be pushed through the upright head's rim. Regression coverage now includes 38 model/physics checks, a real stand click and an assembled-heater click; distillation insertion is exercised slightly high/off-centre.


## Temperature readout

The analogue thermometer now carries a circular digital °C number above its stem. Both readings start at 20°C, warm to 56°C during the main acetone collection stage, rise towards 100°C as acetone is depleted, and cool towards 20°C after heater switch-off. The display is labelled a simplified temperature curve. Model checks exercise the full rise/plateau/rise/cool sequence; Chromium checks the visible starting number, plateau and cooling through the actual heater control.

## Filling funnel inside the neck

Release the funnel above the upright supported flask. Its narrowed stem falls into the neck until the cone rests at the mouth. Pour through it, then lift or store it before fitting the still head.

![Narrow filling funnel seated inside the flask neck](../art/previews/distillation-funnel-seated.png)

## Angled head and connection feedback

The head outlet now slopes down into the Liebig condenser. Matching glassware and hose fittings accept nearby placement and seat visibly. The live panel below the bench reports actual joints, coolant flow and receiver alignment, explains any open path, and separates remaining, collected, escaped and spilled model amounts. The updated running image above shows liquid collection after deliberately off-centre placement. Upper-port supply remains usable with reduced recovery.
