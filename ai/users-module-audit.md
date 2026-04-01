# Auditoría del Módulo de Usuarios

> **Fecha**: 2026-03-31  
> **Módulo**: `src/mwap/modules/mw/users/`  
> **Estado**: Submódulo git compartido — NO MODIFICAR directamente

---

## ⭐ NUEVO: Módulo users2

Se ha creado `src/mwap/modules/mw/users2/` como capa moderna sobre `users`:

| Archivo | Extiende | Mejoras |
|---------|----------|---------|
| `usersmanabs.php` | `mwmod_mw_users_def_usersman` | Type hints, hooks, métodos helper |
| `usersman.php` | `usersmanabs` | Implementación concreta |
| `userabs.php` | `mwmod_mw_users_user` | Type hints, `toArray()`, `toJson()` |
| `user.php` | `userabs` | Implementación concreta |
| `userdata.php` | `mwmod_mw_users_def_userdata` | Validaciones mejoradas |
| `passpolicy.php` | `mwmod_mw_users_passpolicy` | Valores seguros, generador |

**Uso**: Ver [users2/README.md](../../src/mwap/modules/mw/users2/README.md)

---

## 1. Jerarquía de Clases

### 1.1 Manager (Gestor de Usuarios)

```
mw_apsubbaseobj
└── mwmod_mw_users_base_usersmanabs     [base/usersmanabs.php] — Lógica core (800+ líneas)
    └── mwmod_mw_users_usersmanabs      [usersmanabs.php] — Bridge vacío (abstract)
        └── mwmod_mw_users_usersman     [usersman.php] — Implementación mínima
            ├── mwmod_mw_users_def_usersman  [def/usersman.php] — **RECOMENDADO para extender**
            └── mwmod_mw_users_org_usersman  [org/usersman.php] — Variante con grupos
```

### 1.2 Item (Usuario)

```
mw_apsubbaseobj
└── mwmod_mw_users_userabs              [userabs.php] — Clase base (~450 líneas)
    └── mwmod_mw_users_user             [user.php] — Implementación concreta
        └── mwmod_mw_users_org_user     [org/user.php] — Variante organización
```

### 1.3 Subsistemas

| Subsistema | Clase Principal | Ubicación |
|------------|-----------------|-----------|
| **Roles** | `mwmod_mw_users_rols_rolsman` | [rols/rolsman.php](../../src/mwap/modules/mw/users/rols/rolsman.php) |
| **Permisos** | `mwmod_mw_users_permissions_permissionsman` | [permissions/permissionsman.php](../../src/mwap/modules/mw/users/permissions/permissionsman.php) |
| **Grupos** | `mwmod_mw_users_groups_man` | [groups/man.php](../../src/mwap/modules/mw/users/groups/man.php) |
| **JWT** | `mwmod_mw_users_jwt_man` | [jwt/man.php](../../src/mwap/modules/mw/users/jwt/man.php) |
| **Tokens** | `mwmod_mw_users_tokens_man` | [tokens/man.php](../../src/mwap/modules/mw/users/tokens/man.php) ⚠️ DEPRECATED |
| **UserData** | `mwmod_mw_users_userdata` | [userdata.php](../../src/mwap/modules/mw/users/userdata.php) |
| **PassPolicy** | `mwmod_mw_users_passpolicy` | [passpolicy.php](../../src/mwap/modules/mw/users/passpolicy.php) |
| **Mailer** | `mwmod_mw_users_usermailer` | [usermailer.php](../../src/mwap/modules/mw/users/usermailer.php) |

---

## 2. Deuda Técnica

### 🔴 Severidad Alta

| Issue | Ubicación | Impacto |
|-------|-----------|---------|
| **Sistema tokens deprecated** | [tokens/man.php L2](../../src/mwap/modules/mw/users/tokens/man.php) | Comentario: "use mwmod_mw_users_jwt_man instead". Código muerto que podría usarse por error. |
| **Sin type hints PHP 7+** | Todo el módulo | Dificulta IDE, análisis estático, y mantenimiento. 400+ funciones sin tipos. |
| **createUserSelRegister() vacío** | [def/userdata.php L57](../../src/mwap/modules/mw/users/def/userdata.php) | Comentario stub "ver mwap_pastipan_clients_user_userdata" — código incompleto de otro proyecto. |

