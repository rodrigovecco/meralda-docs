# PHPDoc Documentation Guide for Meralda Framework

This guide provides instructions for documenting PHP classes in the Meralda framework with comprehensive PHPDoc comments, following the patterns established in `mwmod_mw_ui_sub_uiabs`.

## Table of Contents

1. [Class-Level Documentation](#class-level-documentation)
2. [Property Documentation with @property-read](#property-documentation-with-property-read)
3. [Method Documentation](#method-documentation)
4. [Internal Methods with @internal](#internal-methods-with-internal)
5. [Complete Example](#complete-example)

---

## Class-Level Documentation

### Basic Class DocBlock

Every class should have a comprehensive class-level PHPDoc block that includes:

```php
/**
 * Brief description of the class purpose.
 *
 * Longer description if needed, explaining key concepts,
 * architecture patterns, or usage notes.
 *
 * @property-read TypeName $propertyName Description of property.
 * @property TypeName $publicProperty Description of writable property.
 * @method ReturnType methodName(ParamType $param) Description (if using magic methods).
 */
abstract class ClassName extends ParentClass {
```

### @property-read for Private Properties

**Critical Pattern**: For private properties accessed via `__get_priv_*()` methods, declare them as `@property-read` at the class level. This provides IDE autocomplete while keeping properties private.

```php
/**
 * Base class example.
 *
 * @property-read string $code The unique identifier.
 * @property-read ManagerClass $items_man The items manager instance.
 * @property-read ParentClass|null $parent Reference to parent object.
 * @property-read array $cmdparams Command parameters array.
 */
class ExampleClass {
    /**
     * The unique identifier.
     * @var string
     */
    private $code;
    
    /**
     * The items manager instance.
     * @var ManagerClass|null
     */
    private $items_man;
    
    /**
     * Reference to parent object.
     * @var ParentClass|null
     */
    private $parent;
    
    /**
     * Command parameters array.
     * @var array<string,mixed>
     */
    private $cmdparams = array();
```

**Key Points:**
- Use `@property-read` for properties accessed via internal getters
- Match the type declarations between `@property-read` and `@var`
- Include `|null` when properties can be uninitialized
- Use specific array types like `array<string,mixed>` when possible

---

## Method Documentation

### Standard Method Documentation

Every public and protected method should have:

```php
/**
 * Brief one-line description of what the method does.
 *
 * More detailed explanation if needed, including:
 * - Important behaviors or side effects
 * - When to use this method
 * - Related methods or patterns
 *
 * @param ParamType $paramName Description of parameter, including valid values.
 * @param OtherType|false $optional Optional parameter. If false, does something else.
 *
 * @return ReturnType Description of what is returned.
 */
function methodName($paramName, $optional = false) {
```

### Method Documentation Checklist

✅ **Description**: Start with a clear one-line summary  
✅ **@param**: Document every parameter with type and description  
✅ **@return**: Document return type and what it represents  
✅ **Details**: Explain complex logic, delegation, or special cases  
✅ **Types**: Use specific types (class names, `array<string,Type>`, `Type|false|null`)

### Common Patterns in Meralda

**Factory Methods:**
```php
/**
 * Creates and returns a new instance of SubManager.
 *
 * Override in child classes to customize manager creation.
 *
 * @return mwmod_mw_manager_man The new manager instance.
 */
function create_items_man() {
```

**Delegation Methods:**
```php
/**
 * Gets the admin user, delegating to the main interface.
 *
 * @return mwmod_mw_users_user|false The admin user or false if not set.
 */
function get_admin_current_user() {
    return $this->maininterface->get_admin_current_user();
}
```

**Override Hooks:**
```php
/**
 * Hook called after initialization completes.
 *
 * Override in child classes to add custom initialization logic.
 *
 * @return void
 */
function after_init() {
    // For child classes to extend
}
```

**Permission Checks:**
```php
/**
 * Checks if the current user is allowed to access this interface.
 *
 * Override in child classes to implement permission logic.
 *
 * @return bool True if allowed, false otherwise.
 */
function is_allowed() {
    return false;
}
```

---

## Internal Methods with @internal

### The __get_priv_* Pattern

Methods prefixed with `__get_priv_` are **internal accessors** for private properties. These should ALWAYS be marked with `@internal` to hide them from IDE suggestions.

```php
/**
 * Internal accessor for the items manager.
 *
 * @internal
 * @return mwmod_mw_manager_man The items manager instance.
 */
final function __get_priv_items_man() {
    return $this->get_items_man();
}
```

### Why @internal?

1. **IDE Behavior**: The `@internal` tag tells IDEs these methods are for framework use only
2. **Developer Guidance**: Developers should use `$this->items_man` (via `@property-read`) instead of `$this->__get_priv_items_man()`
3. **API Clarity**: Separates public API from internal implementation details

### Pattern to Follow

For every private property that needs external access:

1. **Declare property as private** with `@var` documentation
2. **Add `@property-read`** to the class-level DocBlock
3. **Create `__get_priv_*()` method** marked with `@internal`
4. **Optionally create a public getter** if additional logic is needed

Example:
```php
/**
 * Example class.
 *
 * @property-read string $code The unique code identifier.
 */
class Example {
    /**
     * The unique code identifier.
     * @var string
     */
    private $code;
    
    /**
     * Internal accessor for the code.
     *
     * @internal
     * @return string The subinterface code.
     */
    final function __get_priv_code() {
        return $this->code;
    }
    
    // Optional public getter with additional logic
    /**
     * Gets the code for this object.
     *
     * @return string The code.
     */
    function get_code() {
        return $this->__get_priv_code();
    }
}
```

---

## Complete Example

Here's a complete example showing all patterns:

```php
<?php
/**
 * Manages user authentication and session handling.
 *
 * This class provides core authentication functionality including
 * login, logout, and session management.
 *
 * @property-read string $username Current username.
 * @property-read mwmod_mw_data_session_man $session_man Session manager.
 * @property-read array $permissions User permissions array.
 * @property bool $is_authenticated Authentication status flag.
 */
class mwmod_mw_auth_manager extends mw_base_class {
    
    /**
     * Current username.
     * @var string
     */
    private $username;
    
    /**
     * Session manager instance.
     * @var mwmod_mw_data_session_man|null
     */
    private $session_man;
    
    /**
     * User permissions array.
     * @var array<string,bool>
     */
    private $permissions = array();
    
    /**
     * Authentication status flag.
     * @var bool
     */
    public $is_authenticated = false;
    
    /**
     * Creates a new authentication manager.
     *
     * @param mwmod_mw_data_session_man $session_man The session manager to use.
     */
    function __construct($session_man) {
        $this->session_man = $session_man;
        $this->after_init();
    }
    
    /**
     * Hook called after initialization.
     *
     * Override in child classes for custom initialization logic.
     *
     * @return void
     */
    function after_init() {
        // For child classes to extend
    }
    
    /**
     * Authenticates a user with username and password.
     *
     * Validates credentials and establishes a session if successful.
     *
     * @param string $username The username to authenticate.
     * @param string $password The password to verify.
     *
     * @return bool True if authentication succeeded, false otherwise.
     */
    function authenticate($username, $password) {
        if (!$this->validate_credentials($username, $password)) {
            return false;
        }
        
        $this->username = $username;
        $this->is_authenticated = true;
        $this->load_permissions();
        
        return true;
    }
    
    /**
     * Validates user credentials against the database.
     *
     * @param string $username The username to check.
     * @param string $password The password to verify.
     *
     * @return bool True if credentials are valid, false otherwise.
     */
    protected function validate_credentials($username, $password) {
        // Implementation here
        return false;
    }
    
    /**
     * Loads user permissions from the database.
     *
     * @return void
     */
    protected function load_permissions() {
        // Implementation here
    }
    
    /**
     * Checks if user has a specific permission.
     *
     * @param string $permission The permission to check.
     *
     * @return bool True if user has permission, false otherwise.
     */
    function has_permission($permission) {
        if (!$this->is_authenticated) {
            return false;
        }
        
        return isset($this->permissions[$permission]) 
            && $this->permissions[$permission];
    }
    
    /**
     * Gets the session manager instance.
     *
     * @return mwmod_mw_data_session_man The session manager.
     */
    function get_session_man() {
        if (!isset($this->session_man)) {
            $this->session_man = $this->create_session_man();
        }
        return $this->session_man;
    }
    
    /**
     * Creates the session manager instance.
     *
     * Override to customize session manager creation.
     *
     * @return mwmod_mw_data_session_man A new session manager.
     */
    protected function create_session_man() {
        return new mwmod_mw_data_session_man();
    }
    
    /**
     * Internal accessor for username.
     *
     * @internal
     * @return string The current username.
     */
    final function __get_priv_username() {
        return $this->username;
    }
    
    /**
     * Internal accessor for session manager.
     *
     * @internal
     * @return mwmod_mw_data_session_man The session manager instance.
     */
    final function __get_priv_session_man() {
        return $this->get_session_man();
    }
    
    /**
     * Internal accessor for permissions.
     *
     * @internal
     * @return array<string,bool> The permissions array.
     */
    final function __get_priv_permissions() {
        return $this->permissions;
    }
}
?>
```

---

## Documentation Workflow

When documenting a class, follow this order:

### 1. Class-Level Documentation
- [ ] Add class description
- [ ] Document all private properties as `@property-read`
- [ ] Document all public properties as `@property`
- [ ] Add `@method` tags for magic methods if used

### 2. Property Documentation
- [ ] Add `@var` tags to all private properties
- [ ] Use specific types (class names, arrays with key/value types)
- [ ] Include `|null` for nullable properties

### 3. Method Documentation (in file order)
- [ ] Start with constructors and initialization methods
- [ ] Document factory and creator methods
- [ ] Document business logic methods
- [ ] Document getter/setter methods
- [ ] Document internal `__get_priv_*` methods last

### 4. Internal Methods
- [ ] Mark all `__get_priv_*` methods with `@internal`
- [ ] Ensure they match corresponding `@property-read` declarations
- [ ] Keep descriptions brief for internal accessors

### 5. Review
- [ ] Check all `@param` and `@return` types match actual code
- [ ] Verify `@property-read` types match `@var` types
- [ ] Confirm all public methods have documentation
- [ ] Test that IDE autocomplete works as expected

---

## Common Type Declarations

**Primitive Types:**
- `string`, `int`, `float`, `bool`
- `array` (generic), `array<string,Type>` (specific)
- `mixed` (avoid when possible)

**Union Types:**
- `Type|false` - Method may return false on failure
- `Type|null` - Property may be uninitialized
- `string|int` - Multiple valid types

**Object Types:**
- Use full class names: `mwmod_mw_manager_man`
- For child classes: `static` or `$this`
- For interfaces: Use interface name

**Special Values:**
- `void` - Method returns nothing
- `never` - Method never returns (throws or exits)
- `object` - Generic object (avoid when possible, use specific class)

---

## Code Quality Checks While Documenting

### Array Key Access Safety

**Modern PHP requires checking array keys before access** to avoid warnings and errors. While documenting, verify that array accesses use proper checks:

#### ✅ Safe Patterns:

```php
// Using isset() before access
if (isset($array[$key])) {
    return $array[$key];
}

// Using null coalescing operator (??)
return $array[$key] ?? null;
return $array[$key] ?? 'default';

// Using array_key_exists() for explicit null values
if (array_key_exists($key, $array)) {
    return $array[$key];  // May be null
}

// Superglobals with isset()
if (isset($_REQUEST[$key])) {
    $value = $_REQUEST[$key];
}

// Checking before nested access
if (isset($cods[1]) && $cods[1]) {
    return $sub->process($cods[1]);
}
```

#### ❌ Unsafe Patterns (Legacy Code):

```php
// Direct access without check - may cause warning
return $array[$key];

// Using array without checking if initialized
$value = $this->someArray[$index];

// Superglobal direct access
$param = $_GET['id'];
```

**When documenting older code**, note any unsafe array access patterns that should be refactored. Consider adding a comment like:

```php
/**
 * Gets parameter value.
 * 
 * @param string $key Parameter name.
 * @return mixed|null Parameter value or null if not set.
 * @todo Add isset() check before array access for PHP 8+ compatibility.
 */
```

---

## Tips and Best Practices

### DO:
✅ Document all public and protected methods  
✅ Use `@internal` for internal framework methods  
✅ Declare private properties as `@property-read` when accessed externally  
✅ Use specific type names (class names, not generic "object")  
✅ Explain "why" in descriptions, not just "what"  
✅ Document delegation patterns ("delegates to X")  
✅ Mark override hooks with "Override in child classes..."  
✅ Verify array accesses use `isset()`, `??`, or `array_key_exists()`  
✅ Note unsafe array patterns with `@todo` for future refactoring

### DON'T:
❌ Use generic types like `object` when class name is known  
❌ Forget `@internal` on `__get_priv_*` methods  
❌ Leave parameters or return values undocumented  
❌ Duplicate information (let IDE tools extract method signatures)  
❌ Write documentation that contradicts the code  
❌ Use `@access` tags (deprecated, use visibility keywords instead)  
❌ Ignore unsafe array access patterns in legacy code

---

## IDE Benefits

Proper PHPDoc documentation provides:

1. **Autocomplete**: IDEs suggest properties and methods with descriptions
2. **Type Inference**: IDEs understand return types for better suggestions
3. **Navigation**: Click-through to class definitions and method implementations
4. **Validation**: IDEs warn about type mismatches
5. **Documentation**: Hover tooltips show full PHPDoc descriptions
6. **Refactoring**: Safer renames and structural changes

---

## Questions?

For examples, see:
- `src/mwap/modules/mw/ui/sub/uiabs.php` - Comprehensive documentation example
- Other core framework classes in `src/mwap/modules/mw/`

This documentation pattern ensures consistency across the Meralda framework and provides the best developer experience with IDE support.
