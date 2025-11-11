# mw_do_fnc

**Source:** `src/public_html/res/js/main.js`

---

## Description

Simple wrapper that calls a function reference. Useful as a place-holder to pass into APIs that expect a callable.

## Signature

function mw_do_fnc(fnc)

- fnc: Function — function reference to call

## Behavior

- Calls `fnc()` directly without arguments or error handling.

## Example

mw_do_fnc(function(){ console.log('done'); });

---

*Auto-generated (populated) documentation.*