### 🟡 Severidad Media

| Issue | Ubicación | Impacto |
|-------|-----------|---------|
| **Roles hardcodeados** | [base/usersmanabs.php](../../src/mwap/modules/mw/users/base/usersmanabs.php) | Prefijo `rol_` fijo. ALTER TABLE dinámico para crear columnas de roles — frágil ante cambios de esquema. |
| **Sin validación out-of-office circular** | [userabs.php L60](../../src/mwap/modules/mw/users/userabs.php) | `get_out_of_office_replacement_id()` no detecta cadenas circulares (A→B→A). |
| **Métodos con lógica obsoleta** | [base/usersmanabs.php L287](../../src/mwap/modules/mw/users/base/usersmanabs.php) | `create_new_user()` está deshabilitada (`return false;` al inicio) pero no marcada deprecated. |
| **Dependencia implícita de bruteforce** | [base/usersmanabs.php](../../src/mwap/modules/mw/users/base/usersmanabs.php) | Accede a `$mainap->get_submanager("bruteforce")` sin validar existencia consistentemente. |

### 🟢 Severidad Baja

| Issue | Ubicación | Impacto |
|-------|-----------|---------|
| **ServiceMode parcialmente implementado** | [base/usersmanabs.php L30](../../src/mwap/modules/mw/users/base/usersmanabs.php) | Variable `$ServiceMode=false` sugiere auth API, pero lógica incompleta. JWT es sistema separado. |
| **Comentarios en español inconsistentes** | Varios archivos | Mezcla español/inglés en PHPDoc y comentarios. |
| **Variables públicas sin encapsular** | Múltiples clases | Ej: `$pass_min_len`, `$firstAndLastNameMode` en userdata.php — debería usar getters/setters. |

---

## 3. Puntos de Extensión

### 3.1 Métodos Factory (Override en subclase)

```php
// En tu clase que extiende mwmod_mw_users_def_usersman:

function createJwtMan()           // → tu implementación JWT personalizada
function createRolsAndPermissions() // → definir roles/permisos en código (alternativa a script)
function create_user_data_man()   // → tu clase userdata personalizada
function create_user_mailer()     // → tu clase mailer personalizada  
function create_pass_policy()     // → tu clase passpolicy personalizada
function create_groups_man()      // → activar grupos de usuarios
function new_user($tblitem)       // → tu clase user personalizada
```

### 3.2 Hooks en UserData

```php
// En tu clase que extiende mwmod_mw_users_def_userdata:

function setRealNameData(&$nd)              // → lógica nombre completo
function allowNewUserAutoLogin()            // → auto-login tras registro
function save_full_data($input,$user,$msg)  // → guardar campos adicionales
function save_full_data_extra($input,$user,$msg) // → post-save hook
function get_assignable_rols()              // → filtrar roles asignables
function get_not_allowed_data_change_keys() // → campos protegidos
```

### 3.3 Configuración por Propiedades

```php
// En tu clase manager:
$this->disableUserIPsessionValidations = true;  // Deshabilitar validación IP
$this->current_user_cookie_enabled = false;     // Deshabilitar cookie

// En tu clase passpolicy:
$policy->pass_min_len = 12;
$policy->must_contain_uppers = true;
$policy->must_contain_numbers = true;
$policy->change_password_on_remember_ui_enabled = true;

// En tu clase userdata:
$data->firstAndLastNameMode = true;
$data->admin_user_id_enabled = true;
```

### 3.4 Script de Configuración (Patrón Actual)

Archivo `src/app/managers/user.php` configura instancia vía include:

