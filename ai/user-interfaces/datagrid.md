# Data Grid Interfaces

This document provides an overview of DevExtreme-based data grid interfaces in Meralda applications.

## Base Classes

### mwmod_mw_ui_base_dxtbladmin
Standard data grid with CRUD operations on database tables.

### mwmod_mw_ui_base_dxtbladminquery
Data grid with custom SQL queries for complex data retrieval.

## Topics

Detailed documentation for data grid interfaces:

- [Adding Buttons](./datagrid/datagrid-buttons-pattern.md) - How to add action buttons to grid rows

## Quick Start

### Basic Grid (dxtbladmin)

```php
class YourGrid extends mwmod_mw_ui_base_dxtbladmin{
    function __construct($cod, $parentUI){
        $this->init_as_main_or_sub($cod, $parentUI);
        $this->set_def_title($this->lng_get_msg_txt("grid_title","Grid Title"));
        $this->js_ui_class_name = "mw_ui_grid_remote";
        $this->editingMode = "row";
    }
    
    function load_items_man(){
        return $this->mainap->mainMan->yourManager;
    }
    
    function add_cols($datagrid){
        $col = $datagrid->add_column_string("name", $this->lng_get_msg_txt("name","Name"));
        // Add more columns
    }
}
```

### Query-Based Grid (dxtbladminquery)

```php
class YourQueryGrid extends mwmod_mw_ui_base_dxtbladminquery{
    function afterGetQuery($query){
        // Customize the query
        $query->where->add_where_crit("status", "active");
    }
    
    function setDefaultQuerySort($query){
        $query->order->add_order("created_at", "desc");
    }
}
```

## Common Operations

### Control Editing Permissions

Override these methods only if you need to restrict or allow operations based on permissions or business logic:

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
```

If not overridden, default behavior applies (usually allows all operations for allowed users).

### Add Custom Buttons

```php
function afterDatagridCreated($datagrid, $gridhelper){
    // See detailed documentation in datagrid-buttons-pattern.md
}
```

### Filter Query Results

```php
function afterGetQuery($query){
    if($user = $this->get_current_user()){
        $query->where->add_where_crit("user_id", $user->get_id());
    }
}
```

## Related Documentation

- [Base UI Classes](../base-ui-classes.md) - Overview of all UI base classes
- [System Initialization Guide](../../system-initialization-guide.md)
