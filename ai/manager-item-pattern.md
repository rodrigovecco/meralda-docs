# Manager + Item Minimal Pattern

## Class Naming and File Path Convention

**This is the single most important rule when creating any class in this framework.**
The autoloader (`mw_autoload_subprefmanfilebased_width_subclases`) converts class names to file paths by splitting on `_` and treating each segment as a directory or file name. Understanding this mapping prevents all "class not found" errors.

### Framework modules: `mwmod_mw_*`

The `mwmod_mw` prefix is pre-registered in `src/mwap/preinit.php` and always points to `src/mwap/modules/mw/`. **You do not need to register it.**

Naming formula: `mwmod_mw_` + path segments joined by `_`, where each `_` maps to `/`, and the last segment becomes the filename (+ `.php`).

| Class name | File path (relative to `modules/mw/`) |
|---|---|
| `mwmod_mw_formsubmit_man` | `formsubmit/man.php` |
| `mwmod_mw_formsubmit_item` | `formsubmit/item.php` |
| `mwmod_mw_formsubmit_manbase` | `formsubmit/manbase.php` |
| `mwmod_mw_bruteforce_activity_man` | `bruteforce/activity/man.php` |
| `mwmod_mw_manager_man` | `manager/man.php` |

> **Rule:** count the underscores after `mwmod_mw_` — they map 1:1 to `/` in the path.

### Custom app modules: `mwap_*`

These must be registered explicitly in `src/app/init.php` with `create_and_add_sub_pref_man()`. See `project-customization-detaching-and-modules.md`.

| Class name | File path (relative to module root) |
|---|---|
| `mwap_ventis_sales_man` | `ventis/sales/man.php` |
| `mwap_ventis_sales_item` | `ventis/sales/item.php` |

---

## Building a Manager + Item

When you need a typed manager for an existing table (e.g., `venta`) you only need three small pieces:

1. **Manager class** extending `mwmod_mw_manager_man`.
2. **Item class** extending `mwmod_mw_manager_item`.
3. **(Optional)** Lazy loader that exposes the manager from your module’s entry point.

This keeps the code tiny while still using the framework’s table helpers, path handling, and datafield utilities.

## Manager Example

```php
// File: src/mwap/modules/ventis/sales/man.php
class mwap_ventis_sales_man extends mwmod_mw_manager_man {
    function __construct($ap) {
        // "sales" is the manager code; table is `venta`.
        $this->init("sales", $ap, "venta");
    }

    function create_item($tblitem) {
        return new mwap_ventis_sales_item($tblitem, $this);
    }
}
```

Key notes:
- `init($code, $ap, $tblname)` is enough to hook into an existing table.
- No extra methods are required unless you need custom inputs or SQL tweaks.

## Item Example

```php
// File: src/mwap/modules/ventis/sales/item.php
class mwap_ventis_sales_item extends mwmod_mw_manager_item {
    function getVentaId() {
        return $this->get_id();
    }

    function getVentaCode() {
        return $this->get_data_field("venta_code");
    }
}
```

The item class can stay minimal—add friendly getters only when they simplify call sites. All base helpers (`get_data`, `get_sub_path_man`, etc.) already exist.

## Optional: Exposing Managers

Every Meralda object can reach the application instance through `$this->mainap`. Depending on the project, you may expose the manager via:

### 1. Lazy loader in a central manager class

```php
private $salesMan;

final function __get_priv_salesMan() {
    if (!isset($this->salesMan)) {
        $this->salesMan = new mwap_ventis_sales_man($this->mainap);
    }
    return $this->salesMan;
}
```

### 2. Application submanager

If your application class extends `mwmod_mw_ap_def` (or similar), you can declare the manager as a submanager:

```php
function create_submanager_sales() {
    return new mwap_ventis_sales_man($this);
}
```

Both approaches are optional—use whichever fits the architecture. Standalone scripts can instantiate `mwap_ventis_sales_man` directly and skip both helpers.

## Summary

- Minimal manager: call `init()` and override `create_item()`.
- Minimal item: extend `mwmod_mw_manager_item` and only add the helpers you actually use.
- Lazy loader is optional; use it when you have a shared entry point.

Following this recipe keeps your managers lean while still benefiting from the full manager/item framework.
