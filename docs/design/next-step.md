# Work steps and verification

## Current step — implemented, awaiting playtest

The owner approved the [filtration specification](filtration-prototype-spec.md) with “Yes”. A standalone local workbench now implements that bounded first increment, including mouse-held placement and Space action toggling, gravity/contact-driven tipping, equipment and stand hitboxes, corrected ring support, tipped-content spills, physically compatible attachments, material transfer, wrong actions, restart, Finish and the approved explanation question.

See [the review and verification](filtration-prototype-review.md) and [launch instructions](../../prototype/README.md). Review this playable increment before choosing the next development step. Additional separation techniques, production art, room navigation, avatars, currency, persistence and publication are outside this increment.

## Historical work record

The sections below describe earlier rounds and their checks; statements that no app existed apply to those dates.

## Completed and checked in the initial round

- Documentation, working rules, original brief and recorded Q01–Q20 answers were saved.
- Interpretation and open questions were separated from 18 proposals.
- Q21–Q62 option order was preserved in a separate answer key.
- Eight references were catalogued: seven local source images and one external overview, with attribution and licence information.
- 24 local documentation links were checked without missing targets.
- Local image checksums matched the source manifest; SVGs were parsed and rendered with the available Inkscape installation. PNGs and rendered SVGs were visually reviewed.
- Counts of recorded answers and remaining question IDs were checked: 20 and 42.
- No app was created and no app tests were run. These checks concern documentation and references, not chemistry approval or playability.

At the end of the first round, files existed only locally without a commit or push. The user requested commits and pushes in the next round. No app has been deployed and no previous-project resources have been used.

## Further approved documentation and art step

- Expand references to include isometric 2D, stylised 3D and clear non-pixel 2D shapes.
- Create pixel-art equipment proposals and a sheet comparing possible laboratory styles.
- Keep these as drafts; record generation defects and questions before game use.
- Prepare more ideas and a review sheet for the next conversation.
- Check documentation links, sources and images; commit and push to GitHub as explicitly requested.

No engine, dependencies or runnable app are part of this step.

## Checks in the expanded round

45 internal documentation links had no missing targets. All 15 local images in the reference and generation manifests passed checksum and format checks. The five new external reference images and three generated sheets were visually reviewed. Generated S2 and S3 differ less than requested; this is documented alongside apparatus details needing revision.

Material at that point: 13 external references, three generated sheets, 28 proposals and ten new R01–R10 questions. Q21–Q62 remained unanswered. No app tests apply because there is still no game code.

## Expanded Equipment Studies round

Following positive feedback and an explicit request, P03–P14 were created: twelve new sheets with 72 equipment subjects in 144 variants. They were catalogued with Norwegian names at the time, row/column IDs, preserved generation prompts and checksums. Visible generation defects were documented, including the Vigreux column shape and a hollow end on the intended glass rod. Incorrect subjects are not considered scientifically approved. No game code changed.

Checks in that round: 62 internal documentation links without missing targets; 15 generated images with valid formats and matching checksums. All twelve new sheets were visually reviewed. The approved scope was art proposals and a Git push; implementation and chemistry approval remained open.

## English-language conversion — authorised

The user requested English throughout all project content. Translate documentation, questions, lists, equipment names, image descriptions and manifest text; inspect drawings and paths. Preserve choice IDs, option order, open decisions, source attribution and image content that is already in English. Existing English filenames and folders do not need renaming.

This is a language change, not approval of new mechanics, chemistry content, art direction or implementation. The record of earlier checks above is historical, not a claim that those checks were rerun unchanged for the translation.

English conversion checks: 62 internal documentation links had no missing targets. All 20 recorded answers retained their selections; all 42 remaining question IDs and option counts, ten review IDs and 28 idea IDs were preserved. All 27 local image files retained their original paths and checksums and passed format validation. OCR was run as an additional check on 23 raster images; SVG visible text was inspected separately. Existing drawing labels are English or numeric, so no drawings needed regeneration. English paths were retained. No Norwegian prose remained in the checked text files. Source credits and licences were preserved.

