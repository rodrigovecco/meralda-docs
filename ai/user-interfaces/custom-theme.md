# Custom Theme for UI2 — Designer Guide

This guide explains how to create a completely different look and feel for a
Meralda project that uses the **UI2** module, while keeping write access
restricted to **one directory** and **one CSS file**.

---

## How it works

UI2 loads its styles in this order:

| # | File | Owner |
|---|------|-------|
| 1 | `/res/ui2/css/bootstrap.min.css` | Framework (read-only) |
| 2 | `/res/ui2/css/variables.css` | Framework (read-only) |
| 3 | `/res/ui2/css/layout.css` | Framework (read-only) |
| 4 | `/res/ui2/css/components.css` | Framework (read-only) |
| 5 | `/res/ui2/css/theme.css` | Framework (read-only) |
| 6 | `/res/ui2custom/css/custom.css` | **Designer (writable)** |

The custom sheet is loaded **last**, so every rule you write there overrides
the framework defaults at equal specificity.

---

## Step 1 — Activate the custom template in your project UI class

Your project's main UI class (typically in `src/app/managers/`) must call
`create_template()` and return a `mwmod_mw_ui2_template_custom` instance:

```php
// src/app/managers/uiadmin.php  (example)
class mwap_myproject_uiadmin_main extends mwmod_mw_ui2_def_main_admin {

    /**
     * Use the custom-theme template instead of the stock UI2 template.
     * @return mwmod_mw_ui2_template_custom
     */
    function create_template() {
        return new mwmod_mw_ui2_template_custom($this);
    }
}
```

That is the **only PHP change required**.

---

## Step 2 — Edit the CSS override file

The file the designer owns is:

```
src/public_html/res/ui2custom/css/custom.css
```

Served at the URL `/res/ui2custom/css/custom.css`.

### Override CSS variables (recommended approach)

UI2 exposes all colours, fonts, and spacing as CSS custom properties defined
in `/res/ui2/css/variables.css`.  Override them in a `:root` block at the top
of `custom.css`:

```css
:root {
  /* Brand colours */
  --mw-primary:          #e63946;
  --mw-primary-hover:    #c1121f;

  /* Sidebar */
  --mw-sidebar-bg:       #1d3557;
  --mw-sidebar-color:    #a8dadc;

  /* Top navigation */
  --mw-topbar-bg:        #457b9d;
  --mw-topbar-color:     #ffffff;

  /* Page background / text */
  --mw-body-bg:          #f1faee;
  --mw-body-color:       #1d3557;

  /* Cards / panels */
  --mw-card-bg:          #ffffff;

  /* Typography */
  --mw-font-family:      'Inter', sans-serif;
  --mw-border-radius:    0.5rem;
}
```

### Add arbitrary rules

After the `:root` block, add any selector that needs a different appearance:

```css
/* Make the topbar logo larger */
.mw-topbar-brand img { height: 48px; }

/* Round all buttons more */
.btn { border-radius: 2rem !important; }
```

---

## Step 3 — Add custom assets (fonts, images, icons)

Place every static asset the designer needs inside the same directory:

```
src/public_html/res/ui2custom/
    css/
        custom.css     ← the override sheet
    fonts/
        my-font.woff2
    img/
        logo.svg
        sidebar-bg.jpg
```

Reference assets with **relative paths** from `custom.css`:

```css
@font-face {
    font-family: 'Inter';
    src: url('../fonts/inter.woff2') format('woff2');
}

.sb-sidenav {
    background-image: url('../img/sidebar-bg.jpg');
    background-size: cover;
}
```

---

## Writable files summary

To delegate the theming task, give the designer write access to **one
directory only**:

```
src/public_html/res/ui2custom/   ← ONLY THIS DIRECTORY
```

| File / folder | Required? | Purpose |
|---------------|-----------|---------|
| `css/custom.css` | **Yes** | CSS overrides and variable redefinitions |
| `fonts/` | Optional | Custom web-fonts |
| `img/` | Optional | Custom images and logos |

**Nothing else needs to be touched.**  In particular:

- No files under `src/mwap/` should be modified.
- No files under `src/app/` are needed for pure visual changes.
- The only PHP change (step 1) is a one-liner in the project's app managers
  folder, which a developer does once.

---

## Want a second distinct theme?

Subclass `mwmod_mw_ui2_template_custom` and override `$custom_css_path`:

```php
// src/mwap/modules/mw/ui2/template/custom.php (or your own file)
class mwmod_mw_ui2_template_darktheme extends mwmod_mw_ui2_template_custom {
    protected string $custom_css_path = "/res/ui2dark/css/custom.css";
}
```

Then point a different project UI class at that template.  Each theme lives
in its own folder under `src/public_html/res/`.

---

## Related files

| File | Description |
|------|-------------|
| [src/mwap/modules/mw/ui2/template/main.php](../../src/mwap/modules/mw/ui2/template/main.php) | Standard UI2 template — loads the base CSS stack |
| [src/mwap/modules/mw/ui2/template/custom.php](../../src/mwap/modules/mw/ui2/template/custom.php) | Custom template — calls parent then appends custom.css |
| [src/public_html/res/ui2custom/css/custom.css](../../src/public_html/res/ui2custom/css/custom.css) | The designer's CSS override file |
| [docs/ai/user-interfaces/base-ui-classes.md](base-ui-classes.md) | UI base class reference |
