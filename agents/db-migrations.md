# DB Migrations

> **AI Assistant Guide**: Reference for creating and managing database migrations in a Meralda project. The migration system supports multiple modules, tracks version state per module, and applies migrations in order. Migrations can be written as **SQL files** (legacy) or as **PHP objects** (new scheme). Read `architecture-overview.md` first.

---

## Overview

The migration system lives in `mwap/modules/mw/db/migrations/`. It is a built-in Meralda submanager (`dbmigrations`) that:

- Tracks the current applied version per module in a JSON data file.
- Discovers migrations per module, either as `NNNNNN_*.sql` files (legacy) or as PHP objects declared by a module handler (new scheme).
- Applies pending migrations in numerical order.
- Supports multiple modules registered via a lazy hook in your app class.
- Manages **views independently** via a `views/` subfolder — views are version-tracked and re-applied whenever their declared version changes.

Two migration styles are supported:

1. **Legacy SQL** — `NNNNNN_description.sql` files scanned from a directory. Kept for backward compatibility; the admin UI shows a warning when unapplied legacy SQL remains.
2. **PHP objects (preferred)** — a module registers a handler object (`mwmod_mw_db_migrations_moduleabs`) whose items extend `mwmod_mw_db_migrations_itemabs` and implement `check()` / `apply()`. No prefix or path configuration is required; classes resolve via the normal Meralda autoloader.

---

## Migration File Conventions

- **Location**: inside a `db/migrations/` subdirectory of the module.
- **Filename format**: `NNNNNN_description.sql` where `NNNNNN` is a zero-padded 6-digit sequence number.
- **All `CREATE TABLE` must use `IF NOT EXISTS`** — migrations are idempotent.
- **No `DROP TABLE`** — migrations never destroy data.
- **No FK constraints via `ALTER TABLE ... ADD CONSTRAINT`** — the project does not use FK enforcement at the DB level.
- Semicolons inside SQL `COMMENT` strings are safe — the parser tracks quoted string context.
- **Views must NOT be numbered migrations** — put them in the `views/` subfolder instead.

### ⚠️ MySQL vs MariaDB compatibility (MUST read)

Production **can run either MySQL or MariaDB**, so every migration must be
compatible with **both**. The danger is that one engine (MariaDB >= 10.0.2)
accepts the `IF [NOT] EXISTS` clauses on `ALTER TABLE` column/key/drop
operations, while the other (MySQL) does **not** — it fails with a syntax
error. Never use a construct that works on only one of them. The following
**will error out on MySQL**:

```sql
-- ❌ MariaDB-only — fails on MySQL with a syntax error:
ALTER TABLE `routes` ADD COLUMN IF NOT EXISTS `col` INT;
ALTER TABLE `routes` ADD KEY IF NOT EXISTS `idx` (`col`);
ALTER TABLE `routes` DROP COLUMN IF EXISTS `col`;
```

`CREATE TABLE IF NOT EXISTS` and `INSERT IGNORE` **are** fine on both — the
incompatibility is only the `IF [NOT] EXISTS` on `ALTER TABLE ... ADD/DROP
COLUMN/KEY`.

**How to stay compatible:**

- **PHP objects (preferred):** idempotency comes from `check()` + `apply()`,
  not from `IF NOT EXISTS`. In `apply()`, build the `ALTER TABLE` dynamically
  from `column_exists()` / `index_exists()` checks:

  ```php
  function apply() {
      $adds = [];
      if (!$this->column_exists("routes", "col_a")) {
          $adds[] = "ADD COLUMN `col_a` INT NOT NULL DEFAULT 0 AFTER `ancla`";
      }
      if (!$this->column_exists("routes", "col_b")) {
          $adds[] = "ADD COLUMN `col_b` TINYINT(1) NOT NULL DEFAULT 1 AFTER `col_a`";
      }
      if (!$adds) { return ["ok" => true, "warnings" => []]; }
      return $this->run_sql("ALTER TABLE `routes` " . implode(", ", $adds) . ";");
  }
  ```

  Chained `AFTER` references are valid on both engines (they reference
  columns added earlier in the *same* `ALTER`), and `check()` tolerates a
  partial previous run.

- **Legacy SQL files:** do **not** put `ADD COLUMN IF NOT EXISTS` in the file
  either. Plain `ALTER TABLE ... ADD COLUMN` is safe to re-run because the
  runner skips errno **1060** (duplicate column) and **1061** (duplicate key)
  — see the skippable-errors table in `docs/db/migrations/README.md`.

> **Never** edit a migration that was already applied to any environment
> (its `check()` result or version state is already recorded); fix forward
> with a new migration instead.

### Example file: `000001_initial_tables.sql`

```sql
-- Migration 000001: My module initial tables

SET NAMES utf8mb4;
SET default_storage_engine = InnoDB;

CREATE TABLE IF NOT EXISTS `mymod_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## Module Directory Layout

