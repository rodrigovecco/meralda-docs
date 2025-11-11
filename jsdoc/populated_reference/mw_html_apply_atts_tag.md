# mw_html_apply_atts_tag

**Source:** `src/public_html/res/js/main.js`

---

## Description

Set a collection of HTML attributes on an element using jQuery `.attr`.

## Signature

function mw_html_apply_atts_tag(elem, params)

- elem: Element — target element
- params: Object — map of attribute names to values

## Behavior

- Iterates `params` and calls `$(elem).attr(p, params[p] + "")` for each attribute.

## Example

mw_html_apply_atts_tag(el, { title: 'Username', 'data-role': 'user' });

---

*Auto-generated (populated) documentation.*
