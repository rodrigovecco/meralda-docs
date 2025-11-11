# mwuihelper_nav_mnu_item

**Location:** `src/public_html/res/js/ui/helpers/mnu.js`

---

## Signature

`function mwuihelper_nav_mnu_item(cod,params,ui){`

## Source snippet

```javascript
rn false;	
		}
		var r;
		var e;
		for(var i=0;i<list.length;i++){
			e=list[i];
			if(e.cod==cod){
				e.setSelected(true);	
				r=e;
			}else{
				e.setSelected(false);	
			}
		}
		return r;
	}
	
}

function mwuihelper_nav_mnu_item(cod,params,ui){
	this.classNameActive="active";
	this.classNameNormal="";
	
	this.setSelectedChild=function(cod){
		var list=this.items.get_items_by_index();
		if(!list){
			return false;	
		}
		var r;
		var e;
		for(var i=0;i<list.length;i++){
			e=list[i];
			if(e.cod==cod){
				e.setSelected(true);	
				r=e;
			}else{
				e.setSelected(false);	
			}
		}
		if(r){
			this.onSelected();	
		}
		ret
```

---

*Auto-extracted from source.*
