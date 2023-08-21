mapboxgl.accessToken = 'pk.eyJ1IjoidW5qb3Vyc3VydGVycmUiLCJhIjoiY2xrZ3Yxa2ZoMDNsdzNma2VrZ3Rld3g4OCJ9.-TQXieKIGjEFOoND4VUfrA'
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [20, 1.5],
        zoom: 0,
    });

    const projectTitle1 = "Rimba Raya Biodiversity Reserve Project";
    const description1 = "This project protects 47,237 hectares of uninhabited peat swamp forest on the southern coast of Borneo, Central Kalimantan. Despite only covering about 3% of our planet's land, peatlands store twice as much carbon as all the world's forests. Under threate of being logged, drained and burned by palm oil plantations, this project protects the land, which is home to an orangutan sanctuary and 50 other endangered species.";
    const assetLink1 = "https://app.regen.network/project/C03-001";
    const assetType1 = "Eco-Credit";

    const projectTitle2 = "REDD+ Project Resguardo Indigena Unificado Selva de Mataven";
    const description2 = "REDD+ Project Resguardo Indígena Unificado–Selva de Mataven (REDD+ RIU-SM) represents the fourth largest indigenous reservation in Colombia and protects 1.15M hectares of natural forests from deforestation. This project safeguards biodiversity and provides education, healthcare, sanitation, food security, and other co-benefits for 15K indigenous people. The protection of this area also serves as a gatekeeper for deforestation threats moving from the Orinoco Savannahs to the Amazon.";
    const assetLink2 = "https://app.regen.network/project/C03-002";
    const assetType2 = "Eco-Credit";

    const projectTitle3 = "Myanmar Mangrove Restoration";
    const description3 = "This project aims to restore a degraded mangrove ecosystem in the northern part of Ayeyarwady Division of Myanmar. The project will help the coastal communities to address issues including natural disaster risk reduction, biodiversity improvement and poverty reduction with sustainable livelihoods. It is registered with Verra project ID 1764. Solid World is offering 1000 forward credits each for 2022 to 2023, and 2000 forward credits for each year from 2024 to 2027 from the project.";
    const assetLink3 = "https://app.solid.world/projects/5/myanmar-1764";
    const assetType3 = "Forward Credit";

    const projectTitle4 = "Senegal Mangrove Planting";
    const description4 = "The 'ALLCOT Blue Carbon Mangrove Senegal' project follows VCS VM0033 methodology. The project has shown additionality using alternative land use scenarios, barrier analysis and common practice analysis. The project will plant 3 native species of mangroves and it will sequestrate an estimated 1.9 million tCO2e over a period of 2022-2052. Additionally, the project aims to improve the production and income of vulnerable groups, and strengthen their capacity to use land resources sustainably.";
    const assetLink4 = "https://app.solid.world/projects/6/allcot-blue-carbon-mangrove-senegal";
    const assetType4 = "Forward Credit";

    const projectTitle5 = "Fruit-Bearing NFTrees";
    const description5 = "This NFTree is a yield-bearing green bond backed by a fruit tree such as pomegranate and fig tree. This batch was planted in February 2022. The owner of this NFTree will able to claim: 1) CO2 tokens are equivalent to the amount of CO2 absorbed by the actual tree. Currently, this NFTree compensates 25 kilos of CO2 per year. 1kg of CO2 = 1 CO2 token. 2) Yield produced by the sale of fruits of the tree in food markets. This yield starts in the fourth year after planting (2024). The estimated yield is 20%.";
    const assetLink5 = "https://venly.market/offers/1a5c2ad2-4277-4e75-b335-882dd4c38696";
    const assetType5 = "Real-World Asset";

    const projectTitle6 = "Forest NFTrees";
    const description6 = "This NFTree is a yield-bearing token (usufruct) backed by a real tree. The native trees are planted and managed by the Coorest company. This batch is a mixed forest of native trees: Oak - Quercus ilex, Sabina - juniperus phoenicea, Pinus Halepensis, Pinus uncinate, and was planted in March 2023. The owner of this NFTree has the right to claim: 250 CCO2 tokens, equivalent to the amount of CO2 absorbed by the trees. Currently, this NFTree compensates for approx. 250 kilos of CO2 per year.";
    const assetLink6 = "https://venly.market/offers/8ce5c878-2955-4a03-84e1-67c6297ef34f";
    const assetType6 = "Real-World Asset";

    function createMarkerAndPopup(lngLat, title, description, assetType, assetLink) {
        const marker = new mapboxgl.Marker().setLngLat(lngLat).addTo(map);
        const popup = new mapboxgl.Popup({closeButton: true, closeOnClick: true, offset: [0, -30], maxWidth: '500px'})
        .setHTML(
            `<h3>${title}</h3>
            <p>Asset Type: ${assetType}</p>
            <p>${description}</p>
            <a href="${assetLink}" target="_blank">Buy the Asset</a>`
    );

    marker.setPopup(popup);

    popup.addTo(map);

    const popupHeight = popup._container.clientHeight;
    const markerHeight = 50;

    if (popupHeight > marker.getPopup().options.offset[1]) {
        marker.getPopup().setOffset([0, -markerHeight]);
    }

    popup.remove();
}

createMarkerAndPopup([112.303519, -2.614493], projectTitle1, description1, assetType1, assetLink1);
createMarkerAndPopup([-71.015625, 3.951942], projectTitle2, description2, assetType2, assetLink2);
createMarkerAndPopup([94.5, 17.0833], projectTitle3, description3, assetType3, assetLink3);
createMarkerAndPopup([-16.2264, 12.8103], projectTitle4, description4, assetType4, assetLink4);
createMarkerAndPopup([0.0802, 41.2541], projectTitle5, description5, assetType5, assetLink5);
createMarkerAndPopup([0.899997, 41.649997], projectTitle6, description6, assetType6, assetLink6);