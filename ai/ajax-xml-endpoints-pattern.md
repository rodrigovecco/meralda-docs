# AJAX XML Endpoints Pattern in Meralda Framework

## Overview

The Meralda framework uses a specific pattern for AJAX communication between the server-side PHP code and client-side JavaScript. This pattern is implemented through methods named `execfrommain_getcmd_sxml_*` that produce XML responses consumed by JavaScript.

**This pattern is available to ALL subinterfaces** that extend `mwmod_mw_ui_sub_uiabs`, including:
- `mwmod_mw_ui_base_basesubui` - Base admin subinterfaces
- `mwmod_mw_ui_base_basesubuia` - Admin list-based interfaces  
- `mwmod_mw_ui_base_dxtbladmin` - DevExtreme grid interfaces
- Any custom subinterface extending the base class

The framework automatically routes `getcmd` requests to the appropriate method in your subinterface, making it easy to create custom AJAX endpoints for any UI component.

## How It Works - Framework Routing

### 1. The `/get` Gateway Endpoint

All AJAX commands are routed through the `/get` endpoint, which is configured in `/public_html/get/.htaccess`:

```apache
Options +FollowSymLinks
RewriteEngine on
RewriteRule  (.*) /appcmd/dosubmancmd.php
```

**URL Structure:**
```
/get/[main-ui-code]/sxml/[param1]/[value1]/[param2]/[value2]/[command].xml
```

Where:
- `[main-ui-code]` = Main UI interface manager code (e.g., `admin`)
- `sxml` = Command is always "sxml" (structured XML)
- `[param]/[value]` = Key-value pairs (e.g., `ui/admin-users`)
- `[command].xml` = Filename containing the actual subinterface command

**URL Parsing Process:**

The application (`mwmod_mw_ap_apabs`) parses the URL to extract:
1. **Manager code** - First segment after `/get/` → The **main UI interface** code (e.g., `admin`, `users`, `settings`)
2. **Command code** - Second segment → Always `sxml` for structured XML responses
3. **Parameters** - Remaining segments as key/value pairs:
   - **`ui` parameter** - The **subinterface code** (most important parameter)
   - Subinterface codes use **hyphen (`-`)** to separate nested levels: `parent-child-grandchild`
   - Example: `ui/admin-users` or `ui/settings-security-permissions`
   - Other parameters: `itemid/123`, `status/active`, etc.
4. **Filename** - If parameter count is odd, last segment is the filename (e.g., `updatestatus.xml`)

**The actual subinterface command** is extracted from the filename (before the extension).

**Example URL breakdown:**
```
/get/admin/sxml/ui/admin-users/updatestatus.xml
     ^^^^^ ^^^^ ^^ ^^^^^^^^^^^ ^^^^^^^^^^^^^^^^^
     |     |    |  |           |
     |     |    |  |           filename (contains actual command: "updatestatus")
     |     |    |  param value (subinterface: admin-users)
     |     |    param key (ui = subinterface identifier)
     |     command (always "sxml")
     manager (main UI interface)
```

**Example with nested subinterface:**
```
/get/admin/sxml/ui/settings-security-permissions/saveitem.xml
     ^^^^^ ^^^^ ^^ ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ ^^^^^^^^^^^^
     |     |    |  |                              |
     |     |    |  |                              filename: "saveitem.xml"
     |     |    |  nested subinterface (3 levels deep)
     |     |    param key (ui)
     |     command (always "sxml")
     manager (main UI interface)
```

**Another example with additional parameters:**
```
/get/admin/sxml/ui/admin-users/itemid/123/saveitem.xml
     ^^^^^ ^^^^ ^^ ^^^^^^^^^^^ ^^^^^^ ^^^ ^^^^^^^^^^^^^
     |     |    |  |           |      |   |
     |     |    |  |           |      |   filename: "saveitem.xml"
     |     |    |  |           |      value
     |     |    |  |           param key
     |     |    |  param value (subinterface)
     |     |    param key (ui = subinterface)
     |     command (always "sxml")
     manager (main UI interface)
```

The gateway then:
1. Validates the manager exists via `get_submanager($mancod)` → Gets the **main UI interface**
2. Checks if manager accepts commands via `__accepts_exec_cmd_by_url()`
3. Verifies method exists: `exec_getcmd_sxml()` (command is always "sxml")
4. Optionally bypasses user validation via `checkGetCmdOmitValidateUser()`
5. Validates the user session (unless bypassed)
6. Checks permissions via `allow_submancmd()`
7. Calls the manager's `exec_getcmd_sxml($params, $filename)` method
8. The main interface uses `$params['ui']` to identify the target subinterface
   - Subinterface hierarchy uses **hyphen (`-`)** separator: `parent-child-grandchild`
   - Example: `admin-users`, `settings-security-permissions`, `reports-sales-monthly`
9. Extracts the actual command from the filename (e.g., "saveitem" from "saveitem.xml")
10. Routes to the subinterface's `execfrommain_getcmd_sxml_saveitem()` method

### 2. Base Class Support (`mwmod_mw_ui_sub_uiabs`)

All subinterfaces inherit the ability to handle AJAX commands through the base class routing mechanism:

