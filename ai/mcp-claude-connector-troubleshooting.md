# Claude's MCP connector — OAuth flow and troubleshooting

Debugging notes for Claude.ai's custom connector against Meralda's MCP server
(`https://<domain>/service/mcp/`). It documents the full OAuth 2.1 + PKCE →
Streamable HTTP flow and the real failures found along the way, with their fixes.

Related: [well-known-oauth-files.md](well-known-oauth-files.md).

---

## End-to-end flow (what Claude does)

1. `GET /service/mcp/` with no token → **401** with a `WWW-Authenticate` header
   (RFC 9728) pointing at `.well-known/oauth-protected-resource`.
2. Discovery: it reads `oauth-protected-resource` and `oauth-authorization-server`.
3. `POST /oauth/register` (RFC 7591 DCR, public client) → **201** with a `client_id`.
4. It redirects the user to the admin consent UI
   (`/admin/index.php?ui=oauthconsent`), login wall + approval → back to
   `redirect_uri?code=&state=`.
5. `POST /oauth/token` (grant `authorization_code` + PKCE `code_verifier`) → **200**
   with an `access_token` (`oa1.*`) and a `refresh_token` (`or1.*`).
6. MCP transport: `POST /service/mcp/` with `Authorization: Bearer oa1.*`
   (`initialize` → `notifications/initialized` → `tools/list` → `tools/call`).

Step 6 is **Streamable HTTP**: only `POST` carries JSON-RPC. Claude may also open
a `GET` (server-initiated SSE stream) and send `DELETE` (end of session).

---

## How to diagnose

The symptom in Claude is generic (`McpServerError`, `mcp_token_exchange_failed`,
"returned an error when connecting"). The real diagnosis comes from the server
logs, not from Claude's message.

**Access log (domlog) — shows the status code of every request:**

```bash
# Over SSH to the host
grep -E 'oauth/(token|register)|/service/mcp' ~/access-logs/<domain>-ssl_log | tail -n 40
```

**PHP error log — shows fatals/warnings:**

```bash
tail -n 60 ~/logs/<domain>_com.php.error.log
```

With that you can see exactly which endpoint failed and with which code. Example
of the trace that revealed the `301` bug:

```
POST /oauth/register   201   ← registration OK
POST /oauth/token      200   ← token exchange OK
POST /service/mcp      301   ← redirect: loses POST + Authorization
GET  /service/mcp/     401   ← arrives as GET with no token
```

**Reproduce by hand with curl** (ALWAYS test the trailing slash both ways):

```bash
# Must answer 200 (with a valid token) — note the trailing slash
curl -s -D - -o - -X POST "https://<domain>/service/mcp/" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  --data '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-06-18","capabilities":{},"clientInfo":{"name":"c","version":"1"}}}'
```

---

## Failures found and their fixes

### 1. `301` redirect on `POST /service/mcp` (no slash) — THE MAIN BLOCKER

**Symptom:** Claude does `POST /service/mcp` (it normalises the connector URL by
stripping the trailing slash). Because `service/mcp` is a real directory,
Apache's `mod_dir` emits a **301** to `/service/mcp/`. On that redirect the
client turns the `POST` into a `GET` and drops the `Authorization` header → it
arrives authenticated as anonymous → **401**. The connection never gets anywhere.

**Cause:** `DirectorySlash On` (the default) in Apache, over a real directory.

**Fix (do NOT use `DirectorySlash Off` in the directory itself):** turning the
redirect off in the subdirectory's `.htaccess` does not work, because for a
request without a slash Apache has not entered the directory yet, so that
`.htaccess` is never evaluated → the result is a **404**. The correct and
**universal** fix lives in the **parent's** `.htaccess`
(`public_html/service/.htaccess`): if `/service/<name>` without a slash
corresponds to a real directory that has a `service.php`, dispatch it directly
(no 301), preserving the method, the body and the `Authorization` header. It is
generic: it works for any sub-service (`mcp`, `catalog`, `mtsx`, …), not only
MCP, and it does not require the site to have MCP.

