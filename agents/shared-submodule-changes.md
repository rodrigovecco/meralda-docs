# Shared Submodule Change Log

> **AI Assistant Guide**: Record of changes made to directories that are **git submodules**
> (`src/mwap/modules/mw`, `src/mwap/modules/tidyb`, `src/public_html/res/tidyb`, …). Those
> directories are shared by every project running the Meralda core, so a change here can reach
> `tidybuses`, `tidybuses-staging`, `infrarelay` and any other site at a different time.
>
> Read this file **before changing anything** under those paths, and add an entry **after** doing
> it. Each entry states: what changed, whether old behaviour is preserved, and how to roll back.
>
> Companion docs: `core-upgrade-guide.md` (which paths are submodules), `ui-development.md`
> (UI class hierarchy).

## Why a project can break after a framework change

Each project pins its own commit of every submodule. Two consequences:

1. A site can be serving **older** submodule code than the one in this repository. Compare before
   blaming the change:
   ```bash
   git -C src/mwap/modules/mw log --oneline -1
   git -C src/mwap/modules/tidyb log --oneline -1
   git -C src/public_html/res/tidyb log --oneline -1
   ```
2. A deploy only copies what the *deploying* project pins.
   `ubuntu/staging-update.sh` / `prod-update.sh` run
   `git submodule update --init --recursive`, i.e. they honour the pin of the main repo.
   Another project needs an explicit bump:
   ```bash
   git -C <other-project> submodule update --remote src/mwap/modules/mw
   git -C <other-project> add src/mwap/modules/mw   # commit the new pointer
   ```

To verify what a live site is actually serving (works without logging in):

```powershell
(Invoke-WebRequest "https://<host>/res/tidyb/hubui/vehicles.js" -UseBasicParsing).Content -match '<some new identifier>'
```

---

## 2026-11-06 — Mobile layout for the "My vehicles" live map

**Scope**: `tidyb` + `res/tidyb`. Affects the hub UI of every site that uses these submodules.

### Committed

| Repo | Commit | Files |
|---|---|---|
| `src/public_html/res/tidyb` | `9a228b6` | `common/tripmap.js`, `hubui/vehicles.js` |
| `src/mwap/modules/tidyb` | `fc33088` | `hubui/ui/myvehicle/map.php` |
| main repo | `9583977` | submodule pointers |

**`common/tripmap.js` (`mwap_tidyB_trip_map`) — new opt-in properties**

| Property | Default (= previous behaviour) | Effect |
|---|---|---|
| `hideAllStops` | `false` | Skips every stop marker (paraderos) |
| `traceLineOpacity` | `0.8` | Polyline opacity |
| `traceLineWeight` | `4` | Polyline width |
| `arrowOpacity` | `1` | Direction-arrow opacity |
| `fitBoundsOnSetData` | `true` | `setData()` fits the map to the data bounds |

`data.stops` is now guarded with `Array.isArray`, so a trip payload without stops no longer throws.

**`hubui/vehicles.js` (`mwap_tidyB_vehicles_ui`) — view options**

`this.mapOptions` is read from `ui_js_init_params.mapOptions` by `readMapOptions()`:

```
hideBusStops, routeOpacity, routeWeight, arrowOpacity,
directionArrowsEvery (0 = no arrows), fitRoutesOnLoad,
centerOnVehicles, followSelectedVehicle, selectedVehicleZoom
```

Defaults reproduce the classic report exactly (stops drawn, opaque lines, arrows on every segment,
map fitted to the routes, no camera override). New camera helpers: `centerOnVehicle()`,
`fitToVehicles()`, `fitToRoutes()`, `applyVehicleCamera()`. The vehicle selector now only moves the
camera; clearing it re-frames all vehicles.

**`hubui/ui/myvehicle/map.php`** — mobile-first layout: map first in the DOM and full width,
legend below it on narrow screens, vehicle selector floating over the map; sets the
`mapOptions` above.

### Also part of this change

| File | Change |
|---|---|
| `tidyb/hubui/ui/myvehicle/map.php` | styles moved out of inline attributes into classes + `renderMapStyles()` with a `max-width: 767.98px` media query (trims the hub padding so the map uses ~82 % of a phone width instead of ~64 %); sets `$uiHeaderCollapsedByDefault = true` |
| `mw/ui/sub/uiabs.php`, `mw/uitemplates/sbadmin/template/main.php` | collapsible header + sub-menu toggle — see the next entry |

### Risk

* `mwap_tidyB_RouteItem` is **also** used by `hubui/currentdiligences.js`. Its new
  `applyMapOptions()` returns immediately when the UI has no `mapOptions`, so that report is
  untouched.
* All new defaults equal the previous hard-coded values; no site needs to change code.

### Rollback

```bash
git -C src/public_html/res/tidyb revert --no-edit 9a228b6   # or: checkout <prev> -- common/tripmap.js hubui/vehicles.js
git -C src/mwap/modules/tidyb revert --no-edit fc33088
git -C src/mwap/modules/tidyb checkout -- hubui/ui/myvehicle/map.php   # drop pending edits
```


---

## 2026-11-06 — Framework: collapsible UI header + sub-menu toggle on the title line

