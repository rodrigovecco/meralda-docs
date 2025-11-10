# System Initialization and Architecture Guide for AI Tools

This document explains how to understand the complete system architecture by following the initialization chain from entry points.

## Overview

Meralda-based systems follow a consistent initialization pattern with multiple entry points for different contexts (admin, visitor, services). Understanding the initialization flow is crucial for comprehending the entire system architecture.

**Important:** If the `src/app/` directory is missing, copy it from the `example/` directory and configure at minimum the database settings in `src/app/cfg/db.php`.

## Entry Points

The system has multiple entry points depending on the access context. All entry points are located under the `src/` directory:

### Primary Entry Points

1. **Admin Interface:** `src/public_html/admin/index.php`
   - Backend administration panel
   - User management and system configuration
   - Requires authentication

2. **Public Pages:** `src/public_html/get/`
   - Publicly accessible pages
   - Landing pages
   - Login/authentication pages

3. **Service/API Endpoints:** `src/public_html/service/`
   - REST-like API services
   - AJAX endpoints
   - External integrations

### Project-Specific Entry Points

Different projects may have additional entry points depending on their requirements. Common examples include:

- **Visitor interfaces** - For field representatives or mobile users
- **Seller interfaces** - For sales representatives
- **Customer portals** - For client access
- **Partner portals** - For external collaborators

These are defined based on the specific project needs and follow the same initialization pattern.

## How to Map the System

### Step 1: Identify the Entry Point

Start by identifying which entry point you need to understand:

```
src/
├── public_html/    # Web-accessible directory (document root)
│   ├── admin/      # Backend administration
│   │   └── index.php
│   ├── service/    # API services
│   │   └── [various service scripts]
│   ├── get/        # Public pages
│   │   └── [various page scripts]
│   └── [other context-specific directories as needed]
├── app/            # Application-specific code
├── mwap/           # Framework code
└── appdata/        # Application data files
```

### Step 2: Follow the Include Chain

Each entry point follows a similar initialization pattern:

```
Entry Point (e.g., src/public_html/admin/index.php)
    ↓
    includes → init.php (in project root or context-specific)
    ↓
    includes → src/app/init.php (application initialization)
    ↓
    includes → src/mwap/preinit.php (framework pre-initialization)
    ↓
    loads → src/app/cfg/*.php (configuration files)
    ↓
    includes → src/mwap/afterinit.php (framework post-initialization)
    ↓
    executes → Application logic
```

### Step 3: Read Configuration Files

Configuration files are located in `src/app/cfg/`:

```
src/app/cfg/
├── db.php          # Database credentials
├── install.php     # Installation settings
├── sysmail.php     # Email configuration
└── lng/            # Language files
```

**Always read these files to understand:**
- Database connection parameters
- System paths and URLs
- Email settings
- Feature flags

### Step 4: Discover Application Structure

```
src/app/
├── cfg/            # Configuration files
├── content/        # Page content and templates
├── lng/            # Language messages
├── managers/       # Business logic managers
├── mailmsgs/       # Email templates
└── paymentapi/     # Payment gateway integrations
```

### Step 5: Understand Framework Structure

```
src/mwap/
├── preinit.php     # Framework bootstrap
├── afterinit.php   # Post-initialization
├── cfg.ini         # Framework configuration
├── version.json    # Version information
├── core/           # Core framework classes
├── managers/       # Framework managers
├── modules/        # Framework modules
│   └── [module_name]/
│       └── [module files]
└── lng/            # Framework language files
```

## AI Tool Instructions for System Discovery

### 1. Initial System Scan

```bash
# Start with entry points
Read: src/public_html/admin/index.php

# Discover other entry points
List: src/public_html/* directories

# Follow initialization
Read: src/public_html/init.php (if exists)
Read: src/app/init.php
Read: src/mwap/preinit.php
Read: src/mwap/afterinit.php

# Read configuration
Read: src/app/cfg/db.php
Read: src/app/cfg/install.php
Read: src/mwap/cfg.ini
```

### 2. Map Module Structure

When analyzing a specific module or feature:

```bash
# Identify the module location
Search: "class [ClassName]" in src/mwap/modules/

# Read module files
Read: src/mwap/modules/[module_name]/[main_file].php

# Check for managers
Read: src/app/managers/[feature_name].php
Read: src/mwap/managers/[feature_name].php
```

### 3. Understand UI Structure

For user interfaces:

```bash
# Main UI controllers
Search: "extends mwmod_mw_ui_" in src/app/ and src/mwap/modules/

# Subinterfaces
Look for: _do_create_subinterface_child_* methods
Look for: files in same directory as main UI

# Templates and content
Read: src/app/content/[feature_name]/
```

### 4. Database Schema Discovery

```bash
# Schema files
Read: db/[project]_create.sql
Read: db/[project]_updates.sql
Read: db/views.sql

# Dynamic discovery via database
Execute: SHOW TABLES;
Execute: DESCRIBE [table_name];
```

## Common Patterns to Look For

### Autoloading Classes

The framework uses a custom autoloader (`mw_autoload_manager`) located in `src/mwap/core/mwautoloadmanager/`. This autoloader manages different prefix managers that convert class names to file paths.

**How it works:**
- Class names use underscores as namespace separators
- The first part (prefix) determines the autoloader: `mwmod_`, `mwap_`, `mwcus_`, etc.
- Underscores are converted to directory separators after the prefix

**Common patterns:**
- `mwmod_[module]_[class]` → `src/mwap/modules/[module]/[class].php`
- `mwap_[project]_[feature]` → `src/app/` or `src/mwap/modules/[project]/`

**Examples:**
```
Class: mwmod_mw_ui_base_dxtbladmin
File:  src/mwap/modules/mw/ui/base/dxtbladmin.php

Class: mwap_crmba_uiseller_clients
File:  src/mwap/modules/crmba/uiseller/clients.php
```

To understand autoloading for a specific class, read `src/mwap/core/mwautoloadmanager/man.php` and its prefix managers.

### Manager Pattern

Business logic is organized in managers located in `src/app/managers/` and `src/mwap/managers/`

### UI Pattern

User interfaces follow inheritance patterns. Search for classes extending `mwmod_mw_ui_*` to understand the structure.

## Step-by-Step System Analysis

### For a New Project

1. **Start with entry point:**
   ```
   Read: src/public_html/admin/index.php
   ```

2. **Follow includes to understand initialization:**
   ```
   Read each included file in order
   Note configuration paths
   ```

3. **Map application structure:**
   ```
   List directories in src/app/
   List directories in src/app/managers/
   List directories in src/app/content/
   ```

4. **Discover custom modules:**
   ```
   List directories in src/mwap/modules/
   Identify main classes
   ```

5. **Understand database:**
   ```
   Read: db/*.sql files
   Connect and run: SHOW TABLES;
   Document key tables
   ```

6. **Map user interfaces:**
   ```
   Search for: "class.*extends.*ui"
   Identify main interfaces and subinterfaces
   ```

## Best Practices for AI Tools

1. **Always start from entry points** - Don't assume structure
2. **Follow the initialization chain** - Understand setup before features
3. **Read configuration first** - Know environment before analyzing code
4. **Map before diving deep** - Get overview before details
5. **Document as you discover** - Keep track of architecture
6. **Respect the framework patterns** - Don't fight the structure
7. **Use database to verify** - Cross-reference code with actual data
8. **Check version files** - Framework versions may have differences

---

**Remember:** Start from the entry point and follow the initialization chain - the system architecture will reveal itself systematically.
