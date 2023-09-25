const axios = require('axios');
const { MongoClient } = require('mongodb');

const mongoURL =
  'mongodb+srv://louise:Z04niNeVKEFR4erM@cluster0.miypx8l.mongodb.net/?authSource=Cluster0&authMechanism=SCRAM-SHA-1';
const dbName = 'ReFi-Asset-Map';
const collectionName = 'RegenNetwork';
const nominatimUrl = 'https://nominatim.openstreetmap.org/search';

const apiURLs = [
  'https://api.regen.network/data/v1/metadata-graph/regen:13toVh8FBw5G7FNPRkFuBM3GNXDB5MAAPBbeBdYQ5KuRodH7XBTgSak.rdf',
  'https://api.regen.network/data/v1/metadata-graph/regen:13toVhmNbuUMgxxzAenxV1rkQHPrhXyuN3PyaQxsfCrxCn2i9G9niWM.rdf',
  'https://api.regen.network/data/v1/metadata-graph/regen:13toVgCCjzpdUF8ubQeodLJd9vkPQaxnC7XnV1Ztert2Lv9hxCUKUGW.rdf',
  'https://api.regen.network/data/v1/metadata-graph/regen:13toVgRKSPwrP6Z7rx9sXXo51XYqDewrabDjaqoXQMudXuRYJqdEHxp.rdf',
  'https://api.regen.network/data/v1/metadata-graph/regen:13toVg8V7ves71kfAsbqxwr4QV5pvj2WBvEiLyUy9XHKGGFRAYcchmC.rdf',
  'https://api.regen.network/data/v1/metadata-graph/regen:13toVhpRRova7M4o54S9dq51sVFvnJCxKT79UMPopSQzReP2PuxNdAP.rdf',
  'https://api.regen.network/data/v1/metadata-graph/regen:13toVgNuHj5Z7VobRehvrVhnGZdRUeEww9Tcic9zxFBkzkKzrACNLp8.rdf',
  'https://api.regen.network/data/v1/metadata-graph/regen:13toVhFcZXHD1rmZeza4iC8g6ZLdV1hdtczEyHBWYFqVjxV1BMXWQkb.rdf',
  'https://api.regen.network/data/v1/metadata-graph/regen:13toVgJE2eUkVhmnohXpzKvvWiapcPmBsaY8hyMBHLDeGJRcksSXe9N.rdf',
  'https://api.regen.network/data/v1/metadata-graph/regen:13toVgEs67VyTgaLnLGk5ms9BwxGcjvZgiMcbGcgM2ttdWpfDhBHtZx.rdf'
];

const fetchRegenNetworkData = async (url) => {
  try {
    const response = await axios.get(url);
    if (response.status === 200) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
};

const processAndInsertData = async (collection, data) => {
  try {
    const projectTitle = data['schema:name'] || 'Unknown Title';
    const coordinates = data['geometry']?.['coordinates'] || 'Unknown Coordinates'
    const assetType = data['regen:projectActivity']?.['schema:name'] || data['regen:projectActivity'] || 'Toucan Carbon Credit';
    const assetLink = data['@id'] || 'https://app.regen.network/projects/1';
    const description = data['regen:offsetProtocol']?.['schema:name'] || data['regen:projectType'] || 'Carbon credit bridged from Toucan';

    const filteredData = {
      projectTitle,
      coordinates,
      assetType,
      assetLink,
      description,
    };

    await collection.insertOne(filteredData);
    console.log('Inserted data for', projectTitle);
  } catch (error) {
    console.error('Error processing and inserting data:', error);
  }
};

const fetchAndInsertRegenData = async (collection) => {
  for (const apiURL of apiURLs) {
    const data = await fetchRegenNetworkData(apiURL);
    if (data) {
      await processAndInsertData(collection, data)
    }
  }
};

module.export = { fetchAndInsertRegenData };