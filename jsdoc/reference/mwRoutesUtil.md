# mwRoutesUtil

**Location:** `src/public_html/res/js/maps/routes.js`

---

## Signature

`function mwRoutesUtil() {`

## Source snippet

```javascript
nResult === "function") {
            route.onResult(data);
          }
        })
        .catch(err => {
          console.error("OSRM route error", err);
        });
    };
  
    return self;
  }
  function mwRoutesUtil() {
	this.distanceThresholdMeters = 50; // valor por defecto

	this.setThreshold = function(meters) {
		this.distanceThresholdMeters = meters;
	};

	this.calculateDistanceMeters = function(lat1, lng1, lat2, lng2) {
		const R = 6371000; // radio de la Tierra en metros
		const toRad = (deg) => deg * Math.PI / 180;

		const dLat = toRad(lat2 - lat1);
		const dLng = toRad(lng2 - lng1);
		const a = Mat
```

---

*Auto-extracted from source.*
