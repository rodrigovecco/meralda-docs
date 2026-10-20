# Conector MCP de Claude — flujo OAuth y troubleshooting

Notas de depuración del conector personalizado de Claude.ai contra el MCP server
de Meralda (`https://<dominio>/service/mcp/`). Documenta el flujo completo
OAuth 2.1 + PKCE → transporte Streamable HTTP y los fallos reales encontrados con
sus correcciones.

Relacionado: [well-known-oauth-files.md](well-known-oauth-files.md).

---

## Flujo end-to-end (lo que hace Claude)

1. `GET /service/mcp/` sin token → **401** con header `WWW-Authenticate`
   (RFC 9728) que apunta a `.well-known/oauth-protected-resource`.
2. Descubrimiento: lee `oauth-protected-resource` y `oauth-authorization-server`.
3. `POST /oauth/register` (RFC 7591 DCR, cliente público) → **201** con `client_id`.
4. Redirige al usuario a la consent UI del admin
   (`/admin/index.php?ui=oauthconsent`), login wall + aprobación → vuelve a
   `redirect_uri?code=&state=`.
5. `POST /oauth/token` (grant `authorization_code` + PKCE `code_verifier`) → **200**
   con `access_token` (`oa1.*`) y `refresh_token` (`or1.*`).
6. Transporte MCP: `POST /service/mcp/` con `Authorization: Bearer oa1.*`
   (`initialize` → `notifications/initialized` → `tools/list` → `tools/call`).

El punto 6 es **Streamable HTTP**: solo `POST` transporta JSON-RPC. Claude también
puede abrir un `GET` (stream SSE server-initiated) y mandar `DELETE` (fin de sesión).

---

## Cómo diagnosticar

El síntoma en Claude es genérico (`McpServerError`, `mcp_token_exchange_failed`,
"returned an error when connecting"). El diagnóstico real sale de los logs del
servidor, no del mensaje de Claude.

**Access log (domlog) — muestra el status code de cada request:**

```bash
# Vía SSH al hosting
grep -E 'oauth/(token|register)|/service/mcp' ~/access-logs/<dominio>-ssl_log | tail -n 40
```

**PHP error log — muestra fatals/warnings:**

```bash
tail -n 60 ~/logs/<dominio>_com.php.error.log
```

Con eso se ve exactamente qué endpoint falló y con qué código. Ejemplo de una
traza que reveló el bug del `301`:

```
POST /oauth/register   201   ← registro OK
POST /oauth/token      200   ← token exchange OK
POST /service/mcp      301   ← redirect: pierde POST + Authorization
GET  /service/mcp/     401   ← llega como GET sin token
```

**Reproducir a mano con curl** (probar SIEMPRE la barra final en ambos sentidos):

```bash
# Debe dar 200 (con token válido) — nota la barra final
curl -s -D - -o - -X POST "https://<dominio>/service/mcp/" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  --data '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-06-18","capabilities":{},"clientInfo":{"name":"c","version":"1"}}}'
```

---

## Fallos encontrados y correcciones

### 1. Redirect `301` en `POST /service/mcp` (sin barra) — BLOQUEADOR PRINCIPAL

**Síntoma:** Claude hace `POST /service/mcp` (normaliza la URL del conector
quitando la barra final). Como `service/mcp` es un directorio real, `mod_dir` de
Apache emite un **301** hacia `/service/mcp/`. En esa redirección el cliente
convierte el `POST` en `GET` y descarta el header `Authorization` → llega
autenticado como anónimo → **401**. La conexión nunca prospera.

**Causa:** `DirectorySlash On` (por defecto) en Apache sobre un directorio real.

**Corrección (NO usar `DirectorySlash Off` en el propio dir):** desactivar el
redirect en el `.htaccess` del subdirectorio no sirve, porque para una petición
sin barra Apache aún no ha entrado al directorio, así que ese `.htaccess` no se
evalúa → el resultado es un **404**. La solución correcta y **universal** vive en
el `.htaccess` del **padre** (`public_html/service/.htaccess`): si `/service/<name>`
sin barra corresponde a un directorio real con un `service.php`, se despacha
directo (sin 301), conservando método, cuerpo y header `Authorization`. Es
genérica: sirve para cualquier subservicio (`mcp`, `catalog`, `mtsx`, …), no solo
MCP, y no requiere que el sitio tenga MCP.

