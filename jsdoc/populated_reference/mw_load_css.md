# mw_load_css

**Source:** `src/public_html/res/js/main.js`

---

## Description

Dynamically injects a `<link rel="stylesheet">` tag into the document to load a CSS file.

## Signature

function mw_load_css(src)

- src: string — URL or path to the stylesheet

## Behavior

- Creates a `link` element with `rel="stylesheet"` and `type="text/css"`, sets `href`, and appends to `document.body`.
- No load/error callbacks are provided by this helper.

## Example

mw_load_css('/res/css/site.css');

---

*Auto-generated (populated) documentation.*
