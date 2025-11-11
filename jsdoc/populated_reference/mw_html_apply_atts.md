# mw_html_apply_atts

**Source:** `src/public_html/res/js/main.js`

---

## Description

Apply a set of HTML attribute and style configurations to an element. Delegates to `mw_html_apply_atts_tag` and `mw_html_apply_atts_style`.

## Signature

function mw_html_apply_atts(elem, params)

- elem: Element — DOM element to modify
- params: Object — may contain `htmltag` and `htmltagstyle` sub-objects

## Behavior

- If `params.htmltag` is present it calls `mw_html_apply_atts_tag(elem, params.htmltag)` to set attributes.
- If `params.htmltagstyle` is present it calls `mw_html_apply_atts_style(elem, params.htmltagstyle)` to set styles (via jQuery `.css`).

## Example

mw_html_apply_atts(el, { htmltag: { title: 'Name' }, htmltagstyle: { color: 'red' } });

---

*Auto-generated (populated) documentation.*