```php
// In mwmod_mw_ui_sub_uiabs
function exec_getcmd($cmdcod){
    // Routes to execfrommain_getcmd_sxml() which calls
    // execfrommain_getcmd_sxml_[cmdcod]() in your subinterface
    return $this->execfrommain_getcmd_sxml($cmdcod, $_REQUEST, false);
}
```

### 3. Main Interface Must Enable AJAX Commands

**CRITICAL**: For getcmd routing to work, the main UI interface (not the subinterface) must return `true` from `__accepts_exec_cmd_by_url()`:

```php
// In your main interface class (extends mwmod_mw_ui_main_uimainabsajax or similar)
function __accepts_exec_cmd_by_url(){
    return true;  // Enables AJAX command routing
}
```

**The routing flow:**

1. **Gateway level** (`/get` endpoint) - Parses URL and extracts manager/command/params/filename
   ```php
   // URL: /get/admin/sxml/ui/admin-users/saveitem.xml
   // Parsed: manager='admin', command='sxml', params=['ui'=>'admin-users'], filename='saveitem.xml'
   ```

2. **Application level** (`mwmod_mw_ap_apabs`) - Validates and routes
   ```php
   // Checks if manager accepts commands
   if(!$man->__accepts_exec_cmd_by_url()){
       return false; // Blocked!
   }
   // Calls: $man->exec_getcmd_sxml($params, 'saveitem.xml')
   ```

3. **Main interface level** - Extracts command from filename and routes to subinterface
   ```php
   // In mwmod_mw_ui_main_uimainabsajax
   function exec_getcmd_sxml($params, $filename){
       // Extract command from filename: 'saveitem.xml' → 'saveitem'
       // Routes to subinterface based on params['ui']
       // Calls subinterface's execfrommain_getcmd_sxml('saveitem', $params, $filename)
   }
   ```

4. **Subinterface level** - Your AJAX methods execute
   ```php
   // Your subinterface method gets called
   function execfrommain_getcmd_sxml_saveitem($params, $filename){
       // Your code here
   }
   ```

**Where to define `__accepts_exec_cmd_by_url()`:**

- ✅ **In main interface** (e.g., `myapp_ui_main` extending `mwmod_mw_ui_main_uimainabsajax`)
- ❌ **NOT in subinterfaces** (e.g., `myapp_admin_users`)

Most admin interfaces extend `mwmod_mw_ui_main_uimainabsajax` which already returns `true` by default, so AJAX commands work automatically.

### 4. Optional: Bypass User Validation (Advanced)

In some cases, you may want certain AJAX endpoints to work without user authentication (e.g., public APIs, captcha validation). You can implement this method in your **main interface**:

```php
// In your main interface class
function checkGetCmdOmitValidateUser($cmdcod, $params, $filename){
    // Allow specific commands without user validation
    if($cmdcod === "publicapi"){
        return true;  // Skip user validation for this command
    }
    if($cmdcod === "captcha"){
        return true;  // Public endpoint
    }
    return false;  // All other commands require authentication
}
```

**The application checks this BEFORE user validation:**

```php
// In mwmod_mw_ap_apabs
if($validateUser){
    if(method_exists($man, "checkGetCmdOmitValidateUser")){
        if($man->checkGetCmdOmitValidateUser($cmdcod, $params, $filename)){
            $validateUser = false;  // Skip authentication
        }
    }
}
```

⚠️ **Security Warning**: Only use this for truly public endpoints. Most admin operations should require authentication.

### 5. URL Pattern

Any subinterface can respond to AJAX calls via the `/get` endpoint:

```
/get/[main-ui]/sxml/[param1]/[value1]/[command].xml
```

Examples:
```
/get/admin/sxml/ui/admin-users/saveitem.xml
/get/admin/sxml/ui/admin-settings/saveoptions.xml
/get/admin/sxml/ui/dashboard-stats/loadchartdata.xml
/get/admin/sxml/ui/admin-users/userid/123/resetpassword.xml
```

**Key Points:**
- `admin` = Main UI interface manager code
- `sxml` = Command (always "sxml" for structured XML endpoints)
- `ui/admin-users` = Parameters (subinterface identifier)
- `saveitem.xml` = Filename (contains the actual command "saveitem")

**The `/get` Gateway:**

All AJAX commands are routed through `/public_html/get/` which uses `.htaccess` to redirect to `/appcmd/dosubmancmd.php`. This gateway:

1. **Parses the URL structure**: `/get/[main-ui]/sxml/[params]/[filename]`
2. **Extracts parameters** from the URL path as key-value pairs
3. **Extracts filename**: Last segment if parameter count is odd (e.g., `saveitem.xml`)
4. **Validates the manager** (main UI interface) exists and accepts commands via `__accepts_exec_cmd_by_url()`
5. **Calls** `exec_getcmd_sxml($params, $filename)` on the main interface
6. **Main interface extracts command** from filename and routes to appropriate subinterface
7. **Subinterface method executes**: `execfrommain_getcmd_sxml_[command]()`

### 6. Method Discovery

The framework looks for a method matching the pattern:

```php
function execfrommain_getcmd_sxml_[actionname]($params=array(), $filename=false)
```

If found in your subinterface class, it gets executed automatically.

