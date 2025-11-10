# Project Customization: Detaching from Meralda and Creating Custom Modules

> **AI Assistant Guide**: This document covers the process of detaching a cloned Meralda project from the main repository, renaming it for your custom project, and creating your own application modules. Use this after completing the initial installation.

## Overview

This guide covers the steps to transform a cloned Meralda installation into an independent custom project with its own repository and modules, while preserving the framework's submodules.

## Prerequisites

- Completed initial Meralda installation (see [project-setup-first-installation.md](project-setup-first-installation.md))
- Working local development environment
- New empty GitHub repository created for your project
- Administrator access to modify system files

## Step 1: Detach from Meralda Repository

When you clone Meralda, your local repository is connected to the main Meralda repository. To create an independent project, you must remove this connection.

### 1.1 Check Current Remote

```bash
cd /path/to/project
git remote -v
```

**Expected output:**
```
origin  https://github.com/rodrigovecco/meralda.git (fetch)
origin  https://github.com/rodrigovecco/meralda.git (push)
```

### 1.2 Remove Remote Connection

```bash
git remote remove origin
```

### 1.3 Verify Removal

```bash
git remote -v
```

**Expected:** No output (no remotes configured)

### 1.4 Verify Submodules Are Intact

**Critical:** Removing the remote does NOT affect submodules.

```bash
git submodule status
```

**Expected output (should show all submodules):**
```
8d1ac3856a... docs (heads/main)
02335b94f6... src/mwap/modules/mw (v23.0.0-45-g02335b9)
0a890fdbda... src/public_html/res/css (v23.0.0)
43cc73c227... src/public_html/res/js (v23.0.0-20-g43cc73c)
907ecd523e... src/public_html/res/thirdparty (heads/master)
```

**Important Notes:**
- All 5 submodules should remain active
- Submodules maintain their own repository connections
- You only removed the main project's remote connection

## Step 2: Rename Project Directory

Choose a meaningful name for your project directory. This helps organize your workspace and clearly identify the project purpose.

### 2.1 Navigate Out of Project Directory

```powershell
# Windows PowerShell
cd E:\
```

```bash
# Linux/Mac
cd /path/to/parent
```

### 2.2 Rename the Directory

```powershell
# Windows
Rename-Item -Path "meralda" -NewName "projectname"
```

```bash
# Linux/Mac
mv meralda projectname
```

**Example:** Renaming to `ventismeralda`
```powershell
Rename-Item -Path "meralda" -NewName "ventismeralda"
```

### 2.3 Verify the Rename

```powershell
# Windows
Get-ChildItem | Where-Object Name -like "*project*"
```

```bash
# Linux/Mac
ls -la | grep project
```

## Step 3: Update Apache Virtual Host Configuration

After renaming the directory, update your web server configuration to point to the new path.

### 3.1 Locate Apache Configuration File

**WAMP:**
```
E:\wamp64\bin\apache\apache[version]\conf\extra\httpd-vhosts.conf
```

**XAMPP:**
```
C:\xampp\apache\conf\extra\httpd-vhosts.conf
```

**Linux:**
```
/etc/apache2/sites-available/projectname.conf
```

### 3.2 Find Your Virtual Host Entry

Search for your project's virtual host configuration:

```apache
<VirtualHost *:80>
    ServerName projectname.local
    DocumentRoot "e:/path/to/OLD_NAME/src/public_html"
    <Directory "e:/path/to/OLD_NAME/src/public_html/">
        Options +Indexes +Includes +FollowSymLinks +MultiViews
        AllowOverride All
        Require local
    </Directory>
</VirtualHost>
```

### 3.3 Update Paths

Replace old directory name with new name in both `DocumentRoot` and `Directory` directives:

```apache
<VirtualHost *:80>
    ServerName ventismeralda.local
    DocumentRoot "e:/proyectos/ventisMeralda/ventismeralda/src/public_html"
    <Directory "e:/proyectos/ventisMeralda/ventismeralda/src/public_html/">
        Options +Indexes +Includes +FollowSymLinks +MultiViews
        AllowOverride All
        Require local
    </Directory>
</VirtualHost>
```

### 3.4 Restart Apache

**Windows (WAMP):**
- Right-click WAMP tray icon → Apache → Service → Restart

**PowerShell (as Administrator):**
```powershell
Restart-Service wampapache64
```

**Linux:**
```bash
sudo systemctl restart apache2
```

### 3.5 Test Configuration

Open browser and verify the site loads:
```
http://projectname.local
```

## Step 4: Attach to New Repository

Connect your local project to a new empty repository.

### 4.1 Create New Repository on GitHub

1. Go to GitHub and create a new repository
2. **Important:** Create it empty (no README, no .gitignore, no license)
3. Copy the repository URL

