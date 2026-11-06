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

### Pending (working tree, not committed when this entry was written)

| File | Change |
|---|---|
| `tidyb/hubui/ui/myvehicle/map.php` | styles moved out of inline attributes into classes + `renderMapStyles()` with a `max-width: 767.98px` media query (trims the hub padding so the map uses ~82 % of a phone width instead of ~64 %) |
| `mw/ui/sub/uiabs.php` | see the next entry |

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

## 2026-11-06 — Framework flag: collapsible UI header (breadcrumb + title + sub-menu)

**Scope**: `src/mwap/modules/mw` (`ui/sub/uiabs.php`). **This is core framework code** — it is
inherited by every UI class of every project.

> Status when this entry was written: **base class only, uncommitted, nothing reads the flags yet**,
> so the change is currently a no-op. The toggle button, the collapse CSS and the client-side state
> are still pending.

### What was added to `mwmod_mw_ui_sub_uiabs`

| Member | Default | Meaning |
|---|---|---|
| `public $uiHeaderCollapsible` | `true` | Allows the header/sub-menu to be collapsed from the topbar toggle |
| `public $uiHeaderCollapsedByDefault` | `false` | Start collapsed when the browser has no stored choice |
| `is_ui_header_collapsible()` | — | Whether there is a header and/or sub-menu worth collapsing |
| `is_ui_header_collapsed_by_default()` | — | Reads the flag, then falls back to the parent subinterface |

Both defaults keep the classic behaviour: **expanded, exactly as before**. Only a UI that sets
`$uiHeaderCollapsedByDefault = true` opts in — the rule agreed for this project is *"collapsed only
where the vertical space is really needed"* (the `myvehicle` map), never globally.

### ⚠️ Caveat before wiring the template

`is_ui_header_collapsible()` calls `get_sub_interface_mnu_from_parent_responsable()`, which
**builds a new menu object** every time (`create_sub_interface_mnu_for_sub_interface()` in
`tidyb/hubui/ui/route/trip.php` and siblings return a fresh `mwmod_mw_mnu_mnu`). It does not
duplicate items in a shared manager, but it is not free. Cache the result, or replace the check with
a cheap one, when the same subinterface also renders its menu through
`template::exec_sub_interface_mnu()`.

### Name collisions

`uiHeaderCollapsible`, `uiHeaderCollapsedByDefault`, `is_ui_header_collapsible` and
`is_ui_header_collapsed_by_default` did not exist anywhere in the workspace before this change
(verified by search). A child class that already declares a property or method with one of those
names would simply override it — that is legal PHP — but it would also silently change behaviour, so
grep the other projects before bumping their `mw` pin.

### Verification checklist after pulling the change into another project

1. `php -l` on `ui/sub/uiabs.php`.
2. Open any admin screen that has a sub-menu (e.g. `ui=routes` → a route → *Trips*): the breadcrumb,
   title and sub-menu must look **identical** to the previous version.
3. Open a screen whose class sets `$uiHeaderCollapsedByDefault = true`, before and after logging out
   (the browser-stored choice must survive, and must not leak to other screens).
4. Check a grid screen (`mw_ui_grid_remote`) — the collapse must not clip the DevExtreme popups.

### Rollback

```bash
git -C src/mwap/modules/mw checkout -- ui/sub/uiabs.php     # uncommitted
git -C src/mwap/modules/mw revert --no-edit <commit>        # once committed
```
