# CSS Custom Properties Reference — UI2

All design tokens defined in `/res/ui2/css/variables.css`.  
Override any of them in `/res/ui2custom/css/custom.css` inside a `:root` block.

```css
/* Example override */
:root {
    --ui2-primary: #e63946;
}
```

---

## Brand colours

| Variable | Default | Description |
|----------|---------|-------------|
| `--ui2-brand` | `#18181b` | Application brand identity colour |
| `--ui2-brand-accent` | `#2563eb` | Brand accent |

---

## Semantic / status colours

These map to Bootstrap's contextual classes (`btn-primary`, `alert-danger`, etc.).

| Variable | Default | Description |
|----------|---------|-------------|
| `--ui2-primary` | `#2563eb` | Primary accent — buttons, links, active state |
| `--ui2-primary-hover` | `#1d4ed8` | Primary on hover |
| `--ui2-primary-active` | `#1e40af` | Primary on active / pressed |
| `--ui2-primary-rgb` | `37, 99, 235` | RGB triplet for `rgba()` use |
| `--ui2-primary-light` | `#eff6ff` | Light tint of primary |
| `--ui2-secondary` | `#64748b` | Secondary / muted elements |
| `--ui2-secondary-hover` | `#475569` | Secondary on hover |
| `--ui2-secondary-active` | `#334155` | Secondary on active |
| `--ui2-secondary-rgb` | `100, 116, 139` | RGB triplet |
| `--ui2-success` | `#10b981` | Success / positive states |
| `--ui2-success-hover` | `#059669` | Success hover |
| `--ui2-success-rgb` | `16, 185, 129` | RGB triplet |
| `--ui2-danger` | `#ef4444` | Danger / error states |
| `--ui2-danger-hover` | `#dc2626` | Danger hover |
| `--ui2-danger-rgb` | `239, 68, 68` | RGB triplet |
| `--ui2-warning` | `#f59e0b` | Warning states |
| `--ui2-warning-hover` | `#d97706` | Warning hover |
| `--ui2-warning-rgb` | `245, 158, 11` | RGB triplet |
| `--ui2-info` | `#06b6d4` | Informational states |
| `--ui2-info-hover` | `#0891b2` | Info hover |
| `--ui2-info-rgb` | `6, 182, 212` | RGB triplet |

---

## Neutral / grey scale

| Variable | Default | Description |
|----------|---------|-------------|
| `--ui2-white` | `#ffffff` | Pure white |
| `--ui2-black` | `#000000` | Pure black |
| `--ui2-gray-50` | `#f8fafc` | Near-white surface |
| `--ui2-gray-100` | `#f1f5f9` | Lightest grey |
| `--ui2-gray-200` | `#e2e8f0` | Borders, dividers |
| `--ui2-gray-300` | `#cbd5e1` | Subtle separators |
| `--ui2-gray-400` | `#94a3b8` | Placeholder text |
| `--ui2-gray-500` | `#64748b` | Secondary / muted text |
| `--ui2-gray-600` | `#475569` | Body secondary text |
| `--ui2-gray-700` | `#334155` | Headings, labels |
| `--ui2-gray-800` | `#1e293b` | Primary body text |
| `--ui2-gray-900` | `#0f172a` | Near-black |

---

## Layout dimensions

| Variable | Default | Description |
|----------|---------|-------------|
| `--ui2-sidebar-width` | `260px` | Expanded sidebar width |
| `--ui2-sidebar-collapsed-width` | `0px` | Collapsed sidebar width |
| `--ui2-topbar-height` | `60px` | Top navigation bar height |
| `--ui2-footer-height` | `48px` | Footer height |

---

## Spacing scale

| Variable | Default | Pixels |
|----------|---------|--------|
| `--ui2-spacing-xs` | `0.25rem` | 4 px |
| `--ui2-spacing-sm` | `0.5rem` | 8 px |
| `--ui2-spacing-md` | `1rem` | 16 px |
| `--ui2-spacing-lg` | `1.5rem` | 24 px |
| `--ui2-spacing-xl` | `2rem` | 32 px |
| `--ui2-spacing-xxl` | `3rem` | 48 px |

---

## Typography

| Variable | Default | Description |
|----------|---------|-------------|
| `--ui2-font-family` | `"Inter", -apple-system, …` | Primary font stack |
| `--ui2-font-family-mono` | `"JetBrains Mono", …` | Monospace font stack |
| `--ui2-font-size-xs` | `0.75rem` | 12 px |
| `--ui2-font-size-sm` | `0.8125rem` | 13 px |
| `--ui2-font-size-base` | `0.875rem` | 14 px (default) |
| `--ui2-font-size-lg` | `1rem` | 16 px |
| `--ui2-font-size-xl` | `1.125rem` | 18 px |
| `--ui2-font-size-xxl` | `1.5rem` | 24 px |
| `--ui2-font-size-3xl` | `1.875rem` | 30 px |
| `--ui2-font-weight-light` | `300` | Light weight |
| `--ui2-font-weight-normal` | `400` | Normal weight |
| `--ui2-font-weight-medium` | `500` | Medium weight |
| `--ui2-font-weight-semibold` | `600` | Semibold weight |
| `--ui2-font-weight-bold` | `700` | Bold weight |
| `--ui2-line-height-tight` | `1.25` | Compact line height |
| `--ui2-line-height-base` | `1.5` | Default line height |
| `--ui2-line-height-relaxed` | `1.75` | Spacious line height |

---

## Borders & radius

