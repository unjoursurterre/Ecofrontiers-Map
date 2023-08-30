document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded event fired');

    mapboxgl.accessToken = 'pk.eyJ1IjoidW5qb3Vyc3VydGVycmUiLCJhIjoiY2xrZ3Yxa2ZoMDNsdzNma2VrZ3Rld3g4OCJ9.-TQXieKIGjEFOoND4VUfrA'
    
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [20, 1.5],
        zoom: 0,
    });

    // Make a request to the back-end API to fetch project data
    axios.get('/api/projects')
        .then(response => {
            console.log('Received project data:', response.data);
            
            const projects = response.data;

            projects.forEach(project => {
                const {location, coordinates, projectTitle, description, assetType, assetLink} = project;

                // Create a marker for each project
                const marker = new mapboxgl.Marker()
                    .setLngLat([parseFloat(coordinates.lng), parseFloat(coordinates.lat)])
                    .addTo(map);
                
                // Create a popup for each marker
                const popup = new mapboxgl.Popup({closeButton: false, offset: 25})
                    .setHTML(`
                        <h3>${projectTitle}</h3>
                        <p><a href="${assetLink}" target="_blank">Learn more</a></p>
                    `);
                
                marker.setPopup(popup);
            });
        })
        .catch(error => {
            console.error('Error fetching project data:', error);
        });
});
