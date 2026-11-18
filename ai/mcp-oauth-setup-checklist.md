# MCP con OAuth: qué montar en un sitio nuevo

Checklist para dejar un MCP Meralda funcionando con un conector que **obtiene su
token solo** (Claude, y cualquier cliente OAuth 2.1). Escrito porque hacerlo
llevó horas tres veces — lkautomotriz, Money Monks y fractureintime — y siempre
faltó la misma pieza distinta.

Contexto de los documentos: `docs/ai/well-known-oauth-files.md` (qué son los
dos documentos) y `docs/ai/mcp-claude-connector-troubleshooting.md` (los ocho
fallos conocidos). Esto es la **secuencia**, no la teoría.

---

## 0. Antes de empezar: decidir dos cosas

- [ ] **¿OAuth abierto o cerrado?** Con `registration_endpoint` publicado
      (RFC 7591) cualquier cliente se registra solo. Sin él, un conector que
      exige registro automático no funciona y hay que darle un `client_id` a mano.
      Lo que protege el sitio no es quién registra sino **quién aprueba**: sin
      login + consentimiento no hay token.
- [ ] **¿Qué scopes?** NO puede quedar vacío, y esto costó una tarde. Ver la
      sección 3-bis: con `scopes_supported: []` el cliente no pide permiso
      ninguno, el consentimiento muestra *"El cliente no solicitó permisos
      específicos"*, y al autorizar responde
      `Debes conceder al menos un permiso para continuar` — sin forma de
      continuar. Hay que publicar al menos el permiso que las tools necesitan.

---

## 1. Base de datos

- [ ] Las tablas `oauth_clients` y `oauth_auth_codes` existen.

```php
// comprobación rápida por CLI
$db = $ap->get_submanager("db");
foreach (array("oauth_clients","oauth_auth_codes") as $t) { ... SHOW TABLES LIKE ... }
```

Las crean las migraciones del módulo `meralda`. Si faltan:
`./ws.sh` no las crea — se aplican desde **Configuration → Migraciones de BD**.

Síntoma si faltan: `/oauth/register` responde
`500 "OAuth is not enabled on this site"`.

---

## 2. Habilitar el manager (PHP)

- [ ] El users manager del proyecto devuelve `new mwmod_mw_oauth_man($this)`.

```php
class mwap_xxx_users_usersman extends mwmod_mw_users2_def_usersman {
    function createOauthMan() { return new mwmod_mw_oauth_man($this); }
}
```

- [ ] El AP del proyecto nombra esa clase:

```php
function get_users_managers_class_name() { return "mwap_xxx_users_usersman"; }
```

**NO** sobreescribir `create_submanager_user()` del framework: ahí viven los
roles, permisos y la protección de fuerza bruta, y una copia se desactualiza.

Síntoma si falta: `/oauth/token` y `/oauth/register` existen pero responden 500,
y el consentimiento dice que OAuth no está disponible.

---

## 3. Los endpoints (`/oauth/`)

Tres archivos, mismos nombres en todos los proyectos:

- [ ] `public_html/oauth/init.php`
- [ ] `public_html/oauth/service.php`
- [ ] `public_html/oauth/.htaccess`

**LA TRAMPA**: `init.php` incluye el bootstrap del sitio. Contar la profundidad.

```
public_html/oauth/init.php            →  dirname(dirname(__FILE__))   ← DOS
public_html/service/mcp/init.php      →  dirname×3                    ← TRES
```

Copiar el de `service/mcp/` sin ajustar resuelve a `~/init.php`, el include falla,
la aplicación no arranca, y **el único síntoma es un 500 con cuerpo vacío**. El
log dice `include(/home/USUARIO/init.php): Failed to open stream` — prestar
atención a la ruta, no al mensaje.

Verificar:

```bash
curl -s -o /dev/null -w '%{http_code}\n' -X POST https://HOST/oauth/register \
  -H 'Content-Type: application/json' \
  -d '{"client_name":"probe","redirect_uris":["https://example.com/cb"]}'
# 201 + client_id  →  bien
# 500 vacío        →  init.php está un nivel de más (o de menos)
```

Borrar el cliente de prueba al terminar: queda en `oauth_clients` y aparece en
la pantalla de consentimiento como si fuera real.

---

## 3-bis. Los scopes: `[]` NO ES "sin restricción", ES UN FLUJO MUERTO

- [ ] `scopes_supported` en RFC 8414 **no vacío**, con el permiso que las tools
      necesitan.
- [ ] `scopes_supported` en RFC 9728 con la misma lista.

**EL ERROR.** Dejar `scopes_supported: []` parece razonable —"los permisos
reales son la intersección, así que no prometo nada"— y es un callejón sin
salida:

```
cliente lee scopes_supported: []   →  no pide `scope` en la autorización
consent recibe scope vacío          →  buildScopeInfo([]) = []
consent muestra                    →  "El cliente no solicitó permisos específicos"
usuario pulsa Authorize            →  grantedScope = []
                                   →  error no_permissions
                                   →  "Debes conceder al menos un permiso para continuar"
```