### 7. The Router Method (`execfrommain_getcmd_sxml`)

The base class `mwmod_mw_ui_sub_uiabs` contains the router method that makes this work:

```php
// In mwmod_mw_ui_sub_uiabs
function execfrommain_getcmd_sxml($cmdcod, $params=array(), $filename=false){
    // Validate command code
    if(!$cmdcod = $this->check_str_key_alnum_underscore($cmdcod)){
        // Error: Invalid command
        return false;
    }
    
    // Build method name
    $method = "execfrommain_getcmd_sxml_$cmdcod";
    
    // Check if method exists in current class or any parent
    if(!method_exists($this, $method)){
        // Error: Method doesn't exist
        return false;
    }
    
    // Call the method dynamically
    return $this->$method($params, $filename);
}
```

**Key Points:**
- ✅ You **don't need to override** `execfrommain_getcmd_sxml()` - it's already implemented in the base class
- ✅ You **just add** your own `execfrommain_getcmd_sxml_[actionname]()` methods
- ✅ The router uses `method_exists()` to check if your method is available
- ✅ It works in the current class AND all parent classes (inheritance chain)
- ✅ Command codes are validated (alphanumeric + underscore only)

### 8. How To Use It

Simply add a method to your subinterface class:

```php
class myapp_admin_users extends mwmod_mw_ui_base_dxtbladmin {
    
    // The router will automatically find and call this method
    function execfrommain_getcmd_sxml_updatestatus($params=array(), $filename=false){
        $xml = $this->new_getcmd_sxml_answer(false);
        // ... your code ...
        $xml->root_do_all_output();
    }
}
```

JavaScript call:
```javascript
// URL: /get/admin/sxml/ui/admin-users/updatestatus.xml
```

The framework automatically:
1. Routes the request through `/get/[main-ui]/sxml` endpoint
2. Validates the manager (main UI interface) accepts commands via `__accepts_exec_cmd_by_url()`
3. Calls the main interface's `exec_getcmd_sxml($params, 'updatestatus.xml')` method
4. Main interface extracts command "updatestatus" from the filename
5. Routes to the subinterface's `execfrommain_getcmd_sxml_updatestatus()` method

## Creating AJAX Endpoints in ANY Subinterface

### Simple Example - Custom Action in basesubui

Even a simple admin interface can have AJAX endpoints:

```php
class myapp_admin_settings extends mwmod_mw_ui_base_basesubui {
    
    /**
     * AJAX endpoint to save application settings.
     *
     * @param array $params Request parameters (unused).
     * @param bool|string $filename Filename parameter (unused).
     * @return void Outputs XML response.
     */
    function execfrommain_getcmd_sxml_savesettings($params=array(), $filename=false){
        $xml = $this->new_getcmd_sxml_answer(false);
        $this->xml_output = $xml;
        
        // Check permissions
        if(!$this->allow_admin()){
            $xml->root_do_all_output();
            return false;
        }
        
        // Get settings from request
        $input = new mwmod_mw_helper_inputvalidator_request("settings");
        if(!$input->is_req_input_ok()){
            $xml->set_prop("error", "Invalid input");
            $xml->root_do_all_output();
            return false;
        }
        
        $settings = $input->get_value_as_list();
        
        // Save to database or config
        $this->saveApplicationSettings($settings);
        
        // Return success
        $xml->set_prop("ok", true);
        $xml->set_prop("notify.message", "Settings saved successfully");
        $xml->set_prop("notify.type", "success");
        
        $xml->root_do_all_output();
    }
}
```

JavaScript call:
```javascript
$.ajax({
    url: '/get/admin/sxml/ui/admin-settings/savesettings.xml',
    data: {
        settings: JSON.stringify({
            site_name: "My Site",
            max_upload: 10
        })
    },
    success: function(xml) {
        // Process response
    }
});
```

### Example - List Interface with Custom Action

```php
class myapp_admin_categories extends mwmod_mw_ui_base_basesubuia {
    
    /**
     * AJAX endpoint to reorder categories.
     *
     * @param array $params Request parameters (unused).
     * @param bool|string $filename Filename parameter (unused).
     * @return void Outputs XML response.
     */
    function execfrommain_getcmd_sxml_reorder($params=array(), $filename=false){
        $xml = $this->new_getcmd_sxml_answer(false);
        $this->xml_output = $xml;
        
        if(!$this->allow_admin()){
            $xml->root_do_all_output();
            return false;
        }
        
        // Get new order from request
        $order = $_REQUEST["order"] ?? null;
        if(!$order){
            $xml->set_prop("error", "No order provided");
            $xml->root_do_all_output();
            return false;
        }
        
        // Update order in database
        foreach($order as $id => $position){
            if($item = $this->items_man->get_item($id)){
                $item->do_save_data(["sort_order" => $position]);
            }
        }
        
        $xml->set_prop("ok", true);
        $xml->set_prop("notify.message", "Order updated");
        $xml->set_prop("notify.type", "success");
        
        $xml->root_do_all_output();
    }
}
```

### Example - Dashboard with Data Loading

