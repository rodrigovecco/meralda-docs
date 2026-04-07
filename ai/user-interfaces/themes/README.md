# Theming Guide — UI2

This folder covers everything you need to customise the visual appearance of a
Meralda project that uses the **UI2** module.

---

## Contents

| File | Description |
|------|-------------|
| [README.md](README.md) | This overview + quick-start |
| [css-variables-reference.md](css-variables-reference.md) | Complete `--ui2-*` CSS custom-property reference |
| [dark-mode.md](dark-mode.md) | Enabling and customising dark mode |

---

## How theming works

UI2 loads its CSS in this order:

| # | URL | Owner |
|---|-----|-------|
| 1 | `/res/ui2/css/bootstrap.min.css` | Framework (read-only) |
| 2 | `/res/ui2/css/variables.css` | Framework – defines all `--ui2-*` tokens |
| 3 | `/res/ui2/css/layout.css` | Framework (read-only) |
| 4 | `/res/ui2/css/components.css` | Framework (read-only) |
| 5 | `/res/ui2/css/theme.css` | Framework (read-only) |
| 6 | `/res/ui2custom/css/custom.css` | **Your file** — loaded last, wins by default |

Because `custom.css` is loaded last, any rule (or `:root` variable override)
you write there takes precedence at equal CSS specificity.

**Only two things require write access** to change the entire look and feel:

1. `src/public_html/res/ui2custom/` — static assets (one-time setup)
2. A single one-liner in your project's main UI class (one-time PHP setup)

---

## Step 1 — Activate the custom template (PHP, done once)

In your project's main UI class (usually under `src/app/managers/`), override
`create_template()` to return a `mwmod_mw_ui2_template_custom` instance:

```php
// src/app/managers/uiadmin.php
class mwap_myproject_uiadmin_main extends mwmod_mw_ui2_def_main_admin {

    /**
     * Use the custom-theme template.
     * @return mwmod_mw_ui2_template_custom
     */
    function create_template() {
        return new mwmod_mw_ui2_template_custom($this);
    }
}
```

That is the **only PHP change required.**

---

## Step 2 — Edit the CSS override file

```
src/public_html/res/ui2custom/css/custom.css
```

### Override CSS variables (recommended)

Redefine any `--ui2-*` token inside a `:root` block:

```css
:root {
    /* Brand / primary colour */
    --ui2-primary:          #e63946;
    --ui2-primary-hover:    #c1121f;
    --ui2-primary-active:   #9b111e;

    /* Sidebar */
    --ui2-sidebar-bg:       #1d3557;
    --ui2-sidebar-color:    rgba(168, 218, 220, 0.85);

    /* Top navigation */
    --ui2-topbar-bg:        #457b9d;
    --ui2-topbar-color:     #ffffff;

    /* Page background / text */
    --ui2-body-bg:          #f1faee;
    --ui2-body-color:       #1d3557;

    /* Cards */
    --ui2-card-bg:          #ffffff;

    /* Typography */
    --ui2-font-family:      'Inter', sans-serif;
    --ui2-border-radius:    0.5rem;
}
```

See [css-variables-reference.md](css-variables-reference.md) for the full list
of available tokens.

### Add arbitrary CSS rules

After the `:root` block, add any selector that needs a different appearance:

```css
/* Larger topbar logo */
.mw-topbar-brand img { height: 48px; }

/* Rounder buttons */
.btn { border-radius: 2rem !important; }
```

---

## Step 3 — Add custom assets

Place fonts, images, and icons inside the same directory:

```
src/public_html/res/ui2custom/
    css/
        custom.css      ← CSS overrides (required)
    fonts/
        my-font.woff2
    img/
        logo.svg
        sidebar-bg.jpg
```

Reference them with **relative paths** from `custom.css`:

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

## Creating a second distinct theme

Subclass `mwmod_mw_ui2_template_custom` and override the CSS path:

```php
// src/app/managers/uidark.php
class mwap_myproject_uidark_template extends mwmod_mw_ui2_template_custom {
    protected string $custom_css_path = "/res/ui2dark/css/custom.css";
}
```

Then point a second project UI class at that template. Each theme lives in its
own folder under `src/public_html/res/`.

---

## Writable-files summary

| Path | Required? | Purpose |
|------|-----------|---------|
| `src/public_html/res/ui2custom/css/custom.css` | **Yes** | CSS overrides |
| `src/public_html/res/ui2custom/fonts/` | Optional | Custom web-fonts |
| `src/public_html/res/ui2custom/img/` | Optional | Custom images/logos |

**Nothing else must be touched.** In particular:

- No files under `src/mwap/` should be modified (it is a submodule).
- No additional files under `src/app/` are needed for purely visual changes.

---

## Related docs

| Topic | File |
|-------|------|
| All `--ui2-*` CSS tokens | [css-variables-reference.md](css-variables-reference.md) |
| Dark mode | [dark-mode.md](dark-mode.md) |
| UI base classes | [../base-ui-classes.md](../base-ui-classes.md) |
| DataGrid UI | [../datagrid.md](../datagrid.md) |
| Original designer guide | [../custom-theme.md](../custom-theme.md) |