### 4.2 Add New Remote

```bash
cd /path/to/project
git remote add origin https://github.com/username/projectname.git
```

**Example:**
```bash
git remote add origin https://github.com/rodrigovecco/ventismeralda.git
```

### 4.3 Verify Remote

```bash
git remote -v
```

**Expected output:**
```
origin  https://github.com/username/projectname.git (fetch)
origin  https://github.com/username/projectname.git (push)
```

### 4.4 Ensure Branch Name

```bash
git branch -M main
```

### 4.5 Push to New Repository

```bash
git push -u origin main
```

**Expected output:**
```
Enumerating objects: 5149, done.
Counting objects: 100% (5149/5149), done.
Delta compression using up to 24 threads
Compressing objects: 100% (3860/3860), done.
Writing objects: 100% (5149/5149), 73.41 MiB | 13.02 MiB/s, done.
Total 5149 (delta 1092), reused 5146 (delta 1091), pack-reused 0
remote: Resolving deltas: 100% (1092/1092), done.
To https://github.com/username/projectname.git
 * [new branch]      main -> main
branch 'main' set up to track 'origin/main'.
```

### 4.6 Verify on GitHub

Visit your repository URL and confirm all files are present.

## Step 5: Customize Site Name Configuration

Update the application's name throughout the configuration files.

### 5.1 Update Main Configuration INI

**File:** `src/app/cfg.ini`

```ini
page_title = "YourProjectName"
site_name = "YourProjectName"
country="PE"
main_currency="PEN"
```

**Example:**
```ini
page_title = "Ventis"
site_name = "Ventis"
```

### 5.2 Update Language Configuration

**File:** `src/app/cfg/lng/es/cfg.php`

```php
<?php
$data=array(
    "pagetitle"=>"YourProjectName",
    "sitename"=>"YourProjectName",
);
?>
```

**Example:**
```php
<?php
$data=array(
    "pagetitle"=>"Ventis",
    "sitename"=>"Ventis",
);
?>
```

### 5.3 Update Email Sender Name

**File:** `src/app/cfg/sysmail.php`

Find the `FromName` setting and update it:

```php
$data=array(
    "auth"=>array(
        "Host"=>"your-mail-server.com",
        "SMTPAuth"=>true,
        "Username"=>"noreply@yourdomain.com",
        "From"=>"noreply@yourdomain.com",
        "Sender"=>"noreply@yourdomain.com",
        "Password"=>"",
        "Port"=>"587",
        "useSMTPssl"=>false,
        "Helo"=>"",
        "FromName"=>"YourProjectName",  // <- Update this
    )
);
```

**Example:**
```php
"FromName"=>"Ventis",
```

## Step 6: Create Custom Module

Create your own application module to separate your code from the framework.

### 6.1 Understand Module Directory Structure

Modules are located in: `src/mwap/modules/`

**Standard structure:**
```
src/mwap/modules/
├── mw/              # Framework core (submodule - don't modify)
├── demo/            # Demo module (can be removed in production)
├── yourmodule/      # Your custom module
```

### 6.2 Create Module Directory

```bash
mkdir src/mwap/modules/yourmodule
mkdir src/mwap/modules/yourmodule/uiadmin
```

**Example:**
```bash
mkdir src/mwap/modules/ventis
mkdir src/mwap/modules/ventis/uiadmin
```

### 6.3 Create Application Point File

**File:** `src/mwap/modules/yourmodule/ap.php`

```php
<?php
/**
 * [YourModule] Application Point
 * 
 * Main entry point for the [YourModule] module.
 * This class extends the default application point and defines submanagers.
 * 
 * @package YourModule
 * @author Your Name
 * @version 1.0.0
 */
class mwap_yourmodule_ap extends mwmod_mw_ap_def {
    
    /**
     * Constructor
     */
    function __construct() {
        // Initialize module
    }
    
    /**
     * Create UI Admin Submanager
     * 
     * @return mwap_yourmodule_uiadmin_main
     */
    function create_submanager_uiadmin() {
        $man = new mwap_yourmodule_uiadmin_main($this);
        return $man;    
    }
}
?>
```

**Naming Convention:**
- Class name: `mwap_[modulename]_ap`
- Extends: `mwmod_mw_ap_def`
- File location: `src/mwap/modules/[modulename]/ap.php`

### 6.4 Create UI Admin Main File

**File:** `src/mwap/modules/yourmodule/uiadmin/main.php`

