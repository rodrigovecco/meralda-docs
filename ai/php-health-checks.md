# PHP Health & Security Checks

A read-only admin page that audits the running PHP build: version support and
security patches, dangerous INI directives, session hardening, resource limits
and loaded extensions. Every recommendation comes with the matching php.net
reference.

The feature is split in two: a **pure utility class** that produces the report
and an **admin subinterface** that only renders it. The utility has no UI
dependency, so the same data can be consumed by a cron job, the installer, a
deploy script or the CLI.

---

## Files

| Class | File | Role |
|---|---|---|
| `mwmod_mw_util_phphealth` | `src/mwap/modules/mw/util/phphealth.php` | Report builder. No `mainap`, no `lng`, no HTML. |
| `mwmod_mw_ui_def_cfg_phphealth` | `src/mwap/modules/mw/ui/def/cfg/phphealth.php` | Renders the report inside **Configuration**. |

Both live in the `mw` submodule (`meralda_mw_modules`), so they arrive with a
normal core update — nothing to copy into the project.

---

## 1. Include it in the admin panel

### Option A — as a child of Configuration (default)

`mwmod_mw_ui_def_cfg` already lists it. Nothing to do in a project that uses the
framework Configuration section:

```php
// modules/mw/ui/def/cfg.php
$this->sucods = "bruteforce,dbmigrations,phphealth";
```

Result: `/admin/cfg/` → **Salud y seguridad de PHP**.

### Option B — a project that overrides the Configuration section

If the project replaced `mwmod_mw_ui_def_cfg` with its own class, register the
child there:

```php
class mwap_acme_ui_cfg extends mwmod_mw_ui_base_basesubuia {
    function __construct($cod, $parent) {
        $this->init_as_main_or_sub($cod, $parent);
        $this->set_def_title("Configuración");
        $this->sucods = "myown,migrations,phphealth";   // ← add the code
    }

    // One factory per code in $sucods:
    function _do_create_subinterface_child_phphealth($cod) {
        return new mwmod_mw_ui_def_cfg_phphealth($cod, $this);
    }
}
```

### Option C — a top-level sidebar entry

Useful when the page should not be nested under Configuration:

```php
// Admin main interface (e.g. mwap_<mod>_uiadmin_main)
class mwap_acme_uiadmin_main extends mwmod_mw_ui2_def_main_admin {
    function __construct($ap) {
        // ...
        $this->su_cods_for_side = "users,cfg,uidebug,system,phphealth"; // ← add
    }

    function create_subinterface_phphealth() {
        return new mwmod_mw_ui_def_cfg_phphealth("phphealth", $this);
    }
}
```

Access control: the subinterface inherits `is_allowed()` from
`mwmod_mw_ui_base_basesubui`, which delegates to the parent when permission
inheritance is on and otherwise requires the `admin` permission. To restrict it
further, override `is_allowed()` in a project subclass:

```php
class mwap_acme_ui_phphealth extends mwmod_mw_ui_def_cfg_phphealth {
    function is_allowed() {
        return $this->allow("mainadmin");
    }
}
```

---

## 2. Use the report outside the UI

```php
$util   = new mwmod_mw_util_phphealth();
$report = $util->get_report();

// Ruleset identity (see "Maintaining the ruleset" below)
$report["version"];   // "1.0"
$report["date"];      // "2026-10-24"

// Runtime facts
$report["environment"]["php_version"];  // "8.3.14"
$report["environment"]["sapi"];         // "fpm-fcgi"
$report["environment"]["ini_file"];     // "/etc/php/8.3/fpm/php.ini" or false

// Global verdict
$report["summary"]["status"];  // "ok" | "warning" | "danger"
$report["summary"]["score"];   // 0..100 (OK / evaluated)
$report["summary"]["counts"];  // per-status counters
```

Iterating the checks:

```php
foreach ($report["checks"] as $check) {
    // code, group, label, status, current, expected, help, url
    if ($check["status"] === mwmod_mw_util_phphealth::STATUS_FAIL) {
        error_log("PHP health: {$check["code"]} — {$check["current"]} (expected {$check["expected"]})");
    }
}
```

Cron job / deploy gate example:

```php
$util  = new mwmod_mw_util_phphealth();
$fails = 0;
foreach ($util->get_checks() as $check) {
    if ($check["status"] === mwmod_mw_util_phphealth::STATUS_FAIL) {
        $fails++;
        echo "[FAIL] {$check["code"]}: {$check["current"]}\n";
    }
}
exit($fails ? 1 : 0);   // non-zero aborts a deployment pipeline
```

### Public helpers

All static and context-free — usable even before the app boots:

| Method | Returns |
|---|---|
| `get_report()` | Full report (environment, version support, groups, checks, summary). |
| `get_checks()` | Only the checks list. |
| `get_environment()` | PHP version, SAPI, OS, ini file, extension count, HTTPS flag. |
| `get_version_support($version = false)` | Support status, dates, patch status for a branch. |
| `get_branch_table()` | Support snapshot for every known branch. |
| `get_summary($checks)` | Counts, score and global status. |
| `get_branch($version = false)` | `"8.3"` from `"8.3.14"`. |
| `is_https()` | Whether the current request is HTTPS (always true on CLI). |
| `ini_bool()`, `ini_bytes()`, `to_bytes()` | INI parsing that ignores the `on/off` and `128M` traps. |
| `describe_ini_bytes()`, `describe_bool()` | Display formatting. |
| `ini_list()` | Comma-separated INI lists (`disable_functions`). |
| `parse_session_save_path()` | Directory from `"N;/path"` and `"N;MODE;/path"`. |
| `is_world_writable()`, `is_system_temp_dir()` | Filesystem checks (skipped on Windows). |
| `get_missing_extensions($list)` | Extensions from a list that are not loaded. |

