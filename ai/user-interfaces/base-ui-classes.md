# Base UI Classes Overview

This document explains the main base classes used for creating user interfaces in Meralda-based applications.

## Main Base Classes

### mwmod_mw_ui_base_basesubuia

**Purpose:** Base class for interfaces with subinterfaces (tabbed or sectioned UIs).

**Location:** `src/mwap/modules/mw/ui/base/basesubuia.php`

**When to use:** When you need a main interface that contains multiple sub-sections or tabs.

**Key properties to set:**

```php
public $sucods = "list,view,edit";           // Comma-separated subinterface codes
public $subinterface_def_code = "list";      // Default subinterface
public $mnuIconClass = "fa fa-icon-name";    // Icon for menu
```

**Required methods to implement:**

```php
function _do_create_subinterface_child_[code]($cod){
    $ui = new Your_Subinterface_Class($cod, $this);
    return $ui;	
}
```

**Example:**

```php
class mwap_projectname_feature_uiadmin extends mwmod_mw_ui_base_basesubuia{
    function __construct($cod, $parentUI){
        $this->init_as_main_or_sub($cod, $parentUI);
        $this->set_def_title($this->lng_get_msg_txt("feature","Feature Name"));
        $this->mnuIconClass = "fa fa-icon-name";
        $this->sucods = "list,new,edit";
        $this->subinterface_def_code = "list";
    }
    
    function _do_create_subinterface_child_list($cod){
        $ui = new mwap_projectname_feature_uiadmin_list($cod, $this);
        return $ui;	
    }
    
    function _do_create_subinterface_child_new($cod){
        $ui = new mwap_projectname_feature_uiadmin_new($cod, $this);
        return $ui;	
    }
}
```

---

### mwmod_mw_ui_base_basesubui

**Purpose:** Base class for simple subinterfaces (content pages without further subinterfaces).

**Location:** `src/mwap/modules/mw/ui/base/basesubui.php`

**When to use:** For detail pages, views, or any UI that doesn't need subinterfaces.

**Required methods to implement:**

```php
function do_exec_page_in(){
    // Render your page content here
    $container = $this->get_ui_dom_elem_container();
    // Add content to container
    echo $container->get_as_html();
}
```

**Example:**

```php
class mwap_projectname_feature_uiadmin_item_view extends mwmod_mw_ui_base_basesubui{
    function __construct($cod, $parentUI){
        $this->init_as_main_or_sub($cod, $parentUI);
        $this->set_def_title($this->lng_get_msg_txt("view","View"));
    }
    
    function do_exec_page_in(){
        $container = $this->get_ui_dom_elem_container();
        $container->addClass("container-fluid py-3");
        // Build your UI
        echo $container->get_as_html();
    }
}
```

---

### mwmod_mw_ui_base_dxtbladmin

**Purpose:** Base class for DevExtreme data grid with CRUD operations.

**Location:** `src/mwap/modules/mw/ui/base/dxtbladmin.php`

**When to use:** For admin grids that display database table data with optional editing.

**Key properties to set:**

```php
public $editingMode = "row";              // "row", "cell", "batch", or "form"
public $js_ui_class_name = "mw_ui_grid_remote";  // JavaScript class
```

**Required methods to implement:**

```php
function load_items_man(){
    return $this->mainap->mainMan->yourManager;
}

function add_cols($datagrid){
    // Define grid columns
    $col = $datagrid->add_column_string("name", "Name");
    $col = $datagrid->add_column_number("id", "ID");
    // etc.
}
```

**Optional methods to override:**

```php
function allowInsert(){ 
    return $this->is_allowed() && $this->allow("editor");
}

function allowUpdate(){ 
    return $this->is_allowed();
}

function allowDelete(){ 
    return $this->allow_admin();
}

function afterDatagridCreated($datagrid, $gridhelper){
    // Add custom buttons, configure grid
}
```

**Example:**

