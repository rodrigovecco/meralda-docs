# jsobj Inputs Pattern — Form Building Guide

This document explains how to build forms using the `mwmod_mw_jsobj_inputs_*` classes. These are the **only** way to create forms in Meralda UIs — do NOT use native HTML forms or DevExtreme form components.

## Overview

Forms are built as JavaScript object trees in PHP, then rendered to a DOM container via `append_to_container()`. The form handles submission, validation, and file uploads automatically.

## Key Classes

| Class | Purpose |
|---|---|
| `mwmod_mw_jsobj_inputs_frmonpanel` | Complete form with submit button |
| `mwmod_mw_jsobj_inputs_input` | Base input class |
| `mwmod_mw_jsobj_inputs_def` | Generic input (text, textarea, checkbox, password, file) |
| `mwmod_mw_jsobj_inputs_gr` | Group of related inputs |
| `mwmod_mw_jsobj_inputs_select` | Select/dropdown |
| `mwmod_mw_jsobj_inputs_number` | Numeric input with min/max/int |
| `mwmod_mw_jsobj_inputs_date` | Date/time picker |
| `mwmod_mw_jsobj_inputs_btn` | Button with click handler |
| `mwmod_mw_jsobj_inputs_html` | Raw HTML content inside form |
| `mwmod_mw_jsobj_inputs_color` | Color picker |
| `mwmod_mw_jsobj_inputs_tagbox` | Multi-tag input |
| `mwmod_mw_jsobj_inputs_btgridgr` | Bootstrap grid group |

**Location:** `src/mwap/modules/mw/jsobj/inputs/`

---

## Creating Inputs — CORRECT Methods

### ❌ WRONG — These methods do NOT exist:

```php
// NONE of these exist!
$mainGr->add_input_text("field", "Label");
$mainGr->add_input_textarea("field", "Label");
$mainGr->add_input_number("field", "Label");
$mainGr->add_input_checkbox("field", "Label");
```

### ✅ CORRECT — Use `addNewChild()` with type parameter:

```php
// Text input
$input = $mainGr->addNewChild("field_name", "input");
$input->setLabel("Label");
$input->set_value("value");

// Textarea
$input = $mainGr->addNewChild("description", "textarea");
$input->setLabel("Description");

// Checkbox
$input = $mainGr->addNewChild("active", "checkbox");
$input->setLabel("Active");
$input->set_value(true);

// Password
$input = $mainGr->addNewChild("pass", "password");
$input->setLabel("Password");

// File upload
$input = $mainGr->addNewChild("file", "input");
$input->setLabel("File");
$input->setFileMode(".pdf,.jpg,.png");  // Sets type to "file" + accepted types
```

### ✅ CORRECT — Specialized factory methods:

```php
// Number (with min/max/int)
$input = $mainGr->addNewNumber("price");
$input->setLabel("Price");
$input->setMin(0);
$input->setMax(9999);

// Select/Dropdown
$input = $mainGr->addNewSelect("category");
$input->setLabel("Category");
$input->add_select_option("1", "Option One");
$input->add_select_option("2", "Option Two");

// Date
$input = $mainGr->addNewDate("start_date");
$input->setLabel("Start Date");
$input->setNoHour(true);  // Date only, no time

// Checkbox (shorthand)
$input = $mainGr->addNewCheckbox("enabled", "Enabled");

// Color picker
$input = $mainGr->addNewColorPicker("color", "Color");

// HTML content inside form
$html = $mainGr->addNewHtml("info", "<div class='alert alert-info'>Help text</div>");

// Button
$btn = $mainGr->addNewBtn("action");
$fnc = $btn->setOnclick();
$fnc->add_cont("alert('clicked');");

// Group of inputs
$gr = $mainGr->addNewGr("address");
$gr->setTitleMode("Address Details");
$input = $gr->addNewChild("street", "input");
$input->setLabel("Street");
```

---

## Common Input Properties

```php
$input->setLabel("Label text");
$input->setPlaceholder("Placeholder");
$input->setNotes("Help text below input");
$input->set_value("default value");
$input->setRequired(true);
$input->setReadOnly(true);
$input->setDisabled(true);
```

---

## Complete Form Example (basesubui)

```php
function do_exec_no_sub_interface() {
    // REQUIRED: Load JS/CSS for inputs
    $util = new mwmod_mw_html_manager_uipreparers_ui($this);
    $util->preapare_ui();
    $item = $this->create_js_man_ui_header_declaration_item();
    $util->add_js_item($item);
    
    $jsman = $util->get_js_man();
    $jsman->add_item_by_cod_def_path("mw_objcol_adv.js");
    $jsman->add_item_by_cod_def_path("inputs/inputs.js");
    $jsman->add_item_by_cod_def_path("inputs/frm.js");
}

function do_exec_page_in() {
    // 1. Process form submission FIRST (before building form)
    $msgs = new mwmod_mw_html_elem();
    $msgs->only_visible_when_has_cont = true;
    
    $inputMan = new mwmod_mw_helper_inputvalidator_request("form_name");
    if ($inputMan->is_req_input_ok()) {
        $this->saveData($inputMan, $msgs);
    }
    
    // 2. Build form object
    $frm = new mwmod_mw_jsobj_inputs_frmonpanel();
    $mainGr = $frm->add_data_main_gr("form_name");
    
    $input = $mainGr->addNewChild("name", "input");
    $input->setLabel("Name");
    $input->set_value("current value");
    
    $frm->add_submit("Save");
    
    // 3. Build HTML container
    $container = $this->get_ui_dom_elem_container_empty();
    $container->add_cont($msgs);
    $frmContainer = $this->set_ui_dom_elem_id("frmcontainer");
    $container->add_cont($frmContainer);
    $container->do_output();
    
    // 4. Render JS — ALWAYS in do_exec_page_in()
    $js = new mwmod_mw_jsobj_jquery_docreadyfnc();
    $this->set_ui_js_params();
    $var = $this->get_js_ui_man_name();
    
    $js->add_cont($var . ".init(" . $this->ui_js_init_params->get_as_js_val() . ");\n");
    $js->add_cont("var frm=" . $frm->get_as_js_val() . ";\n");
    $js->add_cont("frm.append_to_container(" . $var . ".get_ui_elem('frmcontainer'));\n");
    
    echo $js->get_js_script_html();
}
```

