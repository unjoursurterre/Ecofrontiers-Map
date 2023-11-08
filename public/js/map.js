mapboxgl.accessToken = process.env.MAPBOX_ACCESS_TOKEN;

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v10',
    center: [5, 1.5],
    zoom: 1.5,
});

// Helper function to get the layer ID and pin color based on asset type
function getLayerInfoForAssetType(assetType) {
    // Map asset type to the corresponding layer ID and pin color
    switch (assetType) {
        case 'Forward Carbon Offset':
            return { layerId: 'forward-carbon-offset', color: 'green' };
        case 'Natural Asset Ownership':
            return { layerId: 'natural-asset-ownership', color: 'blue' };
        case 'Carbon Offset':
            return { layerId: 'carbon-offset', color: 'red' };
        case 'Output Rights':
            return { layerId: 'output-rights', color: 'yellow' };
        case 'Non-Carbon Offset':
            return { layerId: 'non-carbon-offset', color: 'pink' };
        case 'Green Bond':
            return { layerId: 'green-bond', color: 'orange' };
        default:
            // Return a default layer ID and pin color when the asset type is not recognized
            return { layerId: 'default-layer', color: 'black' };
    }
}

// Create an array to store all markers
const allMarkers = [];

// Function to add markers to the map
function addMarker(asset) {
    // Get the layer ID and pin color based on the asset type
    const { layerId, color } = getLayerInfoForAssetType(asset.asset_type);

    // Create a marker with the specified color
    const marker = new mapboxgl.Marker({ color: color })
    .setLngLat([asset.longitude, asset.latitude])
    .addTo(map);
    
    // Create the HTML content for the pop-up
    const popupContent = `
    <h3>${asset.project_title}</h3>
    <p><strong>Asset Type:</strong> ${asset.asset_type}</p>
    <p><strong>Description:</strong> ${asset.description}</p>
    <p><strong>Issuer:</strong> ${asset.issuer}</p>
    <a href="${asset.asset_link}" target="_blank">Buy here</a>
    `;

    const popup = new mapboxgl.Popup()
        .setHTML(popupContent);
    marker.setPopup(popup);

    // Add the marker to the array
    allMarkers.push({ marker, assetType: asset.asset_type, issuer: asset.issuer });

    // Initially, add all markers to the map
    marker.addTo(map);
}

// Load marker data from a JSON file and add markers
fetch('../models/all_marker_data.json?' + new Date().getTime())
    .then(response => response.json())
    .then(data => {
        console.log(data);
        data.forEach(asset => {
            console.log(asset);
            addMarker(asset);
        });
    })
    .catch(error => {
        console.error('Error loading marker data:', error);
    });

// Function to update markers based on filters
function updateMarkers(filterAssetType, filterIssuer) {
    console.log('Updating markers with filterAssetType:', filterAssetType, 'and filterIssuer:', filterIssuer);
    
    allMarkers.forEach(markerInfo => {
        const { marker, assetType, issuer } = markerInfo;
        const isVisible =
            (filterAssetType === 'all' || assetType === filterAssetType) &&
            (filterIssuer === 'all' || issuer === filterIssuer);

        if (isVisible) {
            marker.addTo(map);
        } else {
            marker.remove();
        }
    });
}

// Create hard-coded marker for Moss 1
const mossMarker1 = new mapboxgl.Marker({ color: 'blue' })
    .setLngLat([-57.965403, -6.608967])
    .addTo(map);

const mossMarker1Content = `
    <h3>Amazon Green Wall NFT Series 3</h3>
    <p><strong>Asset Type:</strong> Natural Asset Ownership</p>
    <p><strong>Description:</strong> Moss has partners providing state of the art satellite imagery, updated every 6 days, with the highest resolution available in the market, and available to all NFT owners. These third party, independent partners will be responsible for MRV, and MOSS will hire and manage the contracts. The company will direct 20% of sales proceeds to a 30 year protection fund that will cover patrolling and maintenance of protection activities. One share = one hectare = one football field worth of your OWN piece of the Amazon Forest</p>
    <p><strong>Issuer:</strong> Moss</p>
    <a href="https://opensea.io/assets/matic/0x3a68b7f8baef34b28839dd8365551c51b8bbcb43/3" target="_blank">Buy here</a>
`;

const mossMarker1Popup = new mapboxgl.Popup()
    .setHTML(mossMarker1Content);
mossMarker1.setPopup(mossMarker1Popup);

// Add the hard-coded marker to the allMarkers array
allMarkers.push({ marker: mossMarker1, assetType: 'Natural Asset Ownership', issuer: 'Moss' });