```php
<?php
/**
 * [YourModule] UI Admin Main
 * 
 * Main administrative user interface manager for [YourModule] module.
 * Handles session management, subinterfaces, and navigation.
 * 
 * @package YourModule
 * @author Your Name
 * @version 1.0.0
 */
class mwap_yourmodule_uiadmin_main extends mwmod_mw_ui_def_main_admin {
    
    /**
     * Constructor
     * 
     * @param object $ap Application point reference
     */
    function __construct($ap) {
        $this->set_mainap($ap);    
        $this->subinterface_def_code = "welcome";
        $this->url_base_path = "/admin/";
        $this->enable_session_check();
        $this->logout_script_file = "logout.php";
        $this->su_cods_for_side = "mwx,uidebug,users,cfg";
    }
}
?>
```

**Configuration Properties:**
- `subinterface_def_code`: Default subinterface to load ("welcome" is standard)
- `url_base_path`: Base URL path for admin interface
- `su_cods_for_side`: Comma-separated list of subinterface codes for sidebar menu
- `logout_script_file`: Logout script filename

**Standard Subinterfaces:**
- `mwx`: Meralda X extended features (optional)
- `uidebug`: Debug tools (development only)
- `users`: User management
- `cfg`: Configuration settings

### 6.5 Minimal Module Structure

The minimal viable module requires only two files:
1. `ap.php` - Application point
2. `uiadmin/main.php` - Admin UI manager

**Important:** You do NOT need to override every method. The parent classes provide default implementations. Only override what you need to customize.

**Common mistake:** Creating unnecessary `ui.php` or `createUISessionDataMan()` when defaults work fine.

## Step 7: Register Module in Application

Tell the framework about your new module.

### 7.1 Edit Initialization File

**File:** `src/app/init.php`

### 7.2 Register Module with Autoloader

Find the section marked `/*Add your own modules here*/` and add:

```php
$GLOBALS["__mw_autoload_manager"]->create_and_add_sub_pref_man(
    "yourmodule",
    dirname(dirname(__FILE__))."/mwap/modules/yourmodule",
    "mwap"
);
```

**Example:**
```php
/*Add your own modules here*/
$GLOBALS["__mw_autoload_manager"]->create_and_add_sub_pref_man(
    "ventis",
    dirname(dirname(__FILE__))."/mwap/modules/ventis",
    "mwap"
);
```

**Parameters explained:**
1. `"yourmodule"` - Module identifier (used for class name prefix)
2. `dirname(dirname(__FILE__))."/mwap/modules/yourmodule"` - Absolute path to module directory
3. `"mwap"` - Prefix to use for class autoloading

### 7.3 Set Main Application Class

Find the `mw_app` class declaration and update it:

```php
/*
*Declaration of the main application base. Replace with the specific main application class as needed.
*/
class mw_app extends mwap_yourmodule_ap {
}
```

**Example:**
```php
class mw_app extends mwap_ventis_ap {
}
```

**What this does:**
- Your application now uses your custom module as its main entry point
- The `mw_app` class is instantiated as `$GLOBALS["__mw_main_ap"]`
- Framework routing will use your module's submanagers

### 7.4 Complete init.php Example

```php
<?php

include dirname(dirname(__FILE__))."/mwap/preinit.php";

/** @var mw_autoload_manager $GLOBALS["__mw_autoload_manager"] */
/*Remove if you do not want to use the demo module*/
$GLOBALS["__mw_autoload_manager"]->create_and_add_sub_pref_man(
    "demo",
    dirname(dirname(__FILE__))."/mwap/modules/demo",
    "mwap"
);
$GLOBALS["__mw_autoload_manager"]->output_error=true;

/*Add your own modules here*/
$GLOBALS["__mw_autoload_manager"]->create_and_add_sub_pref_man(
    "ventis",
    dirname(dirname(__FILE__))."/mwap/modules/ventis",
    "mwap"
);

///Meralda X
//$GLOBALS["__mw_autoload_manager"]->create_and_add_sub_pref_man("mwx",dirname(dirname(__FILE__))."/mwap/modules/mwx");

/*
*Declaration of the main application base. Replace with the specific main application class as needed.
*/
class mw_app extends mwap_ventis_ap {
}

$GLOBALS["__mw_main_ap"]=new mw_app();
$GLOBALS["__mw_main_ap"]->set_instance_path(dirname(__FILE__));
include dirname(dirname(__FILE__))."/mwap/afterinit.php";

if($GLOBALS["__mw_main_ap"]->connect_db()){
    $GLOBALS["__mw_main_ap"]->after_connect_db_ok();
}else{
    $GLOBALS["__mw_main_ap"]->after_connect_db_fail();
}

function mw_shutdown(){
    if($ap=mw_get_main_ap()){
        $ap->on_shutdown();
    }
}

register_shutdown_function('mw_shutdown');
?>
```

## Step 8: Test Your Custom Module

### 8.1 Clear PHP OpCache (if enabled)

```bash
# Restart Apache to clear cache
systemctl restart apache2  # Linux
# or use WAMP/XAMPP GUI on Windows
```

