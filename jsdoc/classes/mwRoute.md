# mwRoute

**Location:** `src/public_html/res/js/maps/routes.js`

---

## Description

Represents a route managed by a route manager (Google or OSRM). Holds origin/destination, waypoints, styling and callbacks.

## Constructor

- constructor(manager, origin, destination)
	- manager: mwRouteManager (or derived)
	- origin: mwLatLng or string/address
	- destination: mwLatLng or string/address

## Properties

- manager — the route manager instance
- origin — origin coordinate
- destination — destination coordinate
- mode — travel mode (e.g., 'DRIVING')
- waypoints — array of intermediate points
- drawOnResponse — whether to draw route on response
- style — object with color, weight, etc.
- onResult — callback invoked when routing result arrives

## Methods

- setMode(mode)
	- Set travel mode (fluent).

- addWaypoint(latlng)
	- Add a waypoint and return this.

- setWaypoints(pointsArray)
	- Replace waypoints array.

- setStyle(style)
	- Merge style object into route style.

- onResponse(callback)
	- Set onResult callback (fluent).

- request()
	- Ask manager to request this route. Returns this.

---

## Related managers

- mwRouteManager(cfg) — base manager factory
- mwGoogleRouteManager(cfg) — uses Google Directions API
- mwOSRMRouteManager(cfg) — uses OSRM HTTP API

---

*Auto-generated documentation populated from source.*
