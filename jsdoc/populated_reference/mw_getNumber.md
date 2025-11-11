# mw_getNumber

**Source:** `src/public_html/res/js/main.js`

---

## Description

Safely convert a value to a number. Returns `0` for falsy or invalid numeric inputs. For numeric strings or numbers, returns a finite number.

## Signature

function mw_getNumber(n)

- n: any — value to convert

## Returns

- number — parsed finite number, or `0` when input is not a valid number

## Behavior

- If `n` is already a `number` and finite, returns it.
- If `n` can be parsed as numeric (`mw_isNumber`), returns `parseFloat(n)`.
- Otherwise returns `0`.

## Examples

mw_getNumber('12.5') // -> 12.5
mw_getNumber(null) // -> 0

---

*Auto-generated (populated) documentation.*
