# Decisions and requirements

## Status terms

- **Chosen:** explicitly stated in the user's brief or answers.
- **Open:** undecided or requiring a clearer boundary.
- **Proposal:** an assistant suggestion, not an adopted decision.
- **Approved implementation:** a specific development step approved by the user.

An overall design premise has not yet been approved. The table records explicit choices, not approval of a complete game design.

## Original requirements — chosen

The audience is students aged 16–19 studying IB DP Chemistry. Browser support on computers, phones and tablets. The original starting point was a top-down 2D tile-based pixel-art game, with Pokémon Red as a discussion reference, without copying assets or automatically adopting its mechanics. Chemistry must remain central. The experience must be inclusive and understandable without gaming experience. The project owner decides chemistry, education, visuals and gameplay.

## Explicit answers

| ID | Chosen | Reason or boundary |
| --- | --- | --- |
| Q01 | Syllabus first assessed in 2025 | Exact examination years have not been specified. |
| Q02 | Both SL and HL, with separate learning paths | A shared world, shared content and switching between paths remain undecided. |
| Q03 | All listed chemistry topics | This does not mean everything belongs in the first version. First topic and sequence are open. |
| Q04 | Learning, practice, revision and scientific curiosity | Formal assessment and diagnosis have not been explicitly selected as primary purposes. |
| Q05 | All six listed skills | Concepts, calculations, practical skills, data, reasoning and representations. Priorities remain open. |
| Q06 | IB terminology and questions, alongside freer activities using precise language | How these approaches combine needs clarification; do not assume every activity must resemble an exam. |
| Q07 | IB guide and textbook; approval of individual content items and small packages | Guide now supplied and relevant pages reviewed; textbook still pending. The approval workflow needs clarification. |
| Q08 | A short note when a simplification is introduced | No particular scientific simplification has been approved. |
| Q09 | Undecided — discuss | No main activity or percentage balance has been selected. |
| Q10 | Short missions combining world, laboratory and chemistry | Content, story and specific mission mechanics remain open. |
| Q11 | Sessions of 20–30 minutes; chemistry after an introduction of no more than three minutes | No particular timetable within a session has been adopted. |
| Q12 | A recommended next activity with alternatives | Rules governing available alternatives remain open. |
| Q13 | Laboratory as a home base or a function available anywhere | Explicitly undecided between B and D. |
| Q14 | A connected world | Map extent and the role of interiors remain open. |
| Q15 | One region per selected syllabus area | Exact IB divisions and cross-cutting topics need clarification. |
| Q16 | Small areas, short routes, few detours and free return | Optional hidden activities have not yet been selected. |
| Q17 | Signs, an activity map and fast travel between visited places | Direct selection of every discovered activity has not been selected. |
| Q18 | Top-down view; small characters and clear tiles; interaction; interiors | Battles, collecting and companions remain undecided. |
| Q19 | Smooth free movement within a tile-based map; a camera following the character | Controls, speed and camera framing remain open. |
| Q20 | Move close and use a clear interaction button | This does not select keyboard or touch controls. |

## Work currently authorised

Documentation in the existing repository, recording choices and open questions, idea development and visual reference collection for the next conversation.

Game implementation is not yet approved. Reasons the user did not provide have not been presented as the user's own.

## Further permission and a reopened choice

The user requested more references and opened the visual direction to **2.5D or a non-pixel-art style**. The original visual framework is therefore a historical starting point, not a locked art direction. Q18–Q20 remain recorded as original answers; changes to perspective or camera must be explicitly clarified.

Generating pixel-art proposals for chemistry laboratory equipment, preparing further ideas and review questions, and committing/pushing current documentation and images to GitHub are authorised. This does not approve a particular style, use of an apparatus in an experiment, new mechanics or public app deployment.

## Feedback and an additional art round

The user likes the Equipment Studies images very much and requested many more with a wider range of chemistry laboratory equipment, plus a Git push. This authorises further art proposals in the same style. It is not a final decision on the whole game's visual direction, equipment selection, experiments or implementation. P03–P14 are proposals for review.

## Project language — chosen

The user requested English throughout the project: drawings, text, lists, questions, folder names and other project content. English is now the working language and the language of authored project text and labels. Historical notes are translated without changing their meaning or choice IDs. This does not add multilingual features or approve any unanswered gameplay or chemistry decisions. The historical Q53 option list remains available for context; any additional language support is still undecided.