| Variable | Default | Description |
|----------|---------|-------------|
| `--ui2-border-width` | `1px` | Default border width |
| `--ui2-border-color` | `var(--ui2-gray-200)` | Default border colour |
| `--ui2-border-color-light` | `var(--ui2-gray-100)` | Subtle border colour |
| `--ui2-border-radius-sm` | `0.375rem` | 6 px — small elements |
| `--ui2-border-radius` | `0.5rem` | 8 px — default |
| `--ui2-border-radius-lg` | `0.75rem` | 12 px — cards |
| `--ui2-border-radius-xl` | `1rem` | 16 px — dialogs |
| `--ui2-border-radius-2xl` | `1.5rem` | 24 px — large panels |
| `--ui2-border-radius-full` | `9999px` | Pills / circles |

---

## Shadows

| Variable | Default | Usage |
|----------|---------|-------|
| `--ui2-shadow-xs` | `0 1px 2px 0 rgba(0,0,0,.05)` | Hairline depth |
| `--ui2-shadow-sm` | *(see variables.css)* | Subtle lift |
| `--ui2-shadow` | *(see variables.css)* | Default card elevation |
| `--ui2-shadow-md` | *(see variables.css)* | Dropdowns, menus |
| `--ui2-shadow-lg` | *(see variables.css)* | Modals, dialogs |
| `--ui2-shadow-xl` | *(see variables.css)* | Overlay panels |
| `--ui2-ring-color` | `rgba(37,99,235,.4)` | Focus ring colour |
| `--ui2-ring-offset` | `2px` | Focus ring offset |

---

## Transitions

| Variable | Default | Description |
|----------|---------|-------------|
| `--ui2-transition-fast` | `150ms cubic-bezier(…)` | Quick micro-interactions |
| `--ui2-transition-base` | `200ms cubic-bezier(…)` | Default transitions |
| `--ui2-transition-slow` | `300ms cubic-bezier(…)` | Pane / panel transitions |
| `--ui2-transition-bounce` | `500ms cubic-bezier(…)` | Playful bounce |

---

## Z-index layers

| Variable | Value | Description |
|----------|-------|-------------|
| `--ui2-z-dropdown` | `1000` | Dropdown menus |
| `--ui2-z-sticky` | `1020` | Sticky elements |
| `--ui2-z-fixed` | `1030` | Fixed-position elements |
| `--ui2-z-sidenav` | `1038` | Sidebar overlay |
| `--ui2-z-topnav` | `1039` | Top navigation bar |
| `--ui2-z-modal-backdrop` | `1040` | Modal backdrop |
| `--ui2-z-modal` | `1050` | Modal dialog |
| `--ui2-z-popover` | `1060` | Popovers |
| `--ui2-z-tooltip` | `1070` | Tooltips |

---

## Sidebar theme

| Variable | Default | Description |
|----------|---------|-------------|
| `--ui2-sidebar-bg` | `#1e293b` | Sidebar background |
| `--ui2-sidebar-bg-solid` | `#1e293b` | Solid fallback (no transparency) |
| `--ui2-sidebar-color` | `rgba(255,255,255,.7)` | Default menu text / icons |
| `--ui2-sidebar-color-hover` | `rgba(255,255,255,.95)` | Menu item on hover |
| `--ui2-sidebar-color-active` | `var(--ui2-white)` | Active menu item |
| `--ui2-sidebar-heading-color` | `rgba(255,255,255,.4)` | Section headings |
| `--ui2-sidebar-divider-color` | `rgba(255,255,255,.1)` | Horizontal dividers |
| `--ui2-sidebar-footer-bg` | `rgba(0,0,0,.15)` | Footer strip |
| `--ui2-sidebar-active-bg` | `rgba(37,99,235,.2)` | Active item background |
| `--ui2-sidebar-hover-bg` | `rgba(255,255,255,.05)` | Hover background |

---

## Topbar theme

| Variable | Default | Description |
|----------|---------|-------------|
| `--ui2-topbar-bg` | `var(--ui2-white)` | Top navigation background |
| `--ui2-topbar-color` | `var(--ui2-gray-600)` | Icon / text colour |
| `--ui2-topbar-color-hover` | `var(--ui2-gray-900)` | Icon / text on hover |
| `--ui2-topbar-brand-color` | `var(--ui2-gray-900)` | App name / logo colour |
| `--ui2-topbar-border` | `var(--ui2-gray-200)` | Bottom border colour |
| `--ui2-topbar-shadow` | `var(--ui2-shadow-sm)` | Drop shadow |

---

## Content area

| Variable | Default | Description |
|----------|---------|-------------|
| `--ui2-body-bg` | `#f8fafc` | Page / main area background |
| `--ui2-body-color` | `var(--ui2-gray-800)` | Default text colour |
| `--ui2-content-bg` | `var(--ui2-white)` | Main content panel background |

---

## Card theme

| Variable | Default | Description |
|----------|---------|-------------|
| `--ui2-card-bg` | `var(--ui2-white)` | Card background |
| `--ui2-card-border` | `var(--ui2-gray-200)` | Card border colour |
| `--ui2-card-shadow` | `var(--ui2-shadow-sm)` | Card drop shadow |
| `--ui2-card-radius` | `var(--ui2-border-radius-lg)` | Card corner radius |

---

## See also

- [README.md](README.md) — theming overview and quick-start
- [dark-mode.md](dark-mode.md) — dark mode guide
- Source: `src/public_html/res/ui2/css/variables.css`
