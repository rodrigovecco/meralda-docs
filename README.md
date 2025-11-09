# Meralda Documentation

This repository contains documentation for the [Meralda PHP Framework](https://github.com/rodrigovecco/meralda).

## 📁 Documentation Structure

This documentation is organized into specialized directories to serve different audiences and purposes:

### `/ai/` - AI-Accessible Documentation

This directory contains **structured information, patterns, and recipes** specifically designed for AI assistants, code generators, and automated development tools.

**Purpose:**
- Help AI assistants understand Meralda's architecture and conventions
- Provide code generation templates and patterns
- Document common implementation recipes
- Enable AI tools to generate idiomatic Meralda code

**Contents:**
- Framework architecture overviews
- Submanager creation patterns
- UI development recipes
- Database interaction patterns
- Module development guides
- Common code snippets and templates

**For AI Tool Developers:** Files in this directory use structured formats (JSON, YAML, Markdown with frontmatter) to facilitate parsing and integration with AI systems.

### `/lng/` - Language-Specific Documentation

All human-readable documentation organized by language code:

#### `/lng/en/` - English Documentation

Complete documentation in English including:
- User guides and tutorials
- API reference documentation
- Installation and setup guides
- Best practices and patterns
- Example projects and code samples

#### `/lng/es/` - Documentación en Español

Documentación completa en español incluyendo:
- Guías de usuario y tutoriales
- Referencia de API
- Guías de instalación y configuración (WAMP, XAMPP, etc.)
- Mejores prácticas y patrones
- Proyectos de ejemplo y código
- Guías de despliegue

## 🔄 Using This Documentation as a Submodule

This repository is designed to be used as a Git submodule within Meralda-based projects.

### Default Setup

The main Meralda repository includes this documentation as a submodule at `docs/`:

```bash
# Clone Meralda with documentation
git clone --recurse-submodules https://github.com/rodrigovecco/meralda.git
```

### Adding to Your Meralda-Based Project

If you started a project from Meralda but don't have the documentation submodule, you can add it:

```bash
# Navigate to your project root
cd your-meralda-project

# Add the documentation submodule
git submodule add https://github.com/rodrigovecco/meralda-docs.git docs

# Initialize and update the submodule
git submodule update --init --recursive

# Commit the submodule addition
git add .gitmodules docs
git commit -m "Add Meralda documentation submodule"
```

### Customizing for Your Project

You can fork this documentation repository and point your project to your custom version:

1. **Fork this repository** on GitHub

2. **Update the submodule URL** in your Meralda project:
   ```bash
   cd your-meralda-project
   git config -f .gitmodules submodule.docs.url https://github.com/YOUR_USERNAME/meralda-docs.git
   git submodule sync
   git submodule update --init --recursive --remote
   ```

3. **Make your changes** in `docs/` and commit to your fork

4. **Pull upstream updates** from the official documentation:
   ```bash
   cd docs
   git remote add upstream https://github.com/rodrigovecco/meralda-docs.git
   git fetch upstream
   git merge upstream/main
   ```

### Benefits of This Approach

- ✅ Keep framework documentation updated
- ✅ Maintain project-specific documentation separately
- ✅ Contribute improvements back to the community
- ✅ Choose which documentation updates to adopt
- ✅ Version your documentation independently

## 🤝 Contributing

We welcome contributions to improve the Meralda documentation!

### How to Contribute

1. Fork this repository
2. Create a feature branch (`git checkout -b feature/improve-docs`)
3. Make your changes
4. Commit your changes (`git commit -am 'Add detailed submanager guide'`)
5. Push to the branch (`git push origin feature/improve-docs`)
6. Create a Pull Request

### Documentation Guidelines

- **Be clear and concise** - Write for developers of all skill levels
- **Include examples** - Show practical code examples
- **Keep it updated** - Ensure documentation matches current framework version
- **Multilingual** - When adding English docs, consider Spanish translations
- **AI-friendly** - Structure AI docs for easy parsing and interpretation

##  If You Cloned Before Submodules Were Added

If you cloned the Meralda repository before the submodules were introduced, you'll need to add them manually. The Meralda framework uses several submodules for different components:

### All Meralda Submodules

1. **Documentation** (`docs/`)
   - Repository: [meralda-docs](https://github.com/rodrigovecco/meralda-docs.git)
   - Contains all framework documentation, guides, and AI-accessible patterns

2. **Core MW Modules** (`src/mwap/modules/mw/`)
   - Repository: [meralda_mw_modules](https://github.com/rodrigovecco/meralda_mw_modules.git)
   - Core framework modules and functionality

3. **JavaScript Resources** (`src/public_html/res/js/`)
   - Repository: [meralda_js_submodule](https://github.com/rodrigovecco/meralda_js_submodule.git)
   - JavaScript libraries and utilities

4. **CSS Resources** (`src/public_html/res/css/`)
   - Repository: [meralda_css](https://github.com/rodrigovecco/meralda_css.git)
   - Stylesheets and CSS resources

5. **Third-Party Libraries** (`src/public_html/res/thirdparty/`)
   - Repository: [meralda-thirdparty-public](https://github.com/rodrigovecco/meralda-thirdparty-public.git)
   - External libraries and dependencies

### Adding All Submodules Manually

If you need to add all submodules to an existing clone:

```bash
# Navigate to your Meralda project root
cd your-meralda-project

# Add all submodules
git submodule add https://github.com/rodrigovecco/meralda-docs.git docs
git submodule add https://github.com/rodrigovecco/meralda_mw_modules.git src/mwap/modules/mw
git submodule add https://github.com/rodrigovecco/meralda_js_submodule.git src/public_html/res/js
git submodule add https://github.com/rodrigovecco/meralda_css.git src/public_html/res/css
git submodule add https://github.com/rodrigovecco/meralda-thirdparty-public.git src/public_html/res/thirdparty

# Initialize and update all submodules
git submodule update --init --recursive

# Commit the changes
git add .gitmodules docs src/mwap/modules/mw src/public_html/res/js src/public_html/res/css src/public_html/res/thirdparty
git commit -m "Add all Meralda submodules"
```

### Quick Update Command

If you already have the `.gitmodules` file but haven't initialized the submodules:

```bash
git submodule update --init --recursive
```

---

## �📝 License

This documentation is part of the Meralda project and is released under the same [MIT License](https://github.com/rodrigovecco/meralda/blob/main/LICENSE).

## 🐱 About Meralda

Meralda is a comprehensive PHP framework with over 20 years of evolution, named after a beloved cat who inspired creativity and companionship. 

Learn more at: [github.com/rodrigovecco/meralda](https://github.com/rodrigovecco/meralda)
