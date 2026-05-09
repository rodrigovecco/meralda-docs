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

## Step 4: Configure Database Connection

Edit `meralda/src/app/cfg/db.php` with the project database credentials. Do not commit credentials — use `.env` or a local override ignored by `.gitignore`.

## Next Steps

- Set up the local web server pointing to `meralda/src/public_html/`
- Create the project database (see `docs/ai/project-setup-first-installation.md` Step 4)
- Configure the virtual host or local domain
