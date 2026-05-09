# App Customization: Configuring src/app/

> **AI Assistant Guide**: Reference for customizing the application after the module init step. All files here live inside `meralda/src/app/` which is in `.gitignore` — changes are local and must be tracked in the project repo if needed.

## Agent Behavior Rules

- **Before asking about any setting, read the actual file** to get the current value.
- **Use the current file value as the default answer** for each question — never invent or assume a default.
- Ask each field individually, showing the current value inline:
  > "`site_name` — current value: `«Meralda»`. Keep it or enter a new one:"
- If the user confirms or skips, do not modify the file.
- Only write a change when the user explicitly provides a different value.
- After collecting all answers, apply all changes in a single `multi_replace_string_in_file` call.

---

## Quick Reference Map

| File / Path | What it controls |
|---|---|
| `cfg.ini` | Site name, page title, country, currency, debug mode |
| `cfg/lng/es/cfg.php` | Site name / page title per language |
| `cfg/sysmail.php` | Outgoing email (SMTP credentials, From address) |
| `cfg/sysmail/setupphpmailer.php` | Advanced PHPMailer options |
| `cfg/install.php` | Install page access control |
| `cfg/db.php` | Database connection (host, db, user, pass, port) |
| `lng/cfg/es.ini` | Locale for Spanish |
| `content/login/panelhead.html` | HTML shown above the login form |
| `content/pages/welcome.html` | Welcome content shown after login |
| `content/pages/notfound.html` | Custom 404 page |
| `managers/user.php` | User roles, permissions, login security settings |

| `mailmsgs/user_reset_pass_request/` | Password reset request email templates |
| `mailmsgs/user_reset_pass/` | Password reset confirmation email templates |

---

## 1. Site Identity — `cfg.ini`

```ini
page_title = "My App"     ; shown in browser <title>
site_name  = "My App"     ; used in system messages and emails
country    = "AR"          ; ISO 3166-1 alpha-2
main_currency = "ARS"      ; ISO 4217 currency code

register_permissions_requests = "n"   ; "y" logs permission checks (dev only)
register_lng_msg = "n"                ; "y" logs missing language strings (dev only)

debug_mode = "YES"           ; show PHP errors — set to "NO" in production
debug_restrict_ips = "YES"   ; only show debug info to the IPs below
debug_ips = "::1"            ; comma-separated list, e.g. "::1,192.168.1.10"
```

> **Production checklist:** set `debug_mode = "NO"` and `debug_restrict_ips = "YES"` before deploying.

---

## 2. Site Name per Language — `cfg/lng/es/cfg.php`

Overrides `cfg.ini` values for the Spanish locale:

```php
$data = array(
    "pagetitle" => "Mi Aplicación",
    "sitename"  => "Mi Aplicación",
);
```

> If the app supports multiple languages, create parallel files under `cfg/lng/<lang-code>/cfg.php`.

---

## 3. Outgoing Email — `cfg/sysmail.php`

Ask the user for their SMTP credentials before editing this file.

```php
$data = array(
    "auth" => array(
        "Host"       => "smtp.example.com",      // SMTP server hostname
        "SMTPAuth"   => true,
        "Username"   => "smtp-username",          // SMTP user — may differ from From (e.g. AWS SES uses IAM access key)
        "From"       => "noreply@example.com",   // envelope From address
        "Sender"     => "noreply@example.com",   // same as From in most cases
        "Password"   => "your-smtp-password",
        "Port"       => "587",          // 587 = TLS (useSMTPssl=false), 465 = SSL (useSMTPssl=true)
        "useSMTPssl" => false,          // set true only when Port = 465
        "Helo"       => "",
        "FromName"   => "My App",       // sender display name
    ),
    "replyto" => array(                 // optional — where replies go (can differ from From)
        "address" => "contact@example.com",
        "name"    => "My App",
    )
);
```

> **AWS SES note:** `Username` is the IAM SMTP access key ID (e.g. `AKIA...`), not the email address. `From` is the verified sender address.

Ask each field individually showing the current value. Fields to ask:

| Field | Notes |
|---|---|
| `Host` | SMTP server hostname |
| `Username` | SMTP auth username (may differ from From — e.g. AWS SES IAM key) |
| `From` | Envelope From address (must be a verified sender) |
| `Sender` | Usually same as From |
| `Password` | SMTP password or secret access key |
| `Port` | 587 (TLS) or 465 (SSL) |
| `useSMTPssl` | `false` for port 587, `true` for port 465 |
| `FromName` | Display name shown to recipients |
| `replyto.address` | Reply-To address (optional, can differ from From) |
| `replyto.name` | Reply-To display name |

### Advanced PHPMailer options — `cfg/sysmail/setupphpmailer.php`

This file runs after PHPMailer is instantiated. Use it for non-standard settings:

```php
<?php
$phpmailer->XMailer = "PHP" . phpversion();   // default — hides server info
// $phpmailer->SMTPDebug = 2;                 // uncomment to debug SMTP
// $phpmailer->SMTPOptions = [...];           // custom SSL options
?>
```

---

