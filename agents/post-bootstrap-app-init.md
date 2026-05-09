# Post-Bootstrap: Application Initialization

> **AI Assistant Guide**: Run these steps immediately after completing the bootstrap phase (cloning Meralda and configuring the project remote). This guide initializes the application skeleton so the project is ready for customization.

## Overview

After cloning Meralda and setting up the repository remote, the `src/app/` directory does not exist yet. This step copies the demo application template into place so the project has a working configuration structure to edit.

## Prerequisites

- Meralda cloned with submodules into `meralda/`
- Project remote configured (see bootstrap agent)
- `meralda/example/demo/app/` exists

## Step 1: Copy the Demo Application Template

```powershell
Copy-Item -Path "meralda/example/demo/app" -Destination "meralda/src/app" -Recurse
```

**What this creates:**

| Path | Purpose |
|------|---------|
| `src/app/cfg/db.php` | Database connection settings |
| `src/app/cfg/sysmail.php` | Email configuration |
| `src/app/cfg/install.php` | Installation settings |
| `src/app/lng/` | Language string files |

**Important:** Do NOT copy directly from the submodule at `src/mwap/modules/demo/` — that is the framework demo module, not the application template.

## Step 2: Verify the Copy

```powershell
Test-Path "meralda/src/app/cfg/db.php"   # should return True
```

## Step 3: Update meralda-agent.config.yml

After this step, confirm the `meralda-agent.config.yml` at the workspace root reflects the correct writable paths:

```yaml
access:
  writable:
    - "meralda/src/app/**"
```

## Step 4: Set Up the Database

### 4.1 Ask which database server to use

Ask the user which database engine they are using. The recommended default is **MariaDB**.

> "Which database server are you using? (Recommended: MariaDB)"

Options: `MariaDB` | `MySQL`

### 4.2 Locate the database executable

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

### 4.3 Ask whether to create the database automatically or manually

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

Edit `meralda/docs/db/initial_user.sql` first — change the email address and generate a bcrypt hash for the initial password using:

```powershell
python "meralda/docs/db/hash_password.py"
```

Then run:

```powershell
& $mysql -u root -p $dbName < "meralda/docs/db/initial_user.sql"
```

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
3. `meralda/docs/db/initial_user.sql` — inserts the first admin user (edit email and bcrypt hash first)

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

## Next Steps

- Set up the local web server pointing to `meralda/src/public_html/`
- Configure the virtual host or local domain