## Row B world and motion proposals

Following the user's request, C01, L01, H01 and M01 were generated using Equipment Studies row B as the style reference. The proposal catalogue includes six character options with front/back views, three laboratory layouts, six building exteriors, four static motion sequences and eight further motion suggestions. These remain proposals; no playable animation, new mechanics or game code was implemented. Walking-frame similarity, door-angle inconsistency and softer rendering in room illustrations are documented.

Checks: all 19 generated images passed checksum and format validation; 70 local documentation links had no missing targets; Git whitespace checks passed.

## Questionnaire completion and focused follow-up

The user submitted Q21–Q62. Raw answers and option-based interpretation are preserved in answers-21-62.md. Explicit undecided and none selections remain distinct. The old unanswered-question list was replaced by current follow-ups. Key dependencies are first-version scope (Q54 versus Q56), data sharing and school requirements (Q49–Q51/Q62), and currency rules. F01–F06 include visual choices using existing C01/L01/H01/M01 references. No game implementation has begun or been approved.

## Scope and visual selections; walking preview

F01-B and F02-A are now selected: one laboratory plus one chemistry activity in the first playable version, local and backend-free, with manual progress transfer to explore later. All six C01 avatars should be player options; L01-1 and H01-1 are chosen for the laboratory. Other H01 exteriors are retained for future buildings without assigned functions. Motion choices are recorded in follow-up-answers-01.md, including A04 rejection and deferred door-frame correction.

W01 supplies a standalone four-frame looping walking GIF for assessment, using C01-1 only as the sample. Artwork was generated through image_gen and assembled using the recorded ImageMagick helper; no game implementation was started. Similar contact poses and silhouette changes remain limitations. Checks: four distinct consecutive GIF frames, 140 ms per frame, infinite loop metadata, format/checksum validation, 93 local documentation links, helper shell syntax and repeatable GIF checksum. First chemistry objective, activity content and the concrete implementation premise/step remain to be approved.

## Separation activity requirements and curriculum research

The user chose separation techniques and supplied S01–S04. Requirements and a proposed design premise are recorded in separation-activity.md. Current official IB source access was attempted and blocked by the environment proxy with 403. A network draft adding only ibo.org and www.ibo.org was saved, preserving package presets; runtime access has not been applied or claimed. docs/curriculum/ contains source status, owner-selected technique coverage and an explicitly unverified research checklist. At that point, the complete guide and required-technique mapping remained outstanding; the subsequent upload update below supersedes that blocker. No game code has been created.

## Owner-supplied guide reviewed

Chemistry Guide 2025.pdf was supplied and reviewed. The title/publication pages identify first assessment 2025, published February 2023, with 89 physical PDF pages. Full source and extraction are retained in the Git-ignored private curriculum directory. The public reference now includes a 22-section navigation index, exact page mappings, source checksum and machine-readable separation requirements. The verified common SL/HL list adds solvation and recrystallisation to the requested separation coverage; chromatography also requires R_F understanding and calculation. The earlier site-access blocker no longer prevents use of the supplied guide. Later online revisions remain unchecked.

No chemistry simulation or game implementation has started. Specific examples, outcomes, models and a bounded first coding step still require approval.

Guide-reference checks: source publication/assessment identifiers confirmed; six named processes verified on printed p. 33 / PDF p. 39; common-level chromatography boundary and R_F requirement verified on printed p. 41 / PDF p. 47; Tool 1 and distillation/reflux cross-reference checked. All 22 section entry pages were indexed; 109 internal documentation links had no missing targets; source SHA-256 matches the retained PDF. The full PDF and extraction are ignored and untracked.

## Concrete filtration prototype specification prepared

P01–P09 were answered. A reviewable specification now records the selected scope and proposes the finite apparatus/actions, conservation rules, recovery criterion, completion question, keyboard mapping, acceptance checks and verification plan. The owner must approve the concrete specification before coding, as promised in the questionnaire and required by AGENTS.md. No further questionnaire is needed unless that review exposes a new unresolved decision.
