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

function addRouteLayers() {
    routesData.forEach(function(route, i) {
        map.addSource('route-source-' + i, {
            type: 'geojson',
            data: {
                type: 'FeatureCollection',
                features: [route]
            }
        });
        map.addLayer({
            id: 'route-' + i,
            type: 'line',
            source: 'route-source-' + i,
            paint: {
                'line-color': '#e74c3c',
                'line-width': 4,
                'line-opacity': 0
            }
        });
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