```
mwap/modules/
├── mw/
│   ├── dbcore/                   ← "meralda" core module (PHP objects, registered first)
│   │   ├── module.php            ← handler (get_code() = "meralda")
│   │   ├── m000001users.php
│   │   ├── m000002bruteforce.php
│   │   └── m000003userapitokens.php
│   └── db/
│       └── migrations/           ← migration engine (man, itemabs, moduleabs, ui)
├── systems/
│   ├── digitalsales/
│   │   └── db/
│   │       └── migrations/       ← "digitalsales" module (legacy SQL)
│   │           └── 000001_initial_tables.sql
│   └── heartbeat/
│       └── db/
│           └── migrations/       ← "heartbeat" module
│               └── 000001_initial_tables.sql
└── meraldatsx/
    └── db/
        └── migrations/           ← "meraldatsx" module
            ├── 000001_initial_tables.sql
            └── views/
                └── mtsx_stocks_current.sql   ← CREATE OR REPLACE VIEW, @version 1
```

For legacy SQL modules the path passed to `registerModule()` is **relative to
the mwap system root** (`mwap/`). PHP modules pass a handler instance instead
(no path).

---

## Registering a New Module

Override `registerDBMigrationModules()` in your app class (e.g. `mwap/modules/mam/ap.php`):

```php
function registerDBMigrationModules($man) {
    parent::registerDBMigrationModules($man);
    $man->registerModule("mymodule", "modules/mymodule/db/migrations");
}
```

- The first argument is the **module key** (string, used for version state storage).
- The second argument is the **relative path** from the mwap root to the migrations directory.
- The `meralda` core module is always registered first by the manager (lazily) —
  do not re-register it. It is a PHP module whose handler and items live under
  `modules/mw/dbcore/`, separate from the migration engine.
- This method is called **lazily** the first time the migration manager needs the module list.

### App class location

```
mwap/modules/[appprefix]/ap.php
```

The class extends `mwmod_mw_ap_def2` (or another app base). Example for the `mam` app:

```php
class mwap_mam_ap extends mwmod_mw_ap_def2 {

    function registerDBMigrationModules($man) {
        parent::registerDBMigrationModules($man);
        $man->registerModule("digitalsales", "modules/systems/digitalsales/db/migrations");
        $man->registerModule("heartbeat",    "modules/systems/heartbeat/db/migrations");
        $man->registerModule("meraldatsx",   "modules/meraldatsx/db/migrations");
    }
}
```

---

## Currently Registered Modules (mam app)

| Key | Path | Description |
|---|---|---|
| `meralda` | `modules/mw/dbcore` (PHP objects) | Core users, bruteforce, API tokens, OAuth |
| `digitalsales` | `modules/systems/digitalsales/db/migrations` | Digital products, orders, payments |
| `heartbeat` | `modules/systems/heartbeat/db/migrations` | Server monitoring ecosystem |
| `meraldatsx` | `modules/meraldatsx/db/migrations` | TSX shoe inventory, sales, carts |

---

## Adding a Migration to an Existing Module

