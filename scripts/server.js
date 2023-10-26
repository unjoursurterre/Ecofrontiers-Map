const MongoClient = require('mongodb').MongoClient;
const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');

const { loadSolidWorldData } = require('./loadSolidWorld');
const { loadRegenData } = require('./loadRegenNetwork');
const { loadGreenTradeData } = require('./loadGreenTrade');
const { loadCoorestData } = require('./loadCoorest');

const port = process.env.PORT || 3000;
const mongoURL = 'mongodb+srv://louise:Z04niNeVKEFR4erM@cluster0.miypx8l.mongodb.net/?authSource=Cluster0&authMechanism=SCRAM-SHA-1';
const dbName = 'ReFi-Asset-Map';
const solidWorldCollectionName = 'SolidWorld1';
const regenNetworkCollectionName = 'RegenNetwork';
const greenTradeCollectionName = 'GreenTrade';
const coorestCollectionName = "Coorest";

let client;

// Use cors middleware to allow requests from all origins
app.use(cors({ origin: 'http://localhost:8080' }));

// Serve the front-end HTML
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/load/solidworld', async (req, res) => {
    try {
        console.log('Loading SolidWorld data...');
        const db = req.app.locals.db;
        await loadSolidWorldData(db, solidWorldCollectionName);

        res.json({ message: 'SolidWorld loading complete' });
    } catch (error) {
        console.error('Error loading SolidWorld data:', error);
        res.status(500).json({ error: 'An error occurred while loading SolidWorld data.' });
    }
});

app.get('/api/load/regennetwork', async (req, res) => {
    try {
        console.log('Loading Regen Network data...');
        const db = req.app.locals.db;
        const collection = db.collection(regenNetworkCollectionName);
        await loadRegenData(collection);

        res.json({ message: 'Regen Network loading complete'});
    } catch (error) {
        console.error('Error loading Regen Network data:', error);
        res.status(500).json({ error: 'An error occurred while loading Regen Network data.'});
    }
});

app.get('/api/load/GreenTrade', async (req, res) => {
    try {
        console.log('Loading GreenTrade data...');
        const db = req.app.locals.db;
        await loadGreenTradeData(db, greenTradeCollectionName);

        res.json({ message: 'GreenTrade loading complete' });
    } catch (error) {
        console.error('Error loading GreenTrade data:', error);
        res.status(500).json({ error: 'An error occurred while loading GreenTrade data.' });
    }
});

app.get('/api/load/Coorest', async (req, res) => {
    try {
        console.log('Loading Coorest data...');
        const db = req.app.locals.db;
        await loadCoorestData(db, coorestCollectionName);

        res.json({ message: 'Coorest loading complete' });
    } catch (error) {
        console.error('Error loading Coorest data:', error);
        res.status(500).json({ error: 'An error occurred while loading Coorest data.' });
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
