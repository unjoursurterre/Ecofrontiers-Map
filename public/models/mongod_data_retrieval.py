from pymongo import MongoClient
import json

connection_string = "mongodb+srv://louise:Z04niNeVKEFR4erM@cluster0.miypx8l.mongodb.net/"

# Connect to MongoDB
client = MongoClient(connection_string)
db = client['ReFi-Asset-Map']

# Define the collections you want to retrieve data from as a list of collection names
collection_names = ['SolidWorld1', 'RegenNetwork']

# Initialize a list to store all marker data
all_marker_data = []

for collection_name in collection_names:
    collection = db[collection_name]

    # Query to retrieve data from the collection
    collection_data = collection.find()

    # Initialize a list to store marker data for the current collection
    marker_data = []

    asset_ids = set()

    # Iterate through the retrieved documents and extract data
    for asset in collection_data:
        asset_id = asset['_id']

        # Check if the asset ID is not in the set
        if asset_id not in asset_ids:
            coordinates = asset['coordinates']
            latitude = coordinates['lat']
            longitude = coordinates['lng']
            project_title = asset['projectTitle']
            description = asset['description']
            asset_link = asset['assetLink']
            asset_type = asset['assetType']
            seller = asset['seller']

            # Create a dictionary for each asset and add it to the marker_data list
            asset_info = {
                "project_title": project_title,
                "latitude": latitude,
                "longitude": longitude,
                "asset_type": asset_type,
                "description": description,
                "asset_link": asset_link,
                "seller": seller
            }
            marker_data.append(asset_info)
            asset_ids.add(asset_id)

    # Add the marker data for the current collection to the all_marker_data list
    all_marker_data.extend(marker_data)

# Close the MongoDB connection
client.close()

# Save all marker data as a JSON file
with open('all_marker_data.json', 'w') as json_file:
    json.dump(all_marker_data, json_file)