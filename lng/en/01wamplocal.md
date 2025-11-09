# 🚀 Getting Started with Meralda using Wamp, phpMyAdmin and VirtualHost

## 1️⃣ Install Wamp
- Download and install [WampServer](https://www.wampserver.com/).
- Verify it works by opening [http://localhost/](http://localhost/) in your browser.

---

## 2️⃣ Clone the repository (with submodules)

Open your terminal (Git Bash or CMD) and type:

```bash
cd C:/myproject
git clone --recursive https://github.com/rodrigovecco/meralda.git
```

> **Note:** Change `C:/myproject` to the folder where you want your project.

---

## 3️⃣ Resulting structure

The repository will be at:

```
C:/myproject/meralda
```

---

## 4️⃣ Configure VirtualHost in Wamp

* Open [http://localhost/add_vhost.php](http://localhost/add_vhost.php) in Wamp.
* Fill in the form:

  * **Name of the Virtual Host:** `meralda.local` (or your preferred name)
  * **Complete absolute path:** `C:/myproject/meralda/src/public_html`
* Wamp will **automatically add** the line to the `hosts` file and the Apache configuration.
* Make sure to:

  * Have **PHP 8.3** (or compatible version) installed in Wamp.
  * Select that version for your new VirtualHost.
* **Restart all Wamp services** to apply the changes.

---

## 5️⃣ Extract thirdparty.zip

* Extract the contents of `thirdparty.zip` to the folder:

```
C:/myproject/meralda/src/
```

---

## 6️⃣ Copy the example app

* Copy all contents from:

```
C:/myproject/meralda/example/demo/app
```

* Paste into:

```
C:/myproject/meralda/src/app
```

---

## 7️⃣ Create the database with phpMyAdmin

* Open [http://localhost/phpmyadmin](http://localhost/phpmyadmin).
* Create a database (for example: `meralda_new`) with collation **utf8mb4_general_ci**.
* Create a user with password and grant all privileges on that database.
* Import the file:

```
C:/myproject/meralda/docs/db/mwphplib.sql
```

---

## 8️⃣ Configure the database connection

Edit the file:

```
C:/myproject/meralda/src/app/cfg/db.php
```

With your data:

```php
<?php
$data = array(
  "host" => "localhost",
  "db"   => "meralda_new",
  "user" => "your_username",
  "pass" => "your_password",
  "port" => "3306",
);
?>
```

---

## 9️⃣ Test in the browser

* Open [http://meralda.local](http://meralda.local).
* Verify that the app loads correctly.

---

✅ Done! Your Meralda development environment should be running on Wamp.
