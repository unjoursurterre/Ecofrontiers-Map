const puppeteer = require('puppeteer');
const { MongoClient } = require('mongodb');
const axios = require('axios');

const mongoURL =
  'mongodb+srv://louise:Z04niNeVKEFR4erM@cluster0.miypx8l.mongodb.net/?authSource=Cluster0&authMechanism=SCRAM-SHA-1';
const dbName = 'ReFi-Asset-Map';
const collectionName = 'GreenTrade';

const nominatimUrl = 'https://nominatim.openstreetmap.org/search';

const loadGreenTradeData = async (db) => {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    const url = 'https://app.greentrade.tech/project/index';
    await page.goto(url);

    // Wait for the project cards to load (you may need to adjust the selector and waiting time)
    await page.waitForSelector('.project-card-body', { timeout: 5000 });

    const targetDivs = await page.$$eval('.project-card-body', (divs) => {
      return divs.map((div) => {
        const locationElement = div.querySelector('table tbody tr:nth-child(1) td:nth-child(2)');
        const location = locationElement.textContent.trim();

        const projectTitleElement = div.querySelector('.project-card-body__name');
        const projectTitle = projectTitleElement.textContent.trim();

        const descriptionElement = div.querySelector('table tbody tr:nth-child(2) td:nth-child(2)');
        const description = descriptionElement.textContent.trim();

        const assetLinkElement = div.querySelector('.left a');
        const assetLink = assetLinkElement.getAttribute('href');

        return {
          location,
          projectTitle,
          description,
          assetLink,
        };
      });
    });

    async function insertData(collection, data) {
      try {
        const result = await collection.insertMany(data);
        console.log(`${result.insertedCount} documents inserted`, result.insertedIds);
      } catch (error) {
        console.error('Error inserting data:', error);
      }
    };    

    await browser.close();

    const extractedData = [];

    const collection = db.collection(collectionName);

    console.log('Before for loop');
    for (const data of targetDivs) {
      console.log('Processing data:', data);

      const { location, projectTitle, description, assetLink } = data;

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
        assetLink,
        description,
        coordinates,
        assetType: 'Forward Carbon Offset',
        issuer: 'GreenTrade'
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

module.exports = { loadGreenTradeData };