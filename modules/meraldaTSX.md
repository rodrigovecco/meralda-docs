# MeraldaTSX

Modular extension for the Meralda ecosystem focused on product, sales, and stock domain logic. Centralizes commerce-related business rules and data handling — product definitions, pricing, inventory, and sales workflows — for use across multiple Meralda applications.

---

## Repos

| Role | Repo | SSH URL | Path in project |
|---|---|---|---|
| Backend module | `MeraldaTSXmodules` | `git@github.com:rodrigovecco/MeraldaTSXmodules.git` | `src/mwap/modules/meraldatsx` |
| Public resources | `MeraldaTSXres` | `git@github.com:rodrigovecco/MeraldaTSXres.git` | `src/public_html/res/meraldatsx` |

Both repos are required together. The backend module is autoloaded under the prefix `meraldatsx`; the public resources are served statically.

---

## Installation

### 1. Request deploy keys

Ask `rodrigovecco` for deploy keys for both `MeraldaTSXmodules` and `MeraldaTSXres` (see [README.md](README.md) for key generation instructions).

### 2. Add SSH config aliases

```
Host github-meraldatsxmodules
    HostName github.com
    User git
    IdentityFile ~/.ssh/deploy_meralda_modules
    IdentitiesOnly yes

Host github-meraldatsxres
    HostName github.com
    User git
    IdentityFile ~/.ssh/deploy_meralda_modules
    IdentitiesOnly yes
```

### 3. Add submodules

```bash
git submodule add git@github-meraldatsxmodules:rodrigovecco/MeraldaTSXmodules.git src/mwap/modules/meraldatsx
git submodule add git@github-meraldatsxres:rodrigovecco/MeraldaTSXres.git src/public_html/res/meraldatsx
```

### 4. `.gitmodules` entries (result)

```ini
[submodule "src/mwap/modules/meraldatsx"]
    path = src/mwap/modules/meraldatsx
    url = git@github-meraldatsxmodules:rodrigovecco/MeraldaTSXmodules.git

[submodule "src/public_html/res/meraldatsx"]
    path = src/public_html/res/meraldatsx
    url = git@github-meraldatsxres:rodrigovecco/MeraldaTSXres.git
```

### 5. Register the autoloader prefix

In `src/app/init.php`:

```php
$GLOBALS["__mw_autoload_manager"]->create_and_add_sub_pref_man(
    "meraldatsx",
    dirname(dirname(__FILE__))."/mwap/modules/meraldatsx"
);
```

### 6. Create the database schema

The module ships its own SQL files in `src/mwap/modules/meraldatsx/docs/`:

| File | Purpose |
|---|---|
| `db.sql` | Full schema — run once on first install |
| `views.sql` | SQL views — run after `db.sql` |
| `update.sql` | Incremental updates — run when upgrading |

On first install, run in order:

```bash
mysql -u USER -p DATABASE < src/mwap/modules/meraldatsx/docs/db.sql
mysql -u USER -p DATABASE < src/mwap/modules/meraldatsx/docs/views.sql
```

---

## Class naming

All classes in the backend module follow the convention `mwmod_meraldatsx_*`.
