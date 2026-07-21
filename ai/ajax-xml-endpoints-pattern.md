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

## The Native AJAX Recipe — `mw_ui` + `getAjaxLoader()` + `getAjaxDataResponse()`

This is the **canonical Meralda pattern** for custom AJAX calls from any UI.
Do **not** use raw `$.ajax()` or `$.getJSON()` — the framework already provides
a complete, auto-wired stack on the JS side that handles URL construction, XML
parsing, and error recovery.

### PHP side — wiring the JS UI object

Every subinterface that needs JS-side AJAX must tell the framework to inject the
`mw_ui` header declaration with the correct `xmlurl`:

```php
class my_subinterface extends mwmod_mw_ui_base_basesubui {

    function __construct($cod, $parentUI) {
        $this->init_as_subinterface($cod, $parentUI);
        // 1) Tell the framework which JS class to instantiate for this UI.
        //    Use "mw_ui_frm_ajax" if you have a form; "mw_ui" for generic panels.
        $this->js_ui_class_name = "mw_ui_frm_ajax";
    }

    function prepare_before_exec_no_sub_interface() {
        // 2) Load the required JS files (url.js, ajax.js, ui/mwui.js…).
        $util = new mwmod_mw_html_manager_uipreparers_ui($this);
        $util->preapare_ui();
        $jsman = $this->maininterface->jsmanager;
        $jsman->add_item_by_cod_def_path("url.js");
        $jsman->add_item_by_cod_def_path("ajax.js");
        $jsman->add_item_by_cod_def_path("ui/mwui.js");
        $jsman->add_item_by_cod_def_path("ui/mwui_frm.js");

        // 3) Create the JS header that injects `mwui_info` with `xmlurl`,
        //    `ui_var`, `sub_ui_var`, etc.
        $item = $this->create_js_man_ui_header_declaration_item();
        $util->add_js_item($item);
    }
}
```

**What this produces on the page:**

```html
<script>
var mwui_info_<hash> = {
    xmlurl: "/get/admin/sxml/ui/products-vehicles-item-edit",
    ui_var: "...",
    sub_ui_var: "...",
    ...
};
new mw_ui_frm_ajax(mwui_info_<hash>);
</script>
```

The `xmlurl` is the base URL used by `get_xmlcmd_url()` to build command URLs.

### ✅ JS side — canonical GET request

```javascript
// 1) Build the URL: appends "command.xml" to the xmlurl base.
var url = this.get_xmlcmd_url("loadimages");
// → /get/admin/sxml/ui/products-...-productimg/loadimages.xml

// 2) Grab the UI's own AJAX loader (shared instance, already initialized).
var a = this.getAjaxLoader();

// 3) Abort any pending + set the new URL.
a.abort_and_set_url(url);

// 4) Register the callback (once — addOnLoadAcctionUnique).
var _this = this;
a.addOnLoadAcctionUnique(function () {
    var data = _this.getAjaxDataResponse(true);
    // data is mw_obj. Nested values are PLAIN JS.
});

// 5) Fire! a.run() for GET, a.post(data) for POST.
a.run();
```

### ✅ JS side — canonical POST request

```javascript
var a = this.getAjaxLoader();
a.abort_and_set_url(this.get_xmlcmd_url("togglevariant"));

var _this = this;
a.addOnLoadAcctionUnique(function () {
    var data = _this.getAjaxDataResponse(true);
    if (!data || !data.get_param_or_def("ok", false)) { return; }

    // Nested from get_param_if_object is PLAIN JS, not mw_obj.
    var resp = data.get_param_if_object("jsresponse");
    if (resp && resp.hasOwnProperty("checked")) {
        cb.checked = !!resp.checked;
    }
});

a.post({ img_id: 123, variant_id: 456 });
```

### The `mw_obj` response API — CRITICAL: plain values vs mw_obj

**Only the top-level result of `getAjaxDataResponse(true)` is an `mw_obj`.**
Nested values returned by `get_param_if_object()` are **plain JS objects/arrays**, NOT `mw_obj`.

#### Data flow from XML to JS

```
PHP: mwmod_mw_data_xml_js("jsresponse", $jsobj)
  → XML: <jsresponse>{images:[{id,thumb,...}], variants:[{id,name}]}</jsresponse>
  → JS: getAjaxDataResponse(true) → mw_obj
  → data.get_param_as_list('jsresponse.images', true) → plain JS Array  ✅
  → data.get_param_if_object('jsresponse') → plain JS Object {checked: true}  ✅
```

#### Method reference

