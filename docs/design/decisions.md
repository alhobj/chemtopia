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
| Q07 | IB guide and textbook; approval of individual content items and small packages | Sources have not been uploaded. The approval workflow needs clarification. |
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

See [the full activity record](separation-activity.md) and [curriculum source status](../curriculum/README.md). Official-source lookup was blocked by network policy; the required-techniques list is not verified yet. No game implementation or unreviewed scientific consequences have been approved.
