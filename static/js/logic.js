// Create Map
var myMap = L.map("map", {center: [43, -125], zoom: 4});

// Create Tile Layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {attribution: '&copy; <a href=https://www.openstreetmap.org/copyright>OpenStreetMap</a> contributors'}).addTo(myMap);

// Get Circle Color Based On Earthquake Depth
function get_Color(Earthquake_Depth) {
    var Selected_Color
    
    if (Earthquake_Depth >= 90) {Selected_Color = "Red"}
    else if (Earthquake_Depth < 90 && Earthquake_Depth >= 70) {Selected_Color = "OrangeRed"}
    else if (Earthquake_Depth < 70 && Earthquake_Depth >= 50) {Selected_Color = "Orange"}
    else if (Earthquake_Depth < 50 && Earthquake_Depth >= 30) {Selected_Color = "Yellow"}
    else if (Earthquake_Depth < 30 && Earthquake_Depth >= 10) {Selected_Color = "LawnGreen"}
    else {Selected_Color = "GreenYellow"}
    
    return Selected_Color
}

// Plot Circles
function draw_Circle(point, latlng) {
    let Earthquake_Magnitude = point.properties.mag;
    let Earthquake_Depth = point.geometry.coordinates[2];
    return L.circle(latlng, {
            fillOpacity: 0.6,
            color: get_Color(Earthquake_Depth),
            fillColor: get_Color(Earthquake_Depth),
            // Set radius of circle based on magnitude
            radius: Earthquake_Magnitude * 25000
    })
}

// Create Popup Info Panel
function bindPopUp(feature, layer) {
    layer.bindPopup(`Location: ${feature.properties.place} <br> Magnitude: ${feature.properties.mag} <br> Depth: ${feature.geometry.coordinates[2]}`);
}

// Earthquake Data URL
var url = " https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Collect Data From GeoJSON API
d3.json(url).then((data) => {
    var features = data.features;

    // Add Data to Map
    L.geoJSON(features, {
        pointToLayer: draw_Circle,
        onEachFeature: bindPopUp
    }).addTo(myMap);

    // Create Legend
    var legend = L.control({position: 'bottomright'});

    legend.onAdd = () => {
        var div = L.DomUtil.create('div', 'info legend');
        grades = [-10, 10, 30, 50, 70, 90];

        // Set Square Color For Each Bracket In Legend
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML += '<i style="background:' + get_Color(grades[i] + 1) + '"></i> ' + grades[i] + (grades[i + 1] ? ' to ' + grades[i + 1] + '<br>' : '+');
        }
        return div;
    };
    legend.addTo(myMap);
});