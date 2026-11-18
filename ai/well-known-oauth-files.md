# The `.well-known/` files for OAuth 2.1

OAuth discovery metadata: **RFC 9728** (protected resource) and **RFC 8414**
(authorization server). They are the first thing a connector reads, before it
holds a token, and they decide whether it can ask for one at all.

---

## Two ways to serve them, and this installation uses the second

| | MeraldaTSX / lkautomotriz | **Money Monks / fractureintime** |
|---|---|---|
| How they are served | two static JSON files | PHP scripts that build them |
| Domain | written inside the file | derived from the request / `cfg.ini` |
| When creating a site | edit the domain by hand and upload over SFTP | nothing to edit |
| Works on staging/dev | no, unless the file is rewritten | yes |

The static form (the rest of this document) is what sites that cloned
`public_html/.well-known/` before the builder existed still use. **In Money
Monks and fractureintime the JSON is not edited**: the two documents are built
by a small PHP class from the request, and `.well-known/.htaccess` routes them:

```
.well-known/
├── .htaccess                              ← routes: 4 paths → 2 runners
├── oauth-protected-resource.php           ← RFC 9728 (protected resource)
└── oauth-authorization-server.php         ← RFC 8414 (authorization server)
```

Why dynamic matters: the document contains absolute URLs (`resource`, `issuer`,
`token_endpoint`, `registration_endpoint`). Written by hand they are correct on
the machine that wrote them and **false everywhere else**, and the symptom
appears in no log — the client only says "couldn't connect".

The origin comes from `HTTP_HOST`, and can be pinned with
`mcp_authorization_server_url` in `cfg.ini` when a proxy in front rewrites the
host.

If the origin cannot be determined, **answer 500 with the reason**. A 200 full of
relative paths is worse than an error: nobody diagnoses it.

---

## Static structure (sites with JSON, outside this repo)

```
public_html/
└── .well-known/
    ├── .htaccess                    ← force Content-Type: application/json
    ├── oauth-protected-resource     ← RFC 9728: points at the AS
    └── oauth-authorization-server   ← RFC 8414: describes the OAuth endpoints
```

---

## `.htaccess` (always the same, does not change between projects)

```apache
# Force all extensionless files in this directory to be served as JSON.
<Files "*">
    ForceType application/json
</Files>

# Disable directory listing
Options -Indexes
```

For the PHP variant, the routing has to cover **both forms of each path** — the
bare one and the one with the resource path appended (RFC 8414 §3.1, RFC 9728
§3.1), because that is what a client asks for:

```apache
RewriteRule ^oauth-protected-resource$        oauth-protected-resource.php  [L]
RewriteRule ^oauth-protected-resource/.+$     oauth-protected-resource.php  [L]
RewriteRule ^oauth-authorization-server$      oauth-authorization-server.php [L]
RewriteRule ^oauth-authorization-server/.+$   oauth-authorization-server.php [L]
```

---

## `oauth-protected-resource`

Says which authorization server protects this resource.
The `resource` field must match the MCP endpoint URL **exactly**.

It carries extra metadata so OAuth clients know what to name the token and which
scopes are available.

```json
{
  "resource": "https://<domain>/service/mcp/NAME",
  "authorization_servers": ["https://<domain>"],
  "scopes_supported": ["scope_one", "scope_two"],
  "resource_name": "My site (MCP)"
}
```

**Example, lkautomotriz.com:**
```json
{
  "resource": "https://lkautomotriz.com/service/mcp/",
  "authorization_servers": ["https://lkautomotriz.com"],
  "scopes_supported": ["catalog_read", "catalog_admin"],
  "resource_name": "lkautomotriz-mcp"
}
```

**Fields:**
- `resource`: exact URL of the protected endpoint
- `authorization_servers`: list of OAuth server URLs that protect this resource

  > **This field is the one that decides whether a connector can sign its own
  > token.** When it is missing, the client is left guessing between "the
  > endpoint's origin IS the authorization server" and "there is no OAuth":
  > claude.ai picks the second and reports *"Couldn't reach <name>. You can check
  > the server URL and verify the server is running"* — with the server answering
  > 401 perfectly and **naming no URL at all**. It is not a network problem and
  > it is not fixed in the firewall. See
  > `mcp-claude-connector-troubleshooting.md`, failure 6.

- `scopes_supported`: the real scopes the MCP tools use.
  - `catalog_read` → read tools (`list_makes`, `list_models`, `list_variants`, …)
  - `catalog_admin` → write tools (`create_*`, `update_*`, `delete_*`, `set_*`)

  **An empty list is not "no restriction", it is a dead flow**: the client then
  asks for no scope, and the consent screen cannot grant one. See
  `mcp-oauth-setup-checklist.md`, section 3-bis.

- `resource_name`: suggested name to show when creating the token (from
  `mcpServerName` on the `mtsx mainman`, e.g. `lkautomotriz-mcp`)

---

## `oauth-authorization-server`

Describes every OAuth endpoint of the site. Replace `<domain>` with the real one.

```json
{
  "issuer": "https://<domain>",
  "authorization_endpoint": "https://<domain>/admin/index.php?ui=oauthconsent",
  "token_endpoint": "https://<domain>/oauth/token",
  "registration_endpoint": "https://<domain>/oauth/register",
  "response_types_supported": ["code"],
  "grant_types_supported": ["authorization_code", "refresh_token"],
  "code_challenge_methods_supported": ["S256"],
  "token_endpoint_auth_methods_supported": ["none"]
}
```

**Fields and what they point at (Meralda OAuth 2.1 + PKCE implementation):**
- `authorization_endpoint`: the admin's **consent UI**
  (`mwmod_mw_users_ui_oauthconsent_main`, subinterface `oauthconsent`). It takes
  the standard authorization request over GET (`client_id`, `redirect_uri`,
  `response_type=code`, `code_challenge`, `code_challenge_method=S256`, `scope`,
  `state`), applies the login wall, and after approval redirects to
  `redirect_uri?code=&state=`.

  **It must be registered as a subinterface of the project's admin**, or that URL
  renders the login form and nothing else — the flow cannot finish. See
  `mcp-oauth-setup-checklist.md`, section 5.

- `token_endpoint`: `/oauth/token` → `mwmod_mw_oauth_endpoints_token`
  (grants `authorization_code` and `refresh_token`). Returns `oa1.*` / `or1.*`.
- `registration_endpoint`: `/oauth/register` → `mwmod_mw_oauth_endpoints_register`
  (RFC 7591 DCR, public clients).
- Both `/oauth/*` are served by a single entry point,
  `public_html/oauth/service.php`, which mounts `mwmod_mw_oauth_server` on base
  `oauth` and dispatches by path.

---

## Verifying it works

After uploading, all four URLs must answer with
`Content-Type: application/json`:

```bash
curl -i https://<domain>/.well-known/oauth-protected-resource
curl -i https://<domain>/.well-known/oauth-authorization-server
curl -i https://<domain>/.well-known/oauth-protected-resource/service/mcp/NAME
curl -i https://<domain>/.well-known/oauth-authorization-server/service/mcp/NAME
```

All four must return `HTTP/2 200` and the `content-type: application/json`
header. A 404 on the suffixed pair means the `.htaccess` only routes the bare
form.

---

## Note on versioning

`src/public_html/.well-known/` is tracked in git.

With the **static** variant the production domain is hardcoded inside the two
JSON files, so creating a new site means editing the domain in both and uploading
them by SFTP.

With the **PHP** variant there is nothing to edit: the domain comes from the
request, and a new site is correct as soon as the files are deployed.
