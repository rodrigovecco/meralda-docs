# mwRouteManager

**Location:** `src/public_html/res/js/maps/routes.js`

---

## Signature

`function mwRouteManager(cfg) {`

## Source snippet

```javascript
}
  
    onResponse(callback) {
      this.onResult = callback;
      return this;
    }
  
    request() {
      this.manager.requestRoute(this);
      return this;
    }
  }
  
  // Manager base
  function mwRouteManager(cfg) {
    const self = {};
    self.cfg = Object.assign({
      directionMode: "DRIVING",
      mapType: "google",
    }, cfg || {});
  
    self.setGoogleMap = function(map) {
      self.googleMap = map;
    };
  
    self.decodePolyline = function(encoded) {
      return google.maps.geometry.encoding.decodePath(encoded);
    };
  
    self.createRoute = function(origin, destination) {
      ret
```

---

*Auto-extracted from source.*