**Scope**: `src/mwap/modules/mw` — `ui/sub/uiabs.php` and `uitemplates/sbadmin/template/main.php`.
**This is core framework code**, inherited by every UI class of every project.

> Status: **uncommitted when this entry was written, verified on the local site only.** The defaults
> reproduce the previous rendering, so pulling it into another project is visually a no-op.

### `ui/sub/uiabs.php` — `mwmod_mw_ui_sub_uiabs`

| Member | Default | Meaning |
|---|---|---|
| `public $uiHeaderCollapsible` | `true` | The user may collapse this header |
| `public $uiHeaderCollapsedByDefault` | `false` | Start collapsed when the browser has no stored choice |
| `is_ui_header_collapsible()` | — | Permission only (reads the flag) |
| `is_ui_header_collapsed_by_default()` | — | Reads the flag, then falls back to the parent subinterface |

`is_ui_header_collapsible()` deliberately does **not** inspect the menu: asking a parent for the
sub-menu builds a brand new menu object on every call (`create_sub_interface_mnu_for_sub_interface()`
returns a fresh `mwmod_mw_mnu_mnu`). The template already knows whether a header and/or menu exist,
so it makes that decision and caches it.

Only a UI that sets `$uiHeaderCollapsedByDefault = true` opts in. The rule for this project is
*"collapsed only where the vertical space is really needed"* (the `myvehicle` map), never globally.

### `uitemplates/sbadmin/template/main.php`

| Member | Purpose |
|---|---|
| `$uiHeaderToggleEnabled` (`true`) | Set to `false` in a subclass to drop the button entirely |
| `get_sub_interface_mnu_for($su)` | Menu, built **once** per subinterface and cached |
| `is_ui_header_collapsible_for($su)` | Header exists **or** menu exists (cached) |
| `add_ui_header_toggle($nav,$su)` | Chevron button in the topbar, **left of the sidebar hamburger** |
| `get_sub_interface_mnu_toggle_html($su,$inline)` | Sub-menu toggle: `fa-list-ul`, on the title line |
| `get_ui_header_zone_open_html($su)` | Opens `#mwUIHeaderZone` around header + menu |
| `output_ui_header_toggle_assets()` | Emits the CSS and the toggle script once per page |

Rendering changes:

* `exec_page_body_sub_interface_bootstrap()` wraps the breadcrumb/title row **and** the sub-menu row
  in `<div id="mwUIHeaderZone" class="mw-ui-header-zone">`, closed right after
  `exec_sub_interface_mnu()`.
* `exec_sub_interface_mnu()` **no longer prints a `navbar-toggler`**. That toggle now lives on the
  title line (`fa-list-ul` icon, right-aligned, only below 992 px): two hamburgers in a row were
  indistinguishable from the sidebar one.
* State is stored in `localStorage` under `mwUIHeaderCollapsed:<subinterface-full-cod>`, so it is per
  screen. A stored value always wins over `$uiHeaderCollapsedByDefault`.
* On toggle the template dispatches a `resize` event so the Google map / DevExtreme widgets recompute
  their size. A view can define `window.mw_ui_header_on_toggle(collapsed)` to react.

### Risk

* Header markup is unchanged except for one extra `<button>` inside `.mw-subinterface-header` and the
  new wrapper `<div>`. Selectors like `.mw-subinterface-header > .mw-subinterface-header-route` still
  match; selectors that assume the header row is a direct child of `.container-fluid` do not.
* The sub-menu no longer has its own `navbar-toggler`; page code looking for it will not find it.
  Search for `navbar-toggler` in project code before bumping the pin.
* `mwmod_mw_uitemplates_sbadmin_main`, `ui2` and `ui/def/main/def` inherit all of this. The other
  template family (`mwmod_mw_bootstrap_ui_template_main`) is **not** touched and keeps its old
  behaviour.
* Name collisions: `uiHeaderCollapsible`, `uiHeaderCollapsedByDefault`, `is_ui_header_collapsible` and
  `is_ui_header_collapsed_by_default` did not exist anywhere in the workspace before this change
  (verified by search).

### Verification checklist after pulling the change into another project

1. `php -l` on both files.
2. A screen with a sub-menu (e.g. `ui=routes` → a route → *Trips*) at desktop width: breadcrumb,
   title and tabs identical to before, plus one chevron in the topbar.
3. Narrow the window below 992 px: the tabs collapse and a `fa-list-ul` button appears at the right of
   the title line; it must expand/collapse the tabs.
4. Toggle the topbar chevron: header + tabs hide together, the icon flips and the title switches
   between *Ocultar encabezado* / *Mostrar encabezado*; a reload keeps the choice, other screens do
   not inherit it.
5. Grid screens (`mw_ui_grid_remote`): collapsing must not break DevExtreme popups (the `resize`
   event is dispatched for that).
6. Phone width: the map/legend screens still fill the width.

### Rollback

```bash
git -C src/mwap/modules/mw checkout -- ui/sub/uiabs.php uitemplates/sbadmin/template/main.php
git -C src/mwap/modules/mw revert --no-edit <commit>        # once committed
```