```apache
RewriteEngine On
# Forward Authorization (Apache/FastCGI strips it by default).
RewriteCond %{HTTP:Authorization} ^(.+)$
RewriteRule ^ - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]
# /service/<name> (no slash) → <name>/service.php, no 301, if it is a real dir
# with a service.php. POST + Bearer are preserved. URLs with a slash are untouched.
RewriteCond %{REQUEST_FILENAME} -d
RewriteCond %{REQUEST_FILENAME}/service.php -f
RewriteRule ^([^/]+)$ $1/service.php [L,QSA]
```

Requests with a slash (`/service/mcp/`) enter the subdirectory normally and use
`public_html/service/mcp/.htaccess` as always.

> **Careful, measured on mmdev (failure 7):** this rule works on lkautomotriz but
> **not** on the Money Monks account, where mod_rewrite does not apply inside
> `public_html/service/` even when it is granted `RewriteEngine On` and
> `+FollowSymLinks`. In `service/mcp/` and `service/hello/` it does work. Before
> copying it to a new site, check that it fires: a test `RewriteRule ^(.*)$` that
> does not fire means the overlay grants mod_dir and not mod_rewrite.

### 2. JSON-RPC notifications got an error response

**Symptom:** `notifications/initialized` (a message with no `id`) returned
`{"error":{"code":-32601,...}}` with HTTP 200. A notification MUST NOT receive a
response body.

**Fix:** in `mwmod_mw_mcp_server::doExecOk()`, if the message has no `id` key →
`sendNotificationAck()` → **HTTP 202** with an empty body.

### 3. `protocolVersion` hardcoded in `initialize`

**Symptom:** the server always answered `"2024-11-05"`, ignoring the version the
client asked for.

**Fix:** `handleInitialize()` negotiates: echo the requested version if it is in
`$supportedProtocolVersions` (`2025-06-18`, `2025-03-26`, `2024-11-05`),
otherwise the first supported one.

### 4. Non-POST methods returned a `200` with a false parse error

