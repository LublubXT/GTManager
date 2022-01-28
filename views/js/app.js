mapboxgl.accessToken = 'pk.eyJ1IjoibHVibHViIiwiYSI6ImNrdHdxaG5oczB4MHMybnA4MnFwbGJ1cHIifQ.LaqYezE9utIBiRQiLoMIxg';

document.getElementById('wrench-1').style.fill = '#686868';

d = JSON.parse(document.getElementById('send-to-front').value)

console.log(JSON.stringify(d, undefined, 4))

var front_data = document.getElementById('send-to-front').value;

var on = false;

var current_coord;
var current_pos;
var highest_pos;

// <div class="block"><div><p style="text-align: center; width: 75%; margin: auto; margin-top: 20px; font-size: 18px;">Strada Renasterii, nr. 14 MD-3051, Soroca</p><div class="color-red" style="position: fixed; top: 0px; right: 0px; width: 5px; height: 5px;"></div></div><div style="display: flex; flex-direction: row; width: 100%; margin: auto;  margin-top: 30px; margin-bottom: 20px;"><button class="button-gray" style="font-size: 15px; width: 150px;">Not Home</button><button style="font-size: 15px;  width: 150px; margin-left: 5px; margin-right: -50px;", onclick="show()" class="button-green" id="input-info" onclick="show()">Input Info</button><p style="margin-left: 90px; font-size: 19px; margin-right: 0px; width: 150px;">Not Saved</p></div></div>

function editMode() {
    if (on == false) {
        document.getElementById('wrench-1').style.fill = '#7dd261';
        on = true
    } else if (on == true) {
        document.getElementById('wrench-1').style.fill = '#686868';
        on = false
    }
    console.log(JSON.stringify(d, undefined, 4))
        //- console.log("change color")
}

const geojson = {
    "password": d.password,
    "email": d.email,
    'type': 'FeatureCollection',
    'features': d.features
};

const map = new mapboxgl.Map({
    container: 'map',
    //- style: 'mapbox://styles/mapbox/light-v10',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [-96, 37.8],
    zoom: 3
});

for (const feature of geojson.features) {
    // create a HTML element for each feature
    const el = document.createElement('div');
    el.className = 'marker';

    // console.log('freather', feature)

    new mapboxgl.Marker(el)
        .setLngLat(feature.geometry.coordinates)
        .setPopup(
            new mapboxgl.Popup({ offset: 25 }) // add popups
            .setHTML(
                `${feature.properties.description}`
            )
        )
        .addTo(map);

}

function add_marker(event) {
    if (on == true) {
        // var marker = new mapboxgl.Marker();

        for (var i = 0; i < geojson.features.length; i++) {
            console.log(geojson.features[i].index)
            highest_pos = geojson.features[i].index
        }

        var coordinates = event.lngLat;
        console.log('Lng:', coordinates.lng, 'Lat:', coordinates.lat);
        // marker.setLngLat(coordinates).addTo(map);
        geojson.features.push({
            'type': 'Feature',
            "index": highest_pos + 1,
            'geometry': {
                'type': 'Point',
                'coordinates': [coordinates.lng, coordinates.lat]
            },
            'properties': {
                'description': `<div class="block" style="background-color: rgba(252, 252, 252, 0.6); backdrop-filter: blur(5px);"><div><p id="coordinates" style="text-align: center; width: 75%; margin: auto; margin-top: 20px; font-size: 18px;">${coordinates.lng}, ${coordinates.lat}</p><div id="status-popup" class="status" style="position: fixed; top: 11px; right: 11px; width: 5px; height: 5px;"></div></div><div style="display: flex; flex-direction: row; width: 100%; margin: auto;  margin-top: 30px; margin-bottom: 20px;"><button style="font-size: 15px;  width: 150px; margin-left: 5px; margin-right: -50px;", onclick="show()" class="button-green" id="input-info" onclick="show()">Input Info</button><button style="font-size: 15px;  width: 150px; margin-left: 63px; margin-right: 20px;", class="button-gray" id="input-info" onclick="showstatus()">Show Status</button></div></div>`
            },
            'data': {
                'firstName': '',
                'lastName': '',
                'occupation': '',
                'wasHome': true,
                'saved': false,
                'wantsToGoToChurch': false,
                'talkedAbout': '',
                'comments': '',
                'color': 'gray'
            }
        })

        document.getElementById('data').value = JSON.stringify(geojson);

        for (const feature of geojson.features) {
            // create a HTML element for each feature
            const el = document.createElement('div');
            el.className = 'marker';

            // make a marker for each feature and add it to the map
            new mapboxgl.Marker(el)
                .setLngLat(feature.geometry.coordinates)
                .setPopup(
                    new mapboxgl.Popup({ offset: 25 }) // add popups
                    .setHTML(
                        `${feature.properties.description}`
                    )
                )
                .addTo(map);
        }
    } else if (on == false) {
        console.log("cant edit")
    }
}

map.on('click', add_marker);