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

async function fetchRealRoutes(accessToken) {
    var stateHouse = [-76.4908889, 38.9787739];
    var restaurants = [
        [-76.4898587, 38.9793638],
        [-76.4921331, 38.9784478],
        [-76.4863128, 38.9769477],
        [-76.4822483, 38.971587],
        [-76.4815871, 38.9720243]
    ];

    routesData = [];
    var waypoints = [stateHouse].concat(restaurants);

    for (var i = 0; i < waypoints.length - 1; i++) {
        var coords = waypoints[i][0] + ',' + waypoints[i][1] + ';' + waypoints[i+1][0] + ',' + waypoints[i+1][1];
        var url = 'https://api.mapbox.com/directions/v5/mapbox/driving/' + coords + '?access_token=' + accessToken + '&geometries=geojson';

        try {
            var response = await fetch(url);
            var data = await response.json();

            if (data.routes && data.routes.length > 0) {
                var route = {
                    type: 'Feature',
                    geometry: data.routes[0].geometry,
                    properties: { index: i }
                };
                routesData.push(route);
            }
        } catch (err) {
            console.error('Error fetching route ' + i + ':', err);
        }
    }

    console.log('Real routes loaded:', routesData.length);
    return routesData;
}

function addRouteLayers() {
    routesData.forEach(function(route, i) {
        map.addSource('route-source-' + i, {
            type: 'geojson',
            data: {
                type: 'FeatureCollection',
                features: [route]
            }
        });
        // map.addLayer({
        //     id: 'route-' + i,
        //     type: 'line',
        //     source: 'route-source-' + i,
        //     paint: {
        //         'line-color': '#e74c3c',
        //         'line-width': 4,
        //         'line-opacity': 0
        //     }
        // });
    });
}

function createLine() {
    var allCoords = routesData.reduce(function(acc, r) {
        return acc.concat(r.geometry.coordinates);
    }, []);
    var line = turf.lineString(allCoords);
    var lineDistance = turf.lineDistance(line);
    var rects = driveTime;
    var segments = lineDistance / rects;

    for (var i = 0; i <= rects; i++) {
        var pointonline = turf.along(line, (segments * i));
        var newX = pointonline.geometry.coordinates[0];
        var newY = pointonline.geometry.coordinates[1];
        geojsonPoint.features[0].geometry.coordinates.push([newX, newY]);

        if (i === 0) {
            var initPoint = turf.point([newX, newY]);
            if (followPoint === true) {
                map.setCenter([newX, newY]);
            }
            map.getSource('pointSource').setData(initPoint);
        }
        if (i === rects) {
            map.getSource('lineSource').setData(geojsonPoint);
        }
    }
}

function changeCenter(index) {
    var subsampleIndex = 100;
    var coords = geojsonPoint.features[0].geometry.coordinates;
    if (index >= coords.length) index = coords.length - 1;
    var currentJson = coords.slice(0, index);
    var center = coords[index];
    var centerX = center[0];
    var centerY = center[1];

    var movingLine = {
        "type": "FeatureCollection",
        "features": [{
            "type": "Feature",
            "geometry": {
                "type": "LineString",
                "coordinates": currentJson
            }
        }]
    };

    var movingPoint = turf.point([centerX, centerY]);
    map.getSource('lineSource').setData(movingLine);
    map.getSource('pointSource').setData(movingPoint);

    if (followPoint === true) {
        if (index % subsampleIndex === 0) {
            map.jumpTo({ center: [centerX, centerY] });
        }
    }
}