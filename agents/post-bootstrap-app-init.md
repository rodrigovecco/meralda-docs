# Post-Bootstrap: Application Initialization

> **AI Assistant Guide**: Run these steps immediately after completing the bootstrap phase (cloning Meralda and configuring the project remote). This guide initializes the application skeleton so the project is ready for customization.

## Overview

After cloning Meralda and setting up the repository remote, the `src/app/` directory does not exist yet. This step copies the demo application template into place so the project has a working configuration structure to edit.

Before continuing with deeper customization, the assistant must ensure the project is no longer running as plain demo defaults: define the project main app class and confirm which admin UI class should be used.

## Prerequisites

- Meralda cloned with submodules into `meralda/`
- Project remote configured (see bootstrap agent)
- `meralda/example/demo/app/` exists

> **Reminder on the repo "divorce":** the Meralda submodules are **shared globally** across all
> Meralda projects. When you make the project independent, you only change the **superproject's**
> remote — never the submodule URLs in `.gitmodules`. See the **Repository Divorce** section below
> and the bootstrap agent's "Detach Rules" for details.

## Step 1: Copy the Demo Application Template

```powershell
Copy-Item -Path "meralda/example/demo/app" -Destination "meralda/src/app" -Recurse
```

## Step 1.5: Define Main App Class and Admin UI (required)

After copying `src/app/`, do not continue directly to generic config edits. First, ask and confirm:

1. What should be the **project main app class** (the class used by `mw_app` in `src/app/init.php`)?
2. What should be the **admin UI class** (the class used to render `/admin`)?

Minimum required checks:

- Read `meralda/src/app/init.php` and identify the current inheritance (usually demo-based):
  - `class mw_app extends mwap_demo_ap {}`
- Read the project app class file (`ap.php`) and identify `create_ui_main_admin()`.
- Confirm with the user whether to keep demo admin UI temporarily or switch to a project-specific UI class now.

Expected direction for real projects:

- `mw_app` should extend a project class (not remain permanently tied to demo behavior).
- `create_ui_main_admin()` should point to the selected project admin UI class.

Only after this confirmation, proceed with the remaining customization steps.

**What this creates:**

| Path | Purpose |
|------|---------|
| `src/app/cfg/db.php` | Database connection settings |
| `src/app/cfg/sysmail.php` | Email configuration |
| `src/app/cfg/install.php` | Installation settings |
| `src/app/lng/` | Language string files |

**Important:** Do NOT copy directly from the submodule at `src/mwap/modules/demo/` — that is the framework demo module, not the application template.

## Step 2: Review Submodule Versions

After cloning, each submodule is pinned to the commit recorded in the parent repo. For each submodule, **ask the user whether to keep the pinned version or update to the latest remote commit**.

List the current state first:

```powershell
git -C "meralda" submodule status
```

Ask the user per submodule (or as a group if they prefer):

> "Each submodule is currently pinned to a specific commit. For `<submodule-path>` (currently at `<short-hash>`), do you want to:
> - **Keep pinned version** (recommended for stability)
> - **Update to latest** (`git submodule update --remote -- <path>`)"

To update a specific submodule:

```powershell
git -C "meralda" submodule update --remote -- <submodule-path>
# e.g.:
git -C "meralda" submodule update --remote -- src/mwap/modules/mw
```

To update all at once:

```powershell
git -C "meralda" submodule update --remote
```

After any update, commit the new submodule pointers in the parent repo:

```powershell
git -C "meralda" add .
git -C "meralda" commit -m "Update submodule(s) to latest"
```

> **Note:** Submodules without a `+` prefix in `git submodule status` are already at the pinned commit and may already be at the latest if the remote hasn't advanced.

## Step 4: Verify the Copy

```powershell
Test-Path "meralda/src/app/cfg/db.php"   # should return True
```

## Step 5: Update meralda-agent.config.yml

After this step, confirm the `meralda-agent.config.yml` at the workspace root reflects the correct writable paths:

```yaml
access:
  writable:
    - "meralda/src/app/**"
```

## Step 6: Set Up the Database (recommended for local development)

> **Note for the agent:** Creating a local database is recommended for development but not always required (e.g., if connecting to a shared dev server). Ask the user before proceeding:
>
> "Do you want to set up a local database for development now?"

### 6.1 Ask which database server to use

Ask the user which database engine they are using. The recommended default is **MariaDB**.

> "Which database server are you using? (Recommended: MariaDB)"

Options: `MariaDB` | `MySQL`

### 6.2 Locate the database executable

Ask the user for the path to `mysql.exe` (the MariaDB/MySQL client). Do not assume any default path.

> "What is the full path to your mysql.exe (MariaDB/MySQL client)?"

Common locations on Windows:

| Stack | Typical path |
|-------|-------------|
| WAMP  | `F:\wamp64\bin\mariadb\mariadb10.4.13\bin\mysql.exe` |
| XAMPP | `C:\xampp\mysql\bin\mysql.exe` |
| Standalone MariaDB | `C:\Program Files\MariaDB 10.x\bin\mysql.exe` |

Verify it works:

```powershell
& "F:\wamp64\bin\mariadb\mariadb10.4.13\bin\mysql.exe" --version
```

### 6.3 Ask whether to create the database automatically or manually

> "Do you want me to create the database automatically, or would you prefer to do it manually?"

---

#### Option A — Automatic (agent runs the scripts)

