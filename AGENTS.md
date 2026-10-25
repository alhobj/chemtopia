# Working rules for Chemtopia

Read README.md and docs/design/ before continuing work. Use the existing checkout; do not create a Git worktree unless the user explicitly requests one.

## Decision authority

The project owner decides chemistry, education, gameplay, appearance and scope. Unanswered questions remain undecided. Suggestions, reference images and technical possibilities are not approvals.

Documentation structure, reference collection and generated laboratory equipment art proposals are authorised. Visual direction has been reopened to include 2.5D and alternatives to pixel art. The user has also requested Git commits and pushes of this work. This does not authorise publishing an app. Game implementation still requires an approved design premise and an approved first development step. Do not choose a game engine, install dependencies or create executable game code based on this documentation alone.

Ask before changing chemistry content, learning objectives, scientific simplifications, mechanics, progression, regions, equipment, characters, dialogue, visual direction, meaningful interface behaviour, rewards, difficulty, timers, student data, accounts, costs or publication. Routine technical decisions within approved boundaries can be made independently.

## Working process

1. Describe a small proposed step and surface decisions affecting the experience.
2. Wait for approval of that step before implementation.
3. Complete approved work and relevant checks without asking about every line of code.
4. Report changes, how to try them, checks and open decisions.
5. Let the user review the result before moving to the next feature.

Update the decision log with reasons when decisions are actually made. Preserve recorded answers, question IDs, open questions and deferred ideas. Do not turn an earlier assistant summary into a user decision when the recorded answer is ambiguous.

## Content and sources

Do not use the previous project without explicit permission to inspect or reuse it. Do not automatically delete, change or copy from it. It is not the specification for this project.

The owner supplied the IB Chemistry guide (first assessment 2025, published February 2023). Relevant syllabus, separation and chromatography pages are reviewed and indexed in docs/curriculum/. The full PDF and extraction are local and Git-ignored under docs/curriculum/private/. The textbook has not yet been supplied. Do not reproduce textbook questions or add PDFs to Git without clarified rights and the user's permission. Visual references are for discussion, not approved game assets. Record authorship and licensing before any use.

Do not add accounts, analytics, a backend or publication without approval. Use clearly labelled placeholders where needed, without inventing chemistry content.

## Language

Use English throughout the project, including documentation, questions, lists, filenames, folders, image labels and future authored content. Translate historical notes faithfully while retaining question IDs, option order, approval status, source attribution and proper names. The English-only working language does not authorise adding multilingual features or changing the approved experience.

## Curriculum references for chemistry proposals

Consult docs/curriculum/README.md and its source-status record before suggesting syllabus coverage, techniques or related questions. Use the selected first-assessment-2025 syllabus and preserve separate SL/HL scope. A pending source is not verified evidence. Distinguish explicit IB requirements, supporting practical knowledge, owner-selected content and proposals. Record exact source edition and section/page when available. Use the verified Structure 1.1.1 mapping for the named common SL/HL processes, and Structure 2.2.10 for chromatography/R_F. Do not claim online confirmation of the latest revision or extend the list beyond what the supplied guide supports.

For the first separation activity, follow docs/design/separation-activity.md: all needed equipment is available, no placement guides, student-operated practical actions, physically possible wrong actions allowed, and keyboard-equivalent controls. Scientific consequences and an implementation step still require approval.

## Approved first implementation

The owner approved docs/design/filtration-prototype-spec.md with “Yes”. Its sand-and-water filtration workbench, qualitative chemistry, completion question and mouse/keyboard controls are authorised. The static dependency-free prototype is in prototype/; run/check instructions are in prototype/README.md. This supersedes the earlier implementation gate only for this bounded increment. Review the implemented result before starting additional techniques or features. Existing commit/push authorisation applies; public deployment remains unapproved.

## Owner's interaction revision

After playing the prototype, the owner requested that released unsupported equipment fall to the bench, funnels tip unless supported by the stand, keyboard movement be removed for now, and Space toggle the current action (pouring). These explicit requests supersede the original keyboard-equivalence, hold-to-pour and free-air-placement requirements for this prototype. Preserve native keyboard operation of ordinary controls. This is an authorised revision, not an unanswered design question.