## Design B preference and world-art proposals

The user particularly likes design B and requested suggestions for characters, the laboratory, houses and other images/animations in the same style. This proposal round uses Equipment Studies row B, specifically P02, as its working reference. C01, L01, H01 and M01 are generated studies; motion is presented as static storyboards and further written ideas. The request authorises these suggestions, not final character selection, new required locations, gameplay features or game implementation.

## Questionnaire answers Q21–Q62

The user has submitted all remaining questionnaire items, including explicit undecided and none responses. The authoritative record and interpretation are [answers-21-62.md](answers-21-62.md). These are explicit selections, not a complete approved design premise.

The chosen direction includes broad practical work, partial guidance and simple controls, realistic variation and uncertainty, equipment unlocking, unlimited consumables, branching chemistry/equipment skill trees and badges, a story with an apprentice/researcher role and light humour, short skippable/replayable dialogue, ready-made avatar choices, detailed visuals, keyboard and tap-to-destination controls, and first-use control help. First-try correct answers earn more currency; spending and reward rules remain open. English and the current repository location are explicitly confirmed.

Important unresolved dependencies are the Q54/Q56 first-version scope difference and the relationship between cross-device progress/teacher features/optional accounts and local-only progress/a backend-free first version. School GDPR concerns are an explicit constraint to investigate, not a licence to invent a compliance architecture. No old-project inspection is permitted now. Reviewed chemistry content can be considered later if access and specific reuse are approved.

## Focused follow-up selections

F01-B chooses a small laboratory plus one chemistry activity for the first playable version, resolving the earlier Q54/Q56 scope conflict. F02-A chooses a local, backend-free first version with manual progress-file transfer to explore later. [The follow-up answer record](follow-up-answers-01.md) preserves the full wording and boundaries.

All six C01 avatars are selected as player options. L01-1 is the chosen laboratory layout and H01-1 its exterior; the other H01 exteriors are retained for future buildings with functions still unassigned. Walking needs review in motion. Door, notebook and drawer motion directions are liked; the door's repeated middle angle is noted but not urgent. A01–A03 and A05–A08 are accepted animation directions, while A04 greetings are rejected. Scientific content and final animation assets still require review. No overall design premise or game implementation step is yet approved.

## First topic and S01–S04

The first topic is separation techniques for heterogeneous and homogeneous mixtures. S01 selects sand/water filtration, salt recovery by evaporation, water recovery by simple distillation and paper chromatography, plus the other required techniques once verified against the current IB guide. All needed equipment is available from the outset for this activity. S02-C rejects placement guides. S03 requires student-operated actions, including dragging to pour and heater controls; physically possible wrong actions remain possible. S04-A retains keyboard-equivalent operation. These requirements supersede a simplified correct-only assembly or single-run-button approach for this activity.

See [the full activity record](separation-activity.md) and [curriculum source status](../curriculum/README.md). The initial website lookup was blocked by network policy. This has since been superseded for document review by the owner-supplied guide and its verified mapping. No game implementation or unreviewed scientific consequences have been approved.

## Uploaded Chemistry guide and verified separation mapping

The owner supplied Chemistry Guide 2025.pdf. Its publication information identifies first assessment 2025 and publication in February 2023. Relevant source pages are reviewed, and the local full source/extraction are excluded from Git. Public curriculum files provide original summaries, exact references and a topic navigation index for future suggestions. Later online revisions have not been independently checked.

Structure 1.1.1 (printed p. 33 / PDF p. 39) explicitly names solvation, filtration, recrystallisation, evaporation, distillation and paper chromatography in common SL/HL material. Solvation and recrystallisation are therefore part of the owner's requested syllabus-aligned coverage; specific examples, models and increments still need approval. Structure 2.2.10 (printed p. 41 / PDF p. 47) requires explaining, calculating and interpreting R_F. Tool 1 (printed p. 29 / PDF p. 35) mentions paper or thin-layer chromatography; do not turn the alternative into a requirement to build both. GC/HPLC technical/operational details are excluded from assessment in the cited statement. No new experiment content or game code is implemented by this research update.

## Prototype questionnaire P01–P09