```apache
RewriteEngine On
# Forward Authorization (Apache/FastCGI strips it by default).
RewriteCond %{HTTP:Authorization} ^(.+)$
RewriteRule ^ - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]
# /service/<name> (sin barra) → <name>/service.php, sin 301, si es un dir real
# con service.php. Conserva POST + Bearer. Las URLs con barra no se tocan.
RewriteCond %{REQUEST_FILENAME} -d
RewriteCond %{REQUEST_FILENAME}/service.php -f
RewriteRule ^([^/]+)$ $1/service.php [L,QSA]
```

Las peticiones con barra (`/service/mcp/`) entran normal al subdirectorio y usan
`public_html/service/mcp/.htaccess` como siempre.

> **Cuidado, medido en mmdev (fallo 7):** esta regla funciona en lkautomotriz pero
> **no** en la cuenta de Money Monks, donde mod_rewrite no se aplica dentro de
> `public_html/service/` aunque se le concedan `RewriteEngine On` y
> `+FollowSymLinks`. En `service/mcp/` y `service/hello/` sí funciona. Antes de
> copiarla a un sitio nuevo, comprobar que dispara: un `RewriteRule ^(.*)$` de
> prueba que no dispare significa que el overlay concede mod_dir y no
> mod_rewrite.

### 2. Notificaciones JSON-RPC recibían respuesta de error

**Síntoma:** `notifications/initialized` (mensaje sin `id`) devolvía
`{"error":{"code":-32601,...}}` con HTTP 200. Una notificación NO debe recibir
cuerpo de respuesta.

**Corrección:** en `mwmod_mw_mcp_server::doExecOk()`, si el mensaje no trae la
clave `id` → `sendNotificationAck()` → **HTTP 202** con cuerpo vacío.

### 3. `protocolVersion` fijo en `initialize`

**Síntoma:** el server siempre respondía `"2024-11-05"` ignorando la versión
pedida por el cliente.

**Corrección:** `handleInitialize()` negocia: eco de la versión pedida si está en
`$supportedProtocolVersions` (`2025-06-18`, `2025-03-26`, `2024-11-05`), si no la
primera soportada.

### 4. Métodos no-POST devolvían un `200` con error de parseo falso

**Síntoma:** `GET /service/mcp/` (stream SSE de Claude) se parseaba como cuerpo
JSON-RPC y devolvía `200` con `-32700 Parse error`, confundiendo al cliente.

**Corrección:** guard al inicio de `doExecOk()`: si `REQUEST_METHOD != POST` →
`sendMethodNotAllowed()` → **HTTP 405** con `Allow: POST`.

### 5. Grant `refresh_token` devolvía `500 "Database unavailable"`

**Síntoma:** `POST /oauth/token` con `grant_type=refresh_token` devolvía
`500 {"error":"server_error","error_description":"Database unavailable"}`. El
grant `authorization_code` funcionaba porque no toca esa ruta. Rompía la
renovación del access token al expirar (Claude solo hace refresh entonces, así
que no bloqueaba la conexión inicial).

**Causa:** `mwmod_mw_oauth_endpoints_token::handleRefreshToken()` obtenía la BD
con `$this->mainap->db`, que es `null` en el contexto del servicio OAuth.

**Corrección:** usar el accesor real del framework,
`$this->mainap->getDBManager()` (devuelve el submanager `db` con `get_link()`,
que es lo que `mwmod_mw_oauth_tokenhelper::verify()` → `loadTokenRow()` espera).

### 6. `authorization_servers` ausente → "Couldn't reach MM test" (Money Monks, 2026-10-20)

**Síntoma:** al agregar el conector personalizado en claude.ai, el mensaje es

