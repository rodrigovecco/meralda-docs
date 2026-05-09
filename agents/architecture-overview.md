# Architecture Overview

> **AI Assistant Guide**: Read this before any development task. It describes how a Meralda application boots, where code lives, and how pieces connect. Understanding this prevents misplacing files and breaking the autoloader.

---

## Source Tree

```
meralda/src/
├── public_html/        ← web root (Apache/Nginx document root)
│   ├── admin/          ← backend admin entry point
│   ├── get/            ← public pages + AJAX gateway
│   ├── service/        ← API / service endpoints
│   ├── res/            ← framework front-end assets (READ-ONLY submodule)
│   └── appcmd/         ← internal command dispatcher
├── app/                ← project-specific config and content (gitignored)
│   ├── cfg/            ← db.php, sysmail.php, install.php, lng/
│   ├── content/        ← HTML content fragments
│   ├── lng/            ← language string files
│   ├── managers/       ← business logic entry points
│   └── mailmsgs/       ← email templates
├── mwap/               ← framework core (READ-ONLY submodule)
│   ├── preinit.php     ← framework bootstrap + autoloader setup
│   ├── afterinit.php   ← post-init hook
│   ├── cfg.ini         ← framework base config
│   └── modules/        ← all PHP modules (framework + project)
│       ├── mw/         ← framework modules (mwmod_mw_* classes)
│       └── [project]/  ← project modules (mwap_[prefix]_* classes)
└── appdata/            ← runtime data files
```

---

## Initialization Chain

Every entry point follows this sequence:

```
public_html/admin/index.php
    → includes init.php  (context bootstrap)
    → includes src/app/init.php  (registers project modules, defines mw_app)
        → includes src/mwap/preinit.php  (registers autoloader prefixes)
        → loads src/app/cfg/*.php  (db, sysmail, install, lng)
        → includes src/mwap/afterinit.php
    → application logic runs
```

**Key file: `src/app/init.php`**
- Registers project module prefix(es) with the autoloader
- Declares `class mw_app` which is the application singleton
- This is the only project file that touches the autoloader

---

## Autoloader — Naming Convention

The autoloader (`mw_autoload_subprefmanfilebased_width_subclases`) maps class names to file paths by splitting on `_`.

### Framework classes: `mwmod_mw_*`

Pre-registered in `preinit.php`. Root = `src/mwap/modules/mw/`.

| Class name | File path under `modules/mw/` |
|---|---|
| `mwmod_mw_manager_man` | `manager/man.php` |
| `mwmod_mw_ui_base_basesubuia` | `ui/base/basesubuia.php` |
| `mwmod_mw_bruteforce_activity_man` | `bruteforce/activity/man.php` |

Rule: each `_` after `mwmod_mw_` maps to `/`; last segment → filename + `.php`.

### Project classes: `mwap_[prefix]_*`

Registered in `src/app/init.php` via:

```php
$GLOBALS["__mw_autoload_manager"]->create_and_add_sub_pref_man(
    "myprefix",                                  // prefix
    dirname(dirname(__FILE__))."/mwap/modules/myprefix",  // root path
    "mwap"                                       // parent prefix
);
```

| Class name | File path under module root |
|---|---|
| `mwap_myprefix_sales_man` | `myprefix/sales/man.php` |
| `mwap_myprefix_sales_item` | `myprefix/sales/item.php` |
| `mwap_myprefix_uiadmin_main` | `myprefix/uiadmin/main.php` |

**Critical:** the prefix segment in the class name maps directly to the directory inside `modules/`. Getting this wrong causes "class not found" errors.

---

## Entry Points Reference

| Entry point | Context | Main UI class registered |
|---|---|---|
| `public_html/admin/index.php` | Admin backend | `mw_app → mwap_[prefix]_uiadmin_main` |
| `public_html/get/` | Public pages + AJAX | Routes through `dosubmancmd.php` |
| `public_html/service/` | API / integrations | Project-specific |

Projects may add additional entry points (visitor portal, seller UI, etc.) following the same pattern.

---

## Application Singleton (`mw_app`)

Defined in `src/app/init.php`. Always extends a project application class which in turn extends `mwmod_mw_ap_def` (or similar framework base).

```php
// src/app/init.php
class mw_app extends mwap_mam_ap {}
```

The application object is the root of the entire object graph. Every manager, UI, and module can reach it via `$this->mainap`.

---

## Configuration Files

All in `src/app/cfg/` (gitignored — never committed):

| File | Purpose |
|---|---|
| `db.php` | Database connection: host, db, user, pass, port |
| `sysmail.php` | SMTP credentials, From address, Reply-To |
| `install.php` | Install page access control |
| `lng/es/cfg.php` | Site name / page title overrides per language |

Global settings (debug mode, country, currency, locale) are in `src/app/cfg.ini`.

---

## Reading an Unknown Codebase

When asked to understand or modify something:

1. Identify the entry point (`admin/`, `get/`, `service/`, or custom)
2. Follow the include chain to `src/app/init.php` — read it to know which modules are registered and what `mw_app` extends
3. Read `src/app/cfg/db.php` to know the database name
4. Trace the class name through the autoloader naming convention to find the file
5. Check `meralda-agent.config.yml` → `reference_projects` for other Meralda projects with relevant `use_for` tags before implementing anything new