```php
class mwap_projectname_feature_uiadmin_list extends mwmod_mw_ui_base_dxtbladmin{
    function __construct($cod, $parentUI){
        $this->init_as_main_or_sub($cod, $parentUI);
        $this->set_def_title($this->lng_get_msg_txt("list","List"));
        $this->js_ui_class_name = "mw_ui_grid_remote";
        $this->editingMode = "cell";
    }
    
    function load_items_man(){
        return $this->mainap->mainMan->featureManager;
    }
    
    function allowInsert(){ 
        return false; // Or use permission checks
    }
    
    function allowUpdate(){ 
        return $this->is_allowed();
    }
    
    function allowDelete(){ 
        return false;
    }
    
    function add_cols($datagrid){
        $col = $datagrid->add_column_number("id", $this->lng_get_msg_txt("id","ID"));
        $col->js_data->set_prop("visible", false);
        
        $col = $datagrid->add_column_string("name", $this->lng_get_msg_txt("name","Name"));
        // Add more columns...
    }
}
```

---

### mwmod_mw_ui_base_dxtbladminquery

**Purpose:** Similar to dxtbladmin but uses custom SQL queries instead of manager's default query.

**Location:** `src/mwap/modules/mw/ui/base/dxtbladminquery.php`

**When to use:** When you need custom queries (joins, complex filters) instead of simple table queries.

**Additional methods to implement:**

```php
function afterGetQuery($query){
    // Modify the query (add filters, joins, etc.)
    $query->where->add_where_crit("field", "value");
}

function setDefaultQuerySort($query){
    $query->order->add_order("field_name", "desc");
}
```

---

## Common Patterns

### Accessing Parent Subinterface

From a child subinterface:

```php
$this->parent_subinterface  // Direct parent
$this->maininterface        // Main interface (top level)
```

### Getting Another Subinterface

```php
// Get sibling subinterface
$subui = $this->parent_subinterface->get_subinterface("code");

// Get from main interface
$subui = $this->maininterface->get_subinterface("code");
```

### URL Generation

```php
// Get URL for a subinterface
$url = $subui->get_url();

// With parameters
$url = $subui->get_url(["param" => "value"]);
```

### Getting Request Parameters

```php
$id = $this->getRequestedParam("param_name");
```

### Setting Request Parameters

```php
$this->setRequestParam("param_name", $value);
```

---

## UI Hierarchy Example

```
Main Interface (basesubuia)
├── List Subinterface (dxtbladmin)
├── New Subinterface (basesubui)
└── Item Interface (basesubuia)
    ├── View Subinterface (basesubui)
    └── Edit Subinterface (basesubui)
```

Code structure:

```
main.php              → extends basesubuia, sucods="list,new,item"
├── list.php          → extends dxtbladmin
├── new.php           → extends basesubui
└── item.php          → extends basesubuia, sucods="view,edit"
    ├── view.php      → extends basesubui
    └── edit.php      → extends basesubui
```

---

## Initialization Pattern

All UI classes follow this pattern:

```php
function __construct($cod, $parentUI){
    $this->init_as_main_or_sub($cod, $parentUI);
    $this->set_def_title($this->lng_get_msg_txt("key", "Default Text"));
    // Set other properties
}
```

---

## Permission Checking

```php
function is_allowed(){
    return $this->allow("role_name");  // Check single role
}

function is_allowed(){
    return $this->allow_admin();       // Admin only
}
```

---

## Important Notes

1. **sucods items appear in menus** - Only add codes you want visible in navigation
2. **Hidden subinterfaces** - Create `_do_create_subinterface_child_*` method without adding to sucods
3. **Always call parent constructor** - Use `$this->init_as_main_or_sub($cod, $parentUI)`
4. **Set titles early** - Call `set_def_title()` in constructor

---

## Related Documentation

- [Data Grid Interfaces](./datagrid.md)
- [System Initialization Guide](../system-initialization-guide.md)