```
Couldn't reach MM test. You can check the server URL and verify the server is
running. If this persists, share this reference with support: "ofid_…"
```

El servidor **estaba perfecto**: `POST /service/mcp/mm` devolvía `401` con su
`WWW-Authenticate`, el `resource_metadata` y el JSON-RPC que explica cómo obtener
el token. Nada en el log del servidor, porque **la request que falla nunca llega**.

**Causa:** `/.well-known/oauth-protected-resource` se publicaba **sin la clave
`authorization_servers`** (el `get_metadata()` de `mwap_mm_site_mcp` lo omitía a
propósito, con el docblock diciendo "esta instalación no tiene authorization
server"). El conector tiene entonces dos lecturas posibles y elige la de rendirse:

```
POST /service/mcp/mm                    401   ← correcto, con Bearer challenge
GET  /.well-known/oauth-protected-resource  200  ← sin authorization_servers
GET  /.well-known/oauth-authorization-server 404  ← el cliente lo pide igual
POST /oauth/register                    500/404 ← y acá se rinde
```

El mensaje nombra el servidor MCP, pero el que falla es el **descubrimiento OAuth**.
Diagnóstico en 4 curl (los de "Verificación post-deploy", más el AS):

```bash
curl -s https://<dominio>/.well-known/oauth-protected-resource   # ¿tiene authorization_servers?
curl -s https://<dominio>/.well-known/oauth-authorization-server # ¿200 JSON o 404?
curl -s -o /dev/null -w '%{http_code}\n' -X POST https://<dominio>/oauth/register \
  -H 'Content-Type: application/json' \
  --data '{"client_name":"probe","redirect_uris":["https://claude.ai/api/mcp/auth_callback"]}'
# 201 = listo. 500 "OAuth is not enabled on this site" = faltan las tablas.
```

**Corrección en Money Monks** (portado de lkautomotriz/MeraldaTSX):

1. `src/public_html/oauth/` — montaje del authorization server:
   `service.php`, `init.php`, `.htaccess` (todo a `service.php`).
   Antes de esto `/oauth/register` y `/oauth/token` **no existían**: 500.
2. `src/public_html/.well-known/authorization-server.php` + una ruta en
   `.well-known/.htaccess` → publica RFC 8414 (issuer, authorization/token/
   registration endpoints, PKCE S256, `token_endpoint_auth_methods_supported: none`).
3. `mwap_mm_site_mcp::get_metadata()` — ahora emite `authorization_servers`
   (`get_authorization_server_url()`, derivado del request, sin barra final) y
   `resource_name`. `get_authorization_server_metadata()` arma el documento 2.
4. `remote/updategit.sh` — **`oauth` agregado a `PUBLIC_ITEMS`**. Sin eso los
   documentos de descubrimiento viajan y los endpoints que anuncian no, que es la
   peor combinación posible: el cliente recibe instrucciones de un endpoint 404.

**Verificación completa (2026-10-20, mmdev):**

```
GET  /.well-known/oauth-protected-resource        200  authorization_servers: ["https://api.mmdev.meralda.dev"]
GET  /.well-known/oauth-authorization-server      200  issuer + 3 endpoints
POST /oauth/register                              201  client_id (tablas oauth_* presentes)
GET  /admin/index.php?ui=oauthconsent&…           200  pantalla de consentimiento tras el login wall
POST /oauth/token (code inventado)                400  invalid_grant
POST /service/mcp/mm                              401  Bearer challenge, sin redirección
```

**Lección:** un documento de descubrimiento que omite una clave no falla en el
servidor; falla en el cliente, con un mensaje que nombra otra cosa. Cuando un
conector dice "no puedo alcanzar el servidor", **medir el 401 antes de creerle**:
si el 401 está bien, el problema es el documento.

---

### 7. En mmdev, mod_rewrite NO se aplica en `public_html/service/` (2026-10-20)

Consecuencia directa del fallo 1: el intento de portar la regla anti-301 al
servidor nuevo **no funciona**, y no por cómo está escrita.

Medido en `~/apihome/public_html/service/.htaccess`, en este orden, con la regla
del fallo 1 y variantes:

| intento | resultado |
|---|---|
| `RewriteEngine On` | 301 sigue |
| `+ Options +FollowSymLinks` | 301 sigue |
| `RewriteRule ^(.*)$ /zzprobe/$1 [R=302,L]` (no puede no coincidir) | **no dispara nunca** |
| `DirectorySlash Off` | 301 → **403** (el archivo sí se lee) |
| `DirectoryIndex service.php` | **404** |

Conclusión: en ese directorio el overlay del hosting concede **mod_dir** y no
**mod_rewrite**. Las mismas directivas dentro de `service/mcp/.htaccess` y
`service/hello/.htaccess` funcionan perfecto.

**Qué queda entonces:** el mount root sin barra (`/service/mcp`) sigue dando 301,
como cualquier instalación Apache. **No afecta al conector**, porque el recurso
anunciado es el hijo virtual `/service/mcp/mm`, que no es un directorio en disco:
mod_dir no lo toca y contesta directo (401 en las dos formas, con y sin barra).
El archivo `.htaccess` lo documenta para que nadie lo reintente.

Corolario: en este docroot, para mapear una URL usá directivas de mod_dir, no
RewriteRule.

---

### 8. `Authorization with <nombre> failed` — el token OAuth no lo leía el endpoint (2026-10-20)

El paso siguiente al fallo 6, y el mensaje también nombra otra cosa:

```
Authorization with MM test failed. You can check your credentials and permissions.
```

**Lo que decía el access log** (`/etc/apache2/logs/domlogs/api.<dominio>-ssl_log`):

```
POST /admin/.../oauthconsent/authorize.xml   200  ← el usuario aprobó
POST /oauth/token                            200  ← ¡token emitido!
POST /service/mcp/mm                         401  ← y rechazado, siempre
```

Es decir: consentimiento OK, intercambio de código OK, y **cada request MCP con el
token recién emitido daba 401**. Las dos mitades funcionando y el conector
diciendo "authorization failed".

**Causa:** son **dos formatos de credencial distintos** y el endpoint sólo
conocía uno.

| credencial | formato | cómo se verifica |
|---|---|---|
| API token del panel | **JWT firmado** | `apitokenMan->findActiveByJwt()` |
| token que emite `/oauth/token` | **`oa1.<payload>.<hmac>`** (derivado, sin fila propia) | `mwmod_mw_oauth_tokenhelper::verify()` |

`mwmod_mw_service_user_root::loginUserByToken()` sólo intentaba
`findActiveByJwt()`, así que un `oa1.*` no era ni mirado → 401 con el desafío
genérico (`a valid Bearer API token is required`), que hace pensar en un token
inválido.

**Corrección** (en el framework, `mw/modules/mw/mcp/server.php`): override de
`loginUserByToken()` en `mwmod_mw_mcp_server` que, si el JWT falla, verifica el
`oa1.*` y **usa el mismo login**:

```php
$verified = mwmod_mw_oauth_tokenhelper::verify($token, ACCESS_PREFIX, $this->mainap->getDBManager());
$tokenItem = $uman->getApitokenMan()->get_item($verified['token_id']);
$uman->login_user_api_token_mode($uman->get_user($verified['user_id']), $tokenItem);
```

- `login_user_api_token_mode()` es lo que mantiene la intersección de permisos
  (cuenta ∩ scope del token maestro): un solo modelo de permisos, no dos.
- El `refresh_token` (`or1.*`) **no** se acepta: el prefijo lo descarta. Si se
  aceptara, un credencial de 30 días serviría como bearer sin canjearse nunca.
- `getDBManager()` y no `$this->mainap->db` — la misma trampa del fallo 5.

**Verificación** (token `oa1.*` acuñado con el `token_hash` real, contra el server):

```
POST /service/mcp/mm    200  {"result":{"serverInfo":{"name":"Money Monks"...}}}
POST /service/mcp/mm/   200  idéntico
POST tools/list         200  14 tools
```

**Lección:** "authorization failed" puede ser un 401 en el RECURSO, no en el
authorization server. Antes de tocar el flujo OAuth, mirar el log y separar los
tres momentos: consentimiento (200), emisión (`/oauth/token` 200) y uso (401).
Si los dos primeros son 200 y el tercero 401, el problema es **qué formato de
token acepta el recurso**.

---

## Verificación post-deploy

```bash
# 1. POST sin barra final NO debe redirigir (301) ni dar 404. Con token
#    inválido debe responder 401 con cuerpo JSON-RPC; con token válido, 200.
curl -s -o - -w "\nHTTP %{http_code}\n" -X POST "https://<dominio>/service/mcp" \
  -H "Content-Type: application/json" -H "Authorization: Bearer <token>" \
  --data '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{}}'

# 2. GET → 405 con Allow: POST
curl -s -D - -o - -X GET "https://<dominio>/service/mcp/" \
  -H "Authorization: Bearer <token>"

# 3. Notificación → 202 con Content-Length: 0
curl -s -D - -o - -X POST "https://<dominio>/service/mcp/" \
  -H "Content-Type: application/json" -H "Authorization: Bearer <token>" \
  --data '{"jsonrpc":"2.0","method":"notifications/initialized"}'

# 4. initialize → eco de protocolVersion pedida
#    (esperar "protocolVersion":"2025-06-18" en la respuesta)
```

---

## Migración: sitios ya independizados del git de Meralda

El fix universal del `301` vive en `public_html/service/.htaccess`. Este archivo
se copia por sitio, así que los sitios que ya clonaron/forkearon la carpeta
`public_html/service/` **antes** de este cambio no lo reciben automáticamente al
actualizar Meralda: hay que aplicarlo a mano.

**Qué hacer en cada sitio afectado** (tenga MCP o no; la regla es inofensiva si
no hay subservicios): editar `public_html/service/.htaccess` y asegurarse de que
contenga el bloque de dispatch sin barra:

```apache
Options +FollowSymLinks
RewriteEngine On

# Forward the Authorization header (Apache/FastCGI strips it by default).
RewriteCond %{HTTP:Authorization} ^(.+)$
RewriteRule ^ - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]

# Dispatch /service/<name> (sin barra) a <name>/service.php sin emitir un 301.
RewriteCond %{REQUEST_FILENAME} -d
RewriteCond %{REQUEST_FILENAME}/service.php -f
RewriteRule ^([^/]+)$ $1/service.php [L,QSA]
```

Notas:
- Si el `service/.htaccess` del sitio estaba vacío (caso común), basta con pegar
  el bloque completo.
- Si algún sitio recibió el intento anterior con `DirectorySlash Off` dentro de
  `service/mcp/.htaccess`, **quitarlo**: provoca `404` en la forma sin barra.
- Verificar tras el cambio con el paso 1 de "Verificación post-deploy".

Elevar a Meralda: incorporar este `service/.htaccess` genérico al esqueleto base
de Meralda para que los sitios nuevos lo hereden sin intervención.

---

## Archivos relevantes

- `public_html/service/.htaccess` — **rewrite `^mcp$` → `mcp/service.php`** para
  servir la URL sin barra final sin 301 (conserva POST + `Authorization`).
- `public_html/service/mcp/.htaccess` — routing a `service.php` + forward del
  header `Authorization` (para las peticiones CON barra).
- `public_html/service/mcp/service.php` — monta `mwap_lkautomotriz_mcp_server`.
- `modules/mw/mcp/server.php` — base JSON-RPC (`mwmod_mw_mcp_server`): dispatch,
  auth, 202/405/negotiation.
- `modules/meraldatsx/mcpserver/server.php` — subclase MeraldaTSX: valida tokens
  `oa1.*`, registra las tools `mtsx_*`.
- `modules/mw/oauth/endpoints/token.php` — `/oauth/token`.
- `modules/mw/oauth/endpoints/register.php` — `/oauth/register`.
- `modules/mw/users/ui/oauthconsent/main.php` — consent UI (authorization endpoint).
