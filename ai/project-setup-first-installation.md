# Project Setup: First Installation and Configuration

> **AI Assistant Guide**: This document provides step-by-step instructions for cloning the Meralda framework repository and performing the initial setup for a new project. Follow these steps in sequence when a user requests to set up a new Meralda-based application.

## Overview

This guide covers the complete initial setup process from cloning the repository to having a fully functional local development environment with database connectivity and web server configuration.

## Prerequisites

Before starting, verify the system has:
- Git installed and configured
- Local web server (Apache/WAMP/XAMPP)
- MariaDB/MySQL database server
- PHP 7.4+ installed
- PowerShell or appropriate terminal access

## Step 1: Clone Repository with Submodules

Meralda uses Git submodules for documentation and various components. Always clone with the `--recurse-submodules` flag:

```bash
git clone --recurse-submodules https://github.com/rodrigovecco/meralda.git
```

**Important Notes:**
- The `--recurse-submodules` flag ensures all submodules are cloned
- Submodules include: docs, CSS, JS, MW modules, and third-party public resources
- If submodules weren't cloned initially, update them with: `git submodule update --init --recursive`

## Step 2: Copy Application Configuration Template

The repository includes a demo application configuration in `example/demo/app/`. Copy this to `src/app/`:

```powershell
Copy-Item -Path "meralda/example/demo/app" -Destination "meralda/src/app" -Recurse
```

**Why this step is necessary:**
- The `src/app/cfg/` directory contains critical configuration files
- Database connection settings (`db.php`)
- Email configuration (`sysmail.php`)
- Installation settings (`install.php`)
- Language configurations (`lng/`)

## Step 3: Locate Database Executable

Never assume default installation paths. Always search for the actual database installation:

### For Windows Systems:

```powershell
# Search for MySQL/MariaDB executable
Get-ChildItem -Path "C:\" -Filter "mysql.exe" -Recurse -ErrorAction SilentlyContinue
Get-ChildItem -Path "E:\" -Filter "mysql.exe" -Recurse -ErrorAction SilentlyContinue
```

**Common locations:**
- WAMP: `E:\wamp64\bin\mariadb\mariadb[version]\bin\mysql.exe`
- XAMPP: `C:\xampp\mysql\bin\mysql.exe`
- Standalone: `C:\Program Files\MariaDB [version]\bin\mysql.exe`

**Verify the database version:**
```powershell
& "path\to\mysql.exe" --version
```

## Step 4: Create Project Database

**Security Best Practice:** NEVER use root user for application database connections.

### 4.1 Choose a Project-Specific Database Name

Use a descriptive name that matches the project (e.g., `ventismeralda` for a project in the `ventisMeralda` folder).

### 4.2 Create the Database

```bash
mysql -u root -e "CREATE DATABASE projectname CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

### 4.3 Create Dedicated Database User

Generate a secure password (32+ characters, alphanumeric):

```bash
mysql -u root -e "CREATE USER 'projectname'@'localhost' IDENTIFIED BY 'SecurePassword32CharsAlphanumeric';"
```

**Password Requirements:**
- Minimum 32 characters
- Mix of uppercase and lowercase letters
- Include numbers
- Avoid special characters that cause shell escaping issues (`$`, `#`, `@`, `!`)
- Example: `Kx9mP2qRv8Ln4Ys6Wt3Hb7Gj5Fd1Zc0`

### 4.4 Grant Privileges

```bash
mysql -u root -e "GRANT ALL PRIVILEGES ON projectname.* TO 'projectname'@'localhost';"
mysql -u root -e "FLUSH PRIVILEGES;"
```

### 4.5 Test the Connection

```bash
mysql -u projectname -pSecurePassword32CharsAlphanumeric -e "SELECT USER();"
```

## Step 5: Configure Database Connection

Edit `src/app/cfg/db.php` with the project-specific credentials:

```php
<?php
$data=array(
    "host"=>"localhost",
    "db"=>"projectname",
    "user"=>"projectname",
    "pass"=>"SecurePassword32CharsAlphanumeric",
    "port"=>"3306",
);
?>
```

**Configuration Notes:**
- Always use `localhost` for the host (not `127.0.0.1` unless specifically required)
- Port `3306` is default for MySQL/MariaDB
- Never commit passwords to version control; use environment variables in production

## Step 6: Initialize Database Schema

Import the base schema from the docs submodule:

```bash
mysql -u projectname -pSecurePassword32CharsAlphanumeric projectname < docs/db/mwphplib.sql
```

**Verify tables were created:**
```bash
mysql -u projectname -pSecurePassword32CharsAlphanumeric projectname -e "SHOW TABLES;"
```

**Expected tables:**
- `users` - User management and authentication
- `bruteforce_blacklist` - Security: blocked IP addresses
- `bruteforce_ip_activity` - Security: login attempt tracking
- `bruteforce_whitelist` - Security: whitelisted IP addresses

## Step 7: Extract Third-Party Dependencies

The repository includes a `thirdparty.zip` file containing required libraries:

```powershell
# Extract to temporary location first
Expand-Archive -Path "meralda/thirdparty.zip" -DestinationPath "temp_extract/" -Force

# Copy to src directory structure
Copy-Item -Path "temp_extract/mwap/*" -Destination "meralda/src/mwap/" -Recurse -Force
Copy-Item -Path "temp_extract/public_html/*" -Destination "meralda/src/public_html/" -Recurse -Force

# Clean up
Remove-Item -Path "temp_extract" -Recurse -Force
```

**Important:** Third-party files MUST be in the `src/` directory, not the repository root.

