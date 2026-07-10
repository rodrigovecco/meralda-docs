# Module Development

> **AI Assistant Guide**: Reference for creating PHP business logic inside a project module — managers, items, collections, queries, and AJAX endpoints. Read `architecture-overview.md` first to understand naming conventions and file placement.

> ⚠️ **Database tables → migrations**: If your module creates tables, read **`db-migrations.md`** first. SQL files go inside the module at `db/migrations/NNNNNN_description.sql`, and the module must be registered via `registerDBMigrationModules()` in `ap.php`. Do **not** place migration SQL in `docs/db/` — that directory is for core Meralda tables only.

---

## Manager + Item Pattern

The fundamental building block for any database-backed feature.

### Naming & file placement

Class names map directly to file paths via the autoloader (see `architecture-overview.md`).

| Class | File (under module root) |
|---|---|
| `mwap_mam_sales_man` | `mam/sales/man.php` |
| `mwap_mam_sales_item` | `mam/sales/item.php` |

### Manager

```php
// mam/sales/man.php
class mwap_mam_sales_man extends mwmod_mw_manager_man {
    function __construct($ap) {
        // args: manager code, app instance, table name
        $this->init("sales", $ap, "sales");
    }

    function create_item($tblitem) {
        return new mwap_mam_sales_item($tblitem, $this);
    }
}
```

### Item

```php
// mam/sales/item.php
class mwap_mam_sales_item extends mwmod_mw_manager_item {
    function getSalesCode() {
        return $this->get_data_field("sales_code");
    }
    function getAmount() {
        return $this->get_data_field("amount");
    }
}
```

Add getters only when they simplify call sites. All base helpers (`get_id()`, `get_data_field()`, `get_sub_path_man()`, etc.) are inherited.

---

## Exposing Managers

### Option A — Lazy loader (see Lazy Loader Mechanism above)

```php
/** @property-read mwap_mam_sales_man $salesMan */
class mwap_mam_main_man extends mw_apsubbaseobj {
    private $salesMan;
    final function __get_priv_salesMan() {
        if (!isset($this->salesMan)) {
            $this->salesMan = new mwap_mam_sales_man($this->mainap);
        }
        return $this->salesMan;
    }
}
// Access: $this->mainap->mainMan->salesMan
```

### Option B — Application submanager

```php
// in mwap_mam_ap (the project ap.php)
function create_submanager_sales() {
    return new mwap_mam_sales_man($this);
}
```

Access anywhere via `$this->mainap->sales`.

---

## Lazy Loader Mechanism

**How it works.** Every Meralda object extends `mw_baseobj` (defined in `src/mwap/core/coreclasses.php`). That base class implements PHP's magic `__get($name)`, which:

1. Constructs the method name `"__get_priv_" . $name`
2. Calls it if it exists on the object

So when you write `$obj->salesMan`, PHP calls `__get("salesMan")`, which calls `__get_priv_salesMan()`.

**Rules:**

- Declare the property as `private` — it must be inaccessible from outside
- Name the getter exactly `__get_priv_{propertyName}()` — one underscore before `get`, matching the property name exactly
- **Access it as a property** (`$obj->salesMan`), never call `__get_priv_salesMan()` directly from outside the class
- Inside the same class you can call `$this->__get_priv_salesMan()` directly if needed (e.g. inside `__construct`)
- Declare the property type with `@property-read` in the class docblock for IDE autocomplete

```php
/**
 * @property-read mwap_mam_sales_man $salesMan
 */
class mwap_mam_main_man extends mw_apsubbaseobj {

    private $salesMan;   // private — only accessible via __get magic

    final function __get_priv_salesMan() {
        if (!isset($this->salesMan)) {
            $this->salesMan = new mwap_mam_sales_man($this->mainap);
        }
        return $this->salesMan;
    }
}

// Usage — always via property syntax:
$sales = $mainMan->salesMan;        // ✅ correct
$sales = $mainMan->__get_priv_salesMan();  // ❌ never do this from outside
```

---

## Collections Pattern

Use `mwmod_mw_util_itemsbycod` for typed lazy-loaded collections of related items.