// Create hard-coded marker for Moss 2
const mossMarker2 = new mapboxgl.Marker({ color: 'blue' })
    .setLngLat([-57.277130, -4.799042])
    .addTo(map);

const mossMarker2Content = `
    <h3>Amazon Green Wall NFT Series 2</h3>
    <p><strong>Asset Type:</strong> Natural Asset Ownership</p>
    <p><strong>Description:</strong> Moss has partners providing state of the art satellite imagery, updated every 6 days, with the highest resolution available in the market, and available to all NFT owners. These third party, independent partners will be responsible for MRV, and MOSS will hire and manage the contracts. The company will direct 20% of sales proceeds to a 30 year protection fund that will cover patrolling and maintenance of protection activities. One share = one hectare = one football field worth of your OWN piece of the Amazon Forest</p>
    <p><strong>Issuer:</strong> Moss</p>
    <a href="https://opensea.io/assets/matic/0x3a68b7f8baef34b28839dd8365551c51b8bbcb43/2" target="_blank">Buy here</a>
`;

const mossMarker2Popup = new mapboxgl.Popup()
    .setHTML(mossMarker2Content);
mossMarker2.setPopup(mossMarker2Popup);

// Add the hard-coded marker to the allMarkers array
allMarkers.push({ marker: mossMarker2, assetType: 'Natural Asset Ownership', issuer: 'Moss' });

// Create hard-coded marker for FlowCarbon
const FlowCarbon = new mapboxgl.Marker({ color: 'green' })
    .setLngLat([-58.7373634, -23.3512605])
    .addTo(map);

const FlowCarbonContent = `
    <h3>Corazon Verde Del Chaco Project</h3>
    <p><strong>Asset Type:</strong> Forward Carbon Offset</p>
    <p><strong>Description:</strong> This first pool was created to finance important conservation work and carbon avoidance in the Corazón Verde Del Chaco Project (VCS 2611), located in Paraguay within the Gran Chaco Forest. The Gran Chaco is the second-largest forest in South America, behind only the Amazon rainforest and it has one of the highest deforestation rates on the planet due to conversion to cropland and pasture for cattle.</p>
    <p><strong>Issuer:</strong> FlowCarbon</p>
    <a href="https://legacy.tinlake.centrifuge.io/pool/0xd8486c565098360a24f858088a6d29a380ddf7ec/flowcarbon-1" target="_blank">Buy here</a>
`;

const FlowCarbonPopup = new mapboxgl.Popup()
    .setHTML(FlowCarbonContent);
FlowCarbon.setPopup(FlowCarbonPopup);

// Add the hard-coded marker to the allMarkers array
allMarkers.push({ marker: FlowCarbon, assetType: 'Forward Carbon Offset', issuer: 'FlowCarbon' });

// Create hard-coded marker for Creol 1
const Creol1 = new mapboxgl.Marker({ color: 'red' })
    .setLngLat([-73.25383, -3.74912])
    .addTo(map);

const Creol1Content = `
    <h3>Preserving the Amazon</h3>
    <p><strong>Asset Type: </strong> Carbon Offset</p>
    <p><strong>Description: </strong> This project reduces deforestation in the Peruvian Amazon by improving forest management and promoting sustainable nut harvesting. This will help protect critical rainforest habitat and endangered species, while supporting the livelihoods of indigenous communities.</p>
    <p><strong>Issuer:</strong> Creol</p>
    <a href="https://beta.creol.io/#/home" target="_blank">Buy here</a>
`;

const Creol1Popup = new mapboxgl.Popup()
    .setHTML(Creol1Content);
Creol1.setPopup(Creol1Popup);

// Add the hard-coded marker to the allMarkers array
allMarkers.push({ marker: Creol1, assetType: 'Carbon Offset', issuer: 'Creol' });

// Create hard-coded marker for Frigg.eco
const FriggEco = new mapboxgl.Marker({ color: 'orange' })
    .setLngLat([29.5817, -2.65111])
    .addTo(map);

const FriggEcoContent = `
    <h3>Agatobwe</h3>
    <p><strong>Asset Type:</strong> Green Bond</p>
    <p><strong>Description:</strong> Agatobwe is a hydroelectric plant situated in Rwanda, Africa, developed by Malthe Winje AS (MW), est. 1922, a Norwegian infrastructure developer with 15 years of footing in East Africa. MW has support from Norwegian government agencies NORAD, Norec, and NORFUND and is well positioned to scale crucial renewable energy infrastructure in Africa. Nonetheless, MW is underserved by traditional finance. Realizing the potential of Decentralized Finance(DeFi), MW seeks to re-finance its operational projects by issuing debt on Ethereum. The “AgaTobwe Token bond” (ATT) is the first in a series of Digitized Green Bonds backed by MW projects.</p>
    <p><strong>Issuer:</strong> Frigg.eco</p>
    <a href="https://www.agatobwe.eco/" target="_blank">Buy here</a>
`;

