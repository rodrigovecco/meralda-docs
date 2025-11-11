# mw_getInt

**Source:** `src/public_html/res/js/main.js`

---

## Description

Converts a value to an integer when possible; returns `0` for non-numeric inputs.

## Signature

function mw_getInt(n)

- n: any — value to convert

## Returns

- integer — result of `parseInt(n)` when numeric, otherwise `0`.

## Example

mw_getInt('42') // -> 42
mw_getInt('abc') // -> 0

---

*Auto-generated (populated) documentation.*
