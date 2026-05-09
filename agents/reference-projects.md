# Reference Projects Setup

> **AI Assistant Guide**: Optional step after bootstrap. Asks the user which other Meralda-based projects they want agents to consult as reference, and registers them in `meralda-agent.config.yml` at the workspace root.

## When to Run

Run this step when:
- The user mentions another project they want agents to look at for examples
- The user has other Meralda projects on disk or on GitHub
- The bootstrap is complete and `meralda-agent.config.yml` exists

Skip this step if the user has no other Meralda projects to reference.

## Agent Behavior Rules

- Read `meralda-agent.config.yml` first to see what is already registered.
- Show current `reference_projects` list before asking for additions.
- Ask one project at a time if the user provides multiple.
- Never modify files inside a reference project.
- After collecting all answers, apply changes in a single edit.

---

## Step 1: Read Current State

```yaml
# meralda-agent.config.yml — reference_projects section
```

Read the file and show the current `reference_projects` list to the user.

---

## Step 2: Ask for Each Project

For each project the user wants to add, ask:

| Question | Notes |
|---|---|
| **Name** | Short identifier, no spaces (e.g. `my-other-project`) |
| **GitHub URL** | Full URL, e.g. `https://github.com/user/repo` — leave empty if none |
| **Local path** | Absolute path on disk — leave empty if not cloned locally |
| **Description** | One sentence describing the project (optional) |
| **use_for tags** | What this project is useful for — see tag list below |

### Suggested `use_for` tags

```
module structure      — how modules / ap.php / uiadmin are organized
user roles            — rol definitions and permission checks
mailer config         — SMTP setup, email templates
deployment            — server config, vhosts, deploy scripts
multi-tenant          — multi-site or multi-client patterns
db schema             — database table structure and migrations
ui customization      — admin panel look and feel
login customization   — login page, panel headers
```

The user can use any free-form tag — these are just suggestions.

---

## Step 3: Apply Changes

Add the entry to `meralda-agent.config.yml`. If `reference_projects` is currently `[]`, replace it with a proper list.

```yaml
reference_projects:
  - name: "project-name"
    github_url: "https://github.com/user/repo"
    local_path: ""           # empty if not cloned locally
    description: "Short description"
    use_for:
      - "module structure"
      - "user roles"
```

**Fallback rule for agents reading this config:**
1. If `local_path` is set and exists on disk → use `read_file`, `grep_search`, `file_search`
2. If `local_path` is empty or does not exist → use `github_repo` or `github_text_search` with `github_url`
3. Never modify files inside a reference project under any circumstance

---

## Step 4: Confirm and Repeat

Show the updated entry to the user and ask if they want to add another project.

Continue until the user says they are done.
