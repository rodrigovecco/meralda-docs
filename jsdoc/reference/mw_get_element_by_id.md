# mw_get_element_by_id

**Source:** `src/public_html/res/js/main.js`

---

## Description

Resolve either an element ID string to a DOM element or return the element directly when passed a DOM node. Validates that the resolved element is an actual element with a `tagName`.

## Signature

function mw_get_element_by_id(id)

- id: string|Element — element id or element instance

## Returns

- Element|false — DOM element when found; `false` for invalid inputs or if element not present

## Behavior notes

- Accepts an Element and returns it unchanged.
- When `id` is a string uses `document.getElementById`.
- Performs basic type checks and returns `false` for unexpected types.

## Example

const el = mw_get_element_by_id('myDiv');
if (el) el.style.display = 'none';

---

*Auto-generated (populated) documentation.*
