var routesData = [];
var geojsonPoint = {
    "type": "FeatureCollection",
    "features": [{
        "type": "Feature",
        "geometry": {
            "type": "LineString",
            "coordinates": []
        }
    }]
};

// Greeked text — placeholder until real copy arrives
var GREEK = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.";

// Order matches drive-slide-0 through drive-slide-4 after the Lewnes'/Ruth's Chris swap
var restaurantInfo = [
    { name: "Harry Browne's Restaurant",  coords: [-76.4898587, 38.9793638], query: "Harry Browne's Restaurant Annapolis MD",      greek: GREEK },
    { name: "Acqua al 2",                 coords: [-76.4921331, 38.9784478], query: "Acqua al 2 Annapolis MD",                     greek: GREEK },
    { name: "The Choptank",               coords: [-76.4863128, 38.9769477], query: "The Choptank Annapolis MD",                   greek: GREEK },
    { name: "Lewnes' Steakhouse",         coords: [-76.4822483, 38.971587],  query: "Lewnes Steakhouse Annapolis MD",              greek: GREEK },
    { name: "Ruth's Chris Steak House",   coords: [-76.4815871, 38.9720243], query: "Ruth's Chris Steak House Annapolis MD",       greek: GREEK }
];

var placePhotos = {};
var puckMarkers = [];
var activePopup = null;

async function fetchRealRoutes(accessToken) {
    var stateHouse = [-76.4908889, 38.9787739];
    var waypoints = [stateHouse].concat(restaurantInfo.map(function(r) { return r.coords; }));

    routesData = [];
    for (var i = 0; i < waypoints.length - 1; i++) {
        var coords = waypoints[i][0] + ',' + waypoints[i][1] + ';' + waypoints[i+1][0] + ',' + waypoints[i+1][1];
        var url = 'https://api.mapbox.com/directions/v5/mapbox/driving/' + coords +
                  '?access_token=' + accessToken + '&geometries=geojson';
        try {
            var response = await fetch(url);
            var data = await response.json();
            if (data.routes && data.routes.length > 0) {
                routesData.push({
                    type: 'Feature',
                    geometry: data.routes[0].geometry,
                    properties: { index: i }
                });
            }
        } catch (err) {
            console.error('Error fetching route ' + i + ':', err);
        }
    }
    console.log('Real routes loaded:', routesData.length);
    return routesData;
}

// ── Radiating puck markers ──────────────────────────────────────────────────

function createPuckMarker(info) {
    var el = document.createElement('div');
    el.className = 'puck-marker';

    var pulse1 = document.createElement('div');
    pulse1.className = 'puck-ring';
    var pulse2 = document.createElement('div');
    pulse2.className = 'puck-ring puck-ring-delay';
    var core = document.createElement('div');
    core.className = 'puck-core';

    el.appendChild(pulse1);
    el.appendChild(pulse2);
    el.appendChild(core);

    el.addEventListener('click', function(e) {
        e.stopPropagation();
        showTooltip(info);
    });

    var marker = new mapboxgl.Marker({ element: el, anchor: 'center' })
        .setLngLat(info.coords)
        .addTo(map);

    puckMarkers.push(marker);
}

function addPuckMarkers() {
    restaurantInfo.forEach(function(info) {
        createPuckMarker(info);
    });
}

// ── Google Places photo tooltips ────────────────────────────────────────────

function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function(c) {
        return { '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c];
    });
}

function tooltipHtml(info, photoUrl) {
    var photo = photoUrl
        ? '<img src="' + photoUrl + '" class="tip-photo" alt="' + escapeHtml(info.name) + '">'
        : '<div class="tip-photo-placeholder">' +
          (config.googlePlacesKey ? 'Loading photo…' : 'No photo') + '</div>';
    return '<div class="tip-inner">' + photo +
           '<div class="tip-body">' +
             '<h4 class="tip-name">' + escapeHtml(info.name) + '</h4>' +
             '<p class="tip-greek">' + escapeHtml(info.greek) + '</p>' +
           '</div></div>';
}

