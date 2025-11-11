# mw_is_object

**Source:** `src/public_html/res/js/main.js`

---

## Description

Checks whether a value is an object (non-null) and, optionally, whether it exposes a named function property. This mirrors the behavior in the project's `main.js` helper `mw_is_object`.

## Signature

function mw_is_object(data, checkfnc)

- data: any — value to test
- checkfnc: string|undefined — optional name of a function property to verify on `data`

## Returns

- boolean — true when `data` is an object and (if `checkfnc` is provided) `data[checkfnc]` is a function.

## Notes

- The function returns false for falsy values like `null` or `undefined`.
- When `checkfnc` is provided the function delegates to `mw_is_function` to verify that the property is a function.

## Examples

mw_is_object({}) // -> true
mw_is_object(null) // -> false
mw_is_object(obj, 'init') // -> true only if obj.init is a function

---

*Auto-generated (populated) documentation.*
