# Upgrading a Legacy Project to the Current Meralda Core

> **AI Assistant Guide**: Use this when a project runs on an old copy of the Meralda core — typically
> the framework committed as flat files inside the project, targeting an obsolete PHP version — and it
> has to be brought onto the current core and a supported PHP version without losing the ability to
> receive framework updates later. Read `architecture-overview.md` first, and `module-init.md` when
> the project needs its own module registered.

## When to Use This Guide

The project needs this treatment when any of these is true:

- `src/mwap/modules/mw/` and its siblings are **plain committed files**, not submodules
- The code targets a PHP version that is no longer supported (5.x, 7.x)
- `composer.json` at the root is absent and third-party libraries sit inside `src/mwap/modulesext/`
- The project predates the current module layout (`users2`, `dbcore`, `jwt`, `oauth`, `ui2`, `uuid`,
  `tempitems`, `uitemplates`, …)

## The One Rule That Cannot Be Broken

**Every path that is a submodule in Meralda must remain a submodule in the project.**

Copying a submodule's content as flat files "works", and every screen may render correctly, but it
destroys the reason to migrate at all: the project can no longer pull framework updates with
`git submodule update --remote`. A flat copy silently becomes a fork that drifts.

Before touching anything, write down which paths are submodules upstream:

```bash
git config -f .gitmodules --get-regexp '^submodule\..*\.path$'
```

As of this writing the set is:

| Path | Repository |
|---|---|
| `src/mwap/modules/mw` | `meralda_mw_modules` |
| `src/mwap/modulesext` | `meralda-thirdparty-modules` |
| `src/mwap/modules/themes/default` | `meralda-theme-default` |
| `src/public_html/res/js` | `meralda_js_submodule` |
| `src/public_html/res/css` | `meralda_css` |
| `src/public_html/res/thirdparty` | `meralda-thirdparty-public` |
| `src/public_html/res/meralda` | `meralda_public_res` |
| `src/public_html/res/themes/default` | `meralda-theme-default-public` |

Anything else under `src/` is either a flat framework copy or project code.

---

## Step 0 — Build a Safety Net

Never start without a return point. The migration rewrites thousands of files.

```bash
git tag pre-upgrade-snapshot
git checkout -b upgrade-current-core
```

Do the whole migration on that branch. Leave the default branch untouched until the branch is
verified and merged, so a production deploy can still use the old code if something surfaces late.

---

## Step 1 — Classify Every Path

Three outcomes, decided per path:

| Class | Meaning | Action |
|---|---|---|
| **REPLACE** | Framework folder with no project content | Delete the destination, copy the source wholesale |
| **MERGE** | Folder that may hold project additions | Copy source over destination, never delete extras |
| **KEEP** | Project-owned code | Do not touch |

### What is REPLACE

Framework-only folders: `mwap/core`, the bootstrap files (`preinit.php`, `afterinit.php`,
`version.json`), `mwap/autoloaders`, `mwap/data`, `mwap/lng`, `mwap/lngmsgs`, `mwap/mailmsgs`,
`mwap/managers`, and the small modules `mwcommon`, `mwalt`, `mwhelper`, `cus`, `demo`.

`modules/mw` is also REPLACE — it is a submodule upstream, so it gets replaced by a submodule rather
than by a copy (Step 4).

### What is MERGE

`mwap/modulesext` and the `public_html` tree. The project may have added packages under
`modulesext/`, and its own entry points under `public_html/`. Merging (copy over, keep extras) is
what makes "keep the old ones just in case" possible.

### What is KEEP

Everything the project wrote:

- `src/mwap/modules/<project-module>/` — the application module and any auxiliary modules
- `src/app/` — configuration, content, lng, managers
- `src/mwap/cfg.ini` — project overrides of the framework defaults
- `src/public_html/res/<project-assets>/` — project JS/CSS/images
- Entry points the project added under `public_html/` (extra service endpoints, cron jobs, API)

Identify the application module from `src/app/init.php`: every `create_and_add_sub_pref_man()` call
whose path is **not** under Meralda's own module list is project code.

---

## Step 2 — Rescue Framework Modules the Project Never Published

This is the failure mode that reads as a simple "class not found" and is actually data loss.

A project built on an old core may contain framework modules that were never pushed upstream — the
author wrote them in one project and never elevated them to the Meralda submodule. When the core gets
replaced, those modules vanish.

Find them by diffing the pre-upgrade snapshot against the upstream submodule content:

```bash
# Files that exist in the project's copy but not in the upstream submodule
git ls-tree -r --name-only pre-upgrade-snapshot -- src/mwap/modules/mw > /tmp/project-files.txt
git -C src/mwap/modules/mw ls-files > /tmp/upstream-files.txt
comm -23 <(sort /tmp/project-files.txt | sed 's#src/mwap/modules/mw/##') <(sort /tmp/upstream-files.txt)
```

For each survivor, decide:

1. **Still in use?** Grep the project for its classes. If nothing instantiates them, they are dead.
2. **In use and framework-grade** (no project-specific business logic) → elevate to the `mw`
   submodule: copy into the submodule, verify against the target PHP version, commit and push
   upstream. Only then will `git submodule update --remote` keep it.
3. **In use but project-specific** → move it into the project module, and register its prefix in
   `src/app/init.php` if the naming convention does not resolve it.

> ⚠️ A module living under `modules/mw/` is not automatically framework code — the path only says
> where it was stored. Ask the user before moving project logic into a shared submodule, because it
> then ships to every project that uses that submodule.

---

## Step 3 — Preserve Legacy Third-Party Packages

`modulesext` is a submodule. Anything the project put inside it that does not exist upstream will be
destroyed by a submodule checkout.

Move those packages **outside** the submodule path before adding it, and keep them working from the
new location:

```
src/mwap/modulesext/<pkg>/          →  src/mwap/modulesext-legacy/<pkg>/
```

Check whether the current core still expects them at all. Several packages that used to live in
`modulesext` are now resolved at runtime by path, e.g. `mwmod_mw_mail_phpmailer_man` loads
`modulesext/phpmailer/include.php` via `get_sub_path_man()`. A package the new core loads on its own
does not need preserving; one it never mentions, but the project code uses, does.

---

## Step 4 — Execute, in This Order

Order is not cosmetic.

### 4a. Flat copies first

Do every REPLACE and MERGE from Steps 1 and 3 **before** adding the submodules. If a submodule is
added first, a later recursive copy of a parent folder can write files inside the submodule working
tree, leaving it dirty — and the next `git submodule update` silently discards them.

### 4b. Submodules second

For each path from The One Rule, replace the flat files with a real submodule:

```bash
git rm -r --cached <path>
rm -rf <path>
git submodule add -b <branch> <url> <path>     # omit -b for the default branch
```

`git rm --cached` is required: a plain `rm -rf` leaves the old files staged as deletions from a path
that is about to become a gitlink, and the resulting commit is unusable by anyone cloning fresh.

The submodule must end up on the same commit the framework reference uses, so the project starts
from a known-good framework state rather than a random branch tip:

```bash
git submodule status
```

---

## Step 5 — Verify Against the Target PHP Version

### 5a. Static: lint everything

```bash
find src -name '*.php' -print0 | xargs -0 -n1 php -l
```

Lint catches syntax errors only. It will report zero problems while the application is completely
broken; treat a clean lint as permission to continue, not as proof of success.

### 5b. Static: hunt the patterns PHP removed

| Pattern | Status |
|---|---|
| `each()`, `create_function()`, `mysql_*()`, `ereg*()`, `split()` | Removed in PHP 7/8 |
| `$var{0}` string offsets | Removed in PHP 8 |
| `Optional parameter $x before required parameter` | Deprecated — reorder or drop the default |
| `private final function` | Warning — drop `final` |
| Property written but never declared | Deprecated since 8.2, error in 9 |

That last one deserves its own pass. Meralda's `mw_baseobj::__get()` resolves reads through
`__get_priv_<prop>()`, but there is **no `__set()`**, so `$this->x = …` on an undeclared `$x` really
does create a dynamic property. Two recurring shapes:

- A property declared in the parent that the child re-declares to "be safe" — check the parent chain
  before adding a declaration, or the class carries a redundant property.
- A property whose declaration exists but is **commented out**, which turns every assignment into a
  dynamic one.

### 5c. Runtime: read the error log, do not trust the page

`php -l` and visual inspection both miss everything that happens inside an AJAX request. Point the
local host at the target PHP version, walk every screen, then read the server error log and group it:

- Fatals inside AJAX handlers are invisible in the UI — the grid simply stays empty
- Deprecations never render, but they are the next version's fatals
- "Undefined array key" in a config loader usually means the project's `cfg.ini` lacks keys the new
  core reads

### 5d. Runtime: exercise every class of endpoint

At minimum: each list screen (the datagrid endpoint), each detail/form screen, each sub-interface,
and every public API endpoint the mobile clients or third parties consume. An endpoint that returns
HTTP 200 while emitting an HTML fatal inside the body is still broken — check the payload, not the
status code.

---

## Common Breakages and Their Shapes

