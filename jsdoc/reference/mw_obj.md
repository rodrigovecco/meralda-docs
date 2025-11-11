# mw_obj

**Source:** `src/public_html/res/js/main.js`

---

## Description

A constructor-style helper (object factory) that wraps a `params` object and provides convenience methods for nested property access, defaults, form-appending, and debug listing.

## Usage / Notes

- Construct with `var o = new mw_obj();` then use `o.set_params(...)`, `o.get_param('a.b')`, `o.set_param(value, 'a.b')`, and other helpers.
- The object includes helpers to treat dot-coded paths (`a.b.c`) and to convert nested data into form fields (`append2frm`).
- It also provides `get_list_debug_elem` to produce a DOM `<ul>` representation for debug display.

## Key methods (non-exhaustive)

- `set_params(data)` — replace internal params object
- `get_param(cod)` — retrieve a value using dot-coded path; returns whole params when `cod` is falsy
- `set_param(data, cod)` — set a value by dot-coded path
- `param_exists(cod)` — check presence of a nested param
- `append2frm(frm, pref, addLbl)` — append params as form inputs into a provided form element
- `get_list_debug_elem(deep, cod)` — returns a DOM `<ul>` describing the params

## Example

var o = new mw_obj();
o.set_params({ user: { name: 'Alice' } });
console.log(o.get_param('user.name'));

---

*Auto-generated (populated) documentation.*
