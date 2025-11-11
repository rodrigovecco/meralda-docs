# mw_get_debug_data_processor

**Source:** `src/public_html/res/js/main.js`

---

## Description

Processor object used by `mw_get_debug_data` to recursively build a debug-safe representation of values. Offers options to omit functions, limit depth and control how deep-limited values are returned.

## Construction

var p = new mw_get_debug_data_processor();

## Configurable properties

- `p.fnc` (string) — function name to call on objects for their debug representation (default: `getDebugDataForLog`).
- `p.deep` (number) — maximum recursion depth (default: 5). Set <=0 to disable depth limiting.
- `p.omitFunctions` (boolean) — when true, functions are omitted from final representation (default: true).
- `p.returnObjOnDeepLimit` (boolean) — when true, the object itself is returned when depth limit hits (default: false).
- `p.returnFncOnDeepLimit` (boolean) — when true, functions are returned instead of the string `[Function]` when depth limited (default: false).

## Methods

- `p.getData(obj)` — returns a debug-safe representation of `obj`.

## Behavior details

- Arrays and objects are traversed recursively unless depth limit is reached.
- If an object exposes a configured debug function (`p.fnc`) that is callable, that function's return is used as the object's debug representation.

## Example

var p = new mw_get_debug_data_processor();
p.deep = 3;
var data = p.getData(someComplexObject);

---

*Auto-generated (populated) documentation.*
