# Archivos `.well-known/` para OAuth 2.1

Los archivos de esta carpeta son **JSON estáticos** que sirven como metadatos de descubrimiento
OAuth (RFC 9728). Están en `.gitignore` porque contienen la URL del dominio de producción, que
puede diferir entre sitios. Se despliegan manualmente al servidor.

---

## Estructura de la carpeta

```
public_html/
└── .well-known/
    ├── .htaccess                    ← forzar Content-Type: application/json
    ├── oauth-protected-resource     ← RFC 9728: apunta al AS
    └── oauth-authorization-server   ← RFC 8414: describe los endpoints OAuth
```

---

## `.htaccess` (siempre igual, no cambia entre proyectos)

```apache
# Force all extensionless files in this directory to be served as JSON.
<Files "*">
    ForceType application/json
</Files>

# Disable directory listing
Options -Indexes
```

---

## `oauth-protected-resource`

Indica qué servidor de autorización protege este recurso.
El campo `resource` debe coincidir **exactamente** con la URL del endpoint MCP.

Incluye metadatos adicionales para que clientes OAuth (como Open Code) sepan qué nombre
darle al token y qué scopes están disponibles.

```json
{
  "resource": "https://<dominio>/service/mcp/",
  "authorization_servers": ["https://<dominio>"],
  "scopes_supported": ["catalog_read", "catalog_admin"],
  "resource_name": "MeraldaTSX MCP"
}
```

**Ejemplo lkautomotriz.com:**
```json
{
  "resource": "https://lkautomotriz.com/service/mcp/",
  "authorization_servers": ["https://lkautomotriz.com"],
  "scopes_supported": ["catalog_read", "catalog_admin"],
  "resource_name": "lkautomotriz-mcp"
}
```

**Campos:**
- `resource`: URL exacta del endpoint protegido
- `authorization_servers`: lista de URLs de servidores OAuth que protegen este recurso
- `scopes_supported`: scopes reales que usan las tools del MCP:
  - `catalog_read` → tools de lectura (`list_makes`, `list_models`, `list_variants`, …)
  - `catalog_admin` → tools de escritura (`create_*`, `update_*`, `delete_*`, `set_*`)
- `resource_name`: nombre sugerido para mostrar al crear el token (usa `mcpServerName`
  del `mtsx mainman`, p.ej. `lkautomotriz-mcp`)

---

## `oauth-authorization-server`

Describe todos los endpoints OAuth del sitio. Reemplazar `<dominio>` con el dominio real.

```json
{
  "issuer": "https://<dominio>",
  "authorization_endpoint": "https://<dominio>/oauth/authorize/",
  "token_endpoint": "https://<dominio>/oauth/token/",
  "registration_endpoint": "https://<dominio>/oauth/register/",
  "response_types_supported": ["code"],
  "grant_types_supported": ["authorization_code", "refresh_token"],
  "code_challenge_methods_supported": ["S256"],
  "token_endpoint_auth_methods_supported": ["none"]
}
```

---

## Verificar que funciona

Después de subir, los tres archivos deben responder con `Content-Type: application/json`:

```bash
curl -i https://<dominio>/.well-known/oauth-protected-resource
curl -i https://<dominio>/.well-known/oauth-authorization-server
```

Ambos deben devolver `HTTP/2 200` y el header `content-type: application/json`.

---

## Nota sobre `.gitignore`

La carpeta `src/public_html/.well-known/` está ignorada por git (contiene el dominio
de producción hardcodeado). Al crear un nuevo sitio, recrear los dos archivos
manualmente con el dominio correcto y subirlos por SFTP.
