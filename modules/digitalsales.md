# Digital Sales

Private module for digital sales workflows. Handles products, orders, payments, payment provider integrations, digital file delivery, and access logs.

**Standalone module** — no companion public resources repo required.

---

## Repos

| Role | Repo | SSH URL | Path in project |
|---|---|---|---|
| Backend module | `Meralda-digitalsales` | `git@github.com:rodrigovecco/Meralda-digitalsales.git` | `src/mwap/modules/systems/digitalsales` |

---

## Installation

### 1. Request deploy key

Ask `rodrigovecco` for a deploy key for `Meralda-digitalsales` (see [README.md](README.md) for key generation instructions).

### 2. Add SSH config alias

```
Host github-digitalsales
    HostName github.com
    User git
    IdentityFile ~/.ssh/deploy_meralda_modules
    IdentitiesOnly yes
```

### 3. Add submodule

```bash
git submodule add git@github-digitalsales:rodrigovecco/Meralda-digitalsales.git src/mwap/modules/systems/digitalsales
```

### 4. `.gitmodules` entry (result)

```ini
[submodule "src/mwap/modules/systems/digitalsales"]
    path = src/mwap/modules/systems/digitalsales
    url = git@github-digitalsales:rodrigovecco/Meralda-digitalsales.git
```

### 5. Register the autoloader prefix

In `src/app/init.php`:

```php
$GLOBALS["__mw_autoload_manager"]->create_and_add_sub_pref_man(
    "digitalsales",
    dirname(dirname(__FILE__))."/mwap/modules/systems/digitalsales"
);
```

### 6. Create the database schema

The module ships a SQL schema file at the repo root:

| File | Purpose |
|---|---|
| `digital_sales_tables.sql` | Full schema — run once on first install |

```bash
mysql -u USER -p DATABASE < src/mwap/modules/systems/digitalsales/digital_sales_tables.sql
```

---

## Class naming

All classes in this module follow the convention `mwmod_digitalsales_*`.