1. Find the highest existing sequence number in the module's `db/migrations/` directory.
2. Create a new file with the next number: `NNNNNN_description.sql`.
3. Write idempotent SQL (`CREATE TABLE IF NOT EXISTS`, `INSERT IGNORE`). For `ALTER TABLE` changes see [MySQL vs MariaDB compatibility](#-mysql-vs-mariadb-compatibility-must-read) — do **not** use `ADD COLUMN IF NOT EXISTS`.
4. No code changes needed — the manager auto-discovers files by scanning the directory.

> **Views must not be numbered migrations.** Use the `views/` subfolder instead.

---

## PHP Migration Objects (new scheme)

Instead of SQL files, a module can declare migrations as PHP objects. This is the
**preferred** style for new work: each migration is self-describing, can inspect
the live schema before applying (`check()`), and lives in a normal autoloadable
class file.

### How it works

1. Create a **module handler** class extending `mwmod_mw_db_migrations_moduleabs`.
2. In its constructor (or by overriding `load_items()`), add migration items via
   `$this->add_item(new SomeMigration())`.
3. Each item extends `mwmod_mw_db_migrations_itemabs` and implements:
   - `get_description()` — short label shown in the UI.
   - `check()` — return `true` if the change still needs to be applied, `false` if already present.
   - `apply()` — perform the change; return `["ok" => bool, "error" => ?string, "warnings" => []]`.
4. Register the handler in `registerDBMigrationModules()`:

```php
function registerDBMigrationModules($man) {
    parent::registerDBMigrationModules($man);
    $man->registerModule(new mwap_mymodule_db_migrations_module());
}
```

> **No prefix, path or autoloader registration is required.** Item classes are
> resolved through the normal Meralda class/file convention (class name `_`
> segments map to `/` path segments, last segment is the filename).

### Sequence numbers

PHP migration items are applied **in the order they are declared** by the handler
(the order of the `add_item()` calls). Any number in the class/file name is only
a human-readable reference and is **not** used by the manager. A common
convention is `mNNNNNNdescription.php` (starts with a letter, then a zero-padded
number, then a camelCase description), but the number carries no meaning to the
system — declaration order is what matters.

### Item base class helpers

`mwmod_mw_db_migrations_itemabs` extends `mw_apsubbaseobj` (the standard Meralda
object base) and provides these helpers:

| Helper | Purpose |
|---|---|
| `$this->db()` | The DB manager (`mwmod_mw_db_mysqli_dbman`). |
| `$this->run_sql($sql)` | Run one or more `;`-separated statements; returns `["ok"=>, "error"=>, "warnings"=>]`. |
| `$this->query($sql)` | Run a single query, return the result resource. |
| `$this->fetch_assoc($query)` | Fetch one associative row. |
| `$this->table_exists($t)` | True if the table exists. |
| `$this->column_exists($t, $c)` | True if the column exists. |
| `$this->index_exists($t, $i)` | True if the index exists. |

### Example

Handler — `mwap/modules/mymodule/db/migrations/module.php`:

```php
class mwap_mymodule_db_migrations_module extends mwmod_mw_db_migrations_moduleabs {
    function get_code() {
        return "mymodule";
    }

    function load_items() {
        $this->add_item(new mwap_mymodule_db_migrations_m000001initial());
    }
}
```

Item — `mwap/modules/mymodule/db/migrations/m000001initial.php`:

```php
class mwap_mymodule_db_migrations_m000001initial extends mwmod_mw_db_migrations_itemabs {
    function get_description() {
        return "Create mymod_items table";
    }

    function check() {
        return !$this->table_exists("mymod_items");
    }

    function apply() {
        return $this->run_sql("
            CREATE TABLE IF NOT EXISTS `mymod_items` (
                `id` int(11) NOT NULL AUTO_INCREMENT,
                `name` varchar(255) NOT NULL,
                PRIMARY KEY (`id`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        ");
    }
}
```

### Legacy SQL warning

When a module still has unapplied legacy `*.sql` migrations, the admin UI shows a
warning banner suggesting they be ported to PHP objects. Both styles coexist; a
module uses one style (its migrations are discovered either from the folder or
from the handler, not both).

---

## Views

Views live in a `views/` subfolder inside the module's `db/migrations/` directory. The system re-applies a view file whenever its declared version changes.

### Conventions

- Each file must start with a `-- @version X` comment (X is any string, e.g. `1`, `2`, `1.1`).
- Use `CREATE OR REPLACE VIEW` — never `DROP VIEW`.
- Filename is the view name (e.g. `mtsx_stocks_current.sql`).
- The version is compared against the last applied version stored in the JSON data. If they differ, the view is re-applied.

### Example: `views/mtsx_stocks_current.sql`

```sql
-- @version 1
-- View: mtsx_stocks_current

CREATE OR REPLACE VIEW mtsx_stocks_current AS
SELECT
  CONCAT(e.product_variant_id, '_', e.warehouse_id) AS id,
  e.product_variant_id,
  e.warehouse_id,
  (SUM(e.quantity_in) - SUM(e.quantity_out)) AS c_current
FROM mtsx_stocks_entries e
WHERE e.deleted = 0
GROUP BY e.product_variant_id, e.warehouse_id;
```

### When to bump the version

Change `-- @version X` whenever the view definition changes. The manager detects the mismatch and re-applies the file on the next "Apply All Pending" run.

### Apply order

Views are applied **after all pending migrations** succeed, for all modules in registration order.

---

## Version State Storage

State is stored in a JSON data file (one item per module key):

- Key format: `state_[modulekey]` (e.g. `state_meralda`, `state_digitalsales`).
- The stored value is an integer matching the last successfully applied migration number.
- Legacy single-module state (`state` without a suffix) is automatically migrated to `state_meralda` on first UI load via `migrateLegacyStateKey()`.

---

## Admin UI

The migration UI is accessible through the admin panel under the DB Migrations section. It shows:

- One card per registered module.
- Current applied version and total available migrations.
- A table listing all migration files with their status (applied / pending).
- A global **Apply All Pending** button with a confirmation modal.

---

## Key Files Reference

| File | Purpose |
|---|---|
| `mwap/modules/mw/db/migrations/man.php` | Migration manager — discovery, versioning, apply logic |
| `mwap/modules/mw/db/migrations/itemabs.php` | Base class for PHP migration items (`check()` / `apply()`) |
| `mwap/modules/mw/db/migrations/moduleabs.php` | Base class for PHP module handlers |
| `mwap/modules/mw/dbcore/` | Meralda core migrations as PHP objects (handler + items) |
| `mwap/modules/mw/db/migrations/ui/main.php` | Admin UI — per-module cards |
| `mwap/modules/mw/ap/apbase.php` | Base app class — no-op `registerDBMigrationModules()` hook |
| `mwap/modules/[app]/ap.php` | App class — override to register project modules |