**Symptom:** `GET /service/mcp/` (Claude's SSE stream) was parsed as a JSON-RPC
body and returned `200` with `-32700 Parse error`, confusing the client.

**Fix:** a guard at the top of `doExecOk()`: if `REQUEST_METHOD != POST` →
`sendMethodNotAllowed()` → **HTTP 405** with `Allow: POST`.

### 5. `refresh_token` grant returned `500 "Database unavailable"`

**Symptom:** `POST /oauth/token` with `grant_type=refresh_token` returned
`500 {"error":"server_error","error_description":"Database unavailable"}`. The
`authorization_code` grant worked because it does not touch that path. It broke
access-token renewal when the token expired (Claude only refreshes then, so it
did not block the initial connection).

**Cause:** `mwmod_mw_oauth_endpoints_token::handleRefreshToken()` obtained the DB
with `$this->mainap->db`, which is `null` in the OAuth service context.

**Fix:** use the framework's real accessor, `$this->mainap->getDBManager()`
(it returns the `db` submanager with `get_link()`, which is what
`mwmod_mw_oauth_tokenhelper::verify()` → `loadTokenRow()` expects).

### 6. Missing `authorization_servers` → "Couldn't reach MM test" (Money Monks, 2026-10-20)

**Symptom:** when adding the custom connector in claude.ai, the message is

```
Couldn't reach MM test. You can check the server URL and verify the server is
running. If this persists, share this reference with support: "ofid_…"
```

The server was **perfect**: `POST /service/mcp/mm` returned `401` with its
`WWW-Authenticate`, the `resource_metadata` and the JSON-RPC explaining how to
get a token. Nothing in the server log, because **the failing request never
arrives**.

**Cause:** `/.well-known/oauth-protected-resource` was published **without the
`authorization_servers` key** (the `get_metadata()` of `mwap_mm_site_mcp` omitted
it on purpose, with a docblock saying "this installation has no authorization
server"). The connector then has two possible readings and picks the one that
gives up:

```
POST /service/mcp/mm                    401   ← correct, with Bearer challenge
GET  /.well-known/oauth-protected-resource  200  ← without authorization_servers
GET  /.well-known/oauth-authorization-server 404  ← the client asks for it anyway
POST /oauth/register                    500/404 ← and here it gives up
```

The message names the MCP server, but what fails is **OAuth discovery**.
Diagnosis in 4 curls (the ones under "Post-deploy verification", plus the AS):

```bash
curl -s https://<domain>/.well-known/oauth-protected-resource   # does it have authorization_servers?
curl -s https://<domain>/.well-known/oauth-authorization-server # 200 JSON or 404?
curl -s -o /dev/null -w '%{http_code}\n' -X POST https://<domain>/oauth/register \
  -H 'Content-Type: application/json' \
  --data '{"client_name":"probe","redirect_uris":["https://claude.ai/api/mcp/auth_callback"]}'
# 201 = ready. 500 "OAuth is not enabled on this site" = the tables are missing.
```

**Fix on Money Monks** (ported from lkautomotriz/MeraldaTSX):

1. `src/public_html/oauth/` — mount the authorization server:
   `service.php`, `init.php`, `.htaccess` (everything to `service.php`).
   Before this, `/oauth/register` and `/oauth/token` **did not exist**: 500.
2. `src/public_html/.well-known/authorization-server.php` + a route in
   `.well-known/.htaccess` → publishes RFC 8414 (issuer, authorization/token/
   registration endpoints, PKCE S256, `token_endpoint_auth_methods_supported: none`).
3. `mwap_mm_site_mcp::get_metadata()` — now emits `authorization_servers`
   (`get_authorization_server_url()`, derived from the request, no trailing
   slash) and `resource_name`. `get_authorization_server_metadata()` builds the
   second document.
4. `remote/updategit.sh` — **`oauth` added to `PUBLIC_ITEMS`**. Without it the
   discovery documents travel and the endpoints they announce do not, which is
   the worst possible combination: the client receives instructions for a 404.

**Full verification (2026-10-20, mmdev):**

```
GET  /.well-known/oauth-protected-resource        200  authorization_servers: ["https://api.mmdev.meralda.dev"]
GET  /.well-known/oauth-authorization-server      200  issuer + 3 endpoints
POST /oauth/register                              201  client_id (oauth_* tables present)
GET  /admin/index.php?ui=oauthconsent&…           200  consent screen behind the login wall
POST /oauth/token (invented code)                 400  invalid_grant
POST /service/mcp/mm                              401  Bearer challenge, no redirect
```

**Lesson:** a discovery document that omits a key does not fail on the server; it
fails in the client, with a message that names something else. When a connector
says "I can't reach the server", **measure the 401 before believing it**: if the
401 is fine, the problem is the document.

---

### 7. On mmdev, mod_rewrite does NOT apply in `public_html/service/` (2026-10-20)

A direct consequence of failure 1: the attempt to port the anti-301 rule to the
new server **does not work**, and not because of how it is written.

Measured in `~/apihome/public_html/service/.htaccess`, in this order, with the
rule from failure 1 and variants:

| attempt | result |
|---|---|
| `RewriteEngine On` | 301 still |
| `+ Options +FollowSymLinks` | 301 still |
| `RewriteRule ^(.*)$ /zzprobe/$1 [R=302,L]` (cannot not match) | **never fires** |
| `DirectorySlash Off` | 301 → **403** (the file is read) |
| `DirectoryIndex service.php` | **404** |

Conclusion: in that directory the host's overlay grants **mod_dir** and not
**mod_rewrite**. The same directives inside `service/mcp/.htaccess` and
`service/hello/.htaccess` work perfectly.

**So what is left:** the bare mount root (`/service/mcp`) still returns 301, like
any Apache installation. **It does not affect the connector**, because the
advertised resource is the virtual child `/service/mcp/mm`, which is not a
directory on disk: mod_dir does not touch it and it answers directly (401 both
with and without a slash). The `.htaccess` file documents this so nobody retries
it.

Corollary: in this docroot, to map a URL use mod_dir directives, not RewriteRule.

---

### 8. `Authorization with <name> failed` — the endpoint did not read the OAuth token (2026-10-20)

The next step after failure 6, and the message also names something else:

```
Authorization with MM test failed. You can check your credentials and permissions.
```

**What the access log said** (`/etc/apache2/logs/domlogs/api.<domain>-ssl_log`):

```
POST /admin/.../oauthconsent/authorize.xml   200  ← the user approved
POST /oauth/token                            200  ← token issued!
POST /service/mcp/mm                         401  ← and rejected, every time
```

In other words: consent OK, code exchange OK, and **every MCP request with the
brand-new token returned 401**. Both halves working and the connector saying
"authorization failed".

**Cause:** these are **two different credential formats** and the endpoint only
knew one.

| credential | format | how it is verified |
|---|---|---|
| API token from the panel | **signed JWT** | `apitokenMan->findActiveByJwt()` |
| token issued by `/oauth/token` | **`oa1.<payload>.<hmac>`** (derived, no row of its own) | `mwmod_mw_oauth_tokenhelper::verify()` |

`mwmod_mw_service_user_root::loginUserByToken()` only tried
`findActiveByJwt()`, so an `oa1.*` was never even looked at → 401 with the
generic challenge (`a valid Bearer API token is required`), which makes you think
the token is invalid.

**Fix** (in the framework, `mw/modules/mw/mcp/server.php`): override
`loginUserByToken()` in `mwmod_mw_mcp_server` so that, if the JWT fails, it
verifies the `oa1.*` and **uses the same login**:

```php
$verified = mwmod_mw_oauth_tokenhelper::verify($token, ACCESS_PREFIX, $this->mainap->getDBManager());
$tokenItem = $uman->getApitokenMan()->get_item($verified['token_id']);
$uman->login_user_api_token_mode($uman->get_user($verified['user_id']), $tokenItem);
```

- `login_user_api_token_mode()` is what keeps the permission intersection
  (account ∩ master-token scope): one permission model, not two.
- The `refresh_token` (`or1.*`) is deliberately **not** accepted: the prefix
  discards it. A refresh token is a request for a new access token, not a
  credential to call tools with, and accepting it as a Bearer would mean a
  credential valid for its whole (longer) lifetime could be used to read and
  write the site directly. The prefix is the check, so it cannot be forgotten at
  a call site that is added later.

---

## Post-deploy verification

Five curls, in this order. Each one answers a different question, and a
connector that fails will fail at one of them:

```bash
D=https://<domain>

# 1. The protected resource advertises an authorization server.
curl -s $D/.well-known/oauth-protected-resource | grep -o '"authorization_servers":\[[^]]*\]'

# 2. That server's own document is reachable and absolute.
curl -s $D/.well-known/oauth-authorization-server | grep -o '"issuer":"[^"]*"'

# 3. Dynamic client registration works (the oauth_* tables exist).
curl -s -o /dev/null -w 'register: %{http_code}\n' -X POST $D/oauth/register \
  -H 'Content-Type: application/json' \
  --data '{"client_name":"probe","redirect_uris":["https://claude.ai/api/mcp/auth_callback"]}'

# 4. The token endpoint exists and refuses a bad code the right way.
curl -s -o /dev/null -w 'token: %{http_code}\n' -X POST $D/oauth/token \
  -d 'grant_type=authorization_code&code=nope&client_id=nope'

# 5. The MCP endpoint answers 401 with a challenge instead of redirecting.
curl -s -o /dev/null -w 'mcp: %{http_code}\n' -X POST $D/service/mcp/<mount>
```

Expected: `authorization_servers` present, an absolute `issuer`, `register: 201`,
`token: 400` (`invalid_grant`), `mcp: 401`.

Then, with a real token, both forms of the mount URL must answer:

```bash
for u in "$D/service/mcp/<mount>" "$D/service/mcp/<mount>/"; do
  curl -s -o /dev/null -w "%{http_code}  $u\n" -X POST "$u" \
    -H "Authorization: Bearer <oa1.token>" -H "Content-Type: application/json" \
    --data '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'
done
```

---

## Note for a site that was detached from Meralda's git

A site created from Meralda and then divorced from it (`git remote remove origin`
+ a new remote, see the bootstrap agent) keeps its submodules, but its **superproject
history no longer receives Meralda's commits**. Everything above lives in two
places, and a port has to carry both:

- **the framework** (`mw` submodule): the MCP server, the tool layer, the OAuth
  endpoints and the token helper — arrive by updating the submodule;
- **the site** (project module + `public_html`): `.well-known/`, the `oauth/`
  mount, the `service/` `.htaccess` and `updategit.sh`'s `PUBLIC_ITEMS`.

The second is the one that gets forgotten, and its symptom is failure 6: the
discovery documents are published and the endpoints they announce are not.
