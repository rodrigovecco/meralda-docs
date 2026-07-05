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
