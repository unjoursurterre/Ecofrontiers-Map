mapboxgl.accessToken = 'pk.eyJ1IjoidW5qb3Vyc3VydGVycmUiLCJhIjoiY2xtbDVlZmtxMDdrbzJtdG4wcGswYWNubSJ9.gYNEOES5V6knJ5-90vPDuw';
    
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [20, 1.5],
    zoom: 0
});

// Load marker data from a JSON file and add markers
fetch('../models/marker_data.json')
    .then(response => response.json())
    .then(data => {
        console.log(data);
        data.forEach(asset => {
            console.log(asset);
            const marker = new mapboxgl.Marker()
                .setLngLat([asset.longitude, asset.latitude])
                .addTo(map);

            const popup = new mapboxgl.Popup()
                .setHTML(asset.project_title);
            marker.setPopup(popup);
        });
    });
