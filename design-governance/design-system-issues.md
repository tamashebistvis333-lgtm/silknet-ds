# Design System issues — Silknet New DS

Issues found while generating and auditing flows with `/create-flow`. They concern the source
library `ymEnGYUGvRRVKhHiUSGMVF` (Silknet New DS), which this repository never edits: every fix
is a designer decision made in Figma. Registry `contentConstraints` refer to these IDs
(`dsIssue`).

- **Evidence file:** Silknet AI Playground `zzGuTpXzrcglX1zlOd4IuR` — screen `92:1241`
  (Notification Settings, page `92:1240`) and the r8 layout capability evidence `100:1241`
  (page `100:1240`, kept permanently).
- **Measured:** 2026-10-26, default variable mode only. Colours are the rendered hex values read
  through the Plugin API; contrast follows WCAG 2.x relative luminance. Token names are given only
  where verified.
- **Status values:** `open` (reported, no decision), `accepted` (designer accepts as is, with a
  rationale), `fixed` (library changed and re-verified), `wontfix`.

| ID | Severity | Component | Summary | Status |
|---|---|---|---|---|
| DS-01 | High | `Input` `760a013d26238a27bc2a347170ecfe10442ee933` | Long value wraps and overflows the fixed-height field | open |
| DS-02 | Medium | `Input` | Label contrast 4.27:1 (needs 4.5:1) | open |
| DS-03 | Medium–High | `button` `7c3e71bf0a0ffba71efbf997fa41e4dd986065d0` | Primary label contrast 3.63:1 (needs 4.5:1) | open |
| DS-04 | High (off) / Medium (on) | `Toggle` `1b57d0d6637c3725791c74bea0e871af1a62aa90` | Track contrast 1.09:1 off, 2.69:1 on (needs 3:1) | open |
| DS-05 | Medium — decision needed | `Input` | Field boundary 1.05:1 fill / 1.1:1 border | open |
| DS-06 | Low | `navigation-header` `0758be8c107cf606e12937d8b393e3200ece14d5` | Nested `Icon` component set of unverified origin | open |

## DS-01 — Input: long value overflows the field

- **Where:** `State=Filled`, property `Text#2036:245`, text layer `2051:3015`. The value sits in
  `Label+Text` (height follows content) inside the field frame `Input`, which has a fixed height
  of 52 px.
- **Evidence:** a long value wraps to 3 lines at inner width 288 and 2 lines at 361 and 398;
  `Label+Text` grows to 60–80 px and pushes the label 4–14 px above the field (`100:1564`,
  `100:1853`, `100:2142`). The same happens at the native width — not caused by FILL.
- **Impact:** label and value overlap the field border and are clipped by surrounding containers;
  content becomes unreadable.
- **Expected:** a defined behaviour for long values.
- **Options (designer decision):** single line with an ending ellipsis; field height that follows
  content with a 52 px minimum; or document that multi-line entry uses `text area`.
- **Not tested:** `Default`, `Error`, `Disabled` (same structure).
- **Registry:** `ds.input` constraint `C-INPUT-TEXT-1L` (`SINGLE_LINE`).
- **Re-verify:** audit regression case L-N16 against the updated library.

## DS-02 — Input: label contrast below WCAG AA

- **Where:** `State=Filled`, label layer `2051:3014`, 12 px Medium.
- **Evidence:** `#69757e` on `#f2f3f4` (Background/surface `#f8f9f9` under the field's 8 %
  overlay) = **4.27:1**; WCAG 1.4.3 requires 4.5:1 (node `I92:1364;2051:3014`).
- **Token:** the label's colour token was not resolved (UNVERIFIED); resolve with
  `get_variable_defs` on the source Input node.
- **Options:** darker label token, or a lighter field overlay.

## DS-03 — Button: primary label contrast below WCAG AA

- **Where:** `property=primary, size=large, State=default`, label layer `27:185`, 14 px Medium.
- **Evidence:** `#ffffff` on `#0089eb` = **3.63:1**; 4.5:1 required. It would meet only the
  large-text threshold (≥ 18.66 px bold or ≥ 24 px) (node `92:1392`).
- **Token:** `#0089eb` matches the example in the project CLAUDE.md
  (`--background-primary-accent`); the button's binding was not verified.
- **Scope:** likely every primary variant and size; only this one was measured.
- **Options:** a darker accent for button backgrounds, or a larger / bolder label — a brand-colour
  decision.

## DS-04 — Toggle: track contrast

- **Evidence:** off (`selected=false`): track `#edeff0` vs surface `#f8f9f9` **1.09:1**, knob vs
  track 1.15:1. On (`selected=true`): track `#29ae6f` vs surface **2.69:1**, knob vs track 2.85:1.
  WCAG 1.4.11 requires 3:1 for parts needed to identify the control and its state (toggles in
  `92:1274`, `92:1313`, `92:1337`).
- **Mitigation:** state is also shown by knob position (visual assessment; designer confirmation
  pending).
- **Impact:** the off state is almost invisible.
- **Options:** darker off track or a track border; darker on-track colour.

## DS-05 — Input: field boundary contrast

- **Evidence:** field fill `#f2f3f4` **1.05:1** and 1 px border `#eceef0` **1.1:1** against the
  surface (node `92:1364`).
- **Decision needed:** WCAG 1.4.11 applies only if the boundary is required to identify the field;
  the visible label and value may suffice. Record the accessibility judgement here.
- **Options:** stronger border token, or accept with a written rationale.

## DS-06 — navigation-header: nested Icon of unverified origin

- **Where:** `Property=Default`, right slot, layer path `4166:2597;2073:2043`; component set
  `Icon` `8c6c04694a868828a99a5fb79626aebf873f4fb7`, variant `Icon=More_Horizontal`. Hidden by
  default; the registry requires it to stay hidden (`mustRemainHidden`).
- **Evidence:** the exact key is not returned by `search_design_system` in Silknet New DS
  (queries "More_Horizontal", "Icon") or in the other added libraries (Material 3, Simple Design
  System, iOS 18). Silknet's `more-horizontal` is a different component (`65901465…`) and is not
  assumed to be the same.
- **Possible causes (unconfirmed):** an unpublished or hidden source component; a library not
  added to the Playground; a stale reference from an earlier swap.
- **Impact:** none while hidden; enabling the right slot would show an unverified component.
- **Ask:** confirm the origin, or replace it with the Silknet `more-horizontal` and republish.
