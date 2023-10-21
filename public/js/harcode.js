const mapboxgl = require('mapbox-gl');

// Rest of the map.js code should come here

map.on('error', (e) => {
    console.error('Map error:', e.error.message);
});

// Create hard-coded marker for Moss 1
const mossMarker1 = new mapboxgl.Marker()
    .setLngLat([-1.359498562, -48.369831854])
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
    .setLngLat([-1.359498562, -48.369831854])
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
    .setLngLat([-26.333333, -60.5])
    .addTo(map);

const FlowCarbonContent = `
    <h3>Corazon Verde Del Chaco Project</h3>
    <p><strong>Asset Type:</strong> Carbon Forward</p>
    <p><strong>Description:</strong> This first pool was created to finance important conservation work and carbon avoidance in the Corazón Verde Del Chaco Project (VCS 2611), located in Paraguay within the Gran Chaco Forest. The Gran Chaco is the second-largest forest in South America, behind only the Amazon rainforest and it has one of the highest deforestation rates on the planet due to conversion to cropland and pasture for cattle.</p>
    <p><strong>Issuer:</strong> FlowCarbon</p>
    <a href="https://legacy.tinlake.centrifuge.io/pool/0xd8486c565098360a24f858088a6d29a380ddf7ec/flowcarbon-1" target="_blank">Buy here</a>
    `

const FlowCarbonPopup = new mapboxgl.Popup()
    .setHTML(FlowCarbonContent);
FlowCarbon.setPopup(FlowCarbonPopup);

// Create hard-coded marker for EthicHub
const EthicHub = new mapboxgl.Marker()
    .setLngLat([])
    .addTo(map);

const EthicHubContent = `
    <h3> </h3>
    <p><strong>Asset Type:</strong> </p>
    <p><strong>Description:</strong> /p>
    <p><strong>Issuer:</strong> EthicHub</p>
    <a href="" target="_blank">Buy here</a>
    `

const EthicHubPopup = new mapboxgl.Popup()
    .setHTML(EthicHubContent);
EthicHub.setPopup(EthicHubPopup);

// Create hard-coded marker for Frigg.eco
const FriggEco = new mapboxgl.Marker()
    .setLngLat([29.67222, -2.755])
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
FriggEco.setPopup(FriggEcoContent);