```php
<?php
$subman = new mwmod_mw_users_def_usersman($this, "users");
$subman->set_disable_login_after_fail(true, 5, 3);
$subman->enable_login_session_token(true);

// Roles
$rolsman = new mwmod_mw_users_rols_rolsman($subman);
$subman->set_rols_man($rolsman);
$rolsman->add_item(new mwmod_mw_users_rols_rol("admin", "Administrador", $rolsman));

// Permisos
$permissionsman = new mwmod_mw_users_permissions_permissionsman($subman, $rolsman);
$subman->set_permissions_man($permissionsman);
$permissionsman->add_item(new mwmod_mw_users_permissions_permission(
    "admin", "Administrar", "admin", $permissionsman
));
$permissionsman->init_rols();
```

---

## 4. Tests

⚠️ **No se encontraron tests unitarios** para el módulo de usuarios.

Búsquedas realizadas:
- `**/tests/**/*user*.php` → Sin resultados
- `**/test/**/*user*.php` → Sin resultados

**Recomendación**: Crear tests antes de extender para validar que las extensiones no rompen funcionalidad existente.

---

## 5. Flujo de Autenticación (Login)

### 5.1 Diagrama de Flujo Principal

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    exec_login_and_user_validation()                     │
│                    [base/usersmanabs.php L1012]                         │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    ▼                               ▼
            ¿$_REQUEST["logout"]?           ¿$_REQUEST["login_userid"]?
                    │                               │
                    ▼                               ▼
              logout()                    ┌─────────────────────┐
                                          │ VALIDACIONES PREVIAS│
                                          └─────────────────────┘
                                                    │
                    ┌───────────────────────────────┼───────────────────────────────┐
                    ▼                               ▼                               ▼
        check_login_allowed_by_timeout()   login_session_token_check()      bruteForceMan checks
        (bloqueo temporal por fallos)      (CSRF token de sesión)           (blacklist/whitelist IP)
                    │                               │                               │
                    └───────────────────────────────┴───────────────────────────────┘
                                                    │
                                                    ▼
                                    ┌───────────────────────────┐
                                    │    login($username,$pass)  │
                                    │    [base/usersmanabs.php]  │
                                    └───────────────────────────┘
                                                    │
                    ┌───────────────────────────────┼───────────────────────────────┐
                    ▼                               ▼                               ▼
        get_user_by_idname($username)      check_login_pass($pass)           can_login()
        (buscar usuario en DB)             (verificar contraseña)            (¿usuario activo?)
                                                    │
                                                    ▼
                                    ┌───────────────────────────┐
                                    │     login_user($user)      │
                                    └───────────────────────────┘
                                                    │
                    ┌───────────────────────────────┴───────────────────────────────┐
                    ▼                                                               ▼
            ¿ServiceMode?                                                   Modo normal
                    │                                                               │
                    ▼                                                               ▼
        set_currentuser_obj($user)                              set_current_session_var($user)
        (sin sesión HTTP)                                       → $_SESSION[id, token, ip]
                                                                → Cookie con token
                                                                → user->on_login()
                                                                → exec_user_validation()
```

### 5.2 Métodos de Autenticación

| Método | Archivo | Descripción |
|--------|---------|-------------|
| `exec_login_and_user_validation()` | [base/usersmanabs.php L1012](../../src/mwap/modules/mw/users/base/usersmanabs.php) | Punto de entrada principal para UI web |
| `login($username, $pass)` | [base/usersmanabs.php L770](../../src/mwap/modules/mw/users/base/usersmanabs.php) | Login clásico usuario/contraseña |
| `login_user($user)` | [base/usersmanabs.php L798](../../src/mwap/modules/mw/users/base/usersmanabs.php) | Login directo con objeto usuario |
| `login_user_service_mode($user)` | [base/usersmanabs.php L792](../../src/mwap/modules/mw/users/base/usersmanabs.php) | Login para APIs (sin sesión HTTP) |
| `check_login_pass($pass)` | [userabs.php L505](../../src/mwap/modules/mw/users/userabs.php) | Verificar contraseña en usuario |

### 5.3 Validación de Sesión

```php
// exec_user_validation() [base/usersmanabs.php L728]
// Ejecutado en cada request para validar sesión activa

