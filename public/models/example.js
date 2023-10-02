const mongoose = require('mongoose');

// Define a schema for the "ReFiAssets" collection
const refiAssetSchema = new mongoose.Schema({
  name: String,             // Name of the refinancing asset
  provider: String,         // Name of the financial provider
  interestRate: Number,     // Interest rate for the asset
  terms: String,            // Loan terms
  location: {
    type: { type: String }, // GeoJSON type (e.g., 'Point' for coordinates)
    coordinates: [Number]   // [longitude, latitude] coordinates
  }
});

// Create a model based on the schema
const ReFiAsset = mongoose.model('ReFiAsset', refiAssetSchema);

module.exports = ReFiAsset;