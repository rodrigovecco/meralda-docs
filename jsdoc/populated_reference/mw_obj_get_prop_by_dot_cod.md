# mw_obj_get_prop_by_dot_cod

**Source:** `src/public_html/res/js/main.js`

---

## Description

Helper that creates a temporary `mw_obj` instance and uses its `get_obj_prop_by_dot_cod` implementation to return a nested property value from an object using dot-coded paths (e.g., `'a.b.c'`).

## Signature

function mw_obj_get_prop_by_dot_cod(data, cod)

- data: Object — the object to query
- cod: string — dotted path (e.g. `"user.address.city"`)

## Returns

- any — the value found at the path or `false` when the path is invalid

## Example

const val = mw_obj_get_prop_by_dot_cod({ user: { name: 'A' } }, 'user.name'); // -> 'A'

---

*Auto-generated (populated) documentation.*
