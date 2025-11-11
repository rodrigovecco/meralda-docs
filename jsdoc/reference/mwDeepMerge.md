# mwDeepMerge

**Location:** `src/public_html/res/js/main.js`

---

## Signature

`function mwDeepMerge(target, ...sources) {`

## Source snippet

```javascript
// JavaScript Document
function mwDeepMerge(target, ...sources) {
  for (const source of sources) {
    for (const key in source) {
      if (source[key] instanceof Object && key in target) {
        mwDeepMerge(target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    }
  }
}

function nl2br(str){
	var s=""+str;
	return s.replace(/\n/g, "<br>");
}
function mw_format_number(num,precision,thousendsep,decsep,neg
```

---

*Auto-extracted from source.*
