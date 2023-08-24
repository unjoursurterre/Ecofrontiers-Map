const MongoClient = require('mongodb').MongoClient;
const axios = require('axios');
const express = require('express');
const app = express();
const path = require('path');
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

const mongoURL = 'mongodb+srv://louise:Z04niNeVKEFR4erM@cluster0.miypx8l.mongodb.net/?retryWrites=true&w=majority';
const dbName = 'ReFi-Asset-Map';

const client = new MongoClient(mongoURL, { useUnifiedTopology: true });

const collectionName = 'SolidWorld1';

async function insertData(data) {
    try {
        await client.connect();
        console.log('Connected to MongoDB');

        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const result = await collection.insertMany(data);
        console.log(`${result.insertedCount} documents inserted`, result.insertedIds);
    } catch (error) {
        console.error('Error inserting data:', error);
    } finally {
        client.close();
        console.log('Disconnected from MongoDB');
    }
}

const cheerio = require("cheerio");

const url = "https://app.solid.world/projects";

axios.get(url)
    .then(async response => {
        const html = response.data;
        const $ = cheerio.load(html);

        const targetDivs = $('div.ProjectCard_card__3Yi_y');
        const extractedData = [];

        const nominatimUrl = "https://nominatim.openstreetmap.org/search";
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        for (const card of targetDivs) {
            const location = $(card).find('div.ProjectCard_ellipsis__1NASF').text().trim();
            console.log('Extracted location:', location);
            const projectTitle = $(card).find('h2.ProjectCard_title__nsbeD').text().trim();
            const assetLink = $(card).find('a.ProjectCard_link__KD__k').attr('href');

            console.log('Extracted Data:', {
                location,
                projectTitle,
                assetLink,
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
                        coordinates,
                        assetType: 'Forward Credit',
                    });
                }
            }
        }

        if (extractedData.length > 0) {
            await insertData(extractedData);
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
        const collection = db.collection(collectionName);
        const projects = await collection.find().toArray();
        res.json(projects);
    } catch (error) {
        console.error('Error fetching project data:', error);
        res.status(500).json({ error: 'An error occurred while fetching project data.' });
    } finally {
        client.close();
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

