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
    console.log('Making API request...');
    axios.get('http://localhost:3000/api/projects')
        .then(response => {
            console.log('Received project data:', response.data);

            // Create a marker for each project (example data)
            response.data.forEach(project => {
                const {location, coordinates} = project;
                console.log('Project Location:', location);
                console.log('Project Coordinates:', coordinates);

                // Create a marker for each project
                const marker = new mapboxgl.Marker()
                    .setLngLat([parseFloat(coordinates.lng), parseFloat(coordinates.lat)])
                    .addTo(map);
                    console.log('Marker added:', marker);
            });
        })
        .catch(error => {
            console.error('Error fetching project data:', error);
        });
});
