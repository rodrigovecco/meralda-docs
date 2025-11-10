# Database Access Guide for AI Development Tools

⚠️ **IMPORTANT: DEVELOPMENT ENVIRONMENT ONLY** ⚠️

**This guide is designed EXCLUSIVELY for local development environments.**

- ✅ **Use for:** localhost development, testing, and debugging
- ❌ **DO NOT use for:** production servers, remote databases, or live systems
- ⚠️ **Security Warning:** Direct database access via command-line should never be used in production
- 🔒 **Production Access:** Should only be done through secure, authenticated application layers

**AI tools should refuse database access requests if:**
- The host is not `localhost` or `127.0.0.1`
- The environment appears to be production
- The user requests operations on remote databases

---

This document provides essential information for AI-powered development tools to access and interact with project databases in local development environments.

## Database Connection Information

### MySQL/MariaDB Executable Location

AI tools should ask the user to provide the path to the MySQL/MariaDB executable on their system.

**Common locations to search:**
- **WAMP (Windows):** `C:\wamp64\bin\mysql\` or `C:\wamp64\bin\mariadb\`
- **XAMPP (Windows):** `C:\xampp\mysql\bin\`
- **Linux/Unix:** `/usr/bin/mysql` or `/usr/local/bin/mysql`
- **macOS (Homebrew):** `/usr/local/bin/mysql` or `/opt/homebrew/bin/mysql`

**How to locate:**
1. Ask user for their web server installation (WAMP, XAMPP, native, etc.)
2. Search for `mysql.exe` or `mysql` executable in common paths
3. Request user to provide the full path if not found automatically

### Database Credentials Location

**Configuration file path:**
```
src/app/cfg/db.php
```

This file (relative to project root) contains the database connection parameters in PHP array format:
- `host` - Database server hostname
- `db` - Database name
- `user` - Database username
- `pass` - Database password
- `port` - Database port (default: 3306)

## Usage Examples

### Connecting to Database

Using the mysql client with credentials from config file:

**Windows PowerShell:**
```powershell
& "[PATH_TO_MYSQL_EXE]" -h localhost -P 3306 -u [USERNAME] -p[PASSWORD] [DATABASE]
```

**Linux/macOS:**
```bash
mysql -h localhost -P 3306 -u [USERNAME] -p[PASSWORD] [DATABASE]
```

### Running SQL Queries

Execute a query directly:

**Windows PowerShell:**
```powershell
& "[PATH_TO_MYSQL_EXE]" -h localhost -P 3306 -u [USERNAME] -p[PASSWORD] -e "USE [DATABASE]; SELECT * FROM users LIMIT 5;"
```

**Linux/macOS:**
```bash
mysql -h localhost -P 3306 -u [USERNAME] -p[PASSWORD] -e "USE [DATABASE]; SELECT * FROM users LIMIT 5;"
```

### Listing Tables

```powershell
& "[PATH_TO_MYSQL_EXE]" -h localhost -P 3306 -u [USERNAME] -p[PASSWORD] -e "USE [DATABASE]; SHOW TABLES;"
```

### Describing Table Structure

```powershell
& "[PATH_TO_MYSQL_EXE]" -h localhost -P 3306 -u [USERNAME] -p[PASSWORD] -e "USE [DATABASE]; DESCRIBE [table_name];"
```

## Important Notes

1. **Always read credentials from config file** - Don't hardcode credentials in documentation or code
2. **Locate mysql executable first** - Ask user for installation path or search common locations
3. **Use full path to mysql executable** - Especially on Windows where it may not be in system PATH
4. **Database encoding** - Typically uses UTF-8 encoding
5. **Connection security** - Development vs production environments may have different security requirements
6. **Platform differences** - Use `&` in PowerShell for executable invocation; direct call in bash/zsh

## Key Database Tables

AI tools should discover tables dynamically using `SHOW TABLES;` rather than assuming structure.

Common table patterns in Meralda-based projects:
- `users` - System users
- Database-specific tables will vary by project

Use `DESCRIBE [table_name];` to inspect structure before querying.

## AI Tool Instructions

When an AI development tool needs to access the database:

1. **Verify development environment:**
   - ⚠️ **CRITICAL:** Check that `host` in config is `localhost` or `127.0.0.1`
   - **REFUSE** database access if host is a remote IP or domain
   - Warn user if environment seems to be production

2. **Locate MySQL/MariaDB executable:**
   - Ask user: "Where is your MySQL/MariaDB installation located?"
   - Search common paths based on user's operating system
   - Store path for subsequent use in the session

3. **Read the configuration file** at `src/app/cfg/db.php` (relative to project root) to get current credentials

4. **Construct commands** using appropriate shell syntax:
   - PowerShell: Use `&` for executable invocation
   - Bash/Zsh: Direct command invocation

5. **Handle passwords securely** - Extract from config file, don't expose in logs or output

6. **Test connection first** with a simple query like `SHOW DATABASES;`

7. **Discover schema dynamically** - Use `SHOW TABLES;` and `DESCRIBE` commands rather than assuming structure

## Troubleshooting

### mysql executable not found
- Ask user for their database installation location
- Search common paths: WAMP, XAMPP, Homebrew, native installations
- Check if MySQL/MariaDB service is installed
- Verify version-specific path (e.g., `mysql8.0.27`, `mariadb11.5.2`)

### Connection refused
- Verify MySQL/MariaDB service is running
- Check that port 3306 (or configured port) is not blocked
- Confirm credentials in config file are correct
- Test with root user first if available

### Permission denied
- Ensure database user has appropriate privileges
- Check if user account is active in MySQL/MariaDB
- Verify password is correct in config file

### Command syntax errors
- Windows PowerShell requires `&` before executable path with spaces
- Linux/macOS uses direct command invocation
- Ensure proper quoting of paths with spaces

## Database Schema Updates

When schema changes are needed, SQL migration files should be placed in:
```
db/[project]_updates.sql
```

Always backup before applying schema changes.

## Configuration File Format

The `src/app/cfg/db.php` file follows this structure:

```php
<?php
$data=array(
	"host"=>"localhost",
	"db"=>"database_name",
	"user"=>"db_user",
	"pass"=>"db_password",
	"port"=>"3306",
);
?>
```

AI tools should parse this file to extract connection parameters.

## Database Not Found or Unreachable

If the AI tool cannot establish a database connection, it should:

1. **Check configuration exists:**
   - Verify `src/app/cfg/db.php` file exists
   - Confirm the file contains valid database credentials
   - Check that required fields (host, db, user, pass, port) are present

2. **Warn the user clearly:**
   ```
   ⚠️ DATABASE CONFIGURATION NOT ESTABLISHED
   
   The database connection could not be established. This could mean:
   - Database credentials have not been configured yet
   - MySQL/MariaDB service is not running
   - Database does not exist yet
   - Connection parameters are incorrect
   
   Please ensure:
   1. Your web server (WAMP/XAMPP/etc.) is running
   2. MySQL/MariaDB service is active
   3. Database has been created and configured
   4. Credentials in src/app/cfg/db.php are correct
   
   If this is a new installation, you may need to:
   - Run database creation scripts from db/ folder
   - Configure database credentials in src/app/cfg/db.php
   - Create the database user and grant appropriate privileges
   ```

3. **Suggest next steps:**
   - Guide user to check service status
   - Recommend reviewing installation documentation
   - Offer to help with database setup scripts if available
   - Ask if user needs help configuring the database

4. **Do not proceed with queries:**
   - Stop attempting database operations
   - Do not suggest code that requires database access
   - Wait for user to resolve connection issues

**Remember:** A missing or unreachable database typically indicates the development environment is not yet fully set up, not necessarily an error in the code.