### A core method disappeared

Symptom: `Call to undefined method <class>::<method>()`.

Do not assume it was renamed. It may have been **removed**, with the behaviour now handled
differently — for example a fluent setter replaced by an argument on each call, or a date helper
replaced by plain PHP. Read the new class, then reproduce the old behaviour at the call site rather
than adding a method back to the framework.

Also check for a correction rather than a removal: a misspelled method in the project (`…_tocken`)
may simply be `…_token` upstream. Confirm the definition exists before writing a replacement.

### An overridden `before_exec()` lost a framework behaviour

This one is subtle and expensive. When the framework moves a step **into** a base `before_exec()` and
removes it from the place it used to happen, every subclass that overrides `before_exec()` without
calling `parent::before_exec()` silently drops that step.

Symptom: the browser throws `ReferenceError: <jsvar> is not defined` and the grid never renders,
while the HTML looks structurally fine.

The fix belongs at the call site, not in the framework:

```php
function before_exec(){
    // … the subclass's own JS/CSS setup …
    $jsman=$this->maininterface->jsmanager;
    $jsman->add_item_by_cod_def_path("url.js");
    // …

    $this->add_req_js_scripts();
    $this->add_req_css();

    // Restore the behaviour the base class would have added.
    $item=$this->create_js_man_ui_header_declaration_item();
    $jsman->add_item_by_item($item);
}
```

Audit every override in the project, not just the ones that visibly fail. Subclasses of
`mwmod_mw_ui_base_dxtbladmin` need this; subclasses of `mwmod_mw_ui_base_basesubui` do not, because
the declaration lives further down. Verify against the actual parent chain rather than assuming.

### Two config keys pointing at the same asset

Symptom: `Cannot read properties of undefined (reading 'loadMessages')` — a library's own namespace
does not exist yet when its extension file runs.

Cause: an asset registered twice under different keys, once before and once after the library
itself. Check the language/config ini for a "full" and an "override" entry resolving to the same
file, and confirm each points where its name claims.

### JS assets registered but emitted in the wrong order

Assets are usually de-duplicated by code, and a helper that "resets" the list must remove **every**
key it intends to re-add. If the set of keys grows upstream but the reset list does not, the new key
keeps its original position. Compare the emitted order in the page, not the registration order in
PHP — they are not the same thing.

### A `notice` became a visible `Warning`

PHP 8 prints undefined-variable warnings inline by default in development. Code that read
`$repository->name` where the local was `$this->repository` printed nothing for years and now prints
a warning on top of every page. Sweep for undefined locals in constructors first — they run on every
request.

### Dead code that was never loadable

A class whose parent does not exist fails only if something autoloads it. If nothing ever did, the
project carried a latent fatal for years. Confirm by grepping for the class name and its parent;
if nothing instantiates it and the parent is absent everywhere, delete the file instead of porting
it.

---

## Step 6 — Commit and Push in Dependency Order

The submodule must reach its remote **before** the project commit that points at it.

1. Commit and push any framework fixes inside the submodule.
2. Then commit the project, which records the submodule's new SHA in the tree.

Reversing the order publishes a project commit whose gitlink points at a commit that does not exist
upstream. Clones with `--recurse-submodules` fail at checkout, and the error points at the submodule
rather than at the ordering mistake.

Verify before pushing:

```bash
git submodule status                      # no leading '-' or '+'
git submodule foreach 'git status --porcelain'   # nothing dirty
git -C src/mwap/modules/mw log --oneline '@{u}..HEAD'   # empty: nothing unpushed
```

A leading `-` means the submodule is not initialized; a leading `+` means the checked-out commit
differs from the recorded one — usually because the submodule was updated but the project was not
committed afterwards.

---

## Checklist

- [ ] Snapshot tag and work branch created
- [ ] Submodule paths read from `.gitmodules` and recorded
- [ ] Every `src/` path classified REPLACE / MERGE / KEEP
- [ ] Project-owned files inside framework paths found by diffing the snapshot
- [ ] Framework modules the project never published: elevated or explicitly discarded
- [ ] Legacy third-party packages moved out of submodule paths
- [ ] Flat copies applied before submodules were added
- [ ] All submodules present and on the intended commits
- [ ] Lint clean against the target PHP version
- [ ] Removed-API sweep done (`each`, `mysql_*`, dynamic properties, optional-before-required)
- [ ] Error log read after walking every screen, not just the ones that look wrong
- [ ] Datagrid endpoints and public API payloads inspected, not only their HTTP status
- [ ] Submodule fixes committed and pushed before the project commit
- [ ] Old branch still deployable