const FriggEcoPopup = new mapboxgl.Popup()
    .setHTML(FriggEcoContent);
FriggEco.setPopup(FriggEcoPopup);

// Add the hard-coded marker to the allMarkers array
allMarkers.push({ marker: FriggEco, assetType: 'Green Bond', issuer: 'Frigg.eco' });

// Create HTML elements for filtering
const filterOptions = document.createElement('div');
filterOptions.id = 'filter-options';
filterOptions.innerHTML = `
    <label for="asset-type-select">Asset Type:</label>
    <select id="asset-type-select">
        <option value="all">All</option>
        <option value="Forward Carbon Offset">Forward Carbon Offset</option>
        <option value="Natural Asset Ownership">Natural Asset Ownership</option>
        <option value="Carbon Offset">Carbon Offset</option>
        <option value="Green Bond">Green Bond</option>
        <option value="Output Rights">Output Rights</option>
        <option value="Non-Carbon Offset">Non-Carbon Offset</option>
    </select>

    <label for="issuer-select">Issuer:</label>
    <select id="issuer-select">
        <option value="all">All</option>
        <option value="Moss">Moss</option>
        <option value="FlowCarbon">FlowCarbon</option>
        <option value="Creol">Creol</option>
        <option value="Frigg.eco">Frigg.eco</option>
        <option value="SolidWorld">SolidWorld</option>
        <option value="Regen Network">Regen Network</option>
        <option value="GreenTrade">GreenTrade</option>
        <option value="Coorest">Coorest</option>
    </select>
    
    <button id="apply-filter">Apply Filter</button>
`;

document.body.appendChild(filterOptions);

// Add an event listener to apply filters when the button is clicked
document.getElementById('apply-filter').addEventListener('click', function () {
    console.log('Apply Filter button clicked');
    const assetTypeSelect = document.getElementById('asset-type-select');
    const issuerSelect = document.getElementById('issuer-select');
    const filterAssetType = assetTypeSelect.options[assetTypeSelect.selectedIndex].value;
    const filterIssuer = issuerSelect.options[issuerSelect.selectedIndex].value;

    updateMarkers(filterAssetType, filterIssuer);
});

// Add a layer for each asset type
map.on('load', function () {
    // Define layers with different colors for each asset type
    map.addLayer({
        id: 'forward-carbon-offset',
        type: 'symbol',
        source: 'assets',
        filter: ['==', ['get', 'asset_type'], 'Forward Carbon Offset'],
        layout: {
            'icon-image': 'marker-15',
            'icon-size': 1.5
        },
        paint: {
            'icon-color': 'green' // Set the pin color for Forward Carbon Offset
        }
    });

    map.addLayer({
        id: 'natural-asset-ownership',
        type: 'symbol',
        source: 'assets',
        filter: ['==', ['get', 'asset_type'], 'Natural Asset Ownership'],
        layout: {
            'icon-image': 'marker-15',
            'icon-size': 1.5
        },
        paint: {
            'icon-color': 'blue' // Set the pin color for Natural Asset Ownership
        }
    });

    map.addLayer({
        id: 'carbon-offset',
        type: 'symbol',
        source: 'assets',
        filter: ['==', ['get', 'asset_type'], 'Carbon Offset'],
        layout: {
            'icon-image': 'marker-15',
            'icon-size': 1.5
        },
        paint: {
            'icon-color': 'red' // Set the pin color for Carbon Offset
        }
    });

    map.addLayer({
        id: 'output-rights',
        type: 'symbol',
        source: 'assets',
        filter: ['==', ['get', 'asset_type'], 'Output Rights'],
        layout: {
            'icon-image': 'marker-15',
            'icon-size': 1.5
        },
        paint: {
            'icon-color': 'yellow' // Set the pin color for Output Rights
        }
    });

    map.addLayer({
        id: 'non-carbon-offset',
        type: 'symbol',
        source: 'assets',
        filter: ['==', ['get', 'asset_type'], 'Non-Carbon Offset'],
        layout: {
            'icon-image': 'marker-15',
            'icon-size': 1.5
        },
        paint: {
            'icon-color': 'pink' // Set the pin color for Non-Carbon Offset
        }
    });

    map.addLayer({
        id: 'green-bond',
        type: 'symbol',
        source: 'assets',
        filter: ['==', ['get', 'asset_type'], 'Green Bond'],
        layout: {
            'icon-image': 'marker-15',
            'icon-size': 1.5
        },
        paint: {
            'icon-color': 'orange' // Set the pin color for Green Bond
        }
    });
});