# Main Manager Pattern

> **AI Assistant Guide**: How to create a central `mainMan` sub-manager in a Meralda project module — including the lazy loader in `ap.php`, the abstract base class, and the concrete class. This document is self-contained: no reference to private repos is required.

---

## What is the Main Manager?

The main manager (`mainMan`) is a **central coordinator** that groups all domain-specific managers for a project module. It lives as a registered sub-manager on the application class and is exposed as a lazy-loaded property.

Benefits:
- All domain managers are discoverable via IDE autocomplete from a single entry point.
- Instances are created only when first accessed (lazy loading).
- Clean separation between the application bootstrap (`ap.php`) and business logic.

---

## File Layout

For a project module with prefix `mam`:

```
src/mwap/modules/mam/
├── ap.php               ← application class (entry point)
├── mainman.php          ← concrete main manager class
├── base/
│   └── mainmanabs.php   ← abstract base (add lazy-loaded managers here)
└── ...                  ← domain manager directories
```

---

## Step 1 — Abstract base (`base/mainmanabs.php`)

This is where domain managers are declared and lazy-loaded. Each one requires:

1. A `private` property (null by default, keeps state after first load).
2. A `@property-read` entry in the class docblock (IDE visibility).
3. A `final function __get_priv_*()` method (called by `mw_baseobj::__get()`).

```php
<?php
/**
 * Abstract base for the mam main manager.
 *
 * @property-read mwap_mam_sales_man $sales
 * @property-read mwap_mam_products_man $products
 */
abstract class mwap_mam_base_mainmanabs extends mwmod_mw_manager_baseman {

    private $sales;
    private $products;

    function __construct($code, $ap) {
        $this->init($code, $ap);
    }

    final function __get_priv_sales() {
        if (!isset($this->sales)) {
            $this->sales = new mwap_mam_sales_man($this);
        }
        return $this->sales;
    }

    final function __get_priv_products() {
        if (!isset($this->products)) {
            $this->products = new mwap_mam_products_man($this);
        }
        return $this->products;
    }
}
?>
```

### Rules for lazy loaders

| Rule | Reason |
|---|---|
| Property must be `private` | Prevents direct assignment from outside; access is always via `__get()` |
| Method must be `final` | Prevents subclass override, which would break the framework's dispatch |
| Method name: `__get_priv_{propertyName}` | This is the exact naming convention expected by `mw_baseobj::__get()` in `coreclasses.php` |
| **Never call `__get_priv_*()` directly from outside the class** | Always access via property syntax: `$mainMan->sales` |

---

## Step 2 — Concrete class (`mainman.php`)

Minimal. Extends the abstract and calls the parent constructor.

```php
<?php
class mwap_mam_mainman extends mwap_mam_base_mainmanabs {
    function __construct($code, $ap) {
        parent::__construct($code, $ap);
    }
}
?>
```

Add `enable_jsondata()` in the constructor if this manager will handle AJAX endpoints directly.

---

## Step 3 — Application class (`ap.php`)

Three changes are needed in the project `ap.php`:

1. **`@property-read` in class docblock** — IDE visibility.
2. **`private $mainMan`** — holds the cached instance.
3. **`create_submanager_mam()`** — factory called by `get_submanager()`.
4. **`__get_priv_mainMan()`** — lazy loader that retrieves or creates the instance.

```php
<?php
/**
 * @property-read mwap_mam_mainman $mainMan Gestor principal del sistema.
 */
class mwap_mam_ap extends mwmod_mw_ap_def {

    /** @var mwap_mam_mainman|null */
    private $mainMan;

    function __construct() {
    }

    function create_submanager_uiadmin() {
        return new mwap_mam_uiadmin_main($this);
    }

    /**
     * Registers the main manager as a sub-manager under the key "mam".
     * Called internally by get_submanager("mam").
     *
     * @return mwap_mam_mainman
     */
    function create_submanager_mam() {
        return new mwap_mam_mainman("mam", $this);
    }

    /**
     * Lazy loader for $mainMan. Called by mw_baseobj::__get("mainMan").
     *
     * @return mwap_mam_mainman
     */
    final function __get_priv_mainMan() {
        if (!isset($this->mainMan)) {
            $this->mainMan = $this->get_submanager("mam");
        }
        return $this->mainMan;
    }
}
?>
```

