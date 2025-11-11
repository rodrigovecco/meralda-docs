# mw_load_script

**Source:** `src/public_html/res/js/main.js`

---

## Description

Dynamically injects a `<script>` tag into the document body to load a JavaScript file.

## Signature

function mw_load_script(src)

- src: string — URL or path to the JavaScript file

## Behavior

- Creates a `SCRIPT` element, sets `src`, `language` and `type` attributes, then appends it to `document.body`.
- This function does not provide callbacks for load/error; scripts inserted are executed by the browser when loaded.

## Example

mw_load_script('/res/js/someplugin.js');

---

*Auto-generated (populated) documentation.*
