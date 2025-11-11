# mw_dom_append_cont

**Source:** `src/public_html/res/js/main.js`

---

## Description

Appends content to a DOM element. Accepts arrays (appends each item), DOM nodes (appends directly) or other values (converted into DOM using an inner `div`).

## Signature

function mw_dom_append_cont(e, cont)

- e: Element — parent element to append into
- cont: any — content to append; may be an Array, a DOM Node, or a string/HTML fragment

## Behavior

- If `cont` is an array, the function recurses and appends each entry.
- If `cont` is an object (assumed DOM node), it calls `e.appendChild(cont)`.
- Otherwise it creates a temporary `div`, sets `innerHTML = cont`, then moves its childNodes into `e` (preserving nodes).
- Returns true on success; tolerated falsy inputs return true (no-op).

## Examples

mw_dom_append_cont(container, '<p>Hello</p>');
mw_dom_append_cont(container, document.createElement('div'));
mw_dom_append_cont(container, [nodeA, '<span>two</span>']);

---

*Auto-generated (populated) documentation.*