1. Obtener ID de usuario de $_SESSION
2. Cargar usuario de BD
3. Verificar token en cookie (si habilitado)
4. Verificar IP coincide (si habilitado)
5. set_currentuser_obj($user)
```

**Variables de sesión** (nombre por defecto: `__current_user_data`):
```php
$_SESSION["__current_user_data"]["id"]    // ID del usuario
$_SESSION["__current_user_data"]["token"] // Token de validación
$_SESSION["__current_user_data"]["ip"]    // IP del cliente
```

### 5.4 Protección contra Fuerza Bruta

**Nivel 1 — Por sesión** (built-in):
```php
$man->set_disable_login_after_fail(true, 5, 3);
// Parámetros: enabled, timeout_seconds, max_tries
// Bloquea login en sesión actual por 5 segundos tras 3 fallos
```

**Nivel 2 — Por IP** (opcional, módulo bruteforce):
```php
// Si existe $mainap->get_submanager("bruteforce"):
// - Blacklist permanente de IPs
// - Bloqueo temporal por actividad sospechosa
// - Whitelist para IPs confiables
```

### 5.5 Token de Sesión (CSRF)

```php
// Habilitación:
$man->enable_login_session_token(true);

// Genera token único por sesión para evitar CSRF
// El formulario de login debe incluir:
<input type="hidden" name="login_token" value="<?php echo $man->get_login_session_token(); ?>">.
```

### 5.6 Autenticación JWT (APIs)

**Flujo JWT** (para servicios REST):
```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Cliente App   │────▶│  Authorization: │────▶│  jwtMan->       │
│                 │     │  Bearer <token> │     │  validateAnd... │
└─────────────────┘     └─────────────────┘     │  RetrieveUser() │
                                                └─────────────────┘
                                                        │
                                                        ▼
                                          login_user_service_mode($user)
```

**Implementación** ([jwt/man.php](../../src/mwap/modules/mw/users/jwt/man.php)):
```php
// Crear token para usuario
$token = $man->jwtMan->createTokenForUser($user);

// Validar token y obtener usuario
$user = $man->jwtMan->validateAndRetrieveUser($tokenFromHeader);

// El token incluye:
[
    "user_id" => 123,
    "exp" => timestamp,           // Expiración (90 días por defecto)
    "s" => hash(password_hash),   // Vinculado a password actual
    "appid" => "...",             // ID de app (si habilitado)
]
```

**Características de seguridad JWT**:
- Token invalidado automáticamente si usuario cambia contraseña
- Expiración configurable (default: 90 días, o `neverExpires=true`)
- Secret key auto-generada y almacenada en `mwmod_mw_data_secret`
- Soporte para múltiples apps (`appIDEnabled`)

### 5.7 Encriptación de Contraseñas

```php
// passpolicy.php L186-200

function check_crypted_password($password_entered, $password_hash) {
    // Usa password_verify() de PHP (bcrypt por defecto)
    return password_verify($password_entered, $password_hash);
}

function crypt_password($password) {
    // Usa password_hash() con PASSWORD_DEFAULT
    return password_hash($password, PASSWORD_DEFAULT);
}
```

**Modos de contraseña** (`pass_secure_mode`):
| Valor | Descripción |
|-------|-------------|
| 1 | Siempre encriptada (recomendado) |
| 2 | Opcional — checkbox "contraseña segura" |
| 3 | Nunca encriptada (legacy, NO usar) |

⚠️ **Deuda técnica**: El campo `secpass` en tabla `users` determina si la contraseña está hasheada. Esto permite contraseñas en texto plano para usuarios antiguos.

### 5.8 Puntos de Entrada

| Archivo | Uso | Método |
|---------|-----|--------|
| [admin/index.php](../../src/public_html/admin/index.php) | Panel admin | `$ui->exec_user_validation()` |
| [admin/logout.php](../../src/public_html/admin/logout.php) | Cerrar sesión | `$ui->exec_user_logout()` |
| [service/user/root.php](../../src/mwap/modules/mw/service/user/root.php) | APIs REST | `loginUserByToken()` + JWT |
| [install/loginasuser.php](../../src/mwap/modules/mw/ui/install/loginasuser.php) | Test instalación | `login()` directo |

### 5.9 Eventos Post-Login

```php
// user.php
function on_login() {
    $nd["last_login_date"] = date('Y-m-d H:i:s');
    $nd["last_login_ip"] = $_SERVER['REMOTE_ADDR'];
    $this->tblitem->do_update($nd);
}

