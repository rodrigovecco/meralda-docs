# Migration System Change: SQL Files → PHP Objects

> Transition note. The migration system changed: **PHP migration objects** are
> now the preferred scheme, replacing numbered `.sql` files.

## What changed

- The migration engine still lives in `modules/mw/db/migrations/`
  (`man.php`, `itemabs.php`, `moduleabs.php`, `ui/`).
- The **Meralda core** module moved to `modules/mw/dbcore/` as PHP objects:
  a handler (`module.php`, with `get_code()` = `"meralda"`) plus its items
  (`m000001users.php`, `m000002bruteforce.php`, ...). It keeps the
  `state_meralda` version state, so already-migrated installs are unaffected.
- A module can be registered in two ways:
  - **PHP objects (preferred):** `registerModule(new MyModuleHandler())`.
  - **Legacy SQL (compatibility):** `registerModule("code", "relative/path")`.
- When unapplied legacy `.sql` migrations remain, the migrations UI shows a
  **warning** prompting conversion to the new scheme.

## What must be done

**All declared `.sql` migrations must be converted to the new PHP object scheme.**

For each `NNNNNN_description.sql` file:

1. Create an item extending `mwmod_mw_db_migrations_itemabs` in a file named
   `mNNNNNNdescription.php` (no underscores in the last segment; the number is
   only a human reference — actual order is declaration order).
2. Implement:
   - `get_description()` — short label.
   - `check()` — `true` if the change still needs applying, `false` if already
     present (use `table_exists()`, `column_exists()`, `index_exists()`).
   - `apply()` — perform the change with `run_sql(...)` (idempotent SQL:
     `CREATE TABLE IF NOT EXISTS`, `INSERT IGNORE`, etc.).
3. Declare it in the module handler via `add_item(new ...())`, **in the same
   order** the `.sql` files were numbered.

See `db-migrations.md` for full details and examples.

## Minimal example

```php
class mwap_mymodule_db_migrations_m000001initial extends mwmod_mw_db_migrations_itemabs {
    function get_description() { return "Create mymod_items table"; }
    function check()           { return !$this->table_exists("mymod_items"); }
    function apply() {
        return $this->run_sql("
            CREATE TABLE IF NOT EXISTS `mymod_items` (
                `id` int(11) NOT NULL AUTO_INCREMENT,
                PRIMARY KEY (`id`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        ");
    }
}
```
