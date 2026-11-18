# MCP over OAuth: what to mount on a new site

Checklist for getting a Meralda MCP server working with a connector that
**obtains its own token** (Claude, and any OAuth 2.1 client). Written because
doing it has taken hours three separate times — lkautomotriz, Money Monks and
fractureintime — and each time the missing piece was a different one.

Background: `docs/ai/well-known-oauth-files.md` (what the two documents are) and
`docs/ai/mcp-claude-connector-troubleshooting.md` (the eight known failures).
This file is the **sequence**, not the theory.

---

## 0. Before starting: decide two things

- [ ] **Open or closed OAuth?** With `registration_endpoint` published (RFC
      7591) any client registers itself. Without it, a connector that requires
      automatic registration does not work and has to be handed a `client_id` by
      hand. What protects the site is not who registers but **who approves**:
      no login plus consent means no token.
- [ ] **Which scopes?** It CANNOT be empty, and that cost half a day. See
      section 3-bis: with `scopes_supported: []` the client asks for no
      permission, the consent screen says *"The client did not request specific
      permissions"*, and authorizing answers `You must grant at least one
      permission to continue` — with no way to continue. At least the permission
      the tools require has to be published.

---

## 1. Database

- [ ] The tables `oauth_clients` and `oauth_auth_codes` exist.

```php
// quick CLI check
$db = $ap->get_submanager("db");
foreach (array("oauth_clients","oauth_auth_codes") as $t) { /* SHOW TABLES LIKE */ }
```

They are created by the `meralda` module's migrations. When missing: `ws.sh`
does not create them — apply them from **Configuration → DB migrations**.

Symptom when missing: `/oauth/register` answers
`500 "OAuth is not enabled on this site"`.

---

## 2. Enable the manager (PHP)

- [ ] The project's users manager returns `new mwmod_mw_oauth_man($this)`.

```php
class myproject_users_usersman extends mwmod_mw_users2_def_usersman {
    function createOauthMan() { return new mwmod_mw_oauth_man($this); }
}
```

- [ ] The project's AP names that class, instead of copying the constructor:

```php
// mwmod_mw_ap_def2
function get_users_managers_class_name() {
    return "myproject_users_usersman";
}
```

**Do not override `create_submanager_user()` to change one line.** It wires
roles, permissions and brute-force protection; a copied version is out of date
the first time the framework adds a permission. The class-name hook exists for
exactly this.

---

## 3. The endpoints (`/oauth/`)

- [ ] `public_html/oauth/init.php` — includes the bootstrap
- [ ] `public_html/oauth/service.php` — mounts `mwmod_mw_oauth_server("oauth")`
- [ ] `public_html/oauth/.htaccess` — routes every path to `service.php`

```
POST /oauth/register    RFC 7591 — a client registers itself, gets a client_id
POST /oauth/token       RFC 6749 — code + PKCE verifier → access token
```

Two things in the `.htaccess` that are not optional:

```apache
# 1. the runner must not rewrite itself, or the request loops
RewriteRule ^service\.php$ - [L]

# 2. no trailing-slash redirect: mod_dir answers POST /oauth/token/ with a 301
#    and most clients resend a 301 as GET, so the exchange arrives as the wrong
#    method on a path that does not exist
DirectorySlash Off
```

Test:

```bash
curl -s -o /dev/null -w '%{http_code}\n' -X POST https://HOST/oauth/register \
  -H 'Content-Type: application/json' \
  -d '{"client_name":"probe","redirect_uris":["https://example.com/cb"]}'
# 201 + client_id  →  fine
# 500 empty body   →  init.php is one dirname() too deep (or too shallow)
```

Delete the probe client when done: it stays in `oauth_clients` and shows up on
the consent screen as if it were real.

---

## 3-bis. Scopes: `[]` is not "no restriction", it is a dead flow

- [ ] `scopes_supported` in RFC 8414 is **not empty**, and lists the permissions
      the tools need.
- [ ] `scopes_supported` in RFC 9728 lists the same.

**THE MISTAKE.** Leaving `scopes_supported: []` looks reasonable — "the real
permissions are an intersection, so I promise nothing" — and it is a dead end:

```
client reads scopes_supported: []   →  asks for no scope
consent receives an empty scope     →  buildScopeInfo([]) = []
consent shows                       →  "The client did not request specific permissions"
user presses Authorize              →  grantedScope = []
                                    →  error no_permissions
                                    →  "You must grant at least one permission to continue"
