# Dark Mode — UI2

UI2 includes a built-in dark-mode palette activated by adding
`data-theme="dark"` to the `<body>` element.  The framework overrides a
subset of the surface and border tokens while the rest of the colour system
(primary, success, danger, etc.) stays the same.

---

## How it works

The dark-mode overrides live at the bottom of
`/res/ui2/css/variables.css`:

```css
[data-theme="dark"] {
    --ui2-body-bg:           #0f172a;
    --ui2-body-color:        var(--ui2-gray-100);
    --ui2-content-bg:        var(--ui2-gray-800);
    --ui2-border-color:      var(--ui2-gray-700);
    --ui2-border-color-light:var(--ui2-gray-800);
    --ui2-card-bg:           var(--ui2-gray-800);
    --ui2-card-border:       var(--ui2-gray-700);
    --ui2-topbar-bg:         var(--ui2-gray-900);
    --ui2-topbar-color:      var(--ui2-gray-400);
    --ui2-topbar-brand-color:var(--ui2-white);
}
```

No JavaScript is required beyond toggling the attribute.

---

## Enabling dark mode

### Server-side (PHP)

Override `get_body_tag_extra_atts()` in your project's main UI class:

```php
// src/app/managers/uiadmin.php
class mwap_myproject_uiadmin_main extends mwmod_mw_ui2_def_main_admin {

    function create_template() {
        return new mwmod_mw_ui2_template_custom($this);
    }

    /**
     * Force dark mode for all users.
     * @return string
     */
    function get_body_tag_extra_atts() {
        return 'data-theme="dark"';
    }
}
```

### Client-side toggle (JavaScript)

To let users switch modes at runtime, toggle the attribute on `<body>`:

```js
function setTheme(mode) {          // mode: "dark" | "light"
    if (mode === "dark") {
        document.body.setAttribute("data-theme", "dark");
    } else {
        document.body.removeAttribute("data-theme");
    }
    localStorage.setItem("theme", mode);
}

// Restore saved preference on page load
(function () {
    var saved = localStorage.getItem("theme");
    if (saved === "dark") { document.body.setAttribute("data-theme", "dark"); }
})();
```

---

## Customising dark-mode colours

Add a `[data-theme="dark"]` block in `custom.css` **after** the `:root`
block to override specific tokens only in dark mode:

```css
/* custom.css */
:root {
    --ui2-primary: #e63946;  /* brand override for all modes */
}

[data-theme="dark"] {
    /* Darker background than the default dark palette */
    --ui2-body-bg:  #060c18;
    --ui2-card-bg:  #0d1526;

    /* Keep brand colour readable on dark backgrounds */
    --ui2-primary:  #ff6b79;
}
```

---

## Respecting `prefers-color-scheme`

If you want the theme to follow the OS/browser preference automatically,
add this snippet to `custom.css`:

```css
@media (prefers-color-scheme: dark) {
    :root {
        --ui2-body-bg:           #0f172a;
        --ui2-body-color:        #f1f5f9;
        --ui2-content-bg:        #1e293b;
        --ui2-border-color:      #334155;
        --ui2-border-color-light:#1e293b;
        --ui2-card-bg:           #1e293b;
        --ui2-card-border:       #334155;
        --ui2-topbar-bg:         #0f172a;
        --ui2-topbar-color:      #94a3b8;
        --ui2-topbar-brand-color:#ffffff;
    }
}
```

> **Note:** The media-query approach and the `data-theme` approach can
> conflict.  Choose one. If you want a manual toggle, use `data-theme`.
> If you want full automatic OS integration with no manual toggle, use
> `@media (prefers-color-scheme: dark)`.

---

## Dark-mode tokens at a glance

| Token | Light default | Dark override |
|-------|--------------|---------------|
| `--ui2-body-bg` | `#f8fafc` | `#0f172a` |
| `--ui2-body-color` | `--ui2-gray-800` | `--ui2-gray-100` |
| `--ui2-content-bg` | `--ui2-white` | `--ui2-gray-800` |
| `--ui2-border-color` | `--ui2-gray-200` | `--ui2-gray-700` |
| `--ui2-border-color-light` | `--ui2-gray-100` | `--ui2-gray-800` |
| `--ui2-card-bg` | `--ui2-white` | `--ui2-gray-800` |
| `--ui2-card-border` | `--ui2-gray-200` | `--ui2-gray-700` |
| `--ui2-topbar-bg` | `--ui2-white` | `--ui2-gray-900` |
| `--ui2-topbar-color` | `--ui2-gray-600` | `--ui2-gray-400` |
| `--ui2-topbar-brand-color` | `--ui2-gray-900` | `--ui2-white` |

---

## See also

- [README.md](README.md) — theming overview and quick-start
- [css-variables-reference.md](css-variables-reference.md) — full token list
- Source: `src/public_html/res/ui2/css/variables.css`
