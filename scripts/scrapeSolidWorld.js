const axios = require('axios');
const cheerio = require('cheerio');
const { MongoClient } = require('mongodb');

const mongoURL =
  'mongodb+srv://louise:Z04niNeVKEFR4erM@cluster0.miypx8l.mongodb.net/?authSource=Cluster0&authMechanism=SCRAM-SHA-1';
const dbName = 'ReFi-Asset-Map';
const collectionName = 'SolidWorld1';

const scrapeSolidWorldData = async (db) => {
  try {
    const url = 'https://app.solid.world/projects';
    const response = await axios.get(url);
    console.log('Axios GET request successful');
    const html = response.data;
    console.log(response.data);
    const $ = cheerio.load(html);

    const targetDivs = $('div.ProjectCard_projectInfo__H1Wrw');
    console.log(targetDivs.length);
    const extractedData = [];

    const nominatimUrl = 'https://nominatim.openstreetmap.org/search';

    const collection = db.collection(collectionName);

    console.log('Before for loop');
    for (const card of targetDivs) {
      console.log('Processing a div');

      const locationElement = $(card).find('.ProjectCard_ellipsis__wpFFf');
      const locationText = locationElement.text().trim();
        
      // Use a regular expression to remove repeated patterns
      const location = locationText.replace(/(.+?)\1+/, '$1').trim();
                    
      const projectTitleElement = $(card).find('.ProjectCard_title__VpqBn');
      const projectTitle = projectTitleElement.text().trim();
        
      const descriptionElement = $(card).find('div.ProjectCard_description__cg9_P');
      const description = descriptionElement.text().trim();
                   
      const assetLinkElement = $(card).find('.ProjectCard_link__IeEc_');
      const assetLink = assetLinkElement.attr('href');
        
      console.log('Extracted Data:', {
        location,
        projectTitle,
        assetLink,
        description,
      });
        
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
          seller: 'SolidWorld'
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

module.exports = { scrapeSolidWorldData };