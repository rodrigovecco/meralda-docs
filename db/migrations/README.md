# Meralda — Base DB Migrations

These are the **canonical migration scripts** provided by the Meralda framework.

When setting up a new project (or when you need to apply Meralda's base tables to an
existing project), **copy** these files to:

```
src/mwap/db/migrations/
```

## Renumbering

If the project already has its own migrations, renumber these files so their prefix
continues the existing sequence.

**Example:** if the project already has `000001` through `000005`, rename:

```
000001_users_table.sql        → 000006_users_table.sql
000002_bruteforce_tables.sql  → 000007_bruteforce_tables.sql
000003_user_api_tokens.sql    → 000008_user_api_tokens.sql
```

## Scripts included

| File | Description |
|------|-------------|
| `000001_users_table.sql` | Tabla `users` (base de Meralda) |
| `000002_bruteforce_tables.sql` | Tablas de protección contra fuerza bruta |
| `000003_user_api_tokens.sql` | Tabla de tokens de API por usuario |

## Views subfolder

Each migration module may include a `views/` subfolder containing one or more `.sql`
files with `CREATE OR REPLACE VIEW` statements.

```
src/mwap/db/migrations/
    000001_users_table.sql
    views/
        main_views.sql
        reporting_views.sql
```

- All files in `views/` are **re-applied on every migration run**, after all numbered
  migrations have completed successfully.
- Declare the version of each file in its header comment for human tracking:
  ```sql
  -- @version 3
  CREATE OR REPLACE VIEW ...
  ```
- Errors in view files are **non-fatal**: they are reported as warnings but do not
  block the remaining view files or other modules.

## Important

- **Never** modify numbered migration files after they have been applied to any environment.
- Keep this directory in sync with changes to Meralda's own schema.
- Semicolons inside `COMMENT` strings are not supported by the migration parser —
  use em-dash (`—`) or parentheses instead.
- `ALTER TABLE … ADD COLUMN … AFTER x` references are fragile if `x` may not exist
  on all instances. Either omit `AFTER` or add a guard `ALTER TABLE … ADD x …`
  earlier in the same migration file (the runner skips errno 1060 — duplicate column).

## Skippable errors

The migration runner automatically skips the following MySQL/MariaDB errors instead
of aborting, to tolerate schema changes that were already applied manually:

| errno | Meaning |
|-------|---------|
| 1050  | Table already exists |
| 1060  | Duplicate column name (ADD COLUMN) |
| 1061  | Duplicate key name (CREATE INDEX) |
| 1091  | Can't DROP — column/key does not exist |

All other errors abort the migration and report the failure.
