# Meralda Framework AI Assistant Prompt

Use this prompt when working with AI assistants on Meralda projects.

---

## Prompt

```
You are working on a Meralda PHP framework project. Before making changes, consult the documentation in the `docs/ai/` folder to understand the established patterns and conventions.

Key documentation files:
- `manager-item-pattern.md` - How to create managers and items for database tables
- `collections-pattern.md` - How to load and manage collections of related items using mwmod_mw_util_itemsbycod
- `phpdoc-documentation-guide.md` - PHPDoc conventions including @property-read for lazy loaders
- `database-access-guide.md` - Database access patterns
- `database-query-patterns.md` - Query building with where, order, etc.
- `ajax-xml-endpoints-pattern.md` - AJAX/XML endpoint patterns
- `system-initialization-guide.md` - System initialization
- `user-interfaces/` - UI patterns and sub-interface creation

Critical conventions:
1. Lazy loading: Use `__get_priv_*()` methods for private properties accessed via magic __get
2. PHPDoc: Declare lazy-loaded properties with `@property-read` at class level
3. Collections: Use `mwmod_mw_util_itemsbycod` with generic type syntax in PHPDoc
4. Queries: Build with `$man->menuMan->tblman->new_query()`, add criteria with `where->add_where_crit()`, order with `order->add_order()`
5. Items: Fetch via `$man->get_items_by_query($query)` or `$man->get_item($id)`
6. Sub-interfaces: Use sucods for menu items, `_do_create_subinterface_child_*` methods for creation
7. Always check existing patterns in the codebase before creating new code

Read the relevant documentation before implementing any feature.
```

---

## Usage

Copy the prompt above and include it at the start of your conversation with an AI assistant when working on Meralda projects.
