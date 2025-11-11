# mw_datainput_item_datagrid

**Location:** `src/public_html/res/js/inputs/datagrid.js`

---

## Signature

`function mw_datainput_item_datagrid(options){`

## Source snippet

```javascript
this.cod;	
		var p;
		if(this.man){
			if(p=this.man.get_input_name()){
				pref=p+"["+this.cod+"]";
			}
		}
		this.data.append2frm(e,pref);
		c.appendChild(e);
		container.appendChild(c);
		
	}
	
}

function mw_datainput_item_datagrid(options){
	this.init(options);
	this.new_row_index=1;
	//this.value_as_list=new Array();
	this.rows_col=new mw_objcol();
	
	this.get_input_value_as_group=function(){
		var d=new Object;
		
		
		var list=this.dsList();
		if(!list){
			return d;	
		}
		var cod=0;
		var _cod;
		var input;
		for(var i =0; i<list.length;i++){
			cod++;
			_cod=""+cod;
			d[_cod]=list[i];
			
		}
		return d;
	}
	this.in
```

---

*Auto-extracted from source.*
