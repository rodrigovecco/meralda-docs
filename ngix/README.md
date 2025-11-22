
# NGINX Migration Guide for .htaccess Rules (Meralda Sites)

This guide explains how to convert Apache `.htaccess` rules found in your Meralda-based site's `src/public_html` directory to NGINX configuration. It includes examples and a ready-to-use NGINX config snippet.

## 1. Understanding the Migration
- Apache `.htaccess` files provide per-directory configuration, often for URL rewriting, access control, and MIME types.
- NGINX does not support `.htaccess` files. All rules must be placed in the main server configuration, typically in a `server` block or included file.

## 2. Key Conversion Patterns
- **Rewrite Rules:** Use `rewrite` or `try_files` in NGINX.
- **Access Control:** Use `allow` and `deny` directives in location blocks.
- **MIME Types & Handler Restrictions:** Use `types` and `default_type`.

## 3. Example: Apache to NGINX
See `example.conf` for a real conversion based on a Meralda project.

## 4. How to Use
1. Copy the relevant sections from `nginx-meralda-includes.conf` into your NGINX server block.
2. Adjust paths as needed for your deployment.
3. Reload or restart NGINX after changes.

---

- See `example.conf` for a full example.
- See `nginx-meralda-includes.conf` for a ready-to-include config section.
