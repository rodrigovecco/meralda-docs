# _findNodeById

**Location:** `src/public_html/res/js/inputs/dxnormal.js`

---

## Signature

`function _findNodeById(nodes, id){`

## Source snippet

```javascript
this.input_elem.value = this.format_input_value(this.DXValue);
			
            console.log("[DX_dropDownTreeView] Updated hidden input", this.input_elem.value);
        }

        this.on_change();

        function _findNodeById(nodes, id){
            for(var i=0;i<nodes.length;i++){
                if(nodes[i].id == id) return nodes[i];
                if(nodes[i].items){
                    var res = _findNodeById(nodes[i].items, id);
                    if(res) return res;
                }
            }
            return null;
        }
    };

    this.set_input_value = function(val){
		console.log("[DX_dropDownTre
```

---

*Auto-extracted from source.*