## Owner's collision revision

The owner requested non-overlapping solid hitboxes for all equipment and the stand, gravity/contact-driven tipping rather than automatic rotation, contents spilling when tipped, and corrected ring seating, followed by a Git push. docs/design/physics-interactions.md records the implemented scope. This supersedes the earlier simple tipping animation and preservation of sand through a tip. A locally bundled MIT-licensed Matter.js dependency implements the requested collisions; no package installation or deployment is required.


## Approved acetone–water distillation implementation

The owner approved the revised distillation proposal with “Implement it” and selected equal amounts (50:50) in the follow-up. This authorises the bounded local distillation increment in [the specification](docs/design/distillation-prototype-spec.md), alongside filtration. It includes movable coolant hoses, operable upper-port supply with reduced recovery, both volatile sample components, supported glassware, student-operated pouring/heating, Finish review and the explanation question. Numerical coefficients are labelled qualitative implementation defaults, not measured data or additional owner answers. The temporary bottom navigation starts a fresh attempt on switching. Commit/push authorisation applies; public deployment remains unapproved.


## Approved paper chromatography increment

The owner requested paper chromatography with the same ideas and links from both existing labs, then answered “Solvent water, sample markers of different colors. Calculate rf, yes”. This resolves the concrete proposal's sample/solvent and R_F choices and authorises the bounded implemented step in docs/design/chromatography-prototype-spec.md. Direct markers replace the proposed capillary spotter. Keep qualitative example inks distinct from measured brand properties. Preserve the baseline, spotting, solvent contact, supported development, front marking, ruler, R_F retry, explanation and physically possible mistakes. Existing local workflow and commit/push authorisation continue; no public deployment is approved.


## Equipment menu revision

The owner requested replacing the shelf with a left-side equipment menu that hides when not hovered and stores apparatus dragged back into it. This authorises the shared drawer across the three labs. Initial shelf apparatus starts stored; other bench items keep their starting arrangement. Preserve object contents, avoid duplicates, remove hidden physics bodies and active experiment participation, and disconnect joints/switch powered controls off on storage. The small tab and keyboard focus/Enter/Escape provide access when collapsed.


## Evaporation and salt recovery increment

The owner selected L05 with “Start with evaporation and salt recovery”. Follow docs/design/evaporation-prototype-spec.md for the bounded sodium-chloride solution lab: manual pouring, heater contact, basin recovery, wet/dry distinction, water-vapour and non-volatile-salt balances, wrong actions and Finish question. The basis remains qualitative; a new balance, scooping or quantitative mass-measurement task is not included. Existing local workflow and push authorisation apply. Other roadmap labs still require a chosen concrete step.


## Recrystallisation increment

The owner requested “Make recrystallisation” after the L06 brief. Follow docs/design/recrystallisation-prototype-spec.md for the bounded potassium-nitrate/sand/water example, hot dissolution/filtration, cooling, clean-paper collection, material provenance and wet-product reporting. The current capacity curve is qualitative, not verified property data; a sourced quantitative solubility curve remains a future refinement. Preserve the shared equipment drawer and controls. Other planned labs still require a selected concrete step.


## Owner-requested lab corrections (22 October 2026)

The owner explicitly requested arrested stand creep, evaporation of water from heated water/solution beakers in recrystallisation, a draggable chromatography-review ruler with R_F questions, a drawer aligned beside the first lab row, varied answer positions, blocked filtration water spills, and a distillation filling funnel with separate 56°C acetone/100°C water stages that stop below boiling. These requests supersede earlier conflicting simplifications for these bounded behaviours. Preserve material accounting and explicitly label the distillation stages as a teaching simplification, not real mixture equilibrium data. See the revised specifications and decision log. Existing push authorisation applies.


## Beaker endpoint and harder review questions

The owner requested crystals in the recrystallisation beaker as a valid endpoint, optional second filtration, and two harder questions after each current first question. They explicitly asked to remove the longest-answer cue and include actual R_F calculation. Preserve the first-question prompts, use balanced shuffled choices, require typed numerical work and retain retry. See docs/design/review-questions.md and the revised recrystallisation specification. Existing commit/push authorisation applies.


## Forgiving distillation assembly and diagnosis

