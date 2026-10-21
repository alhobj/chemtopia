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
