# MeraldaX

Extended framework utilities and UI tools for Meralda projects. Provides additional UI components, tools, and integrations beyond the base `mw` module.

---

## Repos

| Role | Repo | SSH URL | Path in project |
|---|---|---|---|
| Backend module | `meraldax` | `git@github.com:rodrigovecco/meraldax.git` | `src/mwap/modules/mwx` |
| Public resources | `meraldaXpublicRes` | `git@github.com:rodrigovecco/meraldaXpublicRes.git` | `src/public_html/res/modules/mwx` |

Both repos are required together. The backend module is autoloaded under the prefix `mwx`; the public resources are served statically.

---

## Installation

### 1. Request deploy keys

Ask `rodrigovecco` for deploy keys for both `meraldax` and `meraldaXpublicRes` (see [README.md](README.md) for key generation instructions).

### 2. Add SSH config aliases

```
Host github-meraldax
    HostName github.com
    User git
    IdentityFile ~/.ssh/deploy_meralda_modules
    IdentitiesOnly yes

Host github-meraldaXpublicRes
    HostName github.com
    User git
    IdentityFile ~/.ssh/deploy_meralda_modules
    IdentitiesOnly yes
```

### 3. Add submodules

```bash
git submodule add git@github-meraldax:rodrigovecco/meraldax.git src/mwap/modules/mwx
git submodule add git@github-meraldaXpublicRes:rodrigovecco/meraldaXpublicRes.git src/public_html/res/modules/mwx
```

### 4. `.gitmodules` entries (result)

```ini
[submodule "src/mwap/modules/mwx"]
    path = src/mwap/modules/mwx
    url = git@github-meraldax:rodrigovecco/meraldax.git

[submodule "src/public_html/res/modules/mwx"]
    path = src/public_html/res/modules/mwx
    url = git@github-meraldaXpublicRes:rodrigovecco/meraldaXpublicRes.git
```

### 5. Register the autoloader prefix

In `src/app/init.php`, add after the existing `create_and_add_sub_pref_man` calls:

```php
$GLOBALS["__mw_autoload_manager"]->create_and_add_sub_pref_man(
    "mwx",
    dirname(dirname(__FILE__))."/mwap/modules/mwx"
);
```

---

## Class naming

All classes in the backend module follow the convention `mwmod_mwx_*`.
