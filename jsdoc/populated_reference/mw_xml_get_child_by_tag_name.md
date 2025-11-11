# mw_xml_get_child_by_tag_name

**Source:** `src/public_html/res/js/main.js`

---

## Description

Search for and return the first child element node with a given tag name from an XML/DOM node's `childNodes`.

## Signature

function mw_xml_get_child_by_tag_name(node, tagname)

- node: Node — DOM/XML node to search
- tagname: string — tag name to match (exact string match)

## Returns

- Node|false — matching child node or `false` when not found or invalid input

## Behavior

- Verifies the node is an object and has `childNodes`.
- Iterates childNodes and returns the first child whose `nodeName` equals `tagname`.

## Example

const child = mw_xml_get_child_by_tag_name(xmlNode, 'item');

---

*Auto-generated (populated) documentation.*