## 4. Login Page Header — `content/login/panelhead.html`

HTML shown above the login form (logo, app name, tagline, etc.). Currently empty — anything placed here appears at the top of the login panel.

Example:

```html
<div style="text-align:center; padding: 16px 0 8px;">
    <img src="/res/themes/default/img/logo.png" alt="My App" style="height:60px;">
    <h2 style="margin:8px 0 0; font-size:18px; color:#333;">My App</h2>
</div>
```

---

## 5. Welcome Page — `content/pages/welcome.html`

HTML shown on the admin dashboard after login. Replace the default greeting:

```html
<h2 style="text-align:center; padding:10px;">¡Bienvenido a My App!</h2>
<p style="text-align:center; color:#666;">Selecciona una opción del menú lateral para comenzar.</p>
```

---

## 6. 404 Page — `content/pages/notfound.html`

Full HTML page shown when a route is not found. Edit freely — it is a standalone HTML document. Update at minimum the `<title>`, colors and logo to match the project brand.

---

## 7. User Roles & Permissions — `managers/user.php`

This file wires the users manager with roles and permissions.

### Login security

```php
$subman->set_disable_login_after_fail(true, 5, 3);
//                                         ^   ^
//                                         |   +-- lockout duration in minutes
//                                         +------ failed attempts before lockout
```

### Roles

```php
// Built-in roles (do not remove):
new mwmod_mw_users_rols_rolpublic("public", "Público",    $rolsman)  // unauthenticated
new mwmod_mw_users_rols_rolall("all", "Todos",            $rolsman)  // any user
// Custom roles:
new mwmod_mw_users_rols_rol("user",  "Usuario",           $rolsman)
new mwmod_mw_users_rols_rol("admin", "Administrador",     $rolsman)
```

> `$rol->allways_for_mainadmin = true` — the main admin user always gets this role regardless of DB settings.

### Permissions

```php
new mwmod_mw_users_permissions_permission(
    "code",           // machine code used in allow() checks
    "Human label",    // shown in admin UI
    "admin,user",     // comma-separated roles that have this permission by default
    $permissionsman
);
```

Add new permissions here when a module needs access control. Then check them in code with:

```php
if ($user->allow("my_permission_code")) { ... }
```

### AP class: use `mwmod_mw_ap_def2` to get the full users2 stack

When the project AP class (`src/mwap/modules/<app>/ap.php`) extends `mwmod_mw_ap_def2` instead of `mwmod_mw_ap_def`, it automatically wires:

- `mwmod_mw_users2_def_usersman` as the users manager
- `user_must_change_password_enabled = true` (the "force password change" checkbox appears in user edit forms)
- Users are instances of `mwmod_mw_users2_user`, which implement `mustChangePassword()`
- `mwmod_mw_ui2_main::getForcedSecuritySubinterfaceCode()` detects the flag after login and forces the `forcechangepass` subinterface
- Login brute-force protection and CSRF session token enabled by default

```php
// src/mwap/modules/mam/ap.php
class mwap_mam_ap extends mwmod_mw_ap_def2 {   // ← NOT mwmod_mw_ap_def
    ...
}
```

`mwmod_mw_ap_def2::create_submanager_user()` in `src/mwap/modules/mw/ap/def2.php` already contains the full role + permission wiring shown above; it is NOT necessary to replicate it in `managers/user.php` — that file is used only when the AP class uses the legacy file-based manager loader.

---

## 8. Email Templates — `mailmsgs/`

Each subdirectory is one email type. Each contains:

| File | Purpose |
|---|---|
| `subject.txt` | Email subject line |
| `html.html` | HTML body |
| `plain.txt` | Plain text body (fallback) |

### Available template variables

| Variable | Value |
|---|---|
| `[[app.sitename]]` | Value of `site_name` from `cfg.ini` |
| `[[user.full_name]]` | Recipient's full name |
| `[[user.idname]]` | Recipient's login email/username |
| `[[ui.login_url]]` | Login page URL |
| `[[ui.reset_pass_url]]` | Password reset form URL |
| `[[ui.reset_pass_url_full]]` | Full URL (for `<a href>`) |
| `[[user.reset_pass_code]]` | One-time reset code |

### Email types included

- **`user_reset_pass_request/`** — sent when a user requests a password reset
- **`user_reset_pass/`** — sent after the password is successfully reset

---

## 9. Install Page — `cfg/install.php`

Controls access to the web-based installer:

```php
$data = array(
    "allowed"      => false,          // set true only when running install
    "allowed_ips"  => array("::1", "127.0.0.1"),
    "pass"         => "random-long-string",    // install page password
    "setupmainuser" => array(
        "allowed"  => true,
        "pass"     => "another-random-string", // password for main user setup
    )
);
```

> **Always set `"allowed" => false` in production.** The install page allows creating the initial admin user and should never be publicly accessible.

---

## 11. Locale — `lng/cfg/es.ini`

Sets the PHP locale for the Spanish interface:

```ini
locale = "es_AR"   ; or "es_PE", "es_MX", etc.
```

This affects date formatting, number formatting and any locale-aware PHP functions.
