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

**IMPORTANT:** Override `load_items_man()` to specify which manager to use. Do NOT override `getItemsMan()`. 
The base class provides `get_items_man()` (final method) which calls your `load_items_man()` internally and caches the result.
When you need to access the manager in other methods like `add_cols()`, use `$this->get_items_man()`.

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

---

## Selection and Bulk Actions

Checkbox selection needs **two** properties; with only the first one the rows
are selectable but nothing shows it:

```php
function afterDatagridCreated($datagrid, $gridhelper){
    parent::afterDatagridCreated($datagrid, $gridhelper);

    $datagrid->js_props->set_prop("selection.mode", "multiple");
    $datagrid->js_props->set_prop("selection.showCheckBoxesMode", "always");

    // Toolbar button that posts the selected keys to your own endpoint
    $var = $this->get_js_ui_man_name();
    $items = $datagrid->js_props->get_array_prop("toolbar.items");
    $btn = $items->add_data_obj();
    $btn->set_prop("widget", "dxButton");
    $btn->set_prop("options.text", $this->lng_get_msg_txt("delete_selected", "Eliminar seleccionados"));

    $fnc = new mwmod_mw_jsobj_functionext();
    $fnc->add_cont("my_delete_selected(" . $var . ", "
        . json_encode($this->get_exec_cmd_json_url("deleteselected")) . ");");
    $btn->set_prop("options.onClick", $fnc);
}
```

On the JS side the grid instance hangs off the UI object as `grid`:

```javascript
function my_delete_selected(ui, url) {
    var keys = ui.grid.getSelectedRowKeys();   // array of row ids
    // POST keys to `url`, then reload
}
```

The global variable is `uiman_` plus the parent chain joined by `_`
(`get_full_cod("_")`), for example `uiman_share_list` for `ui=share&sui=list`.
It does **not** include the main interface code: `uiman_uiadmin_share_list`
does not exist.

The endpoint itself is a `getcmd_json` method on the same subinterface:

```php
function execfrommain_getcmd_json_deleteselected($params = array(), $filename = false) {
    // json_output_data() / json_output_error() handle the headers and buffer
    return $this->json_output_data(array("ok" => true, "deleted" => $n));
}
```

---

## Traps

### The grid's AJAX commands do not inherit the page's URL parameters

The grid makes **two** separate requests: `loaddatagrid.xml` (columns) and
`loaddata.xml` (rows). The data one is built from the ui code alone, so a
parameter present in the page URL — say `&all=1` — reaches the column request
and **not** the row request. The symptom is subtle and misleading: the
conditional column appears, the rows stay filtered.

`setRequestParam()` does not help either, for the same reason: the JS rebuilds
one of the two URLs without it.

The session is the only place both requests read from:

```php
function __construct($cod, $parentUI) {
    $this->init_as_main_or_sub($cod, $parentUI);
    if ($all = $this->getRequestedParam("all")) {
        $this->set_all_view($all === "1");   // writes to $this->uiSessionDataMan
    }
}

function is_all_view() {
    return $this->uiSessionDataMan
        && (string) $this->uiSessionDataMan->get_data("all") === "1";
}
```

### `getDataSource().items()` lags behind the server

After a reload the items array can still be the previous one for a moment.
Before concluding that the endpoint returned nothing, check the network
response — the data is usually there and the assertion was simply early.

### Do not `echo` and then call the parent in `do_exec_page_in()`

Each of the two opens its own container, so the header renders twice:

```php
// ❌ two containers, header printed twice
function do_exec_page_in() {
    $container = $this->get_ui_dom_elem_container();
    $container->add_cont($bar);
    echo $container->get_as_html();
    parent::do_exec_page_in();
}
```

If something must sit above the grid, prefer a custom toolbar item.

### Superadmin checks: use the project permission, not `is_main_user()`

`$user->is_main_user()` also requires `id === 1`, so an administrator created
after the install never qualifies. Ask for the permission instead:

```php
$this->mainap->current_admin_user_allow("mainadmin");
```

### Looking up a user: `get_user()`, not `get_item()`

The users manager does not implement the generic `get_item()`, and it fails
silently — an empty cell, not an error:

```php
$user = $this->mainap->get_admin_user_manager()->get_user($id);
```

---

## Related Documentation

- [Base UI Classes](../base-ui-classes.md) - Overview of all UI base classes
- [Adding Buttons](./datagrid/datagrid-buttons-pattern.md)
- [System Initialization Guide](../../system-initialization-guide.md)