### How `get_submanager()` works

`get_submanager("mam")` looks up a registered sub-manager by key. If it hasn't been created yet it calls `create_submanager_mam()`, which is the factory method above. The result is cached internally by the framework. The private `$mainMan` on `ap.php` is an additional project-level cache that avoids repeated lookups.

---

## Accessing managers from anywhere

Given that `$ap` is the application instance:

```php
// From a UI class or any manager that holds a reference to $ap
$this->mainap->mainMan->sales    // accesses mwap_mam_sales_man
$this->mainap->mainMan->products // accesses mwap_mam_products_man
```

Each access to `mainMan` goes through `mw_baseobj::__get("mainMan")` → `__get_priv_mainMan()`.  
Each access to `->sales` goes through `mw_baseobj::__get("sales")` → `__get_priv_sales()`.

---

## Adding a new domain manager

1. Create the manager class (see `module-development.md`).
2. In `base/mainmanabs.php`:
   - Add `@property-read mwap_mam_xyz_man $xyz` to the docblock.
   - Add `private $xyz;` property.
   - Add `final function __get_priv_xyz()` lazy loader.
3. No changes to `ap.php` or `mainman.php` are needed.

---

## Adapting for other module prefixes

Replace every occurrence of `mam` / `Mam` with the actual module prefix:

| mam version | Custom prefix `crm` version |
|---|---|
| `mwap_mam_base_mainmanabs` | `mwap_crm_base_mainmanabs` |
| `mwap_mam_mainman` | `mwap_crm_mainman` |
| `create_submanager_mam()` | `create_submanager_crm()` |
| `get_submanager("mam")` | `get_submanager("crm")` |
| `private $mainMan` | same — this is the property name, not the prefix |

---

## The `$mainap->man` accessor — IDE documentation pattern

> **Do not confuse `$mainap->man` with `$mainap->mainMan`.**
>
> | Property | What it is | Where it lives |
> |---|---|---|
> | `$mainap->man` | Framework accessor — routes `->man->xyz` to `get_submanager("xyz")` | Always present, provided by `mwmod_mw_ap_apabs` |
> | `$mainap->mainMan` | Project domain manager — groups business logic managers | Optional; only if the project declares it |

### How `$mainap->man` works

`$mainap->man` returns an instance of `mwmod_mw_ap_util_submanagers`. Its `__get($name)` calls
`get_submanager($name)`, so `$mainap->man->mtsx` is exactly equivalent to
`$mainap->get_submanager("mtsx")` → `create_submanager_mtsx()`.

**No code is needed to make this work.** It is automatic.

### Purpose of the `man.php` class

The only reason to create a `man.php` in the project module is **IDE code hinting**. The class
contains zero logic — it only declares `@property-read` entries so the IDE can resolve the type
of each sub-manager accessed via `->man->`.

```php
<?php
/**
 * Submanagers accessor for [project].
 * No logic — extends the framework class only for IDE property hints.
 *
 * @property-read mwap_mam_mainman $mam
 * @property-read mwmod_mtsx_mainman $mtsx
 */
class mwap_mam_man extends mwmod_mw_ap_util_submanagers {
}
?>
```

Then in `ap.php`, add only the docblock entry — **no `create_man()` override needed**:

```php
/**
 * @property-read mwap_mam_man $man
 */
class mwap_mam_ap extends mwmod_mw_ap_def2 {
    // ...
}
```

> **Critical:** Do NOT override `create_man()` or `__get_priv_man()` (it is `final` in the framework).
> The `man.php` subclass is never instantiated — it exists only as a type hint for the IDE.
