# Adding Buttons to DevExtreme Data Grid Interfaces

This guide explains how to add action buttons (like view, edit, custom actions) to data grid rows in Meralda-based applications using DevExtreme.

## Overview

Data grids in the framework typically extend `mwmod_mw_ui_base_dxtbladmin` or `mwmod_mw_ui_base_dxtbladminquery`. To add buttons to grid rows, use the `afterDatagridCreated()` method.

## Basic Pattern

### Step 1: Override afterDatagridCreated Method

```php
function afterDatagridCreated($datagrid, $gridhelper){
    // Add a DevExtreme buttons column
    $list = $gridhelper->get_array_prop("columnsExtra");
    $coljs = new mwmod_mw_jsobj_obj();
    $list->add_data($coljs);
    $coljs->set_prop("type", "buttons");
    $btns = $coljs->get_array_prop("buttons");
    
    // Add individual buttons here
}
```

### Step 2: Add Button Configuration

```php
$btnjs = new mwmod_mw_jsobj_obj();
$btns->add_data($btnjs);
$btnjs->set_prop("icon", "tags"); // DevExtreme icon name
```

### Step 3: Add Button Click Handler

```php
$fnc = new mwmod_mw_jsobj_functionext();
$fnc->add_fnc_arg("e");

// Get the subinterface to link to
if($subui = $this->parent_subinterface->get_subinterface("target")){
    $url = $subui->get_url();
    $fnc->add_cont("var url='{$url}&param='+e.row.data.id;");
    $fnc->add_cont("window.location=url;");
}

$btnjs->set_prop("onClick", $fnc);
```

## Complete Example

Generic example - adding a view button to records:

```php
function afterDatagridCreated($datagrid, $gridhelper){
    // Add a DevExtreme buttons column that links to the detail view UI
    $list = $gridhelper->get_array_prop("columnsExtra");
    $coljs = new mwmod_mw_jsobj_obj();
    $list->add_data($coljs);
    $coljs->set_prop("type", "buttons");
    $btns = $coljs->get_array_prop("buttons");

    $btnjs = new mwmod_mw_jsobj_obj();
    $btns->add_data($btnjs);
    $btnjs->set_prop("icon", "tags");

    $fnc = new mwmod_mw_jsobj_functionext();
    $fnc->add_fnc_arg("e");
    if($subui = $this->parent_subinterface->get_subinterface("item")){
        $url = $subui->get_url();
        $fnc->add_cont("var url='{$url}&item_id='+e.row.data.id;");
        $fnc->add_cont("window.location=url;");
    }
    $btnjs->set_prop("onClick", $fnc);
}
```

## Important Concepts

### Getting Target Subinterface

**From parent subinterface (most common):**
```php
$subui = $this->parent_subinterface->get_subinterface("target");
```

Use this when the target subinterface is a sibling (both are children of the same parent).

**From main interface:**
```php
$subui = $this->maininterface->get_subinterface("target");
```

Use this when the target is at the main interface level.

### Target Subinterface Registration

The target subinterface does NOT need to be in `sucods` (menu items). It only needs to have a `_do_create_subinterface_child_*` method in its parent:

```php
// In parent interface (e.g., uiadmin.php)
function _do_create_subinterface_child_visit($cod){
    $ui = new mwap_crmba_visits_uiadmin_visit($cod, $this);
    return $ui;	
}
```

This allows the subinterface to be accessed via `get_subinterface()` without appearing in menus.

### URL Parameters

Pass row data to the target page via URL parameters:

```php
// Single parameter
$fnc->add_cont("var url='{$url}&item_id='+e.row.data.id;");

// Multiple parameters
$fnc->add_cont("var url='{$url}&id='+e.row.data.id+'&type='+e.row.data.type;");
```

The target subinterface retrieves these via:

```php
$id = $this->getRequestedParam("item_id");
```

## Multiple Buttons

Add multiple buttons to the same column:

```php
function afterDatagridCreated($datagrid, $gridhelper){
    $list = $gridhelper->get_array_prop("columnsExtra");
    $coljs = new mwmod_mw_jsobj_obj();
    $list->add_data($coljs);
    $coljs->set_prop("type", "buttons");
    $btns = $coljs->get_array_prop("buttons");

    // View button
    $btnjs = new mwmod_mw_jsobj_obj();
    $btns->add_data($btnjs);
    $btnjs->set_prop("icon", "tags");
    $fnc = new mwmod_mw_jsobj_functionext();
    $fnc->add_fnc_arg("e");
    // ... view button logic
    $btnjs->set_prop("onClick", $fnc);

    // Edit button
    $btnjs2 = new mwmod_mw_jsobj_obj();
    $btns->add_data($btnjs2);
    $btnjs2->set_prop("icon", "edit");
    $fnc2 = new mwmod_mw_jsobj_functionext();
    $fnc2->add_fnc_arg("e");
    // ... edit button logic
    $btnjs2->set_prop("onClick", $fnc2);
}
```

## Common DevExtreme Icons

- `tags` - View/detail icon
- `edit` - Edit icon
- `trash` - Delete icon
- `plus` - Add/create icon
- `search` - Search icon
- `refresh` - Refresh icon
- `download` - Download icon
- `export` - Export icon

Full list: [DevExtreme Icons](https://js.devexpress.com/Documentation/Guide/Themes_and_Styles/Icons/)

## Conditional Buttons

Show buttons only for certain rows:

```php
$fnc = new mwmod_mw_jsobj_functionext();
$fnc->add_fnc_arg("e");
$fnc->add_cont("if(e.row.data.status !== 'completed'){");
$fnc->add_cont("  return;");
$fnc->add_cont("}");
$fnc->add_cont("var url='{$url}&id='+e.row.data.id;");
$fnc->add_cont("window.location=url;");
$btnjs->set_prop("onClick", $fnc);
```

Or use the `visible` property:

```php
$visibleFnc = new mwmod_mw_jsobj_functionext();
$visibleFnc->add_fnc_arg("e");
$visibleFnc->add_cont("return e.row.data.status === 'completed';");
$btnjs->set_prop("visible", $visibleFnc);
```

## Button Hints (Tooltips)

Add tooltips to buttons:

```php
$btnjs->set_prop("hint", $this->lng_get_msg_txt("view_details", "Ver detalles"));
```

## Custom Actions (Non-Navigation)

For actions that don't navigate to another page:

```php
$fnc = new mwmod_mw_jsobj_functionext();
$fnc->add_fnc_arg("e");
$fnc->add_cont("if(confirm('Are you sure?')){");
$fnc->add_cont("  // AJAX call or other action");
$fnc->add_cont("  console.log('Action for item: ' + e.row.data.id);");
$fnc->add_cont("}");
$btnjs->set_prop("onClick", $fnc);
```

## Best Practices

1. **Always check if target subinterface exists** before generating URL
2. **Use parent_subinterface** for sibling subinterfaces (most common pattern)
3. **Don't add target to sucods** if it shouldn't appear in menu
4. **Use meaningful icon names** that match the action
5. **Add hints/tooltips** for better UX
6. **Pass necessary parameters** via URL for the target page to load data

## Related Files

- Base class: `src/mwap/modules/mw/ui/base/dxtbladmin.php`
- Query variant: `src/mwap/modules/mw/ui/base/dxtbladminquery.php`
- JavaScript objects: `src/mwap/core/` (mwmod_mw_jsobj_* classes)

---

**Remember:** The `afterDatagridCreated()` method is called after the grid configuration is complete, making it the perfect place to add custom button columns.
