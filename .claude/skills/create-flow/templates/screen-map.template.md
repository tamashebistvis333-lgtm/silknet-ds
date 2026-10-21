# Flow plan — <flow name>

> Gate B artifact. Nothing is generated until the designer approves this plan.
> Values in `<…>` are to be filled; never fill a key or approval you did not observe.

## 1. Scope

| Item | Value |
|---|---|
| User goal | <…> |
| Actors | <…> |
| Entry point(s) | <…> |
| Viewport(s) | <e.g. 390×844> |
| Theme mode(s) | <Light / Dark — mode names as observed, or UNVERIFIED> |
| Prototype links in scope | <yes / no> |
| Acceptance criteria | <numbered list> |
| Assumptions (need confirmation) | <ASSUMPTION: …> |

## 2. Destination (from Gate A)

| Item | Value |
|---|---|
| Source file (read-only) | `ymEnGYUGvRRVKhHiUSGMVF` |
| Target file | <URL> (key `<…>`) |
| Output page | <page name> |
| Frame prefix | <prefix> |
| Gate A approval | "<designer quote>" — <timestamp> |

## 3. Screens and states

| # | Screen / state | Purpose | Primary action → destination | Secondary / error path |
|---|---|---|---|---|
| S1 | <…> | <…> | <…> → S2 | <…> |

Required states checklist (mark N/A with a reason): empty · loading · success · error · disabled · recovery.

## 4. Component mapping (per screen)

| Screen | Slot / element | Registry ID | Status | Variant values | Text / property overrides | Token bindings (container) |
|---|---|---|---|---|---|---|
| S1 | Header | <ds.…> | approved / proposed / missing | <Property=Value> | <TEXT#id = "…"> | <Background/layer …> |

Structural containers (plain Auto Layout frames, no control appearance):

| Screen | Container | Direction | Gap / padding variables | Fill variable |
|---|---|---|---|---|
| S1 | Content | vertical | <Digits/spacing/4> | <Background/layer> |

## 5. Prototype connections (if in scope)

| From (screen › element) | Trigger | Action | To |
|---|---|---|---|
| <…> | On tap | Navigate | <…> |

## 6. Blockers and gaps

| # | Gap | Type (missing component / state / binding / capability) | Affected screens | Proposed resolution |
|---|---|---|---|---|
| G1 | <…> | <…> | <…> | wait for library change / defer screen / labeled placeholder (needs approval) |

## 7. Approval

- Designer approval of this plan: "<quote>" — <timestamp> — scope: <screens approved>
- Placeholder approvals (per slot, if any): <…>
