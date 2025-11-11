# mw_is_array

**Source:** `src/public_html/res/js/main.js`

---

## Description

Determines whether a value is an Array. The implementation first ensures the value is an object and then checks Object.prototype.toString for `[object Array]`.

## Signature

function mw_is_array(data)

- data: any — value to test

## Returns

- boolean — true when `data` is an Array

## Examples

mw_is_array([1,2,3]) // -> true
mw_is_array({}) // -> false

---

*Auto-generated (populated) documentation.*