**Included Libraries:**
- PHPMailer → `src/mwap/modulesext/phpmailer/`
- QR Code → `src/mwap/modulesext/qrcode/`
- FPDF → `src/mwap/modulesext/fpdf/`
- PHPOffice → `src/mwap/modulesext/phpoffice/`
- KCFinder → `src/public_html/kcfinder/`
- CKEditor → `src/public_html/res/ckeditor/`
- Bootstrap → `src/public_html/res/bootstrap/`
- Font Awesome → `src/public_html/res/icons/fontawesome-free/`
- DevExtreme → `src/public_html/res/dx/`
- And more...

## Step 8: Configure Apache Virtual Host

### 8.1 Locate Apache Configuration

For WAMP installations, find the virtual hosts configuration:

```powershell
Get-ChildItem -Path "E:\wamp64" -Filter "httpd-vhosts.conf" -Recurse
```

**Typical location:** `E:\wamp64\bin\apache\apache[version]\conf\extra\httpd-vhosts.conf`

### 8.2 Add Virtual Host Entry

Append to `httpd-vhosts.conf`:

```apache
<VirtualHost *:80>
    ServerName projectname.local
    DocumentRoot "e:/path/to/project/meralda/src/public_html"
    <Directory "e:/path/to/project/meralda/src/public_html/">
        Options +Indexes +Includes +FollowSymLinks +MultiViews
        AllowOverride All
        Require local
    </Directory>
</VirtualHost>
```

**Key Configuration Points:**
- `ServerName`: Use `.local` suffix for local development
- `DocumentRoot`: Points to `src/public_html/` directory
- `Require local`: Restricts access to localhost only (security best practice)
- Use forward slashes (`/`) even on Windows

### 8.3 Update Windows Hosts File

**File:** `C:\Windows\System32\drivers\etc\hosts`

**Add entry:**
```
127.0.0.1       projectname.local
```

**Important:** 
- Requires Administrator privileges
- Open Notepad as Administrator to edit
- No file extension on the hosts file

### 8.4 Restart Apache

```powershell
# Via WAMP GUI: Right-click tray icon → Apache → Service → Restart
# Or via PowerShell (as Administrator):
Restart-Service wampapache64
```

## Step 9: Verify Installation

### 9.1 Test Database Connectivity

```bash
mysql -u projectname -pPassword projectname -e "SELECT COUNT(*) FROM users;"
```

### 9.2 Test Web Server Access

Open browser and navigate to: `http://projectname.local`

**Expected result:** Meralda framework should load without errors.

### 9.3 Check PHP Error Logs

If issues occur, check Apache error logs:
- WAMP: `E:\wamp64\logs\apache_error.log`
- XAMPP: `C:\xampp\apache\logs\error.log`

## Common Issues and Solutions

### Issue: "Access Denied" on Database Connection

**Causes:**
- Incorrect credentials in `src/app/cfg/db.php`
- User privileges not granted
- Privileges not flushed after creation

**Solution:**
```bash
# Verify user exists and has privileges
mysql -u root -e "SHOW GRANTS FOR 'username'@'localhost';"

# Re-grant privileges
mysql -u root -e "GRANT ALL PRIVILEGES ON dbname.* TO 'username'@'localhost';"
mysql -u root -e "FLUSH PRIVILEGES;"
```

### Issue: Virtual Host Not Working

**Causes:**
- Apache not restarted after configuration change
- Hosts file not updated
- Incorrect DocumentRoot path

**Solution:**
- Verify hosts file entry: `ping projectname.local` should resolve to `127.0.0.1`
- Check Apache syntax: `httpd -t`
- Restart Apache service
- Clear browser cache

### Issue: Third-Party Libraries Not Loading

**Causes:**
- Files extracted to wrong location (root instead of `src/`)
- Incorrect file permissions

**Solution:**
- Verify files are in `src/mwap/modulesext/` and `src/public_html/res/`
- Check file permissions allow web server read access

### Issue: Submodules Empty After Clone

**Cause:** Cloned without `--recurse-submodules` flag

**Solution:**
```bash
cd meralda
git submodule update --init --recursive
```

## Post-Installation Steps

After completing the initial setup:

1. **Create Admin User**: Use the framework's installation interface at `http://projectname.local/install/`
2. **Configure Email Settings**: Edit `src/app/cfg/sysmail.php`
3. **Set Up Language Preferences**: Review `src/app/cfg/lng/` configurations
4. **Review Security Settings**: Check brute-force protection configuration
5. **Enable HTTPS**: Configure SSL certificate for production environments

## AI Assistant Best Practices

When guiding users through setup:

1. **Always ask about existing installations** before assuming default paths
2. **Search the actual file system** rather than using common paths
3. **Generate secure passwords** programmatically (avoid patterns)
4. **Verify each step** with a test command before proceeding
5. **Use project-specific naming** for databases, users, and virtual hosts
6. **Follow the principle of least privilege** (never use root for applications)
7. **Document the credentials** in a secure location for the user
8. **Test the final configuration** before declaring setup complete

## Version Information

- Meralda Framework: Latest from main branch
- MariaDB/MySQL: 10.4+ / 8.0+
- PHP: 7.4+
- Apache: 2.4+

## Related Documentation

- [Database Access Guide](database-access-guide.md) - Working with database connections
- [System Initialization Guide](system-initialization-guide.md) - Framework bootstrap process
- [Database Query Patterns](database-query-patterns.md) - Writing database queries

---

**Document Status:** Living Document  
**Last Updated:** 2025-11-09  
**Applies to:** Meralda Framework v1.0+  
**Target Audience:** AI Assistants, Automated Setup Tools
