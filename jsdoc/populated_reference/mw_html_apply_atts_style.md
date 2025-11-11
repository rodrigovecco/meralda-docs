# mw_html_apply_atts_style

**Source:** `src/public_html/res/js/main.js`

---

## Description

Apply style properties to an element using jQuery's `.css` helper. Accepts an object of style key/value pairs.

## Signature

function mw_html_apply_atts_style(elem, params)

- elem: Element — target element
- params: Object — key/value map of CSS property names and values

## Behavior

- For each property `p` in `params` it calls `$(elem).css(p, params[p] + "")` to set the style on the element.

## Example

mw_html_apply_atts_style(el, { color: 'blue', display: 'inline-block' });

---

*Auto-generated (populated) documentation.*