| Method | Returns | When to use |
|--------|---------|-------------|
| `get_param(cod)` | Any raw value (string, number, etc.) | Primitive values. Supports dot notation: `'jsresponse.checked'` |
| `get_param_or_def(cod, def)` | Value or fallback | Safe access with default. Use for `ok`, strings, numbers |
| `get_param_if_object(cod)` | **plain JS object** (or false) | Sub-objects like `{checked: true}`. **NOT for arrays.** Does NOT verify it's an array. Supports dot notation |
| `get_param_as_list(cod, allowDoptiom)` | **plain JS Array** (or false) | The ONLY method that verifies `mw_is_array()`. Use for lists. With `allowDoptiom=true` also handles DOptim → array conversion. Supports dot notation |

#### ⚠️ Common mistakes

```javascript
var data = this.getAjaxDataResponse(true);

// ❌ WRONG: treating get_param_if_object result as mw_obj
var resp = data.get_param_if_object('jsresponse');
var checked = resp.get_param('checked');  // ERROR! resp is plain {}, no .get_param()

// ❌ WRONG: using get_param_if_object for arrays (no array verification)
var images = data.get_param_if_object('jsresponse.images');  // could be any object

// ❌ WRONG: using a.get() — the method is a.run()
a.get();  // doesn't exist!

// ✅ CORRECT: plain object access
var resp = data.get_param_if_object('jsresponse');
if (resp && resp.hasOwnProperty('checked')) {
    cb.checked = !!resp.checked;  // direct property access
}

// ✅ CORRECT: array via get_param_as_list — verifies array + DOptim-safe
var images = data.get_param_as_list('jsresponse.images', true) || [];
var variants = data.get_param_as_list('jsresponse.variants', true) || [];

// ✅ CORRECT: iterate plain arrays with .length and [i]
for (var i = 0; i < images.length; i++) {
    var img = images[i];          // plain object
    var id = img.id || 0;         // direct property access
    var alt = img.alt || '';
}

// ✅ CORRECT: nested arrays from plain objects — guard with mw_is_array
// (empty PHP arrays serialize as {} via mwmod_mw_jsobj_obj; mw_is_array catches this)
var relVariants = mw_is_array(img.related_variants) ? img.related_variants : [];
if (relVariants.indexOf(someId) !== -1) { /* ... */ }

// ✅ CORRECT: launch GET request
var a = this.getAjaxLoader();
a.abort_and_set_url(url);
a.addOnLoadAcctionUnique(function () { /* ... */ });
a.run();   // ← run(), not get()

// ✅ CORRECT: launch POST request
a.post({ key: value });
```

### 🔴 CRITICAL: PHP array builders — always use `mwmod_mw_jsobj_array`

**This is the #1 source of silent JS bugs in AJAX responses.** When you embed
a PHP array inside a `mwmod_mw_jsobj_obj` via `set_prop()`, the serializer
(`get_as_js_val_from_array`) uses a fragile heuristic to decide `[...]` vs `{...}`:

```php
// get_as_js_val_from_array() logic:
//   if key 0 exists → $isunassoc=true → "[...]"
//   if no key 0   → treat as associative → "{...}"
```

**The empty-array trap:**
```php
$obj = new mwmod_mw_jsobj_obj();
$obj->set_prop("items", []);       // PHP: empty array
// JS receives: {"items": {}}      ← {} NOT []!
// {},get_param_as_list() → false
// {}.indexOf() → 💥 TypeError
```

**The rule: whenever you `set_prop()` a value that should be a JS array, use
`mwmod_mw_jsobj_array` which guarantees `[...]` every time, even when empty.**

```php
// ❌ WRONG — empty array becomes {}, truthy but useless
$obj->set_prop("related_variants", $img->get_related_variant_ids());
$obj->set_prop("tags", []);

// ❌ WRONG — indexed array with gaps (0,2,3 missing key 1) → {}
$obj->set_prop("items", [0 => "a", 3 => "b"]);

// ✅ CORRECT — mwmod_mw_jsobj_array always serializes as [...]
$ids = new mwmod_mw_jsobj_array($img->get_related_variant_ids());
$obj->set_prop("related_variants", $ids);

// ✅ CORRECT — for simple scalar arrays, use constructor directly
$obj->set_prop("tags", new mwmod_mw_jsobj_array(["tag1", "tag2"]));

// ✅ CORRECT — for arrays of objects, build with add_data()
$jsImages = new mwmod_mw_jsobj_array();
foreach ($images as $img) {
    $entry = new mwmod_mw_jsobj_obj();
    $entry->set_prop("id", (int)$img->get_id());
    $entry->set_prop("url", $img->get_url());
    $jsImages->add_data($entry);
}
$obj->set_prop("images", $jsImages);
```

**JS-side defense (always add this too):**
```javascript
// Even with correct PHP, JS should verify with mw_is_array()
// — catches any serialization edge case or corrupted data
var items = mw_is_array(img.related_variants) ? img.related_variants : [];

// ✅ Prefer get_param_as_list(cod, true) at the top-level
//    It auto-verifies mw_is_array() AND converts DOptim → array
var variants = data.get_param_as_list('jsresponse.variants', true) || [];
```

