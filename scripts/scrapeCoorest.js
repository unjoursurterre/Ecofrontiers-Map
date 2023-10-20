const puppeteer = require('puppeteer');
const { MongoClient } = require('mongodb');
const axios = require('axios');

const mongoURL =
  'mongodb+srv://louise:Z04niNeVKEFR4erM@cluster0.miypx8l.mongodb.net/?authSource=Cluster0&authMechanism=SCRAM-SHA-1';
const dbName = 'ReFi-Asset-Map';
const collectionName = 'Coorest';

const scrapeCoorestData = async (db) => {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    const url = 'https://app.coorest.io/batches';
    await page.goto(url);

    const targetDivs = await page.$$eval('.nftrees_batch__yG6FS', (divs) => {
      return divs.map((div) => {
        const locationElement = div.querySelector('.text-center.my-3.flex-column.flex span:nth-child(3)');
        const locationText = locationElement.textContent.trim().split(' : ')[1].trim();

        const projectTitleElement = div.querySelector('h3.font-bold');
        const projectTitle = projectTitleElement.textContent.trim();

        const descriptionElement = div.querySelector('.text-center.my-3.flex-column.flex span:nth-child(2)');
        const description = descriptionElement.textContent.trim();

        return {
          location: locationText,
          projectTitle,
          description,
        };
      });
    });

    await browser.close();

    const extractedData = [];
    const nominatimUrl = 'https://nominatim.openstreetmap.org/search';

    const collection = db.collection(collectionName);

    console.log('Before for loop');
    for (const data of targetDivs) {
      console.log('Processing data:', data);

      const { location, projectTitle, description } = data;

      // Check if the project already exists in the database
      const filter = { projectTitle };
      const existingProject = await collection.findOne(filter);
      console.log('Existing Project:', existingProject);

    // Send a GET request to Nominatim API
    console.log('Nominatim API Request:', nominatimUrl + '?q=' + location);
    const nominatimResponse = await axios.get(nominatimUrl, {
      params: {
        q: location,
        format: 'json',
      },
    });
    console.log('Nominatim API Response:', nominatimResponse.data);

    if (nominatimResponse.data.length > 0) {
      const coordinates = {
        lat: nominatimResponse.data[0].lat,
        lng: nominatimResponse.data[0].lon,
      };

      const newData = {
        location,
        projectTitle,
        assetLink: 'https://venly.market/collections/Coorest',
        description,
        coordinates,
        assetType: 'Output Rights',
        seller: 'Coorest'
      };

      if (existingProject) {
        // If the project exists, update the existing document
        await collection.updateOne(filter, { $set: newData });
        console.log('Updated data for', projectTitle);
      } else {
        // If the project doesn't exist, insert a new document
        extractedData.push(newData);
        console.log('Inserted data for', projectTitle);
      }
    }
  }

  if (extractedData.length > 0) {
    await insertData(collection, extractedData);
  } else {
    console.log('No new data to insert.');
  }
} catch (error) {
  console.error('Error scraping data:', error);
  throw error;
}
};

async function insertData(collection, data) {
try {
  const result = await collection.insertMany(data);
  console.log(`${result.insertedCount} documents inserted`, result.insertedIds);
} catch (error) {
  console.error('Error inserting data:', error);
}
}

module.exports = { scrapeCoorestData };