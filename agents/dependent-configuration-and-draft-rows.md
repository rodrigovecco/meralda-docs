# Dependent Configuration: Save the Row, Do Not Make It Live

> **AI Assistant Guide**: How to build a form whose fields depend on each other — where choosing one value changes which controls the others need — without painting the operator into a corner. Covers the invariant that makes it safe, where validation belongs, and the framework hooks that must agree.

---

## The Situation

A form field is often a **pivot**: it decides the shape of everything after it.

```
Result:   [ Completed    v ]      ← the pivot
Operator: [ is           v ]      ← depends on the pivot
Value:    [ Yes / No     v ]      ← depends on the pivot
```

`Completed` is a fact that is true or false. A different result — `score` — is a quantity:

```
Result:   [ Score        v ]
Operator: [ is at least  v ]      ← a different set
Value:    [ 70           ]        ← a number, not a word
```

The two configurations are not variants of one form; they are different forms. So the moment the operator changes the pivot, **the controls below it are wrong**: the list still shows the values that belonged to the previous result, and the one already selected is no longer one of them.

The naive answer is to validate on save and refuse. That is what turns the form into a dead end:

> Change the pivot → the value that comes with it does not fit → the write is refused → the form is re-rendered with the **old** pivot, because nothing was stored → the operator cannot reach the state that would let them fix the value.

Nothing is broken in the domain. The refusal is correct. And the screen is still unusable.

The other naive answer is to make the form **reactive**: when the pivot changes, rebuild the dependent controls in JavaScript. That works, and it costs a dependency per pair of fields — code, forever, for every combination of fields any module adds. It also needs each dependent list to be available in the browser, which for a value set that comes from the server is a second source of truth.

---

## The Standard

**An incomplete configuration is written to the row, and the row is left NOT ACTIVE.**

Two things follow, and they are why this shape is the standard rather than a workaround:

- the write goes through, so the form comes back **as the operator left it** — new pivot, old value still visible and ready to be corrected;
- the condition/form does not take effect until it is complete, so nothing downstream depends on a configuration nobody can interpret.

The invariant, stated once and enforced everywhere:

> **ACTIVE IMPLIES VALID.**

A row that is not finished is a **draft**, and a draft is inert.

### What is still refused

Only what the form cannot fix. Those refusals are about the **pair** (this record, that reference) and not about what was typed, so no amount of editing produces a valid one:

| Refused, always | Why the form cannot fix it |
|---|---|
| the record does not exist | the address is wrong |
| the referenced record does not exist | it was deleted, or never existed |
| the record is frozen (locked) | a decision, made elsewhere |
| the reference must precede the record | the relationship itself is impossible |

Everything else — which entry of a set, which comparison, which value — is a **configuration**, and a configuration is what the form is for.

---

## Splitting the Validator

The rule above requires the validator to answer two different questions, and a single all-or-nothing method cannot.

```php
// 1. STRUCTURE — may this row exist at all? Refuse; no form can repair it.
function validate_structure($owner, $data, &$error = "") { ... }

// 2. COMPLETENESS — is the configuration usable? Delegated to the MODULE that owns
//    the selected member, not restated here.
function normalize_configuration($owner, $data, &$error = "") { ... }

// 3. THE STRICT QUESTION — used by readers, tests and any caller that needs to know
//    whether the row is usable right now. Never used to decide whether to save.
function validate($owner, $data, &$error = "") {
    $row = $this->validate_structure($owner, $data, $error);
    if ($row === false) { return false; }
    $clean = $this->normalize_configuration($owner, $row, $error);
    if ($clean === false) { return false; }
    return array_merge($row, $clean);
}

// 4. THE ROW TO WRITE — lenient, and it reports what is missing.
function prepare_row($owner, $data, &$error = "", &$notice = "") {
    $row = $this->validate_structure($owner, $data, $error);
    if ($row === false) { return false; }

    $clean = $this->normalize_configuration($owner, $row, $notice);
    if ($clean === false) {
        // Kept as typed, switched off. The remedy is in the form, so the form must live.
        $row["is_active"] = 0;
        return $row;
    }
    return array_merge($row, $clean);
}
```

Two properties of this shape are worth copying:

- **`$notice` is separate from `$error`.** They are different facts and can both be true in one render: the row was saved, **and** it is inert until it is finished. One sentence cannot say both, so the screen gets both.
- **`$notice` carries a CODE, not a sentence.** The language of a refusal belongs to the screen, exactly as the error codes do.

---

## Delegate the Completeness Check

The completeness question has a subject: **the module that owns the selected member**. In a design where a set of members is a registry of classes (one class per member), that class is the one that knows:

- which configurations its members admit,
- which values are legal,
- how a stored value is normalised and compared.

```php
function normalize_configuration($owner, $data, &$error = "") {
    $member = $this->resolve_member($data);      // the selected entry
    if (!$member) { $error = "unknown_member"; return false; }

    // THE MEMBER DECIDES. Nothing here re-states a rule about its values.
    return $member->normalize_configuration($data, $error);
}
```

A validator that restates those rules is a second statement of one truth, and the two drift — in the project this pattern came from, one copy accepted **any non-empty string** where another applied a truthiness list, so a typo stored as `"flase"` was read as **true** and the gate it controlled opened for everybody.

> Rule of thumb: if a validator contains `if` on the name of a member, the rule belongs to the member.

---

## Every Writer Applies the Invariant

The rule must not live in the form. A framework has several writers, and the one that is forgotten is the one that stores an active, unusable row. In Meralda there are three, and they are different extension points:

| Writer | Hook |
|---|---|
| the write API of the manager | the method the screen calls (`save_row()`, `save_condition()`, …) |
| a row written through its item | `mwmod_mw_manager_item::do_save_data()` (override) |
| a row **created** by a grid or any direct insert | `mwmod_mw_manager_man::validate_new_item_data_sub()` |

A screen that respects the invariant while a grid does not is a hole, and it is invisible until somebody edits the right cell.

```php
// The row guard: an incomplete configuration may be stored, and never active.
function do_save_data($input) {
    if (is_array($input) && $this->input_touches_configuration($input)) {
        $merged = $this->merged_view($input);           // what the row WOULD be
        $error = "";
        if ($this->man->validate($this->owner(), $merged, $error) === false
            && $this->merged_would_be_active($merged)) {
            $input["is_active"] = 0;                    // forced off, not refused
        }
    }
    return parent::do_save_data($input);
}
```

**Judge the MERGED view, not the input.** An edit that changes one field must be judged with the values the row already has, or "this value is not one of the set" passes because the input did not mention the set.

---

## Saying What Changed in the Form

An operator who changes the pivot and finds the fields below altered needs to know **why**, and that it was expected. Put it in the note under the pivot:

```php
$resultSelect->setNotes($this->msg(
    "config_result_hint",
    "Changing this changes which comparisons and which values apply, and the fields below follow it."
));
```

And when a row is stored switched off, say **both** halves — the write happened, and the row is inert:

```php
notice_message($code) => refusal_message($code) . " " . msg(
    "config_saved_off",
    "The row was saved switched off, so it has no effect for now: fix the value below and it starts applying."
);
```

A notice that only says "saved" teaches the operator that an inert row works. A notice that only says "the value is wrong" teaches them the save failed, which is false. Both, in one sentence.

**Also say it when the form is OPENED.** A row left unfinished by an earlier session looks exactly like a finished one that happens to be off. Ask the same validator on load and print the same sentence, or the one row that needs attention is the one row nobody can find.

---

## Choosing the Origin First (when the pivot is a reference)

If the pivot is a **reference** — this row reads from that one — then the controls below it belong to the referenced record's type, and the union of "everything any candidate could offer" is not a form: it offers comparisons that apply to none of the selected ones. Split the screen in two steps:

1. **the reference** — a list of real candidates, each a link (`?ref=<id>`). The candidate list comes from the domain, so the list offered and the list accepted are one computation.
2. **the configuration** — drawn from **the selected record's own declaration**.

This costs one click when the row is created and **none** when it is edited: an existing row already names its reference, so its form opens directly at step 2. A `?pick=1` parameter is what the "change" link uses, because otherwise a row that resolves its own reference would land back on the form it was leaving.

Bonus: with the reference settled, the dependent selectors no longer need JavaScript or a union — they are drawn server-side from one declaration, and the save that follows is the ordinary case rather than the exception.

---

## Confirming a Destructive Action

A write that changes who can see something — removing a gate, revoking a token, dropping a
table — asks first. **Ask with a modal, not with `window.confirm()`**: the browser's dialog
cannot be translated, cannot be styled, and cannot say what the action MEANS in the terms of
the screen. The panel already has the shape (the db-migrations UI and the API tokens screen
use it):

```php
$modal = $this->set_ui_dom_elem_id("removeconfirm", "div");
$modal->addClass("modal fade");
$modal->set_att("tabindex", "-1");
$modal->set_att("aria-hidden", "true");
// … modal-dialog > modal-content > modal-header / modal-body / modal-footer
```

and the trigger is a plain button that opens it:

```php
$trigger->set_att("data-bs-toggle", "modal");
$trigger->set_att("data-bs-target", "#" . $this->get_ui_elem_id("removeconfirm"));
```

### The dialog carries its own form

Do **not** make the confirmation a second submit inside the main form: it would post every
field of that form along with the action, and "what did the operator ask for" would depend on
which button the browser happened to report. Give the dialog a form of its own with **one
marker**:

```html
<form method="post" action="<the screen's own url>">
  <input type="hidden" name="_thing_remove" value="1">
  <button type="submit" class="btn btn-danger">Remove</button>
</form>
```

and have the screen recognise **both** forms, because they are not the same request:

```php
if ($this->remove_requested() || $this->is_post_here()) {   // the marker, or the form
    $this->process_save();
}
```

`is_post_here()` is usually the shared one that looks for the form's `nd` group, and it will
answer `false` for the dialog — which has no fields. A screen that only checks it will post the
removal and then ignore it: the button seems to work, the row stays, and nothing is reported.

### Two traps, both silent

- **An accessor that does not exist.** `get_ui_dom_elem_id()` does not exist (the method is
  `get_ui_elem_id()`), so it fell through to `__call` and returned `false`, and the trigger was
  built with `data-bs-target="#"` — an empty selector. Bootstrap then threw a `TypeError` from
  inside the library and the dialog never opened. Nothing in PHP reported it. Use the same
  accessor that named the element.
- **A modal that only looks wired.** Verify the trigger actually opens it in a browser. The
  markup is right, `php -l` is clean, and the failure is a missing id.

---

## Checklist

- [ ] The validator is split: **structure** (refused) vs **completeness** (delegated).
- [ ] A **strict** predicate exists for readers, and is not used to decide whether to save.
- [ ] The write path accepts an incomplete row and stores it **inactive**, with a **notice code**.
- [ ] The invariant `active ⇒ valid` is applied in **every** writer: the API, the item's `do_save_data()`, and the manager's `validate_new_item_data_sub()`.
- [ ] Validation of a write judges the **merged** row.
- [ ] The value control is chosen by the **member** the pivot selected, not by a `switch` in the screen.
- [ ] The pivot's note says that the fields below follow it.
- [ ] A row stored switched off says so, in **one sentence**, on save **and** when opened.
- [ ] A destructive action is confirmed with a **modal of the panel's own** (never `window.confirm()`), and the dialog posts **its own form** with one marker.
- [ ] The screen recognises **both** forms it can receive: the main one (`nd`) and the dialog's.
- [ ] There is a test that **sweeps the table**: every active row passes the strict predicate.
- [ ] Any fixture cleanup is **scoped to the fixture**. A `DELETE … WHERE <key> NOT IN (…)` is unscoped and can remove rows the test never wrote.

---

## Traps Found While Applying This

- **A `NOT NULL` column missing from an `INSERT IGNORE` drops the row in silence.** The framework's `insert_item()` builds `insert IGNORE`; a missing required column makes MySQL discard the row, `last_insert_id()` returns `0`, and the creation guard reports a generic failure. When a creation path fails with no message, print the generated SQL and compare it against the table's columns.
- **`validate_new_item_data_sub()` is the creation guard**, and it is easy to miss: a screen-only fix passes its own tests while `create_new_item()` still returns `false` for exactly the rows the design intends to allow.
- **`getField()` is what decides whether a key reaches the SQL.** A key that is not a known column is not an error; it is dropped, and the insert above is the result.
- **`parent::` cannot reach a trait's method.** A method provided by a trait is spliced onto the *using* class, so `parent::method()` misses it and `mw_baseobj::__call()` answers `false` with no error. Overriding a trait method and calling `parent::` for it looks like careful code and silently returns `false`.
- **`isset()` and `??` do not reach a magic property.** `mw_baseobj` defines `__get()` without `__isset()`, so `isset($obj->privateProp)` and `$obj->privateProp ?? $fallback` answer `false`/the fallback **without calling the getter**. A loop that walks `$node = $node->parent ?? false` ends after one iteration and looks correct.
- **Normalise on the way in.** Collapsing every spelling of one meaning to a single stored form is what lets a closed control show what is stored — and what lets two rows that say the same thing compare equal. Keep accepting the old spellings on read, so rows written before the rule stay editable.
- **An under-scoped fixture cleanup eats other people's rows.** A suite that ends with `DELETE FROM t WHERE <ref> NOT IN (SELECT id FROM other)` removes EVERY row whose reference is missing, not only the ones it wrote. It passes, and it can destroy data a demo or another test depends on. Do the deletion **inside the fixture loop, while the fixture's rows still exist** to name them.
