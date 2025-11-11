# mw_datainput_item_rating

**Location:** `src/public_html/res/js/inputs/other.js`

---

## Signature

`function mw_datainput_item_rating(options) {`

## Source snippet

```javascript
(this.rightBtnContainer).html("<i class='fa fa-eye'></i>");
		}else{
			$(this.input_elem).attr("type","input");
			$(this.rightBtnContainer).html("<i class='fa fa-eye-slash'></i>");
		}

	}
	

	
	
}


function mw_datainput_item_rating(options) {
    mw_datainput_item_base.call(this);

    this.init(options);

    this.create_input_elem = function() {
        var _this = this;

        // Contenedor principal
        var c = document.createElement("div");
        c.className = "mw-rating-input-container";

        // Input oculto para el valor
        this.hiddenInput = document.createElement("input");
        this.hiddenInput.t
```

---

*Auto-extracted from source.*
