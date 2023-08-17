const MongoClient = require('mongodb').MongoClient;

const mongoURL = 'mongodb+srv://louise:Z04niNeVKEFR4erM@cluster0.miypx8l.mongodb.net/?authSource=Cluster0&authMechanism=SCRAM-SHA-1';
const dbName = 'ReFi-Asset-Map';

const client = new MongoClient(mongoURL, {useUnifiedTopology: true});

async function insertData(data) {
    try {
        await client.connect();
        console.log('Connected to MongoDB');

        const db = client.db(dbName);
        const collection = db.collection('SolidWorld');

        const result = await collection.insertMany(data);
        console.log(`${result.insertCount} documents inserted`, result.insertedIds);
    } catch (error) {
        console.error('Error inserting data:', error);
    } finally {
        client.close();
        console.log('Disconnected from MongoDB');
    }
};

const cheerio = require ("cheerio");
const axios = require ("axios");

const url = "https://docs.google.com/spreadsheets/u/2/d/e/2PACX-1vR02HblpAKbeS5GckPQ4W483u-iABBPtsdRFFzzyZ-vIzO1FgTkbpjqXYdH3wfrpc1XVBIsEdauYKbi/pubhtml#";

axios.get(url)
    .then(response => {
        const html = response.data;
        const $ = cheerio.load(html);

        const targetCells = $('td.s5, td.s36');
        const extractedData = [];

        targetCells.each( (index, cell) => {
            const data = $(cell).text();
            const link = $(cell).find('a').attr('href');
            extractedData.push({data, link});
        });

        insertData(extractedData);
    })
    .catch(error => {
        console.error('Error fetching the page:', error);
    });