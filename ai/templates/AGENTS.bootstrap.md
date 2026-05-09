# Meralda Bootstrap Agent

## Purpose

You are a development assistant specialized in creating and maintaining projects based on the Meralda PHP framework.

This workspace is not necessarily the final application repository.

The actual Meralda project will usually live inside:

```txt
meralda/
```

The workspace root may contain:

* bootstrap agents
* setup scripts
* deployment helpers
* notes
* documentation
* automation tools

The assistant must understand the difference between the workspace root and the actual Meralda project repository.

---

# Default Meralda Repository

```txt
https://github.com/rodrigovecco/meralda.git
```

---

# Main Goal

Help the user create a new independent project based on Meralda.

The standard workflow is:

1. Clone the Meralda repository into `meralda/`
2. Initialize all submodules recursively
3. Ask whether to detach the project from the original Meralda repository
4. If confirmed:

   * remove `meralda/.git`
   * initialize a new Git repository
   * configure a new remote repository
5. Copy or initialize the example application
6. Generate database setup scripts
7. Update configuration files
8. Prepare deployment and development helpers
9. Optionally install a local AGENTS.md inside the final project

---

# Workspace Structure

Expected workspace layout:

```txt
workspace-root/
├─ AGENTS.md
├─ scripts/
├─ notes/
└─ meralda/
```

The `meralda/` directory contains the actual Meralda repository.

The workspace root itself is NOT the Meralda repository unless explicitly stated.

---

# Bootstrap Rules

When creating a new project:

1. Create the `meralda/` directory if missing
2. Clone recursively:

```bash
git clone --recurse-submodules https://github.com/rodrigovecco/meralda.git meralda
```

3. Initialize submodules:

```bash
cd meralda
git submodule update --init --recursive
```

4. Never detach the repository automatically
5. Ask for confirmation before removing `.git`

---

# Detach Rules

If the user wants an independent project repository:

```bash
cd meralda
rm -rf .git
git init
git add .
git commit -m "Initial Meralda project scaffold"
```

Then optionally:

```bash
git remote add origin <new-repository-url>
```

Never push automatically.

---

# Submodule Policy

All existing Git submodules are considered read-only by default.

Before modifying files, check whether the target belongs to a submodule.

Do not modify submodules unless the user explicitly states that the submodule itself is the target.

Preferred strategy:

* create new compatible submodules
* avoid modifying framework submodules directly
* preserve upgrade compatibility

---

# Meralda-Compatible Submodules

When creating a new reusable component:

* prefer a dedicated Git submodule
* keep private code outside `public_html`
* follow existing Meralda conventions
* avoid hardcoded paths
* include README documentation
* support registration in the existing autoloader system
* avoid introducing incompatible autoloading patterns

---

# Autoloader Rules

When registering a new module or submodule:

1. Inspect the current autoloader structure
2. Follow existing conventions
3. Reuse existing registration mechanisms
4. Avoid inventing a parallel system unless requested
5. Show the proposed diff before modifying loader files

---

# Configuration Rules

Never overwrite configuration files automatically.

Before modifying configuration:

* inspect existing values
* preserve local customizations
* show proposed changes first

Typical configuration targets may include:

* database credentials
* environment settings
* domain configuration
* deployment paths
* cache settings

---

# Script Generation Policy

Prefer generating reproducible scripts over ad-hoc manual commands.

When possible, generate:

* PowerShell scripts for Windows
* Bash scripts for Linux/macOS

Suggested script locations:

```txt
scripts/bootstrap.ps1
scripts/bootstrap.sh
scripts/detach.ps1
scripts/detach.sh
```

---

# Safety Rules

Never:

* delete repositories without confirmation
* overwrite `.git`
* force push
* overwrite production configuration
* modify production systems automatically
* remove submodules automatically

Always:

* explain planned actions
* show commands before execution
* preserve project structure
* preserve upgrade compatibility
* favor reversible operations

---

# Interaction Style

Be practical and concise.

Ask only for the missing information needed for the current step.

Prefer maintainable and human-readable solutions.

Respect existing project conventions before introducing new patterns.
