from pymongo import MongoClient
import json

connection_string = "mongodb+srv://louise:Z04niNeVKEFR4erM@cluster0.miypx8l.mongodb.net/"

# Connect to MongoDB
client = MongoClient(connection_string)
db = client['ReFi-Asset-Map']
collection = db['SolidWorld1']

# Query to retrieve data from MongoDB
SolidWorld1_data = collection.find({})

# Initialize a list to store marker data
marker_data = []

asset_ids = set()

# Iterate through the retrieved documents and extract data
for asset in SolidWorld1_data:
    asset_id = asset['_id']

    # Check if the asset ID is not in the set
    if asset_id not in asset_ids:
        latitude = float(asset['coordinates']['lat'])
        longitude = float(asset['coordinates']['lng'])
        project_title = asset['projectTitle']
        description = asset['description']
        asset_link = asset['assetLink']
        asset_type = asset['assetType']

        # Create a dictionary for each asset and add it to the marker_data list
        asset_info = {
            "project_title": project_title,
            "latitude": latitude,
            "longitude": longitude,
            "asset_type": asset_type,
            "description": description,
            "asset_link": asset_link
        }
        marker_data.append(asset_info)
        asset_ids.add(asset_id)

# Close the MongoDB connection
client.close()

# Save the marker data as a JSON file
with open('marker_data.json', 'w') as json_file:
    json.dump(marker_data, json_file)