No hay forma de conceder nada porque no hay nada que marcar. El conector no
puede terminar. **No es un bug del framework: es el framework negándose a
emitir un token sin permisos, y el documento no ofreció ninguno.**

**LO QUE EL CONSENT HACE CON EL SCOPE** (`mwmod_mw_users_ui_oauthconsent_main`):

| paso | código |
|---|---|
| parsea `scope` (separado por espacios) | `parseScope($scopeRaw)` |
| clasifica cada código | `buildScopeInfo()` → `ok` / `warning` / `unknown` |
| intersección al autorizar | marcado ∩ solicitado ∩ `$user->man->allow($code)` |

`scope` no son nombres inventados: son **códigos del catálogo de permisos** del
proyecto (`$user->man->get_permission_man()->get_items()`). Un código que no
está en el catálogo sale `unknown` y no se puede marcar.

**CUÁNTOS CÓDIGOS: UNO POR COSA QUE SE PUEDE HACER, NO UNO POR SITIO.**

La tentación es un solo `admin`. El problema es que el consentimiento entonces
no puede decir **qué** se está concediendo, y el usuario aprueba a ciegas. Las
dimensiones que hay que separar, si el sitio tiene más de una:

| dimensión | por qué |
|---|---|
| **área** (draft / live) | escribir el borrador es recuperable; escribir lo que leen los visitantes es público en el instante |
| **leer vs escribir** | un cliente que resume una página no necesita poder sobrescribirla |
| **mensajes del formulario** | traen nombre y dirección de un visitante: leerlos es otro acto, y aprobar un cliente que mantiene el sitio no debe darle la bandeja |

En fractureintime quedaron cinco:

```
ws_draft_write   ws_draft_read
ws_live_write    ws_live_read
contact_read
```

**DÓNDE SE DECLARAN, Y EL ORDEN IMPORTA.** En el usersman del proyecto, pero
**no en el constructor**: `createRolsAndPermissions()` corre antes de
`set_permissions_man()`, así que un permiso agregado ahí se agrega a `null` y
desaparece sin error.

```php
// 1. el usersman del proyecto declara códigos + etiquetas + el mapeo
class mwap_afit_users_usersman extends mwmod_mw_users2_def_usersman {
    const PERM_DRAFT_WRITE = 'ws_draft_write';
    // ...
    static function area_permission_labels() { return array(/* code => label */); }
    static function permission_code_for_area($role, $write = true) { /* ... */ }
    function add_area_permissions() { /* add_item() por cada uno + init_rols() */ }
}

// 2. el AP lo llama DESPUÉS del constructor del framework
function create_submanager_user() {
    $subman = parent::create_submanager_user();
    if ($subman && method_exists($subman, 'add_area_permissions')) {
        $subman->add_area_permissions();
    }
    return $subman;
}
```

**EL MAPEO ES UNA SOLA FUNCIÓN.** Las tools preguntan
`permission_code_for_area($role, $write)` y el documento publica
`array_keys(area_permission_labels())`. Un typo no puede hacer que el
consentimiento ofrezca un código que las tools nunca revisan.

Verificar que los códigos existen **y que la cuenta los tiene**:

```php
$u = $ap->get_submanager("user");
foreach ($u->get_permission_man()->get_items() as $it) { echo $it->get_code(), "\n"; }

$user = $u->get_user_by_idname("...");
var_export($user->allow("ws_draft_write"));   // true
```

Ojo: `$u->allow(...)` en CLI da `false` aunque el permiso exista — no hay
usuario en sesión. Hay que preguntarle al **usuario**, no al manager.

**QUÉ PUBLICAR.** Los códigos que las tools realmente exigen:

- tool con `getRequiredPermission()` vacío → **no exige permiso propio**, pero
  el consent igual necesita al menos uno, así que hay que publicar el que la
  cuenta ya tiene.
- tool con un código concreto → publicar ese, y nada más. Publicar de más es
  prometer permisos que ninguna tool usa.

**EL ERROR DE SIMETRÍA.** Publicar un código que ninguna tool exige "para más
adelante" hace que el consentimiento muestre una casilla que no cambia nada —
peor que no mostrarla, porque el usuario cree que concedió algo. Si el código
todavía no gobierna ninguna operación, decirlo en la etiqueta o no publicarlo.

---

## 4. Los dos documentos de descubrimiento

- [ ] `public_html/.well-known/oauth-protected-resource.php`  (RFC 9728)
- [ ] `public_html/.well-known/oauth-authorization-server.php` (RFC 8414)
- [ ] `public_html/.well-known/.htaccess`

**LAS URLS DEBEN SER ABSOLUTAS.** Un documento con rutas relativas es peor que
ninguno: el cliente no resuelve nada, compara `resource` carácter por carácter
con la URL que está llamando, no coincide, y reporta *"couldn't reach the
server"* con el servidor respondiendo 401 perfectamente. Todos miran el
firewall y el problema está en el JSON.