```php
/**
 * @property-read mwmod_mw_util_itemsbycod<mwap_mam_sales_item> $items
 */
class mwap_mam_order_item extends mwmod_mw_manager_item {
    private $items;

    function __get_priv_items() {
        if (!isset($this->items)) {
            $this->items = new mwmod_mw_util_itemsbycod();
            if ($man = $this->mainap->salesMan) {
                $query = $man->menuMan->tblman->new_query();
                $query->where->add_where_crit("order_id", $this->get_id());
                $query->where->add_where_crit("enabled", 1);
                $query->order->add_order("sort_order");
                if ($loaded = $man->get_items_by_query($query)) {
                    foreach ($loaded as $item) {
                        $this->items->add_item($item);
                        $item->setParentOrder($this); // optional back-reference
                    }
                }
            }
        }
        return $this->items;
    }
}
```

### Consuming a collection

```php
// Get all items
$all = $collection->getItems();

// Get by code/id
$item = $collection->get_item($code);

// Iterate
foreach ($collection->getItems() as $item) { ... }
```

---

## Query Patterns

### Basic query

```php
$query = $man->menuMan->tblman->new_query();
$query->where->add_where_crit("status", "active");
$query->where->add_where_crit("owner_id", $ownerId);
$query->order->add_order("created_at", "desc");
$items = $man->get_items_by_query($query);
```

### Single item

```php
$item = $man->get_item($id);
```

### LEFT JOIN (in a `dxtbladminquery` `getQuery()` override)

```php
$join = $query->from->add_from_join_external(
    "stocks_movements",   // table to join
    "visits.id",          // outer field
    "related_visit_id",   // inner field
    "sm"                  // alias
);
$join->set_as_mode();     // required for alias to work
$join->specialON = "visits.id = sm.related_visit_id AND sm.type = 'delivery'";

// When joining, always select main table fields explicitly:
$query->select->add_select("visits.*");
```

### Calculated field

```php
$select = $query->select->add_select("IF(sm.id IS NOT NULL, 1, 0)", "_has_movement");
$field = $this->queryHelper->addFieldByQuerySelect($select);
if ($field) {
    $field->dataType = "boolean";
}
```

---

## AJAX / XML Endpoints

All AJAX requests go through the `/get` gateway.

### URL structure

```
/get/{main-ui-code}/sxml/ui/{subinterface-code}/{command}.xml
/get/admin/sxml/ui/admin-sales/saveitem.xml
/get/admin/sxml/ui/admin-sales/itemid/123/deleteitem.xml
```

- `{main-ui-code}` → the submanager code registered in `init.php`
- `ui/{subinterface-code}` → hyphen-separated subinterface hierarchy
- `{command}.xml` → filename becomes the method suffix

### Implementing an endpoint

In your subinterface class (extends any `mwmod_mw_ui_sub_uiabs` descendant):

```php
function execfrommain_getcmd_sxml_saveitem($params, $filename) {
    $itemId = $params['itemid'] ?? null;
    // ... logic ...
    // return XML or JSON response
}
```

### Enabling AJAX on the main interface

Most classes extending `mwmod_mw_ui_main_uimainabsajax` already enable AJAX by default. If yours doesn't:

```php
function __accepts_exec_cmd_by_url() {
    return true;
}
```

### Public endpoint (no auth required)

```php
// In main interface class
function checkGetCmdOmitValidateUser($cmdcod, $params, $filename) {
    if ($cmdcod === "publicstatus") {
        return true; // skip session validation for this command
    }
    return false;
}
```

---

## PHPDoc Conventions

```php
/**
 * Brief class description.
 *
 * @property-read mwap_mam_sales_man $salesMan   Lazy-loaded sales manager.
 * @property-read mwmod_mw_util_itemsbycod<mwap_mam_sales_item> $items  Child items.
 */
class mwap_mam_order_item extends mwmod_mw_manager_item {

    /**
     * @var mwap_mam_sales_man|null
     */
    private $salesMan;

    /**
     * @var mwmod_mw_util_itemsbycod<mwap_mam_sales_item>|null
     */
    private $items;
```

- Always declare lazy-loaded private properties with `@property-read` at class level
- Use generic syntax `Collection<ItemType>` for typed collections
- Add `|null` when the property can be uninitialized