### 8.2 Access Admin Interface

Open browser:
```
http://projectname.local/admin/
```

### 8.3 Expected Behavior

- Login page should appear with your site name
- After login, admin interface loads
- Sidebar shows configured subinterfaces (users, cfg, etc.)
- No PHP errors

### 8.4 Check for Errors

If errors occur, check:

1. **Apache error log:**
   - WAMP: `E:\wamp64\logs\apache_error.log`
   - XAMPP: `C:\xampp\apache\logs\error.log`
   - Linux: `/var/log/apache2/error.log`

2. **Common issues:**
   - Class not found: Check module registration in `init.php`
   - File not found: Verify file paths and names match exactly
   - Method not found: Ensure parent class is correct

## Module Development Best Practices

### Naming Conventions

**Class Names:**
- Application Point: `mwap_[module]_ap`
- UI Admin Main: `mwap_[module]_uiadmin_main`
- Subinterfaces: `mwap_[module]_[feature]_ui`
- Data Managers: `mwap_[module]_[entity]_man`

**File Names:**
- Application point: `ap.php`
- Admin main: `uiadmin/main.php`
- Subinterfaces: `ui[feature].php` or `[feature]/ui.php`
- Data managers: `[entity]man.php`

### Directory Organization

```
src/mwap/modules/yourmodule/
├── ap.php                      # Main application point
├── uiadmin/
│   └── main.php               # Admin UI manager
├── ui[feature1].php           # Feature subinterfaces
├── ui[feature2].php
├── [entity1]man.php           # Data managers
├── [entity2]man.php
└── [feature]/                 # Complex features
    ├── ui.php
    ├── man.php
    └── subcomponents/
```

### When to Override Methods

**Override when you need to:**
- Add custom subinterfaces: `create_subinterface_[code]()`
- Customize initialization: `__construct()`
- Add custom database managers: `create_manager_[entity]()`
- Implement custom business logic

**Don't override when:**
- Default behavior works fine
- You're just calling `parent::[method]()`
- Framework provides the functionality already

### Removing Demo Module (Production)

Once your module is working, remove demo from production:

**In `init.php`:**
```php
// Comment out or remove demo registration
/*
$GLOBALS["__mw_autoload_manager"]->create_and_add_sub_pref_man(
    "demo",
    dirname(dirname(__FILE__))."/mwap/modules/demo",
    "mwap"
);
*/
```

**Optional:** Delete demo directory
```bash
rm -rf src/mwap/modules/demo
```

## Committing Changes to New Repository

### 9.1 Check Status

```bash
git status
```

### 9.2 Stage All Changes

```bash
git add .
```

### 9.3 Commit with Descriptive Message

```bash
git commit -m "Initial project customization: renamed from Meralda, created [modulename] module, configured site name"
```

### 9.4 Push Changes

```bash
git push origin main
```

## Summary Checklist

Use this checklist to verify all steps completed:

- [ ] Detached from Meralda repository (`git remote remove origin`)
- [ ] Verified submodules intact (`git submodule status`)
- [ ] Renamed project directory
- [ ] Updated Apache virtual host configuration
- [ ] Restarted Apache service
- [ ] Tested site still loads
- [ ] Created new GitHub repository
- [ ] Connected to new repository (`git remote add origin`)
- [ ] Pushed code to new repository
- [ ] Updated `cfg.ini` with project name
- [ ] Updated `cfg/lng/es/cfg.php` with project name
- [ ] Updated `cfg/sysmail.php` with project name
- [ ] Created custom module directory structure
- [ ] Created `ap.php` in module
- [ ] Created `uiadmin/main.php` in module
- [ ] Registered module in `app/init.php`
- [ ] Changed `mw_app` to extend custom module
- [ ] Tested admin interface loads
- [ ] Committed and pushed changes

## Related Documentation

- [Project Setup: First Installation](project-setup-first-installation.md) - Initial Meralda setup
- [System Initialization Guide](system-initialization-guide.md) - How framework bootstrap works
- [Database Access Guide](database-access-guide.md) - Working with database managers

## AI Assistant Best Practices

When guiding users through customization:

1. **Verify each step** before proceeding to the next
2. **Check submodule status** after detaching repository
3. **Update ALL configuration files** with new site name
4. **Test after each major change** (rename, Apache config, module creation)
5. **Use consistent naming** throughout module (no mixed conventions)
6. **Create minimal modules first** - only add complexity when needed
7. **Verify file and directory names** match exactly (case-sensitive on Linux)
8. **Check error logs** if anything doesn't work
9. **Commit frequently** with clear messages

---

**Document Status:** Living Document  
**Last Updated:** 2025-11-10  
**Applies to:** Meralda Framework v1.0+  
**Target Audience:** AI Assistants, Developers Creating Custom Projects
