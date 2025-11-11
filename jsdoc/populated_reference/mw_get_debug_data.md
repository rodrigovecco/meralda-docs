# mw_get_debug_data

**Source:** `src/public_html/res/js/main.js`

---

## Description

Convenience wrapper that returns a structured debug-safe representation of an object. It constructs `mw_get_debug_data_processor`, configures it, and returns `getData(obj)`.

## Signature

function mw_get_debug_data(obj, fnc, deep)

- obj: any — the value to inspect
- fnc: string|undefined — optional function name to call when objects expose a debug method (default: `getDebugDataForLog` in the processor)
- deep: number|undefined — maximum recursion depth used by the processor

## Returns

- any — sanitized representation of `obj` (primitive, array, or object with functions omitted according to processor settings)

## Notes

- See `mw_get_debug_data_processor` (in `main.js`) for configuration options such as `omitFunctions`, `deep`, and how objects with a named debug function are handled.
- This helper is intended for logging and safe display of complex objects.

## Example

const snapshot = mw_get_debug_data(window.appState, 'getDebugDataForLog', 3);

---

*Auto-generated (populated) documentation.*