The owner selected one complete filtration task first, direct close-up workbench entry, free placement with physical alignment, hold-to-pour controls, the simplified sand/filter/water model, all five proposed wrong-action cases, objective/equipment names/outcomes without explanatory feedback until Finish, full restart, successful separation plus an explanation question, deferred currency, and desktop mouse/keyboard for this milestone. The exact answers and concrete proposed first build are in [filtration-prototype-spec.md](filtration-prototype-spec.md). The specification's additional details and drafted question still require approval; game coding has not started. These contextual P question IDs are not art-sheet IDs.

## First filtration build approved and implemented

On 21 October 2026, the owner replied “Yes” to the concrete filtration prototype specification. This approves its additional qualitative-model boundaries, six apparatus items, recovery criterion, drafted explanation question and static local first increment. This supersedes the pending approval statements in the earlier P01–P09 entry for this increment only.

The implementation uses dependency-free HTML/CSS/JavaScript/SVG, with explicitly labelled functional placeholder artwork. Mouse and keyboard share one material model. The owner should playtest this increment before further features. See [the review](filtration-prototype-review.md); public deployment, student data collection and additional techniques remain outside this approval.

## Playtest revision — gravity and Space action toggle

The owner liked the prototype and requested four concrete changes: unsupported objects fall to the bench, funnels tip unless placed in the stand, keyboard movement is removed for now, and pressing Space starts/stops the current action. This supersedes the first build's suspended placements, vessel-supported funnel and full keyboard movement/hold-Space mapping. The owner reported that keyboard movement did not work in their setup; it is removed rather than claimed fixed.

The revised interaction keeps the mouse held while positioning a pouring beaker; Space toggles flow without needing to hold the key. Releasing the object stops pouring and starts its fall. The visible action button also toggles flow. Selection changes, focus loss, Finish and Restart stop the action. Gravity and tipping use a small qualitative positional model, with no impact damage or new material loss from tipping. Attached paper keeps its retained sand; a tipped unsupported funnel does not act as an upright receiving opening.

The owner also requested Node.js use, convenient terminal execution in VS Code, and a Git push. The existing Node.js local server is retained, with a VS Code run task and a beginner-oriented development guide. Knowing Python/HTML/CSS is recorded as context, not interpreted as a request to rewrite the game or add a Python backend.

## Collision, ring support and tipped contents — requested revision

The owner requested solid hitboxes for equipment and stand, gravity/contact-driven tipping instead of timed rotation, contents pouring out on tipping, and a higher funnel position in its support. These requests authorise the corresponding physical consequences and supersede the earlier “no material loss from tipping” implementation detail. The owner explicitly requested a push.

The implementation uses locally bundled Matter.js 0.20.0 under MIT. The stand geometry now provides clearance for the bowl and collecting vessel, and the cone seats above the ring after contact. Glass/metal collide while real openings and paper containment remain available. See [the physics interaction record](physics-interactions.md) for behaviour, approximations and verification. This does not add new chemistry processes, impact damage or publication.

## Distillation requested as the next experiment

The owner requested adding a distillation experiment now, using the same ideas and interaction principles, with a temporary bottom-of-page button for entry. This selects the next increment and supersedes deferral of all additional techniques. The earlier S01 choice already identifies simple distillation of salt solution to collect water.

[The concrete distillation specification](distillation-prototype-spec.md) proposes the new apparatus, heating/cooling model, scientific limits, recovery criterion, question and temporary reset-on-switch navigation. Those details are presented for owner review, not silently treated as approved chemistry decisions. No distillation simulation code is added by this documentation step.

## Distillation corrections — real cooling connections and acetone recovery

The owner explicitly rejected the first distillation proposal and welcomed being asked. Students must be able to connect cooling-water supply to the upper condenser port, keep operating the experiment and obtain a lower yield. Movable cooling-water connections replace the rejected cooling-switch simplification. Exact cooling efficiencies are not selected.

The owner then selected an **acetone–water mixture**, with **acetone as the collected target**, replacing the original salt-solution/water-recovery example for this experiment. This does not imply a pure-acetone distillate, a selected feed ratio or approval of the remaining first proposal. The revised specification distinguishes acetone recovery from purity, represents both components as volatile and keeps coolant water separate. Vapour-composition rules, starting composition, numerical parameters, collection conditions and assessment remain proposed or open. See [the revised specification](distillation-prototype-spec.md).