The scripts must be run in this order against the `root` user (or a user with CREATE DATABASE privilege):

**Step 1: Create the database**

```powershell
# Replace paths and values as needed
$mysql = "F:\wamp64\bin\mariadb\mariadb10.4.13\bin\mysql.exe"
$dbName = "your_database_name"   # e.g. meraldallmodules

# 1. Create database (uses docs/db/create_db.sql as template)
& $mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS ``$dbName`` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

**Step 2: Create tables**

```powershell
& $mysql -u root -p $dbName < "meralda/docs/db/meralda_base_tables.sql"
```

**Step 3: Create the initial admin user**

Ask the user for the admin email and password before running this step:

> "What email address will the admin user have?"
> "What initial password should the admin have?"

Generate the bcrypt hash using PHP (already required by Meralda — no extra dependencies):

```powershell
# Replace 'mypassword' with the actual password
php -r "echo password_hash('mypassword', PASSWORD_BCRYPT) . PHP_EOL;"
```

> **Why PHP and not the Python script or MariaDB?**
> - MariaDB's native functions (`PASSWORD()`, `SHA2()`) produce hashes incompatible with PHP's `password_verify()`.
> - The included `docs/db/hash_password.py` requires installing the `bcrypt` pip package separately.
> - PHP is already a requirement of Meralda and generates the correct `$2y$10$...` bcrypt format natively.

Copy the resulting hash, then build and execute the SQL using a temp file (required in PowerShell — `<` is not supported and the bcrypt hash breaks `-e` string interpolation):

```powershell
$hash = 'PASTE_HASH_HERE'   # e.g. $2y$10$...
$adminEmail = 'admin@example.com'
$adminName  = 'Administrator'
$sqlFile = "$env:TEMP\insert_admin.sql"

@"
SET NAMES utf8mb4;
INSERT INTO ``users`` (``name``, ``complete_name``, ``pass``, ``secpass``, ``active``, ``last_login_date``, ``last_login_ip``, ``is_main``, ``rol_admin``, ``reset_pass_code``, ``reset_pass_enabled``, ``reset_pass_expires``, ``must_change_pass``, ``image``, ``phonenumber``, ``rol_consult``, ``rol_user``)
VALUES ('$adminEmail', '$adminName', '$hash', 1, 1, NULL, '', 1, 1, '', 0, '0000-00-00 00:00:00', 1, '', '', 0, 0);
"@ | Set-Content $sqlFile -Encoding UTF8

Get-Content $sqlFile | & $mysql -u root -p your_database_name
```

> **Why a temp file?** In PowerShell, `<` (input redirection) is reserved and fails. The bcrypt hash (`$2y$10$...`) also breaks string interpolation when passed via `-e`. Writing to a file and piping with `Get-Content` avoids both issues.

**Step 4: Create the application DB user**

```sql
CREATE USER 'appuser'@'localhost' IDENTIFIED BY 'strongpassword';
GRANT ALL PRIVILEGES ON your_database_name.* TO 'appuser'@'localhost';
FLUSH PRIVILEGES;
```

> **Security:** Never use the `root` user for the application's database connection.

---

#### Option B — Manual

Tell the user to run the scripts in this order from their DB client (HeidiSQL, phpMyAdmin, MySQL Workbench, etc.):

1. `meralda/docs/db/create_db.sql` — creates the database (edit the name first)
2. `meralda/docs/db/meralda_base_tables.sql` — creates all base tables
3. `meralda/docs/db/initial_user.sql` — inserts the first admin user (edit email and generate bcrypt hash with `php -r "echo password_hash('password', PASSWORD_BCRYPT) . PHP_EOL;"` first)

Then create a dedicated application user with privileges only on this database.

---

### 4.4 Configure Database Connection

Edit `meralda/src/app/cfg/db.php` with the project database credentials:

```php
$data = array(
    "host" => "localhost",
    "db"   => "your_database_name",
    "user" => "appuser",
    "pass" => "strongpassword",
    "port" => "3306",
);
```

> This file must be listed in `.gitignore`. Never commit credentials.

## Repository Divorce (make the project independent)

After the app skeleton and database are in place, "divorce" the project from Meralda so it lives
in its own repository. **The divorce affects ONLY the superproject (main repo). It must NEVER
change the submodule URLs in `.gitmodules`** — every Meralda project keeps sharing the exact
same upstream submodules.

### Simple divorce (recommended default)

Keeps history and keeps submodules registered as shared gitlinks. The fresh clone's `origin`
points to Meralda, so just point the project at its own private repo:

```bash
cd meralda
git remote remove origin
git remote add origin <new-private-repo-url>
```

Verify the submodules are still shared (URLs unchanged) and update the config flag:

```bash
git config -f .gitmodules --get-regexp url   # all URLs must still point to the shared Meralda repos
```

Then set `repository.detached: true` in the workspace-root `meralda-agent.config.yml`.

> **Full detach (clean history)** is only for when the user explicitly wants to erase Meralda's
> commit history. See the bootstrap agent's "Detach Rules" — submodules must be re-registered with
> their **same shared URLs** BEFORE the first `git add`.

> **Never push automatically.** The Meralda upstream is read-only; push to the project's own
> private repo only after the user confirms.

## Next Steps

- Set up the local web server pointing to `meralda/src/public_html/`
- Configure the virtual host or local domain
