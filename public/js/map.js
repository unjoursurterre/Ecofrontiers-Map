mapboxgl.accessToken = 'pk.eyJ1IjoidW5qb3Vyc3VydGVycmUiLCJhIjoiY2xtbDVlZmtxMDdrbzJtdG4wcGswYWNubSJ9.gYNEOES5V6knJ5-90vPDuw';
    
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v10',
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
    
    // Create hard-coded marker for Moss 1
    const mossMarker1 = new mapboxgl.Marker()
        .setLngLat([-57.965403, -6.608967])
        .addTo(map);
    
    const mossMarker1Content = `
        <h3>Amazon Green Wall NFT Series 3</h3>
        <p><strong>Asset Type:</strong> Natural Asset Ownership</p>
        <p><strong>Description:</strong> Moss has partners providing state of the art satellite imagery, updated every 6 days, with the highest resolution available in the market, and available to all NFT owners. These third party, independent partners will be responsible for MRV, and MOSS will hire and manage the contracts. The company will direct 20% of sales proceeds to a 30 year protection fund that will cover patrolling and maintenance of protection activities. One share = one hectare = one football field worth of your OWN piece of the Amazon Forest</p>
        <p><strong>Seller:</strong> Moss</p>
        <a href="https://opensea.io/assets/matic/0x3a68b7f8baef34b28839dd8365551c51b8bbcb43/3" target="_blank">Buy here</a>
        `
    
    const mossMarker1Popup = new mapboxgl.Popup()
        .setHTML(mossMarker1Content);
    mossMarker1.setPopup(mossMarker1Popup);
    
    // Create hard-coded marker for Moss 2
    const mossMarker2 = new mapboxgl.Marker()
        .setLngLat([-57.277130, -4.799042])
        .addTo(map);
    
    const mossMarker2Content = `
        <h3>Amazon Green Wall NFT Series 2</h3>
        <p><strong>Asset Type:</strong> Natural Asset Ownership</p>
        <p><strong>Description:</strong> Moss has partners providing state of the art satellite imagery, updated every 6 days, with the highest resolution available in the market, and available to all NFT owners. These third party, independent partners will be responsible for MRV, and MOSS will hire and manage the contracts. The company will direct 20% of sales proceeds to a 30 year protection fund that will cover patrolling and maintenance of protection activities. One share = one hectare = one football field worth of your OWN piece of the Amazon Forest</p>
        <p><strong>Issuer:</strong> Moss</p>
        <a href="https://opensea.io/assets/matic/0x3a68b7f8baef34b28839dd8365551c51b8bbcb43/2" target="_blank">Buy here</a>
        `
    
    const mossMarker2Popup = new mapboxgl.Popup()
        .setHTML(mossMarker2Content);
    mossMarker2.setPopup(mossMarker2Popup);
    
    // Create hard-coded marker for FlowCarbon
    const FlowCarbon = new mapboxgl.Marker()
        .setLngLat([-58.7373634, -23.3512605])
        .addTo(map);
    
    const FlowCarbonContent = `
        <h3>Corazon Verde Del Chaco Project</h3>
        <p><strong>Asset Type:</strong> Forward Carbon Offset</p>
        <p><strong>Description:</strong> This first pool was created to finance important conservation work and carbon avoidance in the Corazón Verde Del Chaco Project (VCS 2611), located in Paraguay within the Gran Chaco Forest. The Gran Chaco is the second-largest forest in South America, behind only the Amazon rainforest and it has one of the highest deforestation rates on the planet due to conversion to cropland and pasture for cattle.</p>
        <p><strong>Issuer:</strong> FlowCarbon</p>
        <a href="https://legacy.tinlake.centrifuge.io/pool/0xd8486c565098360a24f858088a6d29a380ddf7ec/flowcarbon-1" target="_blank">Buy here</a>
        `
    
    const FlowCarbonPopup = new mapboxgl.Popup()
        .setHTML(FlowCarbonContent);
    FlowCarbon.setPopup(FlowCarbonPopup);
    
    // Create hard-coded marker for Creol 1
    const Creol1 = new mapboxgl.Marker()
        .setLngLat([-73.25383, -3.74912])
        .addTo(map);
    
    const Creol1Content = `
        <h3>Preserving the Amazon</h3>
        <p><strong>Asset Type: </strong> Carbon Offset</p>
        <p><strong>Description: </strong> This project reduces deforestation in the Peruvian Amazon by improving forest management and promoting sustainable nut harvesting. This will help protect critical rainforest habitat and endangered species, while supporting the livelihoods of indigenous communities.</p>
        <p><strong>Issuer:</strong> Creol</p>
        <a href="https://beta.creol.io/#/home" target="_blank">Buy here</a>
        `
    
    const Creol1Popup = new mapboxgl.Popup()
        .setHTML(Creol1Content);
    Creol1.setPopup(Creol1Popup);
    
    // Create hard-coded marker for Frigg.eco
    const FriggEco = new mapboxgl.Marker()
        .setLngLat([29.5817, -2.65111])
        .addTo(map);
    
    const FriggEcoContent = `
        <h3>Agatobwe</h3>
        <p><strong>Asset Type:</strong> Green Bond</p>
        <p><strong>Description:</strong> Agatobwe is a hydroelectric plant situated in Rwanda, Africa, developed by Malthe Winje AS (MW), est. 1922, a Norwegian infrastructure developer with 15 years of footing in East Africa. MW has support from Norwegian government agencies NORAD, Norec, and NORFUND and is well positioned to scale crucial renewable energy infrastructure in Africa. Nonetheless, MW is underserved by traditional finance. Realizing the potential of Decentralized Finance(DeFi), MW seeks to re-finance its operational projects by issuing debt on Ethereum. The “AgaTobwe Token bond” (ATT) is the first in a series of Digitized Green Bonds backed by MW projects.</p>
        <p><strong>Issuer:</strong> Frigg.eco</p>
        <a href="https://www.agatobwe.eco/" target="_blank">Buy here</a>
        `
    
    const FriggEcoPopup = new mapboxgl.Popup()
        .setHTML(FriggEcoContent);
    FriggEco.setPopup(FriggEcoPopup);