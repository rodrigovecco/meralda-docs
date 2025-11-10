# Database Query Patterns

This guide explains common patterns for customizing database queries in DevExtreme grid interfaces.

## Table of Contents
1. [Custom Queries in DataGrid Interfaces](#custom-queries-in-datagrid-interfaces)
2. [Adding LEFT JOINs](#adding-left-joins)
3. [Adding Calculated Fields](#adding-calculated-fields)

---

## Custom Queries in DataGrid Interfaces

When extending `mwmod_mw_ui_base_dxtbladmin`, you can customize the SQL query by overriding the `getQuery()` method.

### Basic Pattern

```php
function getQuery(){
    $this->queryHelper = new mwmod_mw_devextreme_data_queryhelper();
    
    if(!$man = $this->getItemsMan()){
        return false;
    }
    if(!$tblman = $man->get_tblman()){
        return false;	
    }
    if(!$query = $tblman->new_query()){
        return false;	
    }
    
    $this->queryHelper->addAllTblFields($tblman);
    
    // Your custom query modifications here
    
    $this->afterGetQuery($query);
    return $query;
}
```

---

## Adding LEFT JOINs

To add a LEFT JOIN to another table, use `add_from_join_external()` with proper aliasing.

### Pattern

```php
// Add LEFT JOIN to another table
$join = $query->from->add_from_join_external(
    "table_name",           // Table to join
    "main_table.id",        // External field (from main table)
    "join_field",           // Inner field (in joined table)
    "alias"                 // Alias for joined table
);

// Set join type (LEFT JOIN)
$join->set_as_mode();

// Add additional ON conditions if needed
$join->specialON = "main_table.id = alias.join_field AND alias.type = 'value'";
```

### Real Example: Checking for Related Stock Movements

```php
function getQuery(){
    $this->queryHelper = new mwmod_mw_devextreme_data_queryhelper();
    
    if(!$man = $this->getItemsMan()){
        return false;
    }
    if(!$tblman = $man->get_tblman()){
        return false;	
    }
    if(!$query = $tblman->new_query()){
        return false;	
    }
    
    $this->queryHelper->addAllTblFields($tblman);
    
    // Add LEFT JOIN to stocks_movements to check if delivery exists
    $join = $query->from->add_from_join_external(
        "stocks_movements",     // Table to join
        "visits.id",            // External field
        "related_visit_id",     // Inner field
        "sm"                    // Alias
    );
    $join->set_as_mode();
    $join->specialON = "visits.id=sm.related_visit_id AND sm.type = 'tovisitorclient'";
    
    // Explicitly select main table fields
    $query->select->add_select("visits.*");
    
    // Add calculated field
    $select = $query->select->add_select("IF(sm.id IS NOT NULL, 1, 0)", "_has_stock_movement");
    $field = $this->queryHelper->addFieldByQuerySelect($select);
    if($field){ 
        $field->dataType = "boolean"; 
    }
    
    $this->afterGetQuery($query);
    return $query;
}
```

### Key Points

- **`set_as_mode()`**: Required to properly use the table alias in the query
- **`specialON`**: Used for additional ON conditions beyond the basic join field match
- **Explicit SELECT**: Use `$query->select->add_select("table_name.*")` to ensure main table fields are included

---

## Adding Calculated Fields

Calculated fields are SQL expressions that compute values on the fly.

### Pattern

```php
// Add a calculated field
$select = $query->select->add_select(
    "SQL_EXPRESSION",       // SQL expression
    "field_name"            // Alias for the field
);

// Register the field with queryHelper
$field = $this->queryHelper->addFieldByQuerySelect($select);
if($field){ 
    $field->dataType = "type";  // e.g., "boolean", "int", "string"
}

// Add column in add_cols() method
$col = $datagrid->add_column_boolean("field_name", "Label");
$col->js_data->set_prop("allowEditing", false);
```

### Common Calculated Field Examples

#### Boolean Check with IF

```php
// Check if related record exists
$select = $query->select->add_select(
    "IF(joined_table.id IS NOT NULL, 1, 0)", 
    "_has_related_record"
);
$field = $this->queryHelper->addFieldByQuerySelect($select);
if($field){ 
    $field->dataType = "boolean"; 
}
```

#### Count with CASE

```php
// Count records matching conditions
$subquery->select->add_select(
    "COUNT(CASE WHEN table.date >= DATE_SUB(NOW(), INTERVAL 3 MONTH) AND table.status = 2 THEN 1 END)",
    "recent_count"
);
```

#### MAX/MIN with Dates

```php
// Get most recent date
$subquery->select->add_select(
    "MAX(table.date_field)",
    "last_date"
);
```

---

## Subqueries for Aggregations

For complex aggregations, use subqueries joined to the main query.

### Pattern

```php
// Create subquery
$subquery = $this->mainap->mainMan->someManager->get_tblman()->new_query();

// Add aggregated fields
$subquery->select->add_select("MAX(table.date_field)", "max_date");
$subquery->select->add_select("COUNT(*)", "count");
$subquery->select->add_select("table.foreign_key", "foreign_key");

// Add grouping
$subquery->group->add_group("table.foreign_key");

// Join subquery to main query
$join = $query->from->add_subquery(
    $subquery,              // Subquery object
    "alias",                // Alias for subquery
    "main_table.id",        // External field (from main table)
    "foreign_key"           // Inner field (in subquery)
);

// Select fields from subquery
$select = $query->select->add_select("alias.max_date", "max_date");
$field = $this->queryHelper->addFieldByQuerySelect($select);
if($field){ 
    $field->setDateMode(); 
}
```

### Real Example: Visit Statistics per Client

```php
// Create subquery for visit statistics
$subquery = $this->mainap->mainMan->visits->get_tblman()->new_query();

$subquery->select->add_select("MAX(visits.scheduled_date)", "last_visit_date");
$subquery->select->add_select("COUNT(*)", "visits_count");
$subquery->select->add_select("visits.client_id", "client_id");
$subquery->select->add_select(
    "COUNT(CASE WHEN visits.scheduled_date >= DATE_SUB(NOW(), INTERVAL 3 MONTH) AND visits.status = 2 THEN 1 END)",
    "visits_scheduled_3m"
);

$subquery->group->add_group("visits.client_id");

// Join to main clients query
$join = $query->from->add_subquery($subquery, "visits_summary", "clients.id", "client_id");

// Add fields from subquery to select
$select = $query->select->add_select("visits_summary.last_visit_date", "last_visit_date");
$field = $this->queryHelper->addFieldByQuerySelect($select);
if($field){ 
    $field->setDateMode(); 
}

$select = $query->select->add_select("visits_summary.visits_scheduled_3m", "visits_scheduled_3m");
$field = $this->queryHelper->addFieldByQuerySelect($select);
if($field){ 
    $field->dataType = "int"; 
}
```

---

## Best Practices

1. **Always use `queryHelper`**: Register calculated fields with `addFieldByQuerySelect()` to ensure proper data type handling
2. **Set data types**: Explicitly set `dataType` for calculated fields ("boolean", "int", "string", "date")
3. **Use aliases**: Always provide meaningful aliases for joined tables and calculated fields
4. **Prefix calculated fields**: Use underscore prefix (e.g., `_has_stock_movement`) to distinguish from table fields
5. **Test SQL**: Complex queries can be tested directly in the database before implementing in code
6. **Call parent hooks**: Always call `$this->afterGetQuery($query)` to allow further customization

---

## Query Object Reference

### Query Object Structure

```
$query
├── select       // mwmod_mw_db_sql_select
│   └── add_select(expression, alias)
├── from         // mwmod_mw_db_sql_from
│   ├── add_from_join_external(table, external_field, inner_field, alias)
│   └── add_subquery(subquery, alias, external_field, inner_field)
├── where        // mwmod_mw_db_sql_where
├── group        // mwmod_mw_db_sql_group
│   └── add_group(field)
└── order        // mwmod_mw_db_sql_order
```

### Join Object Methods

- `set_as_mode()`: Enable alias usage
- `set_join_left()`: Set to LEFT JOIN (default)
- `set_join_right()`: Set to RIGHT JOIN
- `set_join_both()`: Set to INNER JOIN
- `specialON`: Additional ON conditions (string)

---

## See Also

- [DataGrid Documentation](user-interfaces/datagrid.md)
- [Database Access Guide](database-access-guide.md)
- [Base UI Classes](user-interfaces/base-ui-classes.md)
