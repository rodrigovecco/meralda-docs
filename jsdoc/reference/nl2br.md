# nl2br

**Location:** `src/public_html/res/js/main.js`

---

## Signature

`function nl2br(str){`

## Source snippet

```javascript
const key in source) {
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
function mw_format_number(num,precision,thousendsep,decsep,negParenthesis){
	num=mw_getNumber(num);
	precision=Math.abs(mw_getInt(precision));
	
	if(!thousendsep){
		thousendsep="";	
	}
	if(!decsep){
		decsep=".";	
	}
	var sign = (num < 0) ? '-' : '';
	var neg = (num < 0) ? true : false;
	
	num=Math.abs(num);
	//var int=Math.round(num);
	var
```

---

*Auto-extracted from source.*