Construirlas en PHP, nunca como JSON estático:

- `resource` = la URL exacta del endpoint MCP, **tomada de la misma constante**
  que lo monta. Una barra de diferencia y se rechaza el documento.
- origen = `HTTP_HOST` del request (o `mcp_authorization_server_url` en
  `cfg.ini` si hay un proxy adelante).
- si el origen no se puede determinar: **devolver 500 con la razón**, no un 200
  con basura.

**LAS DOS FORMAS DE CADA RUTA.** Un cliente pide la ruta del recurso sufijada:

```
/.well-known/oauth-protected-resource
/.well-known/oauth-protected-resource/service/mcp/NOMBRE     ← esta también
/.well-known/oauth-authorization-server
/.well-known/oauth-authorization-server/service/mcp/NOMBRE   ← y esta
```

Servir solo la forma pelada hace que el cliente adivine, y la adivinanza es el
fallo 6 del doc de troubleshooting.

Verificar (las cuatro):

```bash
for p in /.well-known/oauth-protected-resource \
         /.well-known/oauth-protected-resource/service/mcp/NOMBRE \
         /.well-known/oauth-authorization-server \
         /.well-known/oauth-authorization-server/service/mcp/NOMBRE ; do
  printf '%-70s %s\n' "$p" "$(curl -s -o /dev/null -w '%{http_code}' https://HOST$p)"
done
```

---

## 5. La pantalla de consentimiento — LA QUE SIEMPRE SE OLVIDA

- [ ] `create_subinterface_oauthconsent()` registrado en el admin del proyecto.

```php
function create_subinterface_oauthconsent() {
    return new mwmod_mw_users_ui_oauthconsent_main("oauthconsent", $this);
}
```

La clase viene con el framework y la URL la publica el documento de RFC 8414
(`authorization_endpoint`). **Si no está registrada, esa URL renderiza el
formulario de login y nada más**: el flujo no se puede completar.

El síntoma es cruel porque todo lo demás responde bien: el registro da 201, el
descubrimiento da 200, y el conector se queda esperando.

Verificar **con sesión iniciada**, que es como la abre el conector:

```
https://HOST/admin/index.php?ui=oauthconsent
```

- con sesión → pantalla de autorización (nombre del token, permisos, Authorize/Deny)
- sin sesión → login (correcto: es el muro, no un fallo)

---

## 6. El servidor MCP acepta los dos tokens

- [ ] `loginUserByToken()` acepta el `oa1.*` derivado, no solo el JWT del panel.

Si solo acepta el JWT: el intercambio de token devuelve **200 con un access
token real**, y después **todas** las llamadas MCP dan 401. Es el fallo 8 del
doc de troubleshooting.

---

## 7. Despliegue

- [ ] `.well-known` y `oauth` están en `PUBLIC_ITEMS` de `updategit.sh`.

**El script vive en el servidor y no se actualiza solo.** Un `.sh` editado en
local no cambia nada hasta subirlo. Si no, el deploy dice "complete" y las
carpetas nuevas no aparecen:

```
-> oauth
-> outofservice
...
[Done] Deploy complete.
```

Si `-> oauth` no está en la lista, el servidor tiene el script viejo.

- [ ] `public_html/.well-known/.htaccess` no lo pisa otra regla
      (el docroot tiene `RewriteEngine off`; `.well-known` enciende el suyo).

---

## 8. Verificación final, en este orden

```
1. DCR            POST /oauth/register                    → 201 + client_id
2. token malo     POST /oauth/token (código inválido)     → 400 invalid_grant
3. token GET      GET  /oauth/token                       → 405
4. consent        GET  ?ui=oauthconsent CON sesión        → pantalla, no login
5. MCP sin token  POST /service/mcp/NOMBRE                → 401 + WWW-Authenticate
6. conector       agregar la URL en el cliente            → completa el flujo
```

Si el paso 4 devuelve el login **teniendo sesión**, falta la sección 5.

---

## Errores que ya cometimos, con su forma exacta

| síntoma | causa | dónde |
|---|---|---|
| 500 con cuerpo vacío en `/oauth/*` | `init.php` con un `dirname()` de más | §3 |
| "couldn't reach the server" con el server en 401 | `authorization_servers` ausente o URLs relativas | §4 |
| 201 en registro y espera infinita | consentimiento no registrado | §5 |
| 200 al cambiar el código y 401 en todo lo demás | el endpoint no lee el `oa1.*` | §6 |
| deploy "complete" sin las carpetas nuevas | `updategit.sh` del servidor desactualizado | §7 |
| 301 en `POST /oauth/token/` | `DirectorySlash` de mod_rewrite | §3 |
| "El cliente no solicitó permisos específicos" + "Debes conceder al menos un permiso" | `scopes_supported: []` | §3-bis |
| permiso agregado que no aparece en el catálogo | declarado en el constructor, antes de `set_permissions_man()` | §3-bis |
| casilla de permiso que no cambia nada | código publicado que ninguna tool exige | §3-bis |
