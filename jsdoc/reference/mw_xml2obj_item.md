# mw_xml2obj_item

**Source:** `src/public_html/res/js/main.js`

---

## Description

Parse an XML node into a JavaScript value according to the node's `dataType` attribute. Supports types: `Object`, `Array`, `Bool`, `Int`, `Numeric`, `String`, `JSObject` (when allowed), `json`.

## Signature

function mw_xml2obj_item(xmlNode, allowJsCode)

- xmlNode: Node — XML element node containing `dataType` attribute and child nodes
- allowJsCode: boolean — when true, permits `JSObject` parsing via `eval` (use with caution)

## Returns

- any — parsed value (Object, Array, primitive) or `false` on invalid input

## Behavior details

- For `Object` and `Array` types the function recursively processes element children and builds a JS object/array.
- For primitives it reads `xmlNode.firstChild.data` and converts it according to `dataType`.
- For `JSObject` with `allowJsCode=true` it `eval`s the firstChild data into an object; otherwise returns `{}`.
- For `json` type it parses `JSON.parse` of the text content.

## Security note

- `JSObject` parsing uses `eval` and should only be enabled (`allowJsCode=true`) for trusted inputs.

## Example

// Given an XML node `<item dataType="Int">42</item>`
const v = mw_xml2obj_item(itemNode, false); // -> 42

---

*Auto-generated (populated) documentation.*