### Status values

`STATUS_OK`, `STATUS_WARN`, `STATUS_FAIL`, `STATUS_INFO` (informational only, not
scored) and `STATUS_NA` (directive or SAPI not applicable). Only OK/WARN/FAIL
enter the score. A single FAIL makes the global status `danger`; otherwise any
WARN makes it `warning`.

---

## 3. What is checked

| Group | Coverage |
|---|---|
| `version` | Minimum PHP for the bundled dependencies (8.2), branch support, the 21 Oct 2026 security release (CVE-2026-109618 / CVE-2026-109619), `memory_hard_limit_percent` presence, latest stable branch. |
| `errors` | `expose_php`, `display_errors`, `display_startup_errors`, `log_errors`, `error_log`, `error_reporting`, `html_errors`. |
| `execution` | `allow_url_include`, `allow_url_fopen`, `disable_functions`, `open_basedir`, `cgi.fix_pathinfo`, `cgi.force_redirect`, `auto_prepend/append_file`, `upload_tmp_dir`. |
| `session` | `use_strict_mode`, `use_only_cookies`, `cookie_httponly`, `cookie_secure`, `cookie_samesite`, `use_trans_sid`, `cookie_lifetime`, `cache_limiter`, `save_path`, `sid_length`. |
| `runtime` | `memory_limit`, `post_max_size` vs `upload_max_filesize`, `max_execution_time`, `hard_timeout`, `max_input_vars`, `max_input_nesting_level`, `register_argc_argv`, `short_open_tag`, `zend.assertions`, `zend.exception_ignore_args`. |
| `extensions` | xdebug, OPcache (and `validate_timestamps`), required and recommended extensions. |

CVE note: php.net states that if `memory_hard_limit_percent` is not recognized,
the PHP build is affected by CVE-2026-109618 and CVE-2026-109619 and must be
updated immediately. The report verifies both the patch level per branch and the
presence of the directive.

---

## 4. Maintaining the ruleset

Support dates are a **manual snapshot** of
[php.net/supported-versions](https://www.php.net/supported-versions.php), stored
in `mwmod_mw_util_phphealth::$branches` and identified by `VERSION` / `DATE`:

```php
const VERSION = "1.0";
const DATE    = "2026-10-24";   // day the php.net data was reviewed
```

`$version` / `$date` are also public properties, and `get_report()` returns them
so the UI can display "Reglas v1.0 (2026-10-24)".

When php.net publishes new dates or a new branch:

1. Add/adjust the entry in `$branches`:
   `array("release", "active_end", "security_end", "min_patch_cve")`.
   `min_patch_cve` is `false` when the branch never received that security
   release because it was already end of life.
2. Bump `DATE` (and `VERSION` when the rules change).
3. Update a released branch's `min_patch_cve` when a new security release ships.
4. Verify: `php -r 'include "preinit.php"; print_r((new mwmod_mw_util_phphealth())->get_version_support());'`

Unknown branches (newer than the snapshot) report `status = "unknown"` and the UI
warns that the ruleset needs an update — the page never silently claims a build
is fine.

### Adding a check

Append one `self::new_check(...)` in `get_checks()` (or use
`self::ini_flag_check()` for a boolean directive). Required arguments: unique
`code`, `group` (see `get_groups()`), human label, status, current value,
expected value, help text and php.net URL. No UI change is needed: the page
groups by `group` and renders every check it receives.

The label is resolved as `phpHealth_<code>`, so a translation can be supplied
without touching the code. Messages live in `lngmsgs/<lng-code>/<man-cod>.txt`
(one `code value` pair per line); the Spanish defaults are generated in
`lngmsgs/def/<man-cod>.txt`:

```ini
# lngmsgs/en/cfg.txt
phpHealth_session_use_strict_mode = Session strict mode
```

---

## 5. Translation keys

UI strings use the `phpHealth*` prefix and default to Spanish, so a project only
needs to define the ones it wants to translate. The UI-level keys:

`phpHealth` (title), `phpHealthTitle`, `phpHealthRules` (`%v%` version, `%d%`
date), `phpHealthReload`, `phpHealthScore`, `phpHealthBranchSupport`,
`phpHealthBranch`, `phpHealthRelease`, `phpHealthActiveEnd`,
`phpHealthSecurityEnd`, `phpHealthMinPatch`, `phpHealthStatus`,
`phpHealthInUse`, `phpHealthCheck`, `phpHealthCurrent`, `phpHealthRecommended`,
`phpHealthHelp`, `phpHealthOk`, `phpHealthWarn`, `phpHealthFail`,
`phpHealthNa`, `phpHealthInfo`, `phpHealthGlobalOk`, `phpHealthGlobalWarning`,
`phpHealthGlobalDanger`, `phpHealthPatchOk`, `phpHealthPatchKo` (`%m%` minimum
patch), `phpHealthPatchUnknown`, `phpHealthEnv*` (environment rows) and
`phpHealthFooter`.

---

## 6. Verification

```bash
# Syntax
php -l src/mwap/modules/mw/util/phphealth.php
php -l src/mwap/modules/mw/ui/def/cfg/phphealth.php

# Report (works on CLI, no web server needed — run from the repo root)
php -r 'chdir("src/mwap"); include_once "preinit.php";
        $r = (new mwmod_mw_util_phphealth())->get_report();
        print_r($r["summary"]);
        foreach ($r["checks"] as $c) { echo $c["status"], " | ", $c["code"], " | ", $c["current"], "\n"; }'
```

The page is **read-only**: it never writes INI values nor changes the
configuration. Fixing a FAIL is a server-level task (`php.ini`, FPM pool,
web server config) documented by the php.net link on each row.