function showTooltip(info) {
    if (activePopup) { activePopup.remove(); activePopup = null; }

    var popup = new mapboxgl.Popup({
        offset: 22,
        closeButton: true,
        maxWidth: '280px',
        className: 'restaurant-popup'
    })
    .setLngLat(info.coords)
    .setHTML(tooltipHtml(info, placePhotos[info.name]))
    .addTo(map);

    activePopup = popup;

    // Lazy-load the photo if we don't have it cached
    if (!placePhotos[info.name] && config.googlePlacesKey) {
        fetchAndCachePhoto(info).then(function(url) {
            if (!url || !activePopup) return;
            // Re-render the popup with the photo (only if this popup is still open)
            if (activePopup === popup) {
                popup.setHTML(tooltipHtml(info, url));
            }
        });
    }
}

function waitForGoogle(timeout) {
    return new Promise(function(resolve, reject) {
        var start = Date.now();
        (function check() {
            if (typeof google !== 'undefined' && google.maps && google.maps.importLibrary) {
                return resolve();
            }
            if (Date.now() - start > timeout) return reject(new Error('Google Maps load timeout'));
            setTimeout(check, 100);
        })();
    });
}

async function fetchAndCachePhoto(info) {
    if (!config.googlePlacesKey) return null;
    try {
        await waitForGoogle(8000);
        const { Place } = await google.maps.importLibrary('places');
        const { places } = await Place.searchByText({
            textQuery: info.query,
            fields: ['photos'],
            locationBias: { lat: info.coords[1], lng: info.coords[0] },
            maxResultCount: 1
        });
        if (places && places.length > 0 && places[0].photos && places[0].photos.length > 0) {
            var url = places[0].photos[0].getURI({ maxWidth: 600 });
            placePhotos[info.name] = url;
            return url;
        }
        console.warn('No photo found for ' + info.name);
    } catch (err) {
        console.error('Places API error for ' + info.name + ':', err);
    }
    return null;
}

function preloadPlacePhotos() {
    if (!config.googlePlacesKey || typeof google === 'undefined') return;
    restaurantInfo.forEach(function(info) { fetchAndCachePhoto(info); });
}

// ── Route sources and markers ───────────────────────────────────────────────

function addRouteLayers() {
    routesData.forEach(function(route, i) {
        map.addSource('route-source-' + i, {
            type: 'geojson',
            data: { type: 'FeatureCollection', features: [route] }
        });
    });
    addPuckMarkers();
    preloadPlacePhotos();
}

// ── Animated line ───────────────────────────────────────────────────────────

function createLine() {
    var allCoords = routesData.reduce(function(acc, r) {
        return acc.concat(r.geometry.coordinates);
    }, []);
    var line = turf.lineString(allCoords);
    var lineDistance = turf.lineDistance(line);
    var rects = driveTime;
    var segments = lineDistance / rects;

    for (var i = 0; i <= rects; i++) {
        var pt = turf.along(line, segments * i);
        var newX = pt.geometry.coordinates[0];
        var newY = pt.geometry.coordinates[1];
        geojsonPoint.features[0].geometry.coordinates.push([newX, newY]);

        if (i === 0) {
            var initPoint = turf.point([newX, newY]);
            if (followPoint === true) { map.setCenter([newX, newY]); }
            map.getSource('pointSource').setData(initPoint);
        }
        if (i === rects) {
            map.getSource('lineSource').setData(geojsonPoint);
        }
    }
}

function changeCenter(index) {
    var coords = geojsonPoint.features[0].geometry.coordinates;
    if (index >= coords.length) index = coords.length - 1;
    var currentJson = coords.slice(0, index);
    var center = coords[index];

    map.getSource('lineSource').setData({
        "type": "FeatureCollection",
        "features": [{ "type": "Feature", "geometry": { "type": "LineString", "coordinates": currentJson } }]
    });
    map.getSource('pointSource').setData(turf.point(center));

    if (followPoint === true && index % 100 === 0) {
        map.jumpTo({ center: center });
    }
}
