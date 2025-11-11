# MWRatingRenderer

**Location:** `src/public_html/res/js/mw_star_rating.js`

---

## Description

Lightweight star-rating renderer widget. Renders a row of star icons, allows setting/getting the value, and supports a change callback. Can be appended to any DOM container.

Constructor options (object):
- max: number (default 5) — number of stars
- iconFilled: string — CSS classes for filled star icon
- iconEmpty: string — CSS classes for empty star icon
- colorFilled: string — color for filled stars
- colorEmpty: string — color for empty stars
- value: number — initial value
- readonly: boolean — disable interaction
- onChange: function(value) — callback when value changes

---

## Methods

- constructor(options = {})
	- Initialize renderer with provided options.

- setValue(value)
	- Set the current rating (clamped to 0..max) and re-render.

- getValue()
	- Returns the current numeric value.

- setReadonly(readonly)
	- Enable/disable user interaction.

- setOnChange(callback)
	- Set the onChange callback invoked when user changes the rating.

- appendTo(container)
	- Create the widget DOM inside `container`, render and attach handlers.

- _render()
	- Internal method. Renders the star icons according to current value.

- _attachClickHandler()
	- Internal method. Attaches click listener to the stars to update value.

---

## Usage

const r = new MWRatingRenderer({ max:5, value:3 });
r.appendTo(document.getElementById('ratingContainer'));
r.setOnChange(v => console.log('rating', v));

---

*Auto-generated documentation populated from source.*
