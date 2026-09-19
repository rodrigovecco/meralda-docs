# Related Objects Delete Protection

This document describes the framework mechanism that prevents deleting a
**manager item** while it is still referenced by child rows in other tables
(application-level referential integrity). It covers the hooks exposed by
`mwmod_mw_manager_itemabs`, the supporting related-objects classes, and a
step-by-step recipe for applying the pattern to any item class.

---

## Overview

Meralda does **not** rely on database-level foreign key constraints to stop
orphan rows. Instead, each item class declares its child tables and blocks
deletion while children exist. There are two relevant hooks on the item class:

1. `create_related_objects_man()` — declares the child tables by returning a
   `mwmod_mw_manager_related_man` instance.
2. `pre_delete_depending_objects()` — returns `false` to abort a deletion.

Both hooks live in the base class `mwmod_mw_manager_itemabs`
(`src/mwap/modules/mw/manager/itemabs.php`), so every manager item inherits
them.

---

## Deletion flow

Deleting an item goes through the following chain (all in `itemabs.php`):

```
delete()
  └─ allow_delete()          // false = abort (permission / business rule)
       └─ do_delete()
            └─ _delete()
                 ├─ pre_delete_depending_objects()   // false = abort (children exist)
                 ├─ _delete_all_files()
                 ├─ _delete_tbl_item()               // actual DB row delete
                 └─ post_delete()
```

Two different code paths trigger this chain, and each one reads a different
hook for the "children exist?" check:

| Delete path | Hook that runs | Location |
|---|---|---|
| Base UI `dxtbladmin::delete_item()` | `get_related_objects_man()->get_rel_objects_num()` | `mw/ui/base/dxtbladmin.php` |
| Programmatic delete (`$item->delete()`) | `pre_delete_depending_objects()` | `mw/manager/itemabs.php` `_delete()` |

> **Important:** `pre_delete_depending_objects()` is the enforcement point for
> programmatic deletes (domain write methods, MCP tools, cron scripts). The base
> `dxtbladmin` path only reads `get_related_objects_man()` to render a message,
> and is bypassed entirely when a module UI overrides `delete_item()` and
> delegates to a domain write method. **To fully protect an item, implement both
> hooks.**

---

## Framework machinery

These classes live under `src/mwap/modules/mw/` (a read-only git submodule). Do
not modify them.

### `mwmod_mw_manager_itemabs` (`mw/manager/itemabs.php`)

- `create_related_objects_man()` — returns `false` by default. Override to
  return a `mwmod_mw_manager_related_man`.
- `get_related_objects_man()` — `final`; lazily creates and caches the
  related-man.
- `pre_delete_depending_objects()` — returns `true` by default. Called at the
  start of `_delete()`; returning `false` aborts the deletion.
- `allow_delete()` — returns `false` by default; checked by `delete()` before
  `do_delete()` runs.

### `mwmod_mw_manager_related_man` (`mw/manager/related/man.php`)

- `add_relation($rel)` — registers a relation (assigns a 1-based index and
  calls `$rel->add2man()`).
- `get_relations()` — list of registered relations.
- `get_rel_objects_num()` — sum of `related_items_num` across all relations.
- `get_relations_msg_plain()` / `get_relations_msg_html()` — build the
  localized "there are N related objects" message.

### `mwmod_mw_manager_related_relation_tbl` (`mw/manager/related/relation/tbl.php`)

- Constructor `($tbl_name, $tbl_field_name)` — the child table and the foreign
  key column that points back to this item.
- `$rel->rel_items_tbl_id_key = "id"` — child table primary key.
- `$rel->mainItemIDField` — defaults to `null` (uses `$this->get_id()`).
- `$rel->otherKeys` — extra WHERE criteria when needed.
- `load_related_items_data()` — runs
  `SELECT COUNT(id) num, GROUP_CONCAT(id) ids FROM <tbl> WHERE <fk>=<item_id>`.

### `mwmod_mw_manager_related_relation_abs` (`mw/manager/related/relation/abs.php`)

- `$rel->rel_objects_name` — plural label used in the message (defaults to the
  localized generic "objetos").

---

## Canonical example

`tidybuses` reference project
(`src/mwap/modules/tidyb/busstop/item.php`):

```php
function create_related_objects_man(){
    $man = new mwmod_mw_manager_related_man($this);
    $rel = new mwmod_mw_manager_related_relation_tbl("routes_trips_busstops","busstop_id");
    $rel->rel_objects_name = $this->lng_get_msg_txt("LCtrips","trayectos");
    $man->add_relation($rel);
    return $man;
}
```

This example only implements `create_related_objects_man()`. Projects that
delete through `$item->delete()` (domain write methods / MCP tools) should also
implement `pre_delete_depending_objects()`.

---

## Recipe: adding protection to a parent item

Use the following template. Insert it right after `allow_delete()`:

```php
/**
 * Child tables referencing this item via a foreign key (delete protection).
 *
 * @return mwmod_mw_manager_related_man
 */
function create_related_objects_man() {
    $man = new mwmod_mw_manager_related_man($this);

    $rel = new mwmod_mw_manager_related_relation_tbl("<child_table>", "<fk_column>");
    $rel->rel_objects_name = "<plural label>";
    $man->add_relation($rel);

    return $man;
}

/**
 * Block deletion while related objects still reference this item.
 *
 * @return bool
 */
function pre_delete_depending_objects() {
    $relman = $this->get_related_objects_man();
    if (!$relman) {
        return true;
    }
    return $relman->get_rel_objects_num() === 0;
}
```

Steps:

1. Find every table with a foreign key pointing to the item's table.
2. Insert both hooks after `allow_delete()`.
3. Add one `mwmod_mw_manager_related_relation_tbl(<child_table>, <fk_column>)`
   per child table, with a plural `rel_objects_name`.
4. Run `php -l` on the edited file.

Guidelines:

- Code comments in English; `rel_objects_name` is the user-facing plural label
  (localize it for the target audience).
- `rel_objects_name` labels are lowercase — they are embedded mid-sentence in
  the "there are N related objects" message.
- For self-referencing hierarchies (a parent with children in the same table),
  add a relation for the self column (e.g. `parent_id`).
- Leaf tables (nothing references them) do not need the hooks.

---

## Applied example: `ni` module

The NovoIngenios (`ni`) module applies this pattern to every item that has
child tables. Relation map:

| Parent item (`item.php`) | Parent table | Child table -> FK column |
|---|---|---|
| `crm/clients` | `ni_clients` | `ni_contacts`, `ni_servers`, `ni_domains`, `ni_accounts`, `ni_projects`, `ni_portfolio_items`, `ni_project_transactions`, `ni_quotes`, `ni_invoices`, `ni_payments` (all via `client_id`) |
| `crm/suppliers` | `ni_suppliers` | `ni_contacts` -> `supplier_id`, `ni_recurring_expenses` -> `supplier_id`, `ni_project_transactions` -> `supplier_id` |
| `org/entities` | `ni_entities` | `ni_clients`, `ni_suppliers`, `ni_services`, `ni_servers`, `ni_domains`, `ni_accounts`, `ni_projects`, `ni_portfolio_items`, `ni_recurring_expenses`, `ni_project_transactions`, `ni_quotes`, `ni_invoices`, `ni_payments`, `ni_chart_of_accounts`, `ni_journal_entries` (all via `entity_id`) |
| `org/regions` | `ni_regions` | `ni_entities`, `ni_clients`, `ni_suppliers`, `ni_servers` (all via `region_id`) |
| `org/currencies` | `ni_currencies` | `ni_entities`, `ni_clients`, `ni_suppliers`, `ni_services`, `ni_recurring_expenses`, `ni_project_transactions`, `ni_quotes`, `ni_invoices`, `ni_payments`, `ni_invoice_items`, `ni_journal_lines` (all via `currency_id`) |
| `projects/projects` | `ni_projects` | `ni_tasks`, `ni_project_transactions`, `ni_quotes`, `ni_invoices` (all via `project_id`) |
| `catalog/categories` | `ni_service_categories` | `ni_services` -> `category_id`, `ni_service_categories` -> `parent_id` (self) |
| `infra/servers` | `ni_servers` | `ni_domains`, `ni_accounts`, `ni_recurring_expenses` (all via `server_id`) |
| `portfolio/items` | `ni_portfolio_items` | `ni_portfolio_item_lng`, `ni_portfolio_media`, `ni_portfolio_checks` (all via `item_id`) |
| `billing/quotes` | `ni_quotes` | `ni_invoices` -> `quote_id`, `ni_invoice_items` -> `quote_id` |
| `billing/invoices` | `ni_invoices` | `ni_payments` -> `invoice_id`, `ni_invoice_items` -> `invoice_id` |
| `accounting/chartofaccounts` | `ni_chart_of_accounts` | `ni_journal_lines` -> `account_id`, `ni_chart_of_accounts` -> `parent_id` (self) |
| `accounting/journalentries` | `ni_journal_entries` | `ni_journal_lines` -> `journal_entry_id` |

Notes for `ni`:

- `org/currencies` additionally keeps its main-currency protection:
  `allow_delete()` returns `false` when `isMain()` is true (the base currency
  can never be deleted).
- Leaf tables (no children) are intentionally left without the hooks:
  `crm/contacts`, `projects/tasks`, `projects/transactions`, `catalog/services`,
  `infra/domains`, `infra/accounts`, `recurring/expenses`,
  `accounting/journallines`, `portfolio/lng`, `portfolio/media`,
  `portfolio/checks`, `billing/payments`, `billing/invoiceitems`.
