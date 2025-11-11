# mwGoogleRouteManager

**Location:** `src/public_html/res/js/maps/routes.js`

---

## Signature

`function mwGoogleRouteManager(cfg) {`

## Source snippet

```javascript
coding.decodePath(encoded);
    };
  
    self.createRoute = function(origin, destination) {
      return new mwRoute(self, origin, destination);
    };
  
    return self;
  }
  
  // Google Manager
  function mwGoogleRouteManager(cfg) {
    const base = mwRouteManager(cfg);
    const self = base;
    
  
    let directionsService = new google.maps.DirectionsService();
    let directionsRenderer = null;
  
    self.initRenderer = function() {
      directionsRenderer = new google.maps.DirectionsRenderer({
        map: self.googleMap,
        suppressMarkers: true,
        preserveViewport: true
      });
    };
  
    self.
```

---

*Auto-extracted from source.*
