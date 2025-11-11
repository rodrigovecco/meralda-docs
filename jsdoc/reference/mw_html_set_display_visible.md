# mw_html_set_display_visible

**Source:** `src/public_html/res/js/main.js`

---

## Description

Show or hide an element while preserving its original display value in a `displayonshow` attribute. Supports an "alternate" visibility toggle.

## Signature

function mw_html_set_display_visible(elem, visible)

- elem: Element — target element
- visible: boolean|string|undefined — when `true` shows element, `false` hides it. When `'alternate'` toggles its visibility.

## Behavior

- On first run saves the element's current `display` value into attribute `displayonshow`.
- When `visible` is `'alternate'` toggles between visible and hidden.
- Uses the saved `displayonshow` value to restore visibility when showing.

## Example

mw_html_set_display_visible(el, true); // show
mw_html_set_display_visible(el, 'alternate'); // toggle

---

*Auto-generated (populated) documentation.*
