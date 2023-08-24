const MongoClient = require('mongodb').MongoClient;
const axios = require('axios');
const express = require('express');
const app = express();
const path = require('path');
const cheerio = require("cheerio");

const port = process.env.PORT || 3000;
const mongoURL = 'mongodb+srv://louise:Z04niNeVKEFR4erM@cluster0.miypx8l.mongodb.net/?authSource=Cluster0&authMechanism=SCRAM-SHA-1';
const dbName = 'ReFi-Asset-Map';
const collectionName = 'SolidWorld1';

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'C:/Users/louis/Documents/Work/Coding Practice/ReFi Asset Map/public/index.html'));
});

app.get('/api/projects', async (req, res) => {
    try {
        console.log('Before connecting to MongoDB');
        const client = new MongoClient(mongoURL, { useUnifiedTopology: true });
        await client.connect();
        console.log('Connected to MongoDB'); // Log the connection status
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        const projects = await collection.find().toArray();
        res.json(projects);
    } catch (error) {
        console.error('Error fetching project data:', error);
        res.status(500).json({ error: 'An error occurred while fetching project data.' });
    } finally {
        client.close();
        console.log('Disconnected from MongoDB'); // Log the disconnection status
    }
});

const url = "https://app.solid.world/projects";
console.log('Before axios GET request');
axios.get(url)
    .then(async response => {
        console.log('Axios GET request succesfull');
        const html = response.data;
        const $ = cheerio.load(html);

        const targetDivs = $('div.ProjectCard_ellipsis__1NASF');
        const extractedData = [];

        const nominatimUrl = "https://nominatim.openstreetmap.org/search";

        const client = new MongoClient(mongoURL, { useUnifiedTopology: true });
        await client.connect();
        console.log('Connected to MongoDB');
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        for (const div of targetDivs) {
            console.log('Processing a div');
            const location = $(div).text().trim();

            console.log('Extracted Data:', {
                location
            });

            // Check if the project already exists in the database
            const existingProject = await collection.findOne({ location });

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

                    extractedData.push({ location, coordinates });
                }
            }
        }

        if (extractedData.length > 0) {
            console.log('Inserting new data into the collection');
            await insertData(extractedData, collection);
        } else {
            console.log('No new data to insert.');
        }

        // Close the connection after processing
        client.close();
    })
    .catch(error => {
        console.error('Error fetching the page:', error);
    });

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

async function insertData(data, collection) {
    try {
        const result = await collection.insertMany(data);
        console.log(`${result.insertedCount} documents inserted`, result.insertedIds);
    } catch (error) {
        console.error('Error inserting data:', error);
    }
}