**IMPORTANT:** The JS block (`mwmod_mw_jsobj_jquery_docreadyfnc` + `init()` + `append_to_container()`) MUST always be inside `do_exec_page_in()`, never in a separate method.

---

## Reading Form Data on Submit

### ❌ WRONG — These methods do NOT exist:

```php
$inputMan->get_str("field");
$inputMan->get_num("field");
$inputMan->get_bool("field");
```

### ✅ CORRECT — Use `get_value_by_dot_cod_as_list()`:

```php
$inputMan = new mwmod_mw_helper_inputvalidator_request("form_name");
if ($inputMan->is_req_input_ok()) {
    // Get all form data as associative array
    $nd = $inputMan->get_value_by_dot_cod_as_list();
    
    $name = $nd["name"] ?? "";
    $price = floatval($nd["price"] ?? 0);
    $active = !empty($nd["active"]) ? 1 : 0;
}
```

### Available data access methods:

```php
$inputMan->get_value_by_dot_cod("field.subfield");       // Single value
$inputMan->get_value_by_dot_cod_as_list("group");         // Array of values
$inputMan->get_value_by_dot_cod_as_list();                // All form data
$inputMan->get_value_by_dot_cod_as_date("date_field");    // "Y-m-d"
$inputMan->get_value_by_dot_cod_as_datetime("dt_field");  // "Y-m-d H:i:s"
```

---

## File Upload in Forms

```php
// In form building:
$input = $gr->addNewChild("file", "input");
$input->setLabel("File");
$input->setFileMode(".pdf,.jpg,.png");

// In form processing:
$nd = $inputMan->get_value_by_dot_cod_as_list();
$fileInput = $nd["file"] ?? null;
if ($fileInput && is_array($fileInput)) {
    $fileman = $this->mainap->get_submanager("fileman");
    $uploadedFileName = $fileman->process_upload_input($fileInput, $targetPath);
}
```

---

## Messages — Bootstrap Alerts

### ❌ WRONG:

```php
$msgs->set_cont_warning("text");  // Does NOT exist on mwmod_mw_html_elem
$msgs->add_cont("<div class='alert alert-danger'>text</div>");  // Raw HTML strings
```

### ✅ CORRECT:

```php
$msgs = new mwmod_mw_html_elem();
$msgs->only_visible_when_has_cont = true;

// Add alerts
$alert = new mwmod_mw_bootstrap_html_specialelem_alert("Success message", "success");
$msgs->add_cont($alert);

$alert = new mwmod_mw_bootstrap_html_specialelem_alert("Warning message", "warning");
$msgs->add_cont($alert);

$alert = new mwmod_mw_bootstrap_html_specialelem_alert("Error message", "danger");
$msgs->add_cont($alert);

$alert = new mwmod_mw_bootstrap_html_specialelem_alert("Info message", "info");
$msgs->add_cont($alert);
```

**Display modes:** `success`, `info`, `warning`, `danger`

---

## Validation

```php
// Required field (built-in)
$input->setRequired(true);

// Required with custom message
$input->addValidationRequired("This field is required");

// Email validation
$input->addValidationEmail();

// Custom validation function
$validfnc = $input->addValidation2List();
$validfnc->add_cont("var v=inputElem.get_input_value();\n");
$validfnc->add_cont("if(v.length >= 3){return true}");
$validfnc->addCont("else{inputElem.set_validation_status_error('","Min 3 chars","'); return false;}");

// Password match validation
$inputPass1->addValidation2List();
$validFnc->add_cont("var pass=inputElem.getParentChildByDotCodValue(1,'pass','');\n");
$validFnc->add_cont("var pass1=inputElem.get_input_value();\n");
$validFnc->addCont("if(pass===pass1){return true}else{inputElem.set_validation_status_error('","Passwords don't match","'); return false;}");
```

---

## Group Features

```php
// Collapsible group
$gr = $mainGr->addNewGr("details");
$gr->setTitleMode("Details");
$gr->setCollapsed(true);

// Grid layout (Bootstrap columns)
$gridGr = $mainGr->addNewGrGrid("layout");
$gridGr->addInputInCell("field1", 0, 0, "Field 1");
$gridGr->addInputInCell("field2", 0, 1, "Field 2");
```

---

## Related Documentation

- [Base UI Classes](./base-ui-classes.md)
- [HTML Element Builder](./html-elem-pattern.md)