```php
class myapp_dashboard_main extends mwmod_mw_ui_sub_uiabs {
    
    /**
     * AJAX endpoint to load dashboard statistics.
     *
     * @param array $params Request parameters (unused).
     * @param bool|string $filename Filename parameter (unused).
     * @return void Outputs XML response with stats data.
     */
    function execfrommain_getcmd_sxml_loadstats($params=array(), $filename=false){
        $xml = $this->new_getcmd_sxml_answer(false);
        $this->xml_output = $xml;
        
        if(!$this->is_allowed()){
            $xml->root_do_all_output();
            return false;
        }
        
        // Load statistics
        $stats = array(
            "total_users" => $this->getUserCount(),
            "total_sales" => $this->getSalesTotal(),
            "pending_orders" => $this->getPendingOrdersCount()
        );
        
        $xml->set_prop("ok", true);
        $xml->set_prop("stats", $stats);
        
        $xml->root_do_all_output();
    }
    
    /**
     * AJAX endpoint to load chart data.
     *
     * @param array $params Request parameters (unused).
     * @param bool|string $filename Filename parameter (unused).
     * @return void Outputs XML response with chart data.
     */
    function execfrommain_getcmd_sxml_loadchartdata($params=array(), $filename=false){
        $xml = $this->new_getcmd_sxml_answer(false);
        $this->xml_output = $xml;
        
        if(!$this->is_allowed()){
            $xml->root_do_all_output();
            return false;
        }
        
        $period = $_REQUEST["period"] ?? "week";
        $chartData = $this->getChartData($period);
        
        $xml->set_prop("ok", true);
        $xml->set_prop("chartData", $chartData);
        
        $xml->root_do_all_output();
    }
}
```

## Framework Hierarchy - Where It Works

```
mwmod_mw_ui_sub_uiabs (Base class)
  ├─ Provides: exec_getcmd() routing
  ├─ Provides: new_getcmd_sxml_answer()
  └─ Provides: XML output methods
      │
      ├─ mwmod_mw_ui_base_basesubui
      │    ├─ Admin-only permissions
      │    └─ Your custom admin interfaces
      │         └─ execfrommain_getcmd_sxml_* ← Add here!
      │
      ├─ mwmod_mw_ui_base_basesubuia  
      │    ├─ List-based rendering
      │    └─ Your custom list interfaces
      │         └─ execfrommain_getcmd_sxml_* ← Add here!
      │
      └─ mwmod_mw_ui_base_dxtbladmin
           ├─ DevExtreme grid
           ├─ Built-in CRUD endpoints
           └─ Your custom grid interfaces
                └─ execfrommain_getcmd_sxml_* ← Add here!
```

**Any class in this hierarchy can define AJAX endpoints!**

## Naming Convention

### Method Name Pattern

```php
function execfrommain_getcmd_sxml_[actionname]($params=array(), $filename=false)
```

**Components:**
- `execfrommain_` - Indicates the method is called from the main interface controller
- `getcmd_` - Signals this is a command endpoint (GET/POST request handler)
- `sxml_` - Specifies the response format is structured XML
- `[actionname]` - Describes the specific action (e.g., `loaddata`, `saveitem`, `deleteitem`)

### Common Action Names

| Action Name | Purpose | Example Method |
|------------|---------|----------------|
| `loaddata` | Load paginated data for grids | `execfrommain_getcmd_sxml_loaddata` |
| `loaddatagrid` | Load grid configuration | `execfrommain_getcmd_sxml_loaddatagrid` |
| `saveitem` | Update existing item | `execfrommain_getcmd_sxml_saveitem` |
| `newitem` | Create new item | `execfrommain_getcmd_sxml_newitem` |
| `deleteitem` | Delete item | `execfrommain_getcmd_sxml_deleteitem` |
| `savefilters` | Save user filter preferences | `execfrommain_getcmd_sxml_savefilters` |
| `savecolsstate` | Save column preferences | `execfrommain_getcmd_sxml_savecolsstate` |
| `resetcolsstate` | Reset column preferences | `execfrommain_getcmd_sxml_resetcolsstate` |

## XML Response Structure

### Basic Response Creation

All AJAX endpoints follow this pattern:

```php
function execfrommain_getcmd_sxml_actionname($params=array(), $filename=false){
    // 1. Create XML response object
    $xml = $this->new_getcmd_sxml_answer(false);
    $this->xml_output = $xml;
    
    // 2. Check permissions
    if(!$this->is_allowed()){
        $xml->root_do_all_output();
        return false;
    }
    
    // 3. Process request
    // ... business logic ...
    
    // 4. Set response properties
    $xml->set_prop("ok", true);
    $xml->set_prop("data", $result);
    
    // 5. Output XML
    $xml->root_do_all_output();
}
```

### XML Response Properties

#### Standard Properties

```php
// Success indicator
$xml->set_prop("ok", true);

// Error indicator (mutually exclusive with ok=true)
$xml->set_prop("error", "Error message");

// Data payload
$xml->set_prop("data", $dataArray);
$xml->set_prop("itemdata", $itemArray);
$xml->set_prop("itemid", $id);

// Total count for pagination
$xml->set_prop("totalCount", $total);
```

#### Notification Messages

```php
// User notification message
$xml->set_prop("notify.message", "Item saved successfully");

// Notification type: "success", "error", "warning", "info"
$xml->set_prop("notify.type", "success");

// Enable multiline display
$xml->set_prop("notify.multiline", true);
```

