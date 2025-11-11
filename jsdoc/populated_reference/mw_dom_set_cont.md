# mw_dom_set_cont

**Source:** `src/public_html/res/js/main.js`

---

## Description

Replace the children of a DOM element with new content. Internally calls `mw_dom_remove_children` then `mw_dom_append_cont`.

## Signature

function mw_dom_set_cont(e, cont)

- e: Element — parent element to set content into
- cont: any — new content to append (array, DOM nodes, HTML string)

## Returns

- boolean — true on success; false when `mw_dom_remove_children` fails

## Example

mw_dom_set_cont(container, '<p>New content</p>');

---

*Auto-generated (populated) documentation.*
