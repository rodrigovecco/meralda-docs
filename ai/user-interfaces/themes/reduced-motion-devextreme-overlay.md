# Reduced-motion reset breaks DevExtreme overlays (known issue)

This page documents a real bug that shipped with the UI2 `layout.css` and is
now fixed at the source. Keep this in mind if you ever edit or re-introduce the
accessibility reset described below.

---

## Symptom

On **some machines only**, DevExtreme overlays (date pickers / calendars,
selectbox dropdowns, filter popups, etc.) opened **misaligned**. The most
reliable repro was a **flipped** calendar (a `DateBox` near the bottom of the
page, so the dropdown opens **upward**):

- `.dx-overlay-wrapper` → `transform: translate(358px, 308px)` (absolute anchor)
- `.dx-overlay-content`  → `transform: translate(358px, -2px)` (should be `-1px`/`-2px`)

The content duplicated the wrapper's **X** offset instead of keeping its small
relative offset. The bug showed on Chrome *and* Edge, on the *same* machine,
with `devicePixelRatio = 1`, so it was **not** DPI scaling, not a browser bug,
and not DevExtreme itself (an isolated DevExtreme-only test page rendered fine).

## Root cause

`layout.css` contained an accessibility reset for users who enable
**"reduce motion / disable animations"** in their OS:

```css
@media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}
```

The universal selector `*` with `!important` forced **every** element's
transition duration to `0.01ms`, including DevExtreme's own overlay containers
(`.dx-overlay-wrapper` / `.dx-overlay-content`). DevExtreme measures the
position of a flipped overlay **after** its CSS transition; collapsing the
transition to ~0ms made it read a mid-flight position and paint the content at
the wrong place.

Because the block only activates under `prefers-reduced-motion: reduce`, the
bug appeared **exclusively on machines with "reduce motion" enabled** — which is
exactly why it was intermittent across machines and hard to diagnose.

## Fix

Exclude DevExtreme elements (any class starting with `dx-`) from the reset,
preserving the accessibility intent for the rest of the UI:

```css
@media (prefers-reduced-motion: reduce) {
    *:not([class*="dx-"]),
    *:not([class*="dx-"])::before,
    *:not([class*="dx-"])::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}
```

## General rule

> Never apply a universal `* { transition-duration/animation-duration: … !important }`
> reset globally. JavaScript component libraries (DevExtreme, and others) often
> depend on their own transitions to measure and settle positions. If you need a
> reduced-motion reset, either scope it to your own components or exclude the
> library's element namespace (here `[class*="dx-"]`).

## How to reproduce / verify

1. In the OS enable **reduce motion**: Windows → Settings → Accessibility →
   Visual effects → **Animation effects = Off**.
2. Open a page with a `DateBox` near the bottom of the viewport (so it flips).
3. Before the fix the calendar was misaligned; after the fix it is correct.

You can also emulate it in DevTools without changing OS settings:
`Ctrl+Shift+P` → **"Emulate CSS prefers-reduced-motion"** → `reduce`.