// Extensible — override para agregar:
// - Logging adicional
// - Notificaciones
// - Verificación 2FA (no implementado en base)
```

### 5.10 Consideraciones de Seguridad

| Aspecto | Estado | Notas |
|---------|--------|-------|
| Contraseñas hasheadas | ✅ Soportado | Usa `password_hash()` PHP nativo |
| Validación IP sesión | ✅ Configurable | `disableUserIPsessionValidations` |
| Token CSRF login | ✅ Configurable | `enable_login_session_token()` |
| Brute force por sesión | ✅ Built-in | `set_disable_login_after_fail()` |
| Brute force por IP | ⚠️ Módulo externo | Requiere `bruteforce` submanager |
| 2FA/MFA | ❌ No implementado | Extensible vía `on_login()` |
| OAuth/SSO | ❌ No implementado | Extensible |
| Rate limiting global | ❌ No implementado | Debe hacerse a nivel servidor |

---

## 6. API Pública Estable

### 5.1 Manager — Métodos Críticos (NO cambiar signature)

```php
// Obtención de usuarios
$man->get_user($id)                    // Usuario por ID
$man->get_user_by_idname($idname)      // Usuario por username
$man->get_current_user()               // Usuario logueado
$man->get_all_useres()                 // Todos los usuarios
$man->get_all_active_users()           // Solo activos
$man->is_user_logged()                 // ¿Hay sesión?

// Autenticación
$man->login($username, $pass)          // Login clásico
$man->login_user($user)                // Login directo
$man->logout()                         // Cerrar sesión
$man->exec_user_validation()           // Validar sesión actual

// Permisos
$man->allow($action, $params)          // Verificar permiso
$man->get_permission_man()             // Acceder a permisos
$man->get_rols_man()                   // Acceder a roles

// Subsistemas
$man->get_user_data_man()              // Formularios/validación
$man->get_pass_policy()                // Política contraseñas
$man->get_user_mailer()                // Emails
$man->get_groups_man()                 // Grupos
$man->get_tblman()                     // Tabla DB
```

### 6.2 User — Métodos Críticos

```php
// Identidad
$user->get_id()                        // ID numérico
$user->get_idname()                    // Username
$user->get_real_name()                 // Nombre completo
$user->get_email()                     // Email validado

// Estado
$user->is_active()                     // ¿Activo?
$user->is_main_user()                  // ¿Admin principal?
$user->can_login()                     // ¿Puede loguearse?

// Roles/Permisos
$user->has_rol_code($cod)              // ¿Tiene rol?
$user->get_rols()                      // Todos los roles
$user->allow($action, $params)         // ¿Tiene permiso?

// Datos
$user->get_public_tbl_data()           // Datos sin password
$user->get_data($field)                // Campo específico
```

---

## 7. Recomendaciones

### 7.1 Estrategia de Extensión

```
src/app/
├── managers/
│   ├── user.php                  # Script existente — modificar aquí roles/permisos
│   └── users/                    # NUEVO: crear para extensiones de clase
│       ├── usersman.php          # extends mwmod_mw_users_def_usersman
│       ├── user.php              # extends mwmod_mw_users_user (si necesario)
│       └── userdata.php          # extends mwmod_mw_users_def_userdata
```

### 7.2 Pasos para Extender

1. **Crear clase manager extendida**:
```php
<?php
// src/app/managers/users/usersman.php
class mwap_managers_users_usersman extends mwmod_mw_users_def_usersman {
    
