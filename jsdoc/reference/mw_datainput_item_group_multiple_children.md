# mw_datainput_item_group_multiple_children

**Location:** `src/public_html/res/js/inputs/other.js`

---

## Signature

`function mw_datainput_item_group_multiple_children(options){`

## Source snippet

```javascript
for(var i =0; i<list.length;i++){
					list[i].append_to_container(pbody);
				}
				
			}
			
		}

		return c;
	}
	
	
	

}
mw_datainput_item_groupwithtitle.prototype=new mw_datainput_item_group();
function mw_datainput_item_group_multiple_children(options){
	this.init(options);
	this.get_next_child_index=function(){
		var list=this.get_sub_items_list();
		if(!list){
			return 1;	
		}
		return list.getItemsNum()+1;
	
	}
	
	this.createNewChild=function(){
		var fnc =this.options.get_param_if_function("newchild");
		if(fnc){
			return fnc(this);	
		}
		var cod=this.get_next_child_index();
		var ch=new mw_datainput_item_input({cod:cod,lbl:cod})
```

---

*Auto-extracted from source.*
