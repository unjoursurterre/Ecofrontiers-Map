const MongoClient = require('mongodb').MongoClient;
const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');

const { scrapeSolidWorldData } = require('./scrapeSolidWorld');
const { fetchAndInsertRegenData } = require('./scrapeRegenNetwork');

const port = process.env.PORT || 3000;
const mongoURL = 'mongodb+srv://louise:Z04niNeVKEFR4erM@cluster0.miypx8l.mongodb.net/?authSource=Cluster0&authMechanism=SCRAM-SHA-1';
const dbName = 'ReFi-Asset-Map';
const solidWorldCollectionName = 'SolidWorld1';
const regenNetworkCollectionName = 'RegenNetwork';

let client;

// Use cors middleware to allow requests from all origins
app.use(cors({ origin: 'http://localhost:8080' }));

// Serve the front-end HTML
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/scrape/solidworld', async (req, res) => {
    try {
        console.log('Scraping SolidWorld data...');
        const db = req.app.locals.db;
        await scrapeSolidWorldData(db, solidWorldCollectionName);

        res.json({ message: 'SolidWorld scraping complete', projects });
    } catch (error) {
        console.error('Error scraping SolidWorld data:', error);
        res.status(500).json({ error: 'An error occurred while scraping SolidWorld data.' });
    }
});

app.get('/api/scrape/regennetwork', async (req, res) => {
    try {
        console.log('Scraping Regen Network data...');
        const db = req.app.locals.db;
        const collection = db.collection(regenNetworkCollectionName);
        await fetchAndInsertRegenData(collection);

        res.json({ message: 'Regen Network scraping complete'});
    } catch (error) {
        console.error('Error scraping Regen Network data:', error);
        res.status(500).json({ error: 'An error occurred while scraping Regen Network data.'});
    }
});

app.listen(port, async () => {
    try {
        client = new MongoClient(mongoURL, { useUnifiedTopology: true });
        await client.connect();
        app.locals.db = client.db(dbName); // Store the database instance in app.locals
        console.log(`Connected to MongoDB`);
        console.log(`Server is running on port ${port}`);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
});

// Handle server shutdown gracefully
process.on('SIGINT', async () => {
    try {
        await client.close();
        console.log('Disconnected from MongoDB');
    } catch (error) {
        console.error('Error closing MongoDB connection:', error);
    }
    process.exit(0);
});
