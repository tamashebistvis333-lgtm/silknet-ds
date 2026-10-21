# Handoff — <flow name>

## Summary

- **Overall technical result:** <PASS | FAIL | UNVERIFIED>
- **Designer review:** <pending | approved "<quote>" at <time>> (recorded separately; never upgrades missing evidence)
- **Code generated:** no — <or: yes, under approval "<quote>", scope …>
- **Repository files touched:** <none | registry at <path> (approved "<quote>")>

## Where it lives

| Item | Value |
|---|---|
| Source file (read-only) | `ymEnGYUGvRRVKhHiUSGMVF` — library key `<…>` observed <time> |
| Target file | <URL> (key `<…>`) |
| Page | <…> |
| Registry | <path> — revision <…> |
| Variable mode(s) set | <…> |

## Screens generated

| # | Screen | Node ID | Link | Result |
|---|---|---|---|---|
| S1 | <…> | `<id>` | https://www.figma.com/design/<TARGET_KEY>?node-id=<id-with-dash> | <PASS/FAIL/UNVERIFIED> |

## Components used (usage manifest)

| Screen | Node ID | Registry ID | Key used | Variant / properties set | Exception |
|---|---|---|---|---|---|
| S1 | `<id>` | <ds.…> | `<key>` | <…> | <none / exc-id> |

## Missing components and gaps

| # | Gap | Impact | Status / next action |
|---|---|---|---|
| G1 | <…> | <…> | <…> |

## Validation

| # | Check | Method | Evidence | Result | Remediation / remaining action |
|---|---|---|---|---|---|
| V1 | Source protected, correct target | <…> | <…> | <…> | <…> |
| V2 | Registry provenance, no detached / local replacements | <…> | <…> | <…> | <…> |
| V3 | Variants / properties within approved values | <…> | <…> | <…> | <…> |
| V4 | Auto Layout structure | <…> | <…> | <…> | <…> |
| V5 | Variable bindings, no unapproved literals | <…> | <…> | <…> | <…> |
| V6 | Text styles / text properties | <…> | <…> | <…> | <…> |
| V7 | Layout at specified sizes (clipping, overlap, wrapping) | <…> | <…> | <…> | <…> |
| V8 | Coverage: screens, states, navigation, prototype links | <…> | <…> | <…> | <…> |
| V9 | Accessibility (automated vs. designer review) | <…> | <…> | <…> | <…> |
| V10 | No code / repo mutation / source write / publish | <…> | <…> | <…> | <…> |
| V11 | Frames fully inside their containers; no overlap / overflow | audit `containmentViolations`, `overlapPairs` | <…> | <…> | <…> |
| V12 | Component fonts available and loaded | write-call font report + audit `fontsInUse` | <…> | <…> | <…> |
| V13 | Links, variants, bindings, styles, modes, reactions preserved after modifications | audit `preservationDiffs` vs previous snapshot | <…> | <…> | <…> |
| V14 | Results taken from an independent read-only audit | separate `use_figma` read call | <…> | <…> | <…> |
| V15 | Prototype playback (if in scope) | designer presents the prototype | <…> | <…> | <…> |

Rules for this table: one result per row — `PASS`, `FAIL`, or `UNVERIFIED`, never a mix.
`PASS` only with evidence from this run's independent audit. Anything not exercised is
`UNVERIFIED`, including stored-but-unplayed prototype links. Overall = FAIL if any FAIL,
else UNVERIFIED if any UNVERIFIED, else PASS.

## Limitations (component properties not exposed)

| Component | Missing capability | Effect on the flow | Workaround approved? |
|---|---|---|---|
| <e.g. Badge> | <e.g. no TEXT property — label fixed by variant> | <…> | <no — reported as UNVERIFIED / gap> |

## Exceptions

| ID | Property / value | Nodes | Reason | Approval | Resolution condition |
|---|---|---|---|---|---|

## Unresolved issues and pending decisions

- <…>