#### Debug Information

```php
// Debug data (only in development)
$xml->set_prop("debug.query", $query->toString());
$xml->set_prop("debug.params", $_REQUEST);
```

### Example XML Output

When `$xml->root_do_all_output()` is called, it produces XML like:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<root>
    <ok>1</ok>
    <itemid>123</itemid>
    <itemdata>
        <id>123</id>
        <name>John Doe</name>
        <email>john@example.com</email>
    </itemdata>
    <notify>
        <message>Item saved successfully</message>
        <type>success</type>
    </notify>
</root>
```

## JavaScript Client-Side Integration

### Building the URL

The JavaScript client uses the `get_xmlcmd_url()` method from the `mw_ui` base class to construct URLs:

```javascript
// Example from mw_ui_grid.js
var url = this.get_xmlcmd_url("loaddatagrid");
// Result: /get/admin/sxml/ui/admin-users/loaddatagrid.xml

// With parameters
var url = this.get_xmlcmd_url("saveitem", {itemid: 123, nd: newData});
// Result: /get/admin/sxml/ui/admin-users/saveitem.xml with POST data
```

**How `get_xmlcmd_url()` works:**

```javascript
this.get_xmlcmd_url = function(cod, queryparams, urlparams){
    // Gets the base XML URL from UI parameters (set by PHP)
    var url = this.info.get_param_or_def("xmlurl", false);
    // Example: xmlurl = "/get/admin/sxml/ui/admin-users"
    
    if(!url){
        return false;    
    }
    var u = new mw_url();
    var rest = false;
    if(cod){
        rest = cod + ".xml";  // e.g., "saveitem.xml"
    }
    
    // Combines: base URL + url params + command.xml
    url = u.get_url_from_path_as_obj(url, urlparams, rest);
    // Result: /get/admin/sxml/ui/admin-users/saveitem.xml
    
    // Adds query parameters
    return u.get_url(url, this.get_url_params_plus_default(queryparams));
}
```

**The `xmlurl` parameter is set by PHP:**

```php
// In mwmod_mw_ui_sub_uiabs::set_ui_js_params()
$r["xmlurl"] = $this->get_exec_cmd_sxml_url(false);
// Returns: /get/admin/sxml/ui/admin-users (base URL without command filename)

// Which calls main interface:
// mwmod_mw_ui_main_uimainabsajax::get_exec_cmd_sxml_url($xmlcmd, $sub_ui, $params)

// Which calls:
// get_exec_cmd_sxml_url_from_ui_full_cod($xmlcmd, $ui_full_cod, $params)

// Which builds URL using:
// get_exec_cmd_url($cmd, $params, $filename)
```

**PHP URL building (`mw_apsubbaseobj::get_exec_cmd_url`)**:

```php
function get_exec_cmd_url($cmd, $params=array(), $filename=false){
    // Gets base URL from application
    $url = $this->mainap->get_submanagerexeccmdurl();
    // Returns: "/get"
    
    // Gets manager code (main UI interface)
    $cod = $this->__get_ap_submanager_cod();
    // Example: "admin"
    
    // Builds URL path with command (always "sxml")
    $url .= "/$cod/$cmd";
    // Result: "/get/admin/sxml"
    
    // Adds parameters as path segments (e.g., subinterface identifier)
    if(is_array($params)){
        foreach($params as $c => $v){
            $url .= "/$c/$v";
        }
    }
    // Example: "/get/admin/sxml/ui/admin-users"
    
    // Adds filename if provided (contains the actual command)
    if($filename){
        $url .= "/$filename";
    }
    // Final: "/get/admin/sxml/ui/admin-users/saveitem.xml"
    
    return $url;
}
```

**Flow from PHP to JavaScript:**

1. **PHP sets xmlurl**: `/get/admin/sxml/ui/admin-users`
2. **JavaScript gets base**: `this.info.get_param_or_def("xmlurl")` → `/get/admin/sxml/ui/admin-users`
3. **JavaScript adds command**: `cod + ".xml"` → `saveitem.xml`
4. **Final URL**: `/get/admin/sxml/ui/admin-users/saveitem.xml`
5. **Request sent**: AJAX POST to `/get/admin/sxml/ui/admin-users/saveitem.xml` with data
6. **PHP receives**: Parses as manager=admin, command=sxml, params=[ui=>admin-users], filename=saveitem.xml
7. **Main interface extracts**: "saveitem" from filename
8. **Routes to subinterface**: `execfrommain_getcmd_sxml_saveitem()`

**The command** (e.g., `saveitem.xml`) is appended by JavaScript when calling `get_xmlcmd_url("saveitem")`.

### Making AJAX Requests

The JavaScript client uses the UI's built-in AJAX loader (accessed via `this.getAjaxLoader()`):

```javascript
// Example from mw_ui_frm_ajax - Form submission
this.onSubmitCl = function(){
    var _this = this;
    var data = this.ctrs.get_input_value();
    
    // Build URL
    var url = this.get_xmlcmd_url("submit");
    
    // Get the AJAX loader (already initialized by framework)
    var ajax = this.getAjaxLoader();
    
    // Add callback for when response is received
    ajax.addOnLoadAcctionUnique(function(){ 
        _this.onSubmitResponse(); 
    });
    
    // Set URL and execute POST
    ajax.set_url(url);
    ajax.post(data);
};

