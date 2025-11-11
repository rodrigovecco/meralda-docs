# mwuihelper_ajaxelem_devextreme_scheduler

**Location:** `src/public_html/res/js/ui/helpers/ajaxelem/devextreme_scheduler.js`

---

## Signature

`function mwuihelper_ajaxelem_devextreme_scheduler(params) {`

## Source snippet

```javascript
AJAX
// - Creates the DevExtreme dxScheduler directly (no intermediate manager)
// - Uses mw_devextreme_data for remote data loading
// ===============================================================

function mwuihelper_ajaxelem_devextreme_scheduler(params) {
	mwuihelper_ajaxelem.call(this,params);
    /**
     * Called automatically when AJAX response is loaded successfully.
     * Expects the backend to return:
     *  - jsresponse.scheduleroptions → object with dxScheduler config
     *  - jsresponse.dataSourceMan   → object with remote DataSource parameters
     */
    this.onLoadedDataOK = function() {
        if (!this.loadedData) {
```

---

*Auto-extracted from source.*