The owner requested more forgiving equipment placement, troubleshooting for escaping vapour/no collection, and a downward still-head outlet matching the Liebig condenser. This authorises nearby joint/hose seating and live actual-connection/material feedback. Preserve the narrow falling filling funnel, wrong setups, reduced recovery with upper-port coolant, student-operated actions, material conservation and existing boiling stages. Art, hitboxes and joint anchors must agree. See the revised distillation specification. Existing push authorisation applies.


## Window-filling lab layout

The owner requested removing decorative text shown in screenshots, a lab occupying almost the whole window, and the equipment drawer between objective and workbench. This authorises the shared layout revision across all five labs, collapsed Controls, compact navigation and proportional room resizing. Preserve essential objective/action controls, experiment diagnosis, review tasks and storage behaviour. No chemistry or physics-model change is part of this revision. Existing push authorisation applies.


## Approved solution preparation and dilution increment

The owner selected L07 and approved [the concrete specification](docs/design/solution-preparation-prototype-spec.md) with “Yes”, requiring controls easy for non-gamers. This authorises the NaCl stock preparation and tenfold dilution, balance, spatula, volumetric glassware/pipette, quantitative transfer/rinsing, meniscus view, stoppering/mixing and three-question review. All delivery actions in this new lab are discrete; no timing challenge or continuous flow. Bulk water pauses at 95 mL, with explicit small additions that still allow overfilling. Preserve meaningful wrong actions, material accounting, shared storage/layout, and existing local-only/commit/push boundaries. Other labs retain their approved controls.


## Acid–base titration increment

The owner requested “Start implementering that” after the proposed HCl/NaOH titration. This authorises the bounded local [titration specification](docs/design/titration-prototype-spec.md), with 25.00 mL pipetting, a standard NaOH burette, clamped assembly, discrete coarse/fine/drop additions, swirling, readings, repeat trials and three calculation/concept questions. Preserve non-gamer pacing and real consequences of an unprimed tip, overshoot, dilution or missed receiver. Both indicator and pH probe are initially supplied as a stated implementation default pending the optional observation preference; do not label this an explicit owner choice. Existing commit/push and local-only boundaries apply.


## Owner-requested weak titration options

The owner explicitly requested CH₃COOH and NH₃ options in the titration lab. This authorises ethanoic-acid/NaOH and ammonia/HCl modes, their weak equilibria, appropriate supplied indicators, mode-specific labels/reviews and a sample selector that starts a fresh attempt. Restart preserves the chosen mode. Preserve analytical material accounting, buffer/conjugate-species pH behaviour, discrete delivery and the existing local-only/push boundaries. Label the weak-titration interpretation extension as AHL using docs/curriculum/weak-titrations.md; do not treat weak reagents as fully ionised or force their equivalence points to pH 7.


## Independent acid, base and indicator choices

The owner requested student choice of acids, bases and all indicators, allowing mistakes. This supersedes automatically paired reagents and automatically supplied matching indicators. Offer HCl/CH₃COOH acids and NaOH/NH₃ bases independently, with acid or base as the unknown; allow every pair including weak–weak. Make all three currently modelled indicators separate available droppers, with no forced choice or dose. Preserve mixed-indicator contents, actual colour/pH consequences, biased recorded titres and reviewable wrong attempts. A colour change is not proof of equivalence, especially for weak–weak titrations. Existing discrete delivery, local-only and commit/push boundaries continue.


## Approved calorimetry increments

The owner approved the proposed HCl/NaOH insulated-cup calorimetry and requested combustion beneath water in an aluminium container, then chose an ethanol spirit burner. This authorises the bounded two workbenches in [the specification](docs/design/calorimetry-prototype-spec.md), their shared energy/material balances, analogue thermometer with digital reading, deliberate temperature/mass records, discrete pouring and three-question numerical reviews. Preserve wrong placements/amounts, real heat loss and measurement lag. Numerical coefficients are explicit teaching-model defaults, not recorded owner selections or calibrated properties. Existing local-only, English and commit/push boundaries apply. Owner playtesting of titration and these labs is pending; later roadmap labs remain unselected.


## Owner-selected B equipment artwork