## Approved acetone–water distillation implementation

The owner approved the revised distillation proposal with “Implement it” and selected equal amounts (50:50) in the follow-up. This authorises the bounded local distillation increment in [the specification](distillation-prototype-spec.md), alongside filtration. It includes movable coolant hoses, operable upper-port supply with reduced recovery, both volatile sample components, supported glassware, student-operated pouring/heating, Finish review and the explanation question. Numerical coefficients are labelled qualitative implementation defaults, not measured data or additional owner answers. The temporary bottom navigation starts a fresh attempt on switching. Commit/push authorisation applies; public deployment remains unapproved.


## Stability and thermometer fixes

Following the owner's playtest, equipment and support surfaces now use consistent friction on all compound collision parts, with stronger static friction and damping. A click selects apparatus; pickup/disconnection begins only after a short drag, so touching a stand or heater does not lift or disturb it. Heater pickup also preserves its position rather than applying a vessel-height correction.

The thermometer has a shorter stem and a physical seating collar, matching the still-head opening. Near-aligned insertion seats the collar at the rim and constrains the thermometer, with the bulb at the side-arm height. No target ghost or chemistry change is introduced. Tests cover a nudged stand settling, surface friction, near-aligned thermometer seating, and clicking the assembled heater without moving the glassware.


## Analogue thermometer with circular digital reading

The owner requested retaining the analogue thermometer while adding a number in a circle above it. It starts at 20°C, warms to acetone's approximate boiling point (56°C), holds during the main acetone collection stage, then rises towards 100°C. Heater switch-off cools towards 20°C. This explicitly authorises replacing the earlier qualitative-only readout. The analogue column and number share a reading; the display is a simplified teaching curve, with the existing two-volatile-component balance preserved. Numerical visual rates and the final-acetone transition threshold are documented implementation defaults.


## Paper chromatography requested

The owner requested starting the next paper chromatography experiment using the same ideas, with links from both filtration and distillation. This selects the technique and navigation, carrying forward the existing interaction direction. The linked preparation page is scaffolded. Sample, solvent, development/consequence model and whether measurement/R_F belong in the first increment remain for review in [the proposal](chromatography-prototype-spec.md); recommendations are not recorded as owner decisions.


## Paper chromatography choices resolved and implemented

The owner answered “Solvent water, sample markers of different colors. Calculate rf, yes”. This selects water-soluble coloured marker examples, water solvent, measurement and R_F in the bounded paper-chromatography step. Direct markers replace the proposed capillary spotter. The workbench carries forward dragging, Space actions, friction/gravity, solid support surfaces, wrong-action consequences, restart and Finish review. Green/purple/black examples and migration rates are explicitly qualitative implementation defaults, not measured properties of particular brands. Both earlier labs link to the playable experiment and it links back. No backend, saving, currency or publication is introduced.


## Collapsible equipment menu

The owner requested replacing the apparatus shelf with an equipment menu on the left that hides when the mouse leaves and accepts equipment dragged back into it. All three labs now use the shared drawer. Hover over the visible Equipment tab to expand it; drag a stored row to open bench space, or drag a bench object back over the drawer to store it. Shelf apparatus starts in the drawer. Other initial bench equipment stays available and can be returned. “On bench” rows select existing apparatus; “Stored” rows can be dragged out. Fixed tap/drain fittings remain on the bench.

Storage keeps the same object and its contents, including a filter contained in its funnel. It removes collision bodies, disconnects external joints/hoses and switches powered controls off. Stored vessels cannot catch a pour, pour, develop paper or generate vapour while hidden. Taking equipment out requires clear space and does not duplicate apparatus or discard material. Unsupported equipment falls after release as before.

The tab remains visible when collapsed. The drawer opens for keyboard focus; Enter on a stored row retrieves it into available bench space, and Escape closes it. Restart restores the initial arrangement, including the initially stored shelf equipment. Storage is local to the current attempt; no saving, accounts or backend are added.

Verification covers storage/retrieval, loaded contents, contained filter paper, disconnected powered/glass apparatus, blocked retrieval, real hover hiding, drag-back and drag-out, and all lab playthroughs.
