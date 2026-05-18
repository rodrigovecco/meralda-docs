# DB Migrations

> **AI Assistant Guide**: Reference for creating and managing database migrations in a Meralda project. The migration system supports multiple modules, tracks version state per module, and applies SQL files in order. Read `architecture-overview.md` first.

---

## Overview

The migration system lives in `mwap/modules/mw/db/migrations/`. It is a built-in Meralda submanager (`dbmigrations`) that:

- Tracks the current applied version per module in a JSON data file.
- Discovers SQL migration files by scanning a directory for `NNNNNN_*.sql` files.
- Applies pending migrations in numerical order.
- Supports multiple modules (one directory per module) registered via a lazy hook in your app class.

---

## Migration File Conventions

- **Location**: inside a `db/migrations/` subdirectory of the module.
- **Filename format**: `NNNNNN_description.sql` where `NNNNNN` is a zero-padded 6-digit sequence number.
- **All `CREATE TABLE` must use `IF NOT EXISTS`** — migrations are idempotent.
- **No `DROP TABLE`** — migrations never destroy data.
- **No FK constraints via `ALTER TABLE ... ADD CONSTRAINT`** — the project does not use FK enforcement at the DB level.
- Semicolons inside SQL `COMMENT` strings are safe — the parser tracks quoted string context.

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
│   └── db/
│       └── migrations/           ← "meralda" core module (always registered first)
│           ├── 000001_users_table.sql
│           ├── 000002_bruteforce_tables.sql
│           └── 000003_user_api_tokens.sql
├── systems/
│   ├── digitalsales/
│   │   └── db/
│   │       └── migrations/       ← "digitalsales" module
│   │           └── 000001_initial_tables.sql
│   └── heartbeat/
│       └── db/
│           └── migrations/       ← "heartbeat" module
│               └── 000001_initial_tables.sql
└── meraldatsx/
    └── db/
        └── migrations/           ← "meraldatsx" module
            ├── 000001_initial_tables.sql
            └── 000002_stock_view.sql
```

The path passed to `registerModule()` is **relative to the mwap system root** (`mwap/`).

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
- The `meralda` core module is always registered first by the manager constructor — do not re-register it.
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
| `meralda` | `modules/mw/db/migrations` | Core users, bruteforce, API tokens |
| `digitalsales` | `modules/systems/digitalsales/db/migrations` | Digital products, orders, payments |
| `heartbeat` | `modules/systems/heartbeat/db/migrations` | Server monitoring ecosystem |
| `meraldatsx` | `modules/meraldatsx/db/migrations` | TSX shoe inventory, sales, carts |

---

## Adding a Migration to an Existing Module

1. Find the highest existing sequence number in the module's `db/migrations/` directory.
2. Create a new file with the next number: `NNNNNN_description.sql`.
3. Write idempotent SQL (`CREATE TABLE IF NOT EXISTS`, `CREATE OR REPLACE VIEW`, `INSERT IGNORE`, etc.).
4. No code changes needed — the manager auto-discovers files by scanning the directory.

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
| `mwap/modules/mw/db/migrations/ui/main.php` | Admin UI — per-module cards |
| `mwap/modules/mw/ap/apbase.php` | Base app class — no-op `registerDBMigrationModules()` hook |
| `mwap/modules/[app]/ap.php` | App class — override to register project modules |
