# mw_html_table

**Source:** `src/public_html/res/js/main.js`

---

## Description

A small helper that builds an HTML table programmatically. The helper exposes methods to add cells, rows and access the underlying `TABLE`/`TBODY` elements.

## Construction

var t = new mw_html_table();

## Methods

- `t.addCell(innerHTML)` — creates a `TD`, sets `innerHTML` when provided, appends to the current row and returns the cell.
- `t.appendCell(cell)` — appends an existing `TD` node to the current row and returns it.
- `t.closeRow()` — closes the current row so the next added cell starts a new row.
- `t.getActualRow()` — returns the current working `TR`, creating one if needed.
- `t.getTBody()` — ensures the `TBODY` exists and returns it.
- `t.getTable()` — ensures the `TABLE` exists and returns it.

## Example

var t = new mw_html_table();
var cell = t.addCell('Hello');
document.body.appendChild(t.getTable());

---

*Auto-generated (populated) documentation.*
