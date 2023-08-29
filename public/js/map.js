document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded event fired');

    mapboxgl.accessToken = 'pk.eyJ1IjoidW5qb3Vyc3VydGVycmUiLCJhIjoiY2xrZ3Yxa2ZoMDNsdzNma2VrZ3Rld3g4OCJ9.-TQXieKIGjEFOoND4VUfrA'
    
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [20, 1.5],
        zoom: 0,
    });
});

    // Make a request to the back-end API to fetch project data
    axios.get('/api/projects')
        .then(response => {
            const projects = response.data;

            projects.forEach(project => {
                const {location, coordinates} = project;

                createMarkerAndPopup(
                    [parseFloat(coordinates.lng), parseFloat(coordinates.lat)],
                    location,
                    projectTitle,
                    assetType,
                    assetLink,
                );
            });
            console.log(response.data);
        })
        .catch(error => {
            console.error('Error fetching project data:', error);
        });
