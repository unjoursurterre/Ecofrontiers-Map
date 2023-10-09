mapboxgl.accessToken = 'pk.eyJ1IjoidW5qb3Vyc3VydGVycmUiLCJhIjoiY2xtbDVlZmtxMDdrbzJtdG4wcGswYWNubSJ9.gYNEOES5V6knJ5-90vPDuw';
    
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [5, 1.5],
    zoom: 1.5,
});

// Load marker data from a JSON file and add markers
fetch('../models/all_marker_data.json?' + new Date().getTime())
    .then(response => response.json())
    .then(data => {
        console.log(data);
        data.forEach(asset => {
            console.log(asset);
            const marker = new mapboxgl.Marker()
                .setLngLat([asset.longitude, asset.latitude])
                .addTo(map);
            
            // Create the HTML content for the pop-up
            const popupContent = `
                <h3>${asset.project_title}</h3>
                <p><strong>Asset Type:</strong> ${asset.asset_type}</p>
                <p><strong>Description:</strong> ${asset.description}</p>
                <p><strong>Seller:</strong> ${asset.seller}</p>
                <a href="${asset.asset_link}" target="_blank">Buy here</a>
                `;

            const popup = new mapboxgl.Popup()
                .setHTML(popupContent);
            marker.setPopup(popup);
        });
    });