```

There is no way to grant anything because there is nothing to tick. The
connector cannot finish. **It is not a framework bug: the screen refuses to mint
a token with no permissions, and the document offered it none.**

**WHAT THE CONSENT SCREEN DOES WITH THE SCOPE**
(`mwmod_mw_users_ui_oauthconsent_main`):

| step | code |
|---|---|
| parses `scope` (space separated) | `parseScope($scopeRaw)` |
| classifies each code | `buildScopeInfo()` → `ok` / `warning` / `unknown` |
| intersection on authorize | ticked ∩ requested ∩ `$user->man->allow($code)` |

`scope` is not an invented name: it is a **code from the project's permission
catalog** (`$user->man->get_permission_man()->get_items()`). A code that is not
in the catalog comes back `unknown` and cannot be ticked.

**HOW MANY CODES: ONE PER THING THAT CAN BE DONE, NOT ONE PER SITE.**

The temptation is a single `admin`. The problem is that the consent screen then
cannot say **what** is being granted, and the user approves blind. The
dimensions worth separating, when the site has more than one:

| dimension | why |
|---|---|
| **area** (draft / live) | writing the draft is recoverable; writing what visitors read is public the instant it happens |
| **read vs write** | a client that summarizes a page does not need the power to overwrite it |
| **contact messages** | they carry a visitor's name and address: reading them is a different act, and approving a client that maintains the site must not hand it the inbox |

fractureintime ended up with five:

```
ws_draft_write   ws_draft_read
ws_live_write    ws_live_read
contact_read
```

**WHERE THEY ARE DECLARED, AND THE ORDER MATTERS.** In the project's users
manager, but **not in the constructor**: `createRolsAndPermissions()` runs
before `set_permissions_man()`, so a permission added there is added to `null`
and disappears without an error.

```php
// 1. the project's users manager declares codes + labels + the mapping
class myproject_users_usersman extends mwmod_mw_users2_def_usersman {
    const PERM_DRAFT_WRITE = 'ws_draft_write';
    // ...
    static function area_permission_labels() { return array(/* code => label */); }
    static function permission_code_for_area($role, $write = true) { /* ... */ }
    function add_area_permissions() { /* add_item() per code + init_rols() */ }
}

// 2. the AP calls it AFTER the framework's constructor
function create_submanager_user() {
    $subman = parent::create_submanager_user();
    if ($subman && method_exists($subman, 'add_area_permissions')) {
        $subman->add_area_permissions();
    }
    return $subman;
}
```

**THE MAPPING IS ONE FUNCTION.** The tools ask
`permission_code_for_area($role, $write)` and the document publishes
`array_keys(area_permission_labels())`. A typo cannot make the consent screen
offer a code the tools never check.

Verify the codes exist **and that the account holds them**:

```php
$u = $ap->get_submanager("user");
foreach ($u->get_permission_man()->get_items() as $it) { echo $it->get_code(), "\n"; }

$user = $u->get_user_by_idname("...");
var_export($user->allow("ws_draft_write"));   // true
```

Note: `$u->allow(...)` in CLI returns `false` even when the permission exists —
there is no user in session. Ask the **user**, not the manager.

**WHAT TO PUBLISH.** The codes the tools actually require:

- a tool whose `getRequiredPermission()` is empty → **it requires no permission
  of its own**, but the consent screen still needs at least one, so publish the
  one the account already holds.
- a tool with a concrete code → publish that one, and nothing else. Publishing
  more promises permissions no tool checks.

**THE SYMMETRY MISTAKE.** Publishing a code no tool requires "for later" puts a
checkbox on the consent screen that changes nothing — worse than not showing it,
because the user believes they granted something. If the code does not yet
govern an operation, say so in the label or do not publish it.

---

## 4. The two discovery documents

- [ ] `public_html/.well-known/oauth-protected-resource.php`  (RFC 9728)
- [ ] `public_html/.well-known/oauth-authorization-server.php` (RFC 8414)
- [ ] `public_html/.well-known/.htaccess`

**THE URLS MUST BE ABSOLUTE.** A document with relative paths is worse than
none: the client resolves nothing, compares `resource` character by character
against the URL it is calling, does not match, and reports *"couldn't reach the
server"* while the server answers 401 perfectly. Everyone looks at the firewall
and the problem is in the JSON.

Build them in PHP, never as static JSON:

- `resource` = the exact MCP endpoint URL, **taken from the same constant** that
  mounts it. One slash of difference and the document is refused.
- origin = `HTTP_HOST` from the request (or `mcp_authorization_server_url` in
  `cfg.ini` when a proxy is in front).
- when the origin cannot be determined: **answer 500 with the reason**, not a 200
  full of nonsense.

**BOTH FORMS OF EACH PATH.** A client asks for the resource-suffixed path:

```
/.well-known/oauth-protected-resource
/.well-known/oauth-protected-resource/service/mcp/NAME     ← this one too
/.well-known/oauth-authorization-server
/.well-known/oauth-authorization-server/service/mcp/NAME   ← and this one
```

Serving only the bare form makes the client guess, and the guess is failure 6 in
the troubleshooting document.

Verify (all four):

```bash
for p in /.well-known/oauth-protected-resource \
         /.well-known/oauth-protected-resource/service/mcp/NAME \
         /.well-known/oauth-authorization-server \
         /.well-known/oauth-authorization-server/service/mcp/NAME ; do
  printf '%-70s %s\n' "$p" "$(curl -s -o /dev/null -w '%{http_code}' https://HOST$p)"
