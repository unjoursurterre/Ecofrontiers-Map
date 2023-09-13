const MongoClient = require('mongodb').MongoClient;
const axios = require('axios');
const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');
const cheerio = require("cheerio");

const port = process.env.PORT || 3000;
const mongoURL = 'mongodb+srv://louise:Z04niNeVKEFR4erM@cluster0.miypx8l.mongodb.net/?authSource=Cluster0&authMechanism=SCRAM-SHA-1';
const dbName = 'ReFi-Asset-Map';
const collectionName = 'SolidWorld1';

let client;

// Use cors middleware to allow requests from all origins
app.use(cors({origin: 'http://localhost:8080'}));

// Serve the front-end HTML
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/projects', async (req, res) => {
    try {
        console.log('Before connecting to MongoDB');
        client = new MongoClient(mongoURL, {useUnifiedTopology: true});
        await client.connect();
        console.log('Connected to MongoDB');
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        const projects = await collection.find().toArray();
        res.json(projects);
    } catch (error) {
        console.error('Error fetching project data:', error);
        res.status(500).json({ error: 'An error occurred while fetching project data.' });
    } finally {
        // Close the connection after processing
        client.close();
        console.log('Disconnected from MongoDB');
    }
});

const url = "https://app.solid.world/projects";
console.log('Before axios GET request');
axios.get(url)
    .then(async response => {
        console.log('Axios GET request successfull');
        const html = response.data;
        const $ = cheerio.load(html);

        const targetDivs = $('div.ProjectCard_projectInfo__6Ztff');
        const extractedData = [];

        const nominatimUrl = "https://nominatim.openstreetmap.org/search";

        const client = new MongoClient(mongoURL, {useUnifiedTopology: true});
        await client.connect();
        console.log('Connected to MongoDB');
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        for (const card of targetDivs) {
            console.log('Processing a div');

            const locationElement = $(card).find('.ProjectCard_ellipsis__1NASF');
            const locationText = locationElement.text().trim();

            // Use a regular expression to remove repeated patterns
            const location = locationText.replace(/(.+?)\1+/, '$1').trim();
            
            const projectTitleElement = $(card).find('.ProjectCard_title__nsbeD');
            const projectTitle = projectTitleElement.text().trim();

            const descriptionElement = $(card).find('div.ProjectCard_description__e6LI_');
            const description = descriptionElement.text().trim();
           
            const assetLinkElement = $(card).find('.ProjectCard_link__KD__k');
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
                        assetType: 'Forward Credit',
                    });
                }
            }
        }

        if (extractedData.length > 0) {
            await insertData(collection, extractedData);
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

async function insertData(collection, data) {
    try {
        const result = await collection.insertMany(data);
        console.log(`${result.insertedCount} documents inserted`, result.insertedIds);
    } catch (error) {
        console.error('Error inserting data:', error);
    }
}