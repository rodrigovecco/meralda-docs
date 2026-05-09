# Optional Modules

Private modules that can be added to a Meralda project as Git submodules. Unless otherwise noted, all repos are owned by `rodrigovecco` and require deploy key access.

## Available modules

| Module | Description | Repos |
|---|---|---|
| [MeraldaX](meraldaX.md) | Extended framework utilities and UI tools | 2 (backend + public) |
| [MeraldaTSX](meraldaTSX.md) | Commerce module: products, sales, stock, cart | 2 (backend + public) |
| [Digital Sales](digitalsales.md) | Digital sales: orders, payments, file delivery | 1 (backend only) |

---

## Deploy Key Setup

### Requesting access

Provide the **public key** for your machine or server to `rodrigovecco`. A deploy key will be added per repo. Each environment (dev, staging, production) needs its own key.

### Generate a key pair on the target machine

```bash
ssh-keygen -t ed25519 -C "deploy-MACHINENAME" -f ~/.ssh/deploy_meralda_modules -N ""
```

Send `~/.ssh/deploy_meralda_modules.pub` to the repo owner.

### SSH config alias pattern

Each private repo needs a named alias in `~/.ssh/config`:

```
Host github-REPONAME
    HostName github.com
    User git
    IdentityFile ~/.ssh/deploy_meralda_modules
    IdentitiesOnly yes
```

`IdentitiesOnly yes` is required — prevents SSH from trying other loaded keys first.

### Adding the submodule

```bash
git submodule add git@github-REPONAME:rodrigovecco/REPONAME.git PATH/IN/PROJECT
```

The `.gitmodules` entry uses the alias host (`github-REPONAME`), not `github.com` directly.

### On a new machine or server

1. Generate or copy the key pair for that environment.
2. Request deploy key access from `rodrigovecco` for each required module.
3. Add alias blocks to `~/.ssh/config`.
4. Run `git submodule update --init --recursive`.

---

## Adding a new module

Create a file `docs/modules/MODULENAME.md` following the structure of [meraldaX.md](meraldaX.md), then add a row to the table above.