done
```

---

## 5. The consent screen — THE ONE THAT IS ALWAYS FORGOTTEN

- [ ] `create_subinterface_oauthconsent()` registered in the project's admin.

```php
function create_subinterface_oauthconsent() {
    return new mwmod_mw_users_ui_oauthconsent_main("oauthconsent", $this);
}
```

The class ships with the framework and the RFC 8414 document publishes the URL
(`authorization_endpoint`). **If it is not registered, that URL renders the
login form and nothing else**: the flow cannot be completed.

The symptom is cruel because everything else answers correctly: registration
gives 201, discovery gives 200, and the connector just waits.

Verify **signed in**, which is how the connector opens it:

```
https://HOST/admin/index.php?ui=oauthconsent
```

- signed in → the authorization screen (token name, permissions, Authorize/Deny)
- signed out → login (correct: that is the wall, not a failure)

New codes on this screen need English entries, or the page mixes languages. See
section 9.

---

## 6. The MCP server accepts both tokens

- [ ] `loginUserByToken()` accepts the derived `oa1.*`, not only the panel JWT.

If it only accepts the JWT: the token exchange returns **200 with a real access
token**, and then **every** MCP call returns 401. That is failure 8 in the
troubleshooting document.

---

## 7. Deployment

- [ ] `.well-known` and `oauth` are in `PUBLIC_ITEMS` of `updategit.sh`.

**The script lives on the server and does not update itself.** A `.sh` edited
locally changes nothing until it is uploaded. Otherwise the deploy says
"complete" and the new folders never appear:

```
-> oauth
-> outofservice
...
```

- [ ] `index.html` is deliberately NOT in that list: the front page is generated
      from the live copy. Copying a repository file over it would replace the
      published page.

---

## 8. Final verification, in this order

```bash
# 1. discovery, both forms, both documents          → 200 + application/json
# 2. POST /oauth/register                           → 201 + client_id
# 3. GET /oauth/token                               → 405 (POST only)
# 4. POST /oauth/token with a bogus code            → 400 invalid_grant
# 5. consent URL                                    → the screen, when signed in
# 6. POST /service/mcp/NAME without a token         → 401 + WWW-Authenticate
```

Then the real test, which no curl can do: add the connector, sign in when it
sends you to the consent screen, tick the permissions, authorize, and confirm
the client lists the tools.

---

## 9. Translating the consent screen

The screen resolves its messages through the `def` message manager (the app's
`get_lngmsgsmancod()`), so in an English site the entries go in
`src/mwap/lngmsgs/en/def.txt`, one `code message` per line.

Without them the page is half Spanish: the framework ships Spanish literals as
defaults and those are what renders when a code has no entry.

Codes used by the consent screen:

```
authorize_access_title  access_request_title   requests_access
unavailable_permissions_note  requested_permissions  no_specific_permissions
unknown_permission  permission_not_available  authorize_btn  deny_btn
no_permissions_granted  session_required  invalid_redirect_uri  unknown_client
oauth_disabled  invalid_action  nonce_error  error_generic
token_system_unavailable  token_creation_failed  authcode_creation_failed
token_settings_title  token_name_label  token_expiry_label  expiry_no_expiry
expiry_7_days  expiry_30_days  expiry_90_days  expiry_365_days
creating_token  token_created_title  token_created_intro  token_copied
token_copy_fail  resource_label  redirect_to_label  code_will_be_sent_to
send_code_btn  redirecting
```

`register_lng_msg = 1` in `cfg.ini` collects missing ones while browsing (see the
note in that file), but it captures the literal from the CODE, which is Spanish.
Translating the list above by hand is faster and produces better sentences.

---

## Mistakes already made, with their exact shape

| symptom | cause | where |
|---|---|---|
| 500 with an empty body on `/oauth/*` | `init.php` with one `dirname()` too many | §3 |
| "couldn't reach the server" with the server on 401 | `authorization_servers` missing or relative URLs | §4 |
| 201 on registration and an endless wait | consent screen not registered | §5 |
| 200 on the code exchange and 401 on everything else | the endpoint does not read `oa1.*` | §6 |
| deploy "complete" without the new folders | `updategit.sh` on the server out of date | §7 |
| 301 on `POST /oauth/token/` | `DirectorySlash` | §3 |
| "The client did not request specific permissions" + "You must grant at least one" | `scopes_supported: []` | §3-bis |
| a permission added that never appears in the catalog | declared in the constructor, before `set_permissions_man()` | §3-bis |
| a permission checkbox that changes nothing | a published code no tool requires | §3-bis |
| half the consent screen in Spanish on an English site | no `en/` entries for its codes | §9 |