this.onSubmitResponse = function(){
    // Get parsed response data
    var resp = this.getAjaxDataResponse(true);
    
    if(resp){
        // Show notification
        this.show_popup_notify(resp.get_param_if_object("jsresponse.notify"));
        
        // Check if successful
        if(resp.get_param("ok")){
            // Handle success
            var redirecturl = resp.get_param("redirecturl");
            if(redirecturl){
                window.location = redirecturl;
            }
        }
    }
};
```

**Key Pattern:**

1. **Get AJAX loader**: `var ajax = this.getAjaxLoader()`
   - Returns the UI's AJAX instance (already initialized)
   - Same instance used throughout the UI lifecycle

2. **Build URL**: `this.get_xmlcmd_url("command", params)`
   - Constructs the proper `/get/[main-ui]/sxml/...` URL

3. **Set callback**: `ajax.addOnLoadAcctionUnique(callback)`
   - Callback executes when response is received

4. **Execute request**:
   - `ajax.set_url(url)` - Set the endpoint URL
   - `ajax.post(data)` - POST with data
   - `ajax.run()` - GET request (no data)

5. **Get response**: `this.getAjaxDataResponse(true)`
   - Returns parsed XML response as `mw_obj`
   - Automatically handles XML parsing

**Alternative pattern with mw_ajax_launcher (for standalone calls):**

```javascript
// Example from mw_ui_grid - Direct AJAX call
var url = this.get_xmlcmd_url("saveitem", {nd: newData, itemid: oldData.id});
var ajax = new mw_ajax_launcher(url, function(){
    var data = new mw_obj();
    data.set_params(ajax.getResponseXMLFirstNodeByTagnameAsData());
    
    if(data.get_param_or_def("ok", false)){
        // Success
        var itemid = data.get_param_or_def("itemid", false);
        var itemdata = data.get_param_if_object("itemdata");
    }
});
ajax.run();
```

**When to use each:**

- ✅ **Use `this.getAjaxLoader()`** - When working within a UI class (forms, grids, custom UIs)
- ✅ **Use `new mw_ajax_launcher()`** - For standalone AJAX calls or event handlers
- ✅ Both patterns work with `this.get_xmlcmd_url()` to build URLs
- ✅ Both automatically parse XML responses

### URL Pattern

AJAX endpoints are accessed via the `/get` gateway:

```
/get/[main-ui]/sxml/[param1]/[value1]/[command].xml
```

Examples:
```
/get/admin/sxml/ui/admin-users/saveitem.xml
/get/admin/sxml/ui/admin-categories/reorder.xml
/get/admin/sxml/ui/dashboard-stats/loadchartdata.xml
```

### Request Data

Data is sent via:
- **URL path segments** - For simple parameters like manager code, command, and key-value pairs
- **POST/GET data** - For complex objects (serialized as `nd`, `cols`, `filters`, etc.)
- **$_REQUEST** - Both URL params and POST data are available via `$_REQUEST` in PHP

Example with POST data:
```javascript
// URL: /get/users/saveitem/itemid/123
// POST data:
{
    nd: JSON.stringify({
        name: "New Name",
        email: "newemail@example.com"
    })
}
```

### Response Parsing

The JavaScript framework automatically parses XML to JavaScript objects:

```javascript
// XML Response
<root>
    <ok>1</ok>
    <notify.message>Success</notify.message>
    <notify.type>success</notify.type>
</root>

