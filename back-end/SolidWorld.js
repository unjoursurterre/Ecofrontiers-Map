const MongoClient = require('mongodb').MongoClient;
const axios = require('axios');
const express = require('express');
const app = express();
const path = require('path');
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'C:/Users/louis/Documents/Work/Coding Practice/ReFi Asset Map/public/index.html'));
});

const mongoURL = 'mongodb+srv://louise:Z04niNeVKEFR4erM@cluster0.miypx8l.mongodb.net/?authSource=Cluster0&authMechanism=SCRAM-SHA-1';
const dbName = 'ReFi-Asset-Map';

const client = new MongoClient(mongoURL, {useUnifiedTopology: true});

async function insertData(data) {
    try {
        await client.connect();
        console.log('Connected to MongoDB');

        const db = client.db(dbName);
        const collection = db.collection('SolidWorld1');

        const result = await collection.insertMany(data);
        console.log(`${result.insertedCount} documents inserted`, result.insertedIds);
    } catch (error) {
        console.error('Error inserting data:', error);
    } finally {
        client.close();
        console.log('Disconnected from MongoDB');
    }
};

const cheerio = require ("cheerio");

const url = "https://app.solid.world/projects";

const collectionName = 'SolidWorld1';

axios.get(url)
    .then(async response => {
        const html = response.data;
        const $ = cheerio.load(html);

        const targetDivs = $('div.ProjectCard_ellipsis__1NASF');
        const extractedData = [];

        const nominatimUrl = "https://nominatim.openstreetmap.org/search";

        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(SolidWorld1);

        for (const div of targetDivs) {
            const location = $(div).text().trim();

            // Check if the project already exists in the database
            const existingProject = await collection.findOne({location});

            if (!existingProject) {
                // Send a GET request to Nominatim API
                const nominatimResponse = await axios.get(nominatimUrl, {
                    params: {
                        q: location,
                        format: 'json',
                },
            });

            if (nominatimResponse.data.length > 0) {
                const coordinates = {
                    lat: nominatimResponse.data[0].lat,
                    lng: nominatimResponse.data[0].lon,
                };

                extractedData.push({location, coordinates});
            }
        }
    }

    if (extractedData.length > 0) {
        insertData(extractedData);
    } else {
        console.log('No new data to insert.');
    }

    // Close the connection after processing
    client.close();
})
    .catch(error => {
        console.error('Error fetching the page:', error);
    });

    app.get('/api/projects', async (req, res) => {
        try {
            await client.connect();
            const db = client.db(dbName);
            const collection = db.collection('SolidWorld1');
            const projects = await collection.find().toArray();
            res.json(projects);
        } catch (error) {
            console.error('Error fetching project data:', error);
            res.status(500).json({error: 'An error occured while fetching project data.'});
        } finally {
            client.close();
        }
    });

    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });