# UI Development

> **AI Assistant Guide**: Reference for creating admin UI classes — main interfaces, subinterfaces, data grids, and forms. Read `architecture-overview.md` first and `module-development.md` for the underlying manager/item that the UI will display.

---

## Class Hierarchy

```
mwmod_mw_ui_main_uimainabsajax        ← main interface (admin panel root)
    └── mwmod_mw_ui2_def_main_admin   ← default themed main interface

mwmod_mw_ui_sub_uiabs                 ← base for all subinterfaces
    ├── mwmod_mw_ui_base_basesubuia   ← subinterface with child subinterfaces
    ├── mwmod_mw_ui_base_basesubui    ← simple content subinterface
    ├── mwmod_mw_ui_base_dxtbladmin   ← DevExtreme data grid (manager-based)
    └── mwmod_mw_ui_base_dxtbladminquery  ← DevExtreme data grid (custom query)
```

---

## Main Interface

The admin panel entry point. Registered as a submanager in `src/app/init.php` or in `ap.php`.

```php
// mam/uiadmin/main.php
class mwap_mam_uiadmin_main extends mwmod_mw_ui2_def_main_admin {
    function __construct($cod, $ap) {
        $this->session_key = "mammainui";
        $this->su_cods_for_side = "users,cfg,uidebug,system";
        parent::__construct($cod, $ap);
    }
}
```

`su_cods_for_side` controls which sidebar sections appear. Each code maps to a submanager registered in the framework or in the project.

---

## Subinterface with Children (`basesubuia`)

Use when a menu item has multiple sub-tabs or sections.

```php
class mwap_mam_sales_uiadmin extends mwmod_mw_ui_base_basesubuia {
    function __construct($cod, $parentUI) {
        $this->init_as_main_or_sub($cod, $parentUI);
        $this->set_def_title($this->lng_get_msg_txt("sales", "Sales"));
        $this->mnuIconClass = "fa fa-shopping-cart";
        $this->sucods = "list,new,edit";
        $this->subinterface_def_code = "list";
    }

    function _do_create_subinterface_child_list($cod) {
        return new mwap_mam_sales_uiadmin_list($cod, $this);
    }

    function _do_create_subinterface_child_new($cod) {
        return new mwap_mam_sales_uiadmin_new($cod, $this);
    }

    function _do_create_subinterface_child_edit($cod) {
        return new mwap_mam_sales_uiadmin_edit($cod, $this);
    }
}
```

One `_do_create_subinterface_child_{code}()` method per entry in `$sucods`.

---

## Simple Subinterface (`basesubui`)

Use for a single content page with no sub-tabs.

```php
class mwap_mam_sales_uiadmin_new extends mwmod_mw_ui_base_basesubui {
    function __construct($cod, $parentUI) {
        $this->init_as_main_or_sub($cod, $parentUI);
        $this->set_def_title($this->lng_get_msg_txt("new", "New"));
    }

    function do_exec_page_in() {
        $container = $this->get_ui_dom_elem_container();
        $container->addClass("container-fluid py-3");
        // build content here
        echo $container->get_as_html();
    }
}
```

---

## Data Grid (`dxtbladmin`)

Use for listing and editing table rows with built-in CRUD.

```php
class mwap_mam_sales_uiadmin_list extends mwmod_mw_ui_base_dxtbladmin {
    function __construct($cod, $parentUI) {
        $this->init_as_main_or_sub($cod, $parentUI);
        $this->set_def_title($this->lng_get_msg_txt("list", "List"));
        $this->js_ui_class_name = "mw_ui_grid_remote";
        $this->editingMode = "cell";   // row | cell | batch | form
    }

    // Override load_items_man(), NOT getItemsMan()
    function load_items_man() {
        return $this->mainap->mainMan->salesMan;
    }

    function allowInsert() { return $this->is_allowed() && $this->allow("editor"); }
    function allowUpdate() { return $this->is_allowed(); }
    function allowDelete() { return $this->allow_admin(); }

    function add_cols($datagrid) {
        $col = $datagrid->add_column_number("id", "ID");
        $col->js_data->set_prop("visible", false);

        $col = $datagrid->add_column_string("sales_code", $this->lng_get_msg_txt("code", "Code"));
        $col = $datagrid->add_column_number("amount", $this->lng_get_msg_txt("amount", "Amount"));
    }
}
```

**Critical:** override `load_items_man()`, never `getItemsMan()`. Use `$this->get_items_man()` when you need the manager in other methods like `add_cols()`.

---

## Data Grid with Custom Query (`dxtbladminquery`)

Use when you need JOINs, calculated fields, or complex filters.

```php
class mwap_mam_sales_uiadmin_report extends mwmod_mw_ui_base_dxtbladminquery {
    function __construct($cod, $parentUI) {
        $this->init_as_main_or_sub($cod, $parentUI);
        $this->set_def_title($this->lng_get_msg_txt("report", "Report"));
        $this->js_ui_class_name = "mw_ui_grid_remote";
    }

    function load_items_man() {
        return $this->mainap->mainMan->salesMan;
    }

    function afterGetQuery($query) {
        // Add a LEFT JOIN
        $join = $query->from->add_from_join_external(
            "clients", "sales.client_id", "id", "cl"
        );
        $join->set_as_mode();

        $query->select->add_select("sales.*");
        $query->select->add_select("cl.name", "client_name");
    }

    function setDefaultQuerySort($query) {
        $query->order->add_order("sales.created_at", "desc");
    }
}
```

---

## Forms (`jsobj_inputs`)

**Do NOT use native HTML forms or DevExtreme form components.** Always use `mwmod_mw_jsobj_inputs_*`.

```php
function do_exec_page_in() {
    $container = $this->get_ui_dom_elem_container();

    $frm = new mwmod_mw_jsobj_inputs_frmonpanel($this);
    $frm->setTitle($this->lng_get_msg_txt("new_sale", "New Sale"));
    $frm->setSaveUrl($this->get_sxml_url("savesale"));

    $mainGr = $frm->getMainGr();

    // Text input
    $input = $mainGr->addNewChild("sales_code", "input");
    $input->setLabel($this->lng_get_msg_txt("code", "Code"));
    $input->setRequired(true);

    // Textarea
    $input = $mainGr->addNewChild("notes", "textarea");
    $input->setLabel($this->lng_get_msg_txt("notes", "Notes"));

    // Number
    $input = $mainGr->addNewNumber("amount");
    $input->setLabel($this->lng_get_msg_txt("amount", "Amount"));
    $input->setMin(0);

    // Select
    $input = $mainGr->addNewSelect("status");
    $input->setLabel($this->lng_get_msg_txt("status", "Status"));
    $input->add_select_option("active",   $this->lng_get_msg_txt("active", "Active"));
    $input->add_select_option("inactive", $this->lng_get_msg_txt("inactive", "Inactive"));

    // Date (no time)
    $input = $mainGr->addNewDate("sale_date");
    $input->setLabel($this->lng_get_msg_txt("date", "Date"));
    $input->setNoHour(true);

    // Checkbox
    $input = $mainGr->addNewCheckbox("is_paid", $this->lng_get_msg_txt("paid", "Paid"));

    $frm->append_to_container($container);
    echo $container->get_as_html();
}
```

### Common input properties

```php
$input->setLabel("Label");
$input->setPlaceholder("...");
$input->setNotes("Help text below the field");
$input->set_value("default");
$input->setRequired(true);
$input->setReadOnly(true);
```

### Input types via `addNewChild()`

| Type string | Use for |
|---|---|
| `"input"` | Single-line text |
| `"textarea"` | Multi-line text |
| `"checkbox"` | Boolean toggle |
| `"password"` | Password field |
| `"input"` + `setFileMode(".pdf")` | File upload |

### Factory shortcuts

| Method | Creates |
|---|---|
| `addNewNumber($name)` | Numeric input with min/max/int |
| `addNewSelect($name)` | Dropdown |
| `addNewDate($name)` | Date/time picker |
| `addNewCheckbox($name, $label)` | Checkbox shorthand |
| `addNewColorPicker($name, $label)` | Color picker |
| `addNewHtml($name, $html)` | Raw HTML inside form |
| `addNewBtn($name)` | Button with JS click handler |
| `addNewGr($name)` | Grouped inputs with optional title |

---

## Subinterface Codes (hyphen separator)

When building AJAX URLs for subinterfaces, codes use `-` as separator:

```
admin                         → main interface
admin-sales                   → sales subinterface of admin
admin-sales-list              → list sub of sales
```

Use `$this->get_sxml_url("command")` to generate the correct URL for the current subinterface.