// Parsed JavaScript Object
{
    ok: true,
    notify: {
        message: "Success",
        type: "success"
    }
}
```

## Common Implementation Patterns

### Pattern 1: CRUD Operations (Typically in dxtbladmin)

#### Create Item

```php
function execfrommain_getcmd_sxml_newitem($params=array(), $filename=false){
    $xml = $this->new_getcmd_sxml_answer(false);
    $this->xml_output = $xml;
    
    if(!$this->allowInsert()){
        $xml->root_do_all_output();
        return false;
    }
    
    // Validate input
    $input = new mwmod_mw_helper_inputvalidator_request("nd");
    if(!$input->is_req_input_ok()){
        $xml->set_prop("error", "Invalid input");
        $xml->root_do_all_output();
        return false;
    }
    
    $nd = $input->get_value_as_list();
    
    // Create item
    if(!$item = $this->create_new_item($nd)){
        $xml->set_prop("notify.message", "Could not create item");
        $xml->set_prop("notify.type", "error");
        $xml->root_do_all_output();
        return false;
    }
    
    // Success response
    $xml->set_prop("ok", true);
    $xml->set_prop("itemid", $item->get_id());
    $xml->set_prop("itemdata", $this->get_item_data($item));
    $xml->set_prop("notify.message", "Item created successfully");
    $xml->set_prop("notify.type", "success");
    
    $xml->root_do_all_output();
}
```

#### Update Item

```php
function execfrommain_getcmd_sxml_saveitem($params=array(), $filename=false){
    $xml = $this->new_getcmd_sxml_answer(false);
    
    if(!$this->allowUpdate()){
        $xml->root_do_all_output();
        return false;
    }
    
    // Get item by ID from request
    if(!$item = $this->getOwnItem($_REQUEST["itemid"] ?? null)){
        $xml->root_do_all_output();
        return false;
    }
    
    // Validate input
    $input = new mwmod_mw_helper_inputvalidator_request("nd");
    if(!$input->is_req_input_ok()){
        $xml->root_do_all_output();
        return false;
    }
    
    $nd = $input->get_value_as_list();
    
    // Save changes
    $this->saveItem($item, $nd);
    
    // Success response
    $xml->set_prop("ok", true);
    $xml->set_prop("itemid", $item->get_id());
    $xml->set_prop("itemdata", $this->get_item_data($item));
    $xml->set_prop("notify.message", "Item updated");
    $xml->set_prop("notify.type", "success");
    
    $xml->root_do_all_output();
}
```

#### Delete Item

```php
function execfrommain_getcmd_sxml_deleteitem($params=array(), $filename=false){
    $xml = $this->new_getcmd_sxml_answer(false);
    
    if(!$this->allowDelete()){
        $xml->root_do_all_output();
        return false;
    }
    
    if(!$item = $this->getOwnItem($_REQUEST["itemid"] ?? null)){
        $xml->root_do_all_output();
        return false;
    }
    
    // Delete with validation (checks related objects)
    $this->delete_item($item, $xml);
    
    $xml->root_do_all_output();
}
```

### Pattern 2: Data Grid Loading (Typically in dxtbladmin)

```php
function execfrommain_getcmd_sxml_loaddata($params=array(), $filename=false){
    $xml = $this->new_getcmd_sxml_answer(false);
    $this->xml_output = $xml;
    
    if(!$this->is_allowed()){
        $xml->root_do_all_output();
        return false;
    }
    
    // Get query
    if(!$query = $this->getQueryFromReq()){
        $xml->root_do_all_output();
        return false;
    }
    
    // Process DevExtreme load options
    $dataqueryhelper = $this->queryHelper;
    $dataqueryhelper->setLoadOptions($_REQUEST["lopts"] ?? null);
    
    // Apply pagination
    $skip = $dataqueryhelper->getSkip();
    $take = $dataqueryhelper->getTake();
    
    // Get total count
    if(!$totalCount = $query->getAffectedRowsNum()){
        $totalCount = 0;
    }
    
    // Apply limit
    $query->set_limit($skip, $take);
    
    // Load data
    $data = array();
    if($items = $query->get_items_list()){
        foreach($items as $item){
            $data[] = $this->get_item_data($item);
        }
    }
    
    // Response
    $xml->set_prop("ok", true);
    $xml->set_prop("data", $data);
    $xml->set_prop("totalCount", $totalCount);
    
    $xml->root_do_all_output();
}
```

### Pattern 3: User Preferences (Any subinterface can use)

```php
function execfrommain_getcmd_sxml_savefilters($params=array(), $filename=false){
    $xml = $this->new_getcmd_sxml_answer(false);
    $this->xml_output = $xml;
    
    if(!$this->allowSaveFilters()){
        $xml->root_do_all_output();
        return false;
    }
    
    // Get user data storage
    if(!$dataItem = $this->get_user_ui_data("filters")){
        $xml->root_do_all_output();
        return false;
    }
    
    // Validate input
    $input = new mwmod_mw_helper_inputvalidator_request("filters");
    if(!$input->is_req_input_ok()){
        $xml->set_prop("error", "Invalid input");
        $xml->root_do_all_output();
        return false;
    }
    
    // Save column filters
    if($nd = $input->get_value_by_dot_cod_as_list("cols")){
        foreach($nd as $cod => $val){
            if(is_array($val)){
                if($this->check_str_key_alnum_underscore($cod)){
                    $dataItem->set_data($val, "cols.".$cod);
                }
            }
        }
        $dataItem->save();
    }
    
    // Success response
    $xml->set_prop("ok", true);
    $xml->set_prop("filters", $dataItem->get_data());
    $xml->set_prop("notify.message", "Filters saved");
    $xml->set_prop("notify.type", "success");
    
    $xml->root_do_all_output();
}
```

## Security Considerations

### 1. Permission Checks

**Always check permissions first:**

```php
// Check general access
if(!$this->is_allowed()){
    $xml->root_do_all_output();
    return false;
}

// Check specific operation
if(!$this->allowInsert()){
    $xml->root_do_all_output();
    return false;
}

// Check item-level permissions
if(!$this->allowDeleteItem($item)){
    $xml->set_prop("notify.message", "Not allowed");
    $xml->set_prop("notify.type", "error");
    $xml->root_do_all_output();
    return false;
}
```

### 2. Input Validation

**Use the input validator:**

```php
$input = new mwmod_mw_helper_inputvalidator_request("nd");
if(!$input->is_req_input_ok()){
    $xml->set_prop("error", "Invalid input");
    $xml->root_do_all_output();
    return false;
}
```

### 3. Safe Array Access

**Always use null coalescing operator:**

```php
// Safe access to $_REQUEST
$itemid = $_REQUEST["itemid"] ?? null;