    public function __construct($ap, $tbl, $sessionvar = "__current_user_data") {
        parent::__construct($ap, $tbl, $sessionvar);
    }
    
    // Agregar type hints en overrides
    public function get_user(int $id): ?mwmod_mw_users_user {
        return parent::get_user($id);
    }
    
    // Nuevas funcionalidades
    public function get_users_by_department(int $deptId): array {
        // Tu lógica
    }
}
```

2. **Actualizar script de configuración** (`src/app/managers/user.php`):
```php
<?php
// Cambiar de:
$subman = new mwmod_mw_users_def_usersman($this, "users");
// A:
$subman = new mwap_managers_users_usersman($this, "users");
// Resto igual...
```

3. **Registrar autoloader** si usas prefijo `mwap_` (en `src/app/init.php`):
```php
// El autoloader ya debería manejar mwap_*, verificar configuración
```

### 7.3 Contribuciones al Submódulo (Solo Fixes Universales)

Si encuentras bugs que afectan todos los proyectos:

1. Hacer cambio en `src/mwap/modules/mw/users/`
2. Commit separado en el submódulo
3. Push al repo del submódulo
4. En cada proyecto que use el submódulo: `git submodule update --remote`

**NO contribuir al submódulo**:
- Personalización específica de este proyecto
- Cambios que rompan compatibilidad hacia atrás
- Features que solo necesita este proyecto

---

## 8. Próximos Pasos Sugeridos

| Prioridad | Acción | Esfuerzo |
|-----------|--------|----------|
| 1 | Crear estructura `src/app/managers/users/` | Bajo |
| 2 | Crear clase `mwap_managers_users_usersman` extendiendo `def_usersman` | Bajo |
| 3 | Agregar type hints en métodos overrideados de la extensión | Medio |
| 4 | Crear tests básicos de login/logout con extensión | Medio |
| 5 | Migrar configuración de roles del script a `createRolsAndPermissions()` | Bajo |
| 6 | Implementar funcionalidades nuevas en la extensión | Variable |

---

## Anexo: Archivos del Módulo

```
src/mwap/modules/mw/users/
├── base/
│   └── usersmanabs.php          # Core logic (~800 líneas)
├── def/
│   ├── userdata.php             # Default userdata config
│   └── usersman.php             # Default manager implementation
├── groups/
│   ├── item.php                 # Group item
│   ├── man.php                  # Groups manager
│   └── ui/                      # Groups admin UI
├── jwt/
│   ├── access.php               # JWT access control
│   └── man.php                  # JWT manager (USAR ESTE)
├── list/                        # User list utilities
├── org/
│   ├── user.php                 # Organization user variant
│   ├── userdata.php             # Organization userdata
│   └── usersman.php             # Organization manager
├── permissions/
│   ├── permission.php           # Permission class
│   ├── permissionsman.php       # Permissions manager
│   └── special/                 # Special permissions
├── rols/
│   ├── rol.php                  # Role class
│   ├── rolall.php               # "All" special role
│   ├── rolmainadmin.php         # Main admin role
│   ├── rolpublic.php            # Public role
│   └── rolsman.php              # Roles manager
├── tokens/
│   └── man.php                  # ⚠️ DEPRECATED — usar jwt/
├── ui/
│   ├── myaccount/               # Self-service UI
│   ├── user/                    # Admin user edit UI
│   ├── myaccount.php
│   ├── mydata.php
│   ├── newuser.php
│   ├── user.php
│   └── users.php
├── usermailer/
│   └── def.php                  # Default mailer config
├── util/
│   └── seluserinput.php         # User select input
├── passpolicy.php               # Password policy
├── user.php                     # User item class
├── userabs.php                  # Abstract user base
├── userdata.php                 # User form/validation
├── usermailer.php               # Email orchestration
├── usersman.php                 # Manager implementation
└── usersmanabs.php              # Abstract manager bridge
```
