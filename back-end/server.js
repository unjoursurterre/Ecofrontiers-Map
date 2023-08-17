const express = require('express');
const path = require('path');
const MongoClient = require('mongodb').MongoClient;
const cheerio = require('cheerio');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;

// Connection URL for MongoDB
const url = 'mongodb+srv://louise:Z04niNeVKEFR4erM@cluster0.miypx8l.mongodb.net/?authSource=Cluster0&authMechanism=SCRAM-SHA-1';

// Connect to the MongoDB database
MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
    if (err) {
        console.error('Error connecting to MongoDB:', err);
        return;
    }

    console.log('Connected to MongoDB');

// Scrape data from the public HTML page
app.get('/scrape', async (req, res) => {
    const headers = {
        'User-Agent': 'Curve-Labs'
    };
    
    try {
        console.log('Initiating data scraping...');
        const response = await axios.get('https://docs.google.com/spreadsheets/u/2/d/e/2PACX-1vR02HblpAKbeS5GckPQ4W483u-iABBPtsdRFFzzyZ-vIzO1FgTkbpjqXYdH3wfrpc1XVBIsEdauYKbi/pubhtml');
        console.log('Response:', response.data);
        const $ = cheerio.load(response.data);

        const scrapedData = [];

        // Loop through all table in the document
        $('table tbody tr').each((rowIndex, rowElement) => {
            const rowData = [];
            $(rowElement).find('td').each((colIndex, colElement) => {
                rowData.push($(colElement).text().trim());
            });
            scrapedData.push(rowData);
        });

        // Insert scraped data into MongoDB
        const db = client.db('ReFi-Asset-Map');
        const collection = db.collection('SolidWorld Inventory');
        await collection.insertMany(scrapedData);

        console.log('Data scraped and inserted into MongoDB');

        res.json({ message: 'Data scraped and inserted into MongoDB'});
    } catch (error) {
        console.error('Error scraping data:', error);
        res.status(500).json({ error: 'An error occurred while scraping data' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
});
