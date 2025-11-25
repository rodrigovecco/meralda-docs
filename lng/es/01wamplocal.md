# 🚀 Instructivo para iniciar un nuevo proyecto Meralda con Wamp, phpMyAdmin y VirtualHost

## 1️⃣ Instalar Wamp
- Descarga e instala [WampServer](https://www.wampserver.com/).
- Verifica que funcione abriendo [http://localhost/](http://localhost/) en tu navegador.

---

## 2️⃣ Clonar el repositorio (con submódulos)

Abre la terminal (Git Bash o CMD) y escribe:

```bash
cd C:/miproyecto
git clone --recursive https://github.com/rodrigovecco/meralda.git
````

> **Nota:** Cambia `C:/miproyecto` por la carpeta donde quieras tu proyecto.

---

## 3️⃣ Estructura resultante

El repositorio quedará en:

```
C:/miproyecto/meralda
```

---

## 4️⃣ Configurar VirtualHost en Wamp

* Abre [http://localhost/add\_vhost.php](http://localhost/add_vhost.php) en Wamp.
* Llena el formulario:

  * **Name of the Virtual Host:** `meralda.local` (o el nombre que prefieras)
  * **Complete absolute path:** `C:/miproyecto/meralda/src/public_html`
* Wamp **agregará automáticamente** la línea en el archivo `hosts` y la configuración en Apache.
* Asegúrate de:

  * Tener **PHP 8.3** (o la versión compatible) instalada en Wamp.
  * Seleccionar esa versión para tu nuevo VirtualHost.
* **Reinicia todos los servicios de Wamp** para aplicar los cambios.

---

## 5️⃣ Descomprimir thirdparty.zip

* Extrae el contenido de `thirdparty.zip` en la carpeta:

```
C:/miproyecto/meralda/src/
```

## 5️⃣ Inicializar submódulos (Git)

Este proyecto ya no usa `thirdparty.zip`. Las dependencias y recursos externos se manejan ahora mediante submódulos Git (hay dos submódulos principales que se inicializan en la raíz del repositorio). Si clonaste el repo sin la opción `--recursive` o si acabas de obtener cambios, inicializa y actualiza los submódulos con:

```bash
cd C:/miproyecto/meralda
git submodule update --init --recursive
```

Esto descargará y colocará los submódulos en las rutas que el repositorio define. Puedes comprobar el estado de los submódulos con:

```bash
git submodule status --recursive
```

Si usas Windows y tu Git no está configurado para seguir submódulos automáticamente, ejecuta los comandos anteriores desde Git Bash o una terminal con soporte Git.

---

## 6️⃣ Copiar la app de ejemplo

* Copia todo el contenido de:

```
C:/miproyecto/meralda/example/demo/app
```

* Pégalo en:

```
C:/miproyecto/meralda/src/app
```

---

## 7️⃣ Crear la base de datos con phpMyAdmin

* Abre [http://localhost/phpmyadmin](http://localhost/phpmyadmin).
* Crea una base de datos (por ejemplo: `meralda_new`) con cotejamiento **utf8mb4\_general\_ci**.
* Crea un usuario con contraseña y dale todos los privilegios sobre esa base.
* Importa el archivo:

```
C:/miproyecto/meralda/db/mwphplib.sql
```

---

## 8️⃣ Configurar la conexión a la base de datos

Edita el archivo:

```
C:/miproyecto/meralda/src/app/cfg/db.php
```

Con tus datos:

```php
<?php
$data = array(
  "host" => "localhost",
  "db"   => "meralda_new",
  "user" => "tu_usuario",
  "pass" => "tu_contraseña",
  "port" => "3306",
);
?>
```

---

## 9️⃣ Probar en el navegador

* Abre [http://meralda.local](http://meralda.local).
* Verifica que cargue correctamente la app.

---

✅ ¡Listo! Tu entorno de desarrollo Meralda debería estar funcionando en Wamp.
