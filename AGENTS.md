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
