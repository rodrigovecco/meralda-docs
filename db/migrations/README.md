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

## Important

- **Never** modify these files after they have been applied to any environment.
- Keep this directory in sync with changes to Meralda's own schema.
- Semicolons inside `COMMENT` strings are not supported by the migration parser —
  use em-dash (`—`) or parentheses instead.
