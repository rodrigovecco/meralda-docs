# Collections Pattern in Meralda

When you need to load and manage a collection of related items (e.g., filters for a report, products for a category), use the `mwmod_mw_util_itemsbycod` class with lazy loading.

## Basic Pattern

### 1. Declare the Private Property

```php
private $items;
```

### 2. Add PHPDoc with Generic Type

Use the generic syntax to indicate the type of items in the collection:

```php
/**
 * @property-read mwmod_mw_util_itemsbycod<YourItemClass> $items
 */
class YourClass {
    private $items;
```

### 3. Create the Lazy Loader

```php
function __get_priv_items(){
    if(!isset($this->items)){
        $this->items = new mwmod_mw_util_itemsbycod();
        if($man = $this->getItemsManager()){
            $query = $man->menuMan->tblman->new_query();
            $query->where->add_where_crit("parent_id", $this->get_id());
            $query->where->add_where_crit("enabled", 1);
            $query->order->add_order("sort_order");
            
            if($loadedItems = $man->get_items_by_query($query)){
                foreach($loadedItems as $item){
                    $this->items->add_item($item);
                    // Optional: set back-reference
                    $item->setParentManager($this);
                }
            }
        }
    }
    return $this->items;
}
```

## Key Components

### Query Building

Use the manager's table manager to create queries with conditions:

```php
$query = $man->menuMan->tblman->new_query();
$query->where->add_where_crit("field_name", $value);
$query->where->add_where_crit("another_field", $anotherValue);
$query->order->add_order("sort_order");
```

### Fetching Items

Use `get_items_by_query($query)` to fetch items matching the query:

```php
$items = $man->get_items_by_query($query);
```

### Adding to Collection

Use `add_item($item)` to add each item. The item must have a `get_cod()` method that returns its unique identifier:

```php
$this->items->add_item($item);
```

### Back-Reference (Optional)

When items need to reference their parent/owner, set it during loading:

```php
$item->setParentManager($this);
```

## Complete Example

```php
/**
 * Manager for a parent entity with child items.
 *
 * @property-read ParentItem $parent
 * @property-read mwmod_mw_util_itemsbycod<ChildItem> $children
 */
class ParentItemManager {
    private $parent;
    private $children;
    
    function __construct($parent){
        $this->setParent($parent);
    }
    
    final function setParent($parent){
        $this->parent = $parent;
    }
    
    final function __get_priv_parent(){
        return $this->parent;
    }
    
    function __get_priv_children(){
        if(!isset($this->children)){
            $this->children = new mwmod_mw_util_itemsbycod();
            if($man = $this->parent->man->childrenMan){
                $query = $man->menuMan->tblman->new_query();
                $query->where->add_where_crit("parent_id", $this->parent->get_id());
                $query->where->add_where_crit("enabled", 1);
                $query->order->add_order("sort_order");
                
                if($items = $man->get_items_by_query($query)){
                    foreach($items as $item){
                        $this->children->add_item($item);
                        $item->setParentManager($this);
                    }
                }
            }
        }
        return $this->children;
    }
}
```

## Using the Collection

Once loaded, access items using `mwmod_mw_util_itemsbycod` methods:

```php
// Get all items as array
$items = $collection->getItems();

// Get item by code/id
$item = $collection->get_item($code);

// Iterate
foreach($collection->getItems() as $item){
    // process item
}
```

## Summary

- Use `mwmod_mw_util_itemsbycod` for typed collections
- Lazy load via `__get_priv_*` methods
- Build queries with `new_query()`, `where->add_where_crit()`, and `order->add_order()`
- Fetch with `get_items_by_query($query)`
- Optionally set back-references for bidirectional navigation
