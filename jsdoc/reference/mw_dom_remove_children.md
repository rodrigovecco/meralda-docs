# mw_dom_remove_children

**Source:** `src/public_html/res/js/main.js`

---

## Description

Removes all child nodes from a DOM element. As a fallback it also clears innerHTML if an attribute `innerHTML` exists.

## Signature

function mw_dom_remove_children(e)

- e: Element — DOM element whose children will be removed

## Returns

- boolean — true when operation completed; false when the argument is falsy or invalid.

## Behavior

- If `e` is falsy returns false.
- Uses `hasChildNodes()` and `removeChild()` in a loop to remove children.
- If element has an `innerHTML` attribute the function sets `e.innerHTML = ""` as extra cleanup.

## Example

const container = document.getElementById('list');
mw_dom_remove_children(container);

---

*Auto-generated (populated) documentation.*