**How `mwmod_mw_jsobj_array` serializes (always correct):**
```php
// mwmod_mw_jsobj_array::get_as_js_val() — always "[...]":
$arr = new mwmod_mw_jsobj_array([1, 2, 3]);   // → [1,2,3]
$arr = new mwmod_mw_jsobj_array();              // → []  (correct even when empty!)
$arr = new mwmod_mw_jsobj_array([5 => "a"]);   // → ["a"]  (re-indexed)
```

### Complete real-world example — load images + variants

Full pattern from `meraldatsx/products/uiadmin/productimg.php` + `productimg.js`:

**PHP endpoint** — returns images and variants as JS objects:

```php
function execfrommain_getcmd_sxml_loadimages($params = array(), $filename = false) {
    $xml = $this->new_getcmd_sxml_answer(false);

    // Build variants array
    $jsVariants = new mwmod_mw_jsobj_array();
    foreach ($this->getVariants() as $variant) {
        $v = new mwmod_mw_jsobj_obj();
        $v->set_prop("id", $variant->get_id());
        $v->set_prop("name", $variant->get_name());
        $jsVariants->add_data($v);
    }

    // Build images array
    $jsImages = new mwmod_mw_jsobj_array();
    foreach ($this->getImages() as $img) {
        $item = new mwmod_mw_jsobj_obj();
        $item->set_prop("id", $img->get_id());
        $item->set_prop("thumb", $img->get_thumb_url());
        $item->set_prop("full", $img->get_full_url());
        $item->set_prop("alt", $img->get_alt());
        $item->set_prop("position", $img->get_position());
        $item->set_prop("view", $img->get_view());
        $item->set_prop("action_url", $img->get_action_url());
        $item->set_prop("delete_url", $img->get_delete_url());
        $relVarIds = $img->get_related_variant_ids();
        $jsRelVars = new mwmod_mw_jsobj_array($relVarIds);
        $item->set_prop("related_variants", $jsRelVars);
        $jsImages->add_data($item);
    }

    // Wrap in jsresponse
    $jsResponse = new mwmod_mw_jsobj_obj();
    $jsResponse->set_prop("images", $jsImages);
    $jsResponse->set_prop("variants", $jsVariants);

    $xml->set_prop("ok", true);
    $xml->add_sub_item(new mwmod_mw_data_xml_js("jsresponse", $jsResponse));
    $xml->root_do_all_output();
}
```

> **⚠️ Why `mwmod_mw_jsobj_array` for `related_variants`?**  
> `mwmod_mw_jsobj_obj::set_prop("key", [])` serializes an **empty** PHP array as `{}` (JS object),
> not `[]`. This is because `get_as_js_val_from_array()` uses `$isunassoc` (key 0 must exist)
> as the heuristic for sequential arrays. An empty array has no keys → treated as associative → `{}`.
> `mwmod_mw_jsobj_array` always emits `[...]` and is immune to this bug.  
> On the JS side, always guard with `mw_is_array()` instead of `|| []`:

```javascript
// ✅ Safe: handles both empty-array-as-object and non-array values
var relVariants = mw_is_array(img.related_variants) ? img.related_variants : [];

// ❌ Unsafe: {} is truthy, so || [] never fires
var relVariants = img.related_variants || [];
```

**JS client** — loads data, builds DOM, wires events:

```javascript
this.loadImages = function () {
    var a = this.getAjaxLoader();
    a.abort_and_set_url(this.get_xmlcmd_url('loadimages'));

    var _this = this;
    a.addOnLoadAcctionUnique(function () {
        var data = _this.getAjaxDataResponse(true);
        if (!data || !data.get_param_or_def('ok', false)) { return; }

        // get_param_as_list verifies it's an array AND handles DOptim.
        _this.variants = data.get_param_as_list('jsresponse.variants', true) || [];
        _this.allImages = data.get_param_as_list('jsresponse.images', true) || [];
        _this.renderCards();
    });

    a.run();  // ← GET request
};

this.renderCards = function () {
    var container = this.get_ui_elem('container');
    container.innerHTML = '';

    if (!this.allImages || this.allImages.length === 0) {
        container.innerHTML = '<div class="alert alert-info">Sin imágenes</div>';
        return;
    }

    // this.allImages is a plain JS array — use .length and [i]
    for (var i = 0; i < this.allImages.length; i++) {
        var img = this.allImages[i];  // plain JS object
        var card = this.buildCard(img);
        container.appendChild(card);
    }
};

this.buildCard = function (img) {
    // img is a plain JS object — direct property access, no .get_param()
    var id = img.id || 0;
    var thumb = img.thumb || '';
    var full = img.full || '';
    var alt = mw_html_escape(img.alt || '');
    var relVariants = mw_is_array(img.related_variants) ? img.related_variants : [];

    // ... build DOM elements ...
};

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