The owner explicitly requested using the detailed pixel-art equipment marked B instead of the smooth SVG placeholders, while preserving working physics. This authorises the shared [B sprite adaptation](prototype/assets/design-b/README.md) across the existing labs, transparent/composite apparatus assets and model-driven contents/scales/readouts. Preserve the existing chemistry, collision geometry, mouth/tip/joint coordinates and practical actions; do not treat an illustration as approval for new apparatus or lab scope. See [the visual revision review](docs/design/design-b-equipment-review.md). Existing commit/push authorisation applies; deployment remains unapproved.


## Approved laboratory selection room

The owner selected next-step suggestion 2 and requested the earlier laboratory illustration behind experiment previews on the benches. Use their existing **L01-1** room selection, not another layout. The local root now opens `laboratory.html`, with nine bench previews and a larger keyboard/phone-accessible list. Replace bottom cross-lab links with one return-to-room link. Preserve direct lab URLs and fresh attempts on switching; no persistence, avatar movement, notebook, new labs or deployment is authorised by this increment. See [the selection-room review](docs/design/laboratory-selection.md). Existing commit/push authorisation continues; owner playtesting remains deferred.


## Approved reaction-rates increment

The owner requested “Implement number 4. Reaction rates” after the proposed CaCO₃ chips/powder versus excess-HCl gas-syringe investigation. Follow [the bounded specification](docs/design/reaction-rates-prototype-spec.md): student-chosen measured solid/liquid portions, supported syringe and bung/tube, optional inner vial and combined mixing/clock action to avoid a timing challenge, real wrong actions/leaks, recorded observations, in-memory trial comparison/graphs and three review questions. Model rates and leakage coefficients are labelled teaching defaults, not property data or further owner answers. Preserve the ten-lab room, B equipment direction, gravity/friction/colliders and local-only boundaries. This does not implement a general notebook, accounts, persistence, other rate variables or later roadmap labs. Existing commit/push authorisation applies; public deployment remains unapproved.

## Owner playtest: apparatus alignment and transfers

The owner reported mismatched sprites/contents, failed liquid/solid pouring, floating overview apparatus, beaker weighing failure, reversed spouts and block-like solids. This authorises corrections to those existing behaviours: explicit vessel interiors and grain rendering, right-facing spouts with matching outlets, visible/physical bench alignment, forgiving discrete receiver targeting, direct solid-bottle portions alongside spatulas, and beaker recognition on existing balances. Empty vessel masses are labelled teaching defaults. Preserve chemistry targets, finite inventories, stoppered/bung closure, collisions, non-gamer controls and local-only boundaries. See the 24 October correction in the B equipment review and decision log. Existing commit/push authorisation applies.

## Owner-requested conductivity, colorimetry and zinc–copper cells

The owner explicitly requested work on all three labs together, continued implementation and a subsequent list of next-step suggestions/questions. This authorises the bounded [measurement-lab specification](docs/design/measurement-labs-prototype-spec.md): sample/probe conductance comparisons with finite carried films; measured CuSO₄ calibration and unknown estimation; and Zn/Cu half-cells, salt bridge, lead polarity and finite loaded redox. Numerical recipes, response coefficients, metered portions and 60 s model-time advancement are documented implementation defaults, not additional owner answers. Preserve common/AHL boundaries, B glassware, original functional meter/cuvette/electrode art, student-operated wrong actions, finite inventories, accessible lead buttons and the local-only thirteen-lab room. Later ideas in N01–N12 remain proposals. Existing commit/push authorisation applies; accounts, persistence, analytics and deployment remain outside scope.

## Approved town and equipment progression expansion

The owner explicitly authorised implementing six existing C01 character selections, local nickname/save/resume, selected avatar movement in town, a modular tutorial, equipment/material ownership, a data-driven progression map covering all thirteen existing labs, configurable purchasing and future reward APIs. One local profile, individual ownership and equipment/material-only unlocks are confirmed. This supersedes earlier no-avatar/no-persistence/increment-by-increment gates within this expansion. Preserve chemistry mechanics, original practice URLs and B equipment. No external player data, deployment or permanent mission economy is authorised. See CHEMTOPIA_ROADMAP.md and the experiment equipment audit. Existing commit/push authorisation continues.
