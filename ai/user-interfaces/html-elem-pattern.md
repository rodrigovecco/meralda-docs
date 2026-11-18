# HTML Element Builder — `mwmod_mw_html_elem`

How to build HTML in PHP without concatenating strings.

**Rule:** every piece of markup produced by PHP code goes through `mwmod_mw_html_elem`. Do **not** build HTML by concatenating strings, and do **not** write your own escaping helper.

---

## Why

`mwmod_mw_html_elem` already handles the two things that make hand-written HTML dangerous:

| Concern | Handled by |
|---|---|
| Text content | `addContPlainText()` — escapes it |
| Attribute values | `set_att()` — escaping happens in `mwmod_mw_html_atts::get_att_str_for_tag()` |

Writing `htmlspecialchars($v, ENT_QUOTES, "UTF-8")` in a module means duplicating logic that already exists, and it is easy to forget in the one place that matters.

**Location:** `src/mwap/modules/mw/html/`

---

## Building an element

```php
$card = new mwmod_mw_html_elem("div");
$card->addClass("card mb-4");

$body = new mwmod_mw_html_elem("div");
$body->addClass("card-body");
$card->add_cont($body);
```

The constructor accepts `($tagname, $atts = false, $cont = false)`; an element with no tag name renders its children only, which is what `mwmod_mw_html_cont_varcont` is for.

---

## Text vs. HTML content

This is the part that replaces escaping helpers.

### Plain text — `addContPlainText()`

```php
$p = new mwmod_mw_html_elem("p");
$p->addContPlainText($user_supplied_value);   // escaped
```

### The `[T]` prefix

`add_cont()` detects a `"[T]"` prefix and routes the rest through `addContPlainText()`:

```php
$p = new mwmod_mw_html_elem("p");
$p->add_cont("[T]" . $user_supplied_value);   // same as addContPlainText()
```

### Trusted markup — `add_cont()` / `add_cont_as_html()`

```php
// Another element object (preferred)
$card->add_cont($body);

// A literal HTML fragment: NO escaping, must be trusted
$card->add_cont("<hr>");
```

A plain string passed to `add_cont()` is inserted as-is. That is why `[T]` exists, and why mixing a variable into a concatenated string is the mistake to avoid:

```php
// ❌ WRONG — the value is not escaped and a helper was invented to compensate
$html = '<p>' . htmlspecialchars($note) . '</p>';

// ✅ CORRECT
$p = new mwmod_mw_html_elem("p");
$p->addContPlainText($note);
```

---

## Attributes

```php
$input = new mwmod_mw_html_elem("input");
$input->set_att("type", "text");
$input->set_att("class", "form-control");
$input->set_att("readonly", "readonly");
$input->set_att("value", $value);          // escaping is automatic
$input->set_att("onclick", "this.select()");
```

Related helpers:

```php
$el->addClass("btn btn-primary");     // appends, does not overwrite
$el->remove_class("btn-primary");
$el->setAtts("id='x' name='y'");      // bulk, string or array
$el->set_visible(false);              // not rendered
$el->only_visible_when_has_cont = true;
```

Textareas take their value as content, so plain text goes through `addContPlainText()`:

```php
$ta = new mwmod_mw_html_elem("textarea");
$ta->set_att("rows", "6");
$ta->addContPlainText($text);
```

---

## Nesting and containers

```php
$container = $this->get_ui_dom_elem_container();        // the page container
$container->addClass("container-fluid");
$container->add_cont($card);

echo $container->get_as_html();
```

When the UI must render its own JS into the page (forms), use the empty variant and output explicitly:

```php
$container = $this->get_ui_dom_elem_container_empty();
$container->add_cont($this->set_ui_dom_elem_id("ctrs"));  // JS target
$container->do_output();                                  // echoes now
```

---

## Returning elements instead of strings

When a helper renders something for several callers, return the element and let the caller place it. Strings force the caller to trust the escaping that already happened somewhere else.

```php
static function result($ui, $item, $pin) {
    $card = new mwmod_mw_html_elem("div");
    $card->addClass("card border-success mb-4");
    // ...
    return $card;
}
```

---

## Related Documentation

- [jsobj Inputs Pattern](./jsobj-inputs-pattern.md)
- [Base UI Classes](./base-ui-classes.md)
