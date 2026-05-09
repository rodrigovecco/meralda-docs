# Module Init: Creating Your Project's Custom Module

> **AI Assistant Guide**: Run these steps to create the project's own application module — the namespace and class folder where all custom business logic will live. This replaces the `demo` module as the base for `mw_app`.

## Overview

After the bootstrap phase, the application still extends `mwap_demo_ap` from the `demo` module. This guide creates a dedicated project module so the app has its own namespace, autoloader prefix and base classes.

## Step 1: Choose a Module Name

Ask the user for a module name. Rules:

- **Lowercase letters and numbers only** — no underscores, hyphens, spaces or special characters
- **Single word** — this becomes the autoloader prefix and all class names will use it
- Should be short and meaningful (e.g. `mam`, `acme`, `core`, `myapp`)

> "What name do you want for the project module? (lowercase letters/numbers only, e.g. `mam`)"

Validate the input:

```powershell
$mod = "mam"   # replace with user input
if ($mod -match '^[a-z][a-z0-9]+$') {
    Write-Host "Valid: $mod"
} else {
    Write-Host "Invalid — use only lowercase letters and numbers, starting with a letter"
}
```

For the rest of this guide, replace `<mod>` with the chosen name.

---

## Step 2: Create the Module Directory Structure

The module lives at `meralda/src/mwap/modules/<mod>/`.

Minimum required structure (mirrored from the `demo` module):

```
meralda/src/mwap/modules/<mod>/
├── ap.php          ← defines mwap_<mod>_ap (base application class)
└── uiadmin/
    └── main.php    ← defines mwap_<mod>_uiadmin_main (admin UI manager)
```

Create the directories:

```powershell
$mod = "<mod>"
New-Item -ItemType Directory -Force "meralda/src/mwap/modules/$mod/uiadmin"
```

---

## Step 3: Create ap.php

```powershell
$mod = "<mod>"
$apFile = "meralda/src/mwap/modules/$mod/ap.php"
```

Content of `ap.php`:

```php
<?php
class mwap_<mod>_ap extends mwmod_mw_ap_def {
    function __construct() {
    }
    function create_submanager_uiadmin() {
        $man = new mwap_<mod>_uiadmin_main($this);
        return $man;
    }
}
?>
```

> **Naming convention:** All classes in this module start with `mwap_<mod>_`. This is the autoloader prefix used in `init.php`.

---

## Step 4: Create uiadmin/main.php

Content of `uiadmin/main.php`:

```php
<?php
class mwap_<mod>_uiadmin_main extends mwmod_mw_ui2_def_main_admin {
    function __construct($ap) {
        $this->set_mainap($ap);
        $this->subinterface_def_code = "welcome";
        $this->url_base_path = "/admin/";
        $this->enable_session_check();
        $this->logout_script_file = "logout.php";
        $this->su_cods_for_side = "users,cfg,uidebug,system";
    }
    function create_template() {
        return new mwtheme_default_mainuitemplate($this);
    }
    function createUISessionDataMan() {
        return new mwmod_mw_data_session_man("<mod>mainui");
    }
}
?>
```

> **`su_cods_for_side`**: comma-separated list of subinterface codes shown in the admin sidebar. Adjust to the modules you register. Remove `demo` — it was only for the demo module.

---

## Step 5: Register the Module in init.php

Edit `meralda/src/app/init.php`. Make two changes:

### 5.1 — Add the autoloader registration

Add this line **after** the existing `preinit.php` include and **before** the class declaration. If the `demo` line is still present, add the new one alongside it (or remove demo if it's no longer needed):

```php
$GLOBALS["__mw_autoload_manager"]->create_and_add_sub_pref_man("<mod>", dirname(dirname(__FILE__))."/mwap/modules/<mod>", "mwap");
```

> **Parameters explained:**
> - `"<mod>"` — the module short name (used to find the directory)
> - `dirname(...)."/mwap/modules/<mod>"` — absolute path to the module folder
> - `"mwap"` — autoloader prefix: classes named `mwap_<mod>_*` will be looked up in this folder

### 5.2 — Replace the mw_app base class

Find this block:

```php
class mw_app extends mwap_demo_ap{
}
```

Replace with:

```php
class mw_app extends mwap_<mod>_ap {
}
```

### 5.3 — Remove the demo module registration (optional)

If the project no longer uses the `demo` module, remove or comment out:

```php
// $GLOBALS["__mw_autoload_manager"]->create_and_add_sub_pref_man("demo", ...);
```

Ask the user first:

> "Do you still need the `demo` module registered, or should I remove it?"

---

## Step 6: Verify

Reload the site in the browser. If there are autoloader errors, check:

1. The class name in `ap.php` matches `mwap_<mod>_ap` exactly
2. The third argument to `create_and_add_sub_pref_man` is `"mwap"` (not `"mwmod"`)
3. The directory path is correct

---

## Reference: demo module comparison

| Item | demo (original) | Your module |
|------|----------------|-------------|
| Directory | `src/mwap/modules/demo/` | `src/mwap/modules/<mod>/` |
| Base class | `mwap_demo_ap` | `mwap_<mod>_ap` |
| Admin UI class | `mwap_demo_uiadmin_main` | `mwap_<mod>_uiadmin_main` |
| Autoloader prefix | `"mwap"` | `"mwap"` (same) |
| init.php declaration | `class mw_app extends mwap_demo_ap` | `class mw_app extends mwap_<mod>_ap` |