// Safe access to nested arrays
$value = $data["key1"]["key2"] ?? "default";
```

### 4. SQL Injection Prevention

**Never concatenate user input into SQL:**

```php
// ❌ UNSAFE - Direct concatenation
$query->where->add_where("name='".$_REQUEST["name"]."'");

// ✅ SAFE - Use parameterized where methods
$query->where->add_where_crit("name", $_REQUEST["name"] ?? "");

// ✅ SAFE - For LIKE searches
$query->where->add_where_crit_like("name", $_REQUEST["search"] ?? "");

// ✅ SAFE - For IN lists (numbers)
$query->where->add_where_num_list("status", [1, 2, 3]);

// ✅ SAFE - For IN lists (strings)
$query->where->add_where_str_list("category", ["active", "pending"]);
```

## Best Practices

### 1. Consistent Response Structure

Always include:
- Success indicator (`ok` or `error`)
- User notification when appropriate
- Relevant data payload

### 2. Error Handling

```php
// Early return on errors
if(!$this->validateSomething()){
    $xml->set_prop("error", "Validation failed");
    $xml->set_prop("notify.message", "User-friendly message");
    $xml->set_prop("notify.type", "error");
    $xml->root_do_all_output();
    return false;
}
```

### 3. Meaningful Notifications

```php
// ✅ Good - Specific and helpful
$xml->set_prop("notify.message", $item->get_name()." saved successfully");

// ❌ Bad - Generic and unhelpful
$xml->set_prop("notify.message", "Success");
```

### 4. Include Relevant Data

```php
// After update, return fresh data
$xml->set_prop("itemdata", $this->get_item_data($item));

// For lists, include total count
$xml->set_prop("totalCount", $totalCount);
```

## Debugging

### Enable Debug Output

```php
// Add debug information
$xml->set_prop("debug.request", $_REQUEST);
$xml->set_prop("debug.query", $query->toString());
$xml->set_prop("debug.loadOptions", $loadOptions);
```

### Client-Side Debugging

```javascript
// When using UI's AJAX loader
var ajax = this.getAjaxLoader();
ajax.addOnLoadAcctionUnique(function(){ 
    _this.onResponse(); 
});
ajax.set_url(url);
ajax.post(data);

this.onResponse = function(){
    var resp = this.getAjaxDataResponse(true);
    console.log("Full response:", resp);
    
    if(resp){
        console.log("OK status:", resp.get_param("ok"));
        console.log("Error:", resp.get_param_or_def("error", null));
        console.log("Debug data:", resp.get_param_if_object("debug"));
    }
};

// Or when using mw_ajax_launcher
var url = this.get_xmlcmd_url("actionname", params);
var ajax = new mw_ajax_launcher(url, function(){
    var data = new mw_obj();
    data.set_params(ajax.getResponseXMLFirstNodeByTagnameAsData());
    
    console.log("Full response:", data);
    console.log("OK status:", data.get_param_or_def("ok", false));
    console.log("Error:", data.get_param_or_def("error", null));
    console.log("Debug data:", data.get_param_if_object("debug"));
});
ajax.run();
```

## Summary

The `execfrommain_getcmd_sxml_*` pattern provides:

1. **Universal AJAX communication** - Available to ALL subinterfaces, not just grids
2. **Consistent architecture** - Same pattern works in basesubui, basesubuia, dxtbladmin, or custom interfaces
3. **Automatic routing** - Framework handles the dispatching via base class
4. **Structured XML responses** - Automatically parsed by JavaScript
5. **Built-in support** for notifications, errors, and data payloads
6. **Permission integration** at the framework level
7. **DevExtreme grid compatibility** for data loading and CRUD operations (in dxtbladmin)

## Key Takeaway

**You can add `execfrommain_getcmd_sxml_*` methods to ANY subinterface class that extends `mwmod_mw_ui_sub_uiabs`.**

Whether you're building:
- A simple admin settings page (`basesubui`)
- A list of categories (`basesubuia`)
- A full data grid (`dxtbladmin`)
- A custom dashboard (`uiabs`)

...they all support AJAX endpoints using this pattern. The framework automatically routes `getcmd` requests to your methods, making it easy to add interactive features to any interface.

## Common Use Cases by Interface Type

| Interface Type | Typical AJAX Endpoints |
|---------------|------------------------|
| **basesubui** | Save settings, test connections, clear cache, toggle features |
| **basesubuia** | Reorder items, bulk operations, duplicate items, quick actions |
| **dxtbladmin** | CRUD operations (built-in), custom item actions, bulk updates, exports |
| **Custom uiabs** | Load dashboard data, generate reports, search autocomplete, any custom action |

## Related Documentation

- See `docs/ai/phpdoc-documentation-guide.md` for PHPDoc standards
- See framework classes:
  - `mwmod_mw_ui_sub_uiabs` - Base class with AJAX routing
  - `mwmod_mw_ui_base_basesubui` - Admin base (permission inheritance)
  - `mwmod_mw_ui_base_basesubuia` - List-based rendering
  - `mwmod_mw_ui_base_dxtbladmin` - DevExtreme grid base class
  - `mwmod_mw_devextreme_data_queryhelper` - Query helper for grids
  - `mwmod_mw_helper_inputvalidator_request` - Input validation
