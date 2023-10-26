const axios = require('axios');
const cheerio = require('cheerio');
const { MongoClient } = require('mongodb');

const mongoURL =
  'mongodb+srv://louise:Z04niNeVKEFR4erM@cluster0.miypx8l.mongodb.net/?authSource=Cluster0&authMechanism=SCRAM-SHA-1';
const dbName = 'ReFi-Asset-Map';
const collectionName = 'GreenTrade';

const loadGreenTradeData = async (db) => {
  try {
    const url = 'https://app.greentrade.tech/project/index';
    const response = await axios.get(url);
    console.log('Axios GET request successful');
    const html = response.data;
    console.log(response.data);
    const $ = cheerio.load(html);

    const targetDivs = $('.project-list-items');
    console.log(targetDivs.length);
    const extractedData = [];

    const nominatimUrl = 'https://nominatim.openstreetmap.org/search';

    const collection = db.collection(collectionName);

    console.log('Before for loop');
    for (const card of targetDivs) {
      console.log('Processing a div');
      
      const table = $('.project-card-body__provider table');

      const locationRow = $('tr', table)[0];
      const descriptionRow = $('tr', table)[1];
      
      const location = $(locationRow).find('td').eq(1).text().trim();
      const description = $(descriptionRow).find('td').eq(1).text().trim();

      const projectTitleElement = $(card).find('.project-card-body__name');
      const projectTitle = projectTitleElement.text().trim();
                   
      const assetLinkElement = $(card).find('.left');
      const assetLink = assetLinkElement.attr('href');
        
      console.log('Extracted Data:', {
        location,
        projectTitle,
        assetLink,
        description,
      });
        
      // Check if the project already exists in the database
      const existingProject = await collection.findOne({ location });
      console.log('Existing Project:', existingProject);
        
      if (!existingProject) {
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

          extractedData.push({
            location,
            projectTitle,
            assetLink,
            description,
            coordinates,
            assetType: 'Forward Carbon Offset',
          });
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

module.exports = { loadGreenTradeData };