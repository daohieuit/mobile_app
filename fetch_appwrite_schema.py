import requests
import json
import os

ENDPOINT = 'https://nyc.cloud.appwrite.io/v1'
PROJECT_ID = '697668d20008048533e3'
DATABASE_ID = '6977db47002be9bd55d6'
API_KEY = 'standard_16f41e45cb6ed6a2c63d173605d214bd4d1813cecccf493859899890201815fb69260a49e32f7f18c2a48035d0c096b58f676d7ac905c66fd545ff7f49165b53111e8aac5a983c385bde3823bc50bceae919c5edd2e45f8cca678e77069b38e8affb3a55c9783bf2d5efc9977e01d9ae8130df59a0611a3a1b4634d9a2c58207'

COLLECTION_IDS = ["users", "docks", "vocabularies", "study_logs", "daily_streaks", "quiz_results"]

headers = {
    'X-Appwrite-Project': PROJECT_ID,
    'X-Appwrite-Key': API_KEY,
    'Content-Type': 'application/json'
}

def fetch_collection_schema(collection_id):
    print(f"Fetching schema for collection: {collection_id}...")
    
    # Get collection details
    coll_url = f"{ENDPOINT}/databases/{DATABASE_ID}/collections/{collection_id}"
    coll_resp = requests.get(coll_url, headers=headers)
    if coll_resp.status_code != 200:
        print(f"Error fetching collection {collection_id}: {coll_resp.status_code} - {coll_resp.text}")
        return None
    
    collection_data = coll_resp.json()
    
    # Get attributes
    attr_url = f"{ENDPOINT}/databases/{DATABASE_ID}/collections/{collection_id}/attributes"
    attr_resp = requests.get(attr_url, headers=headers)
    attributes = attr_resp.json().get('attributes', []) if attr_resp.status_code == 200 else []
    
    # Get indexes
    index_url = f"{ENDPOINT}/databases/{DATABASE_ID}/collections/{collection_id}/indexes"
    index_resp = requests.get(index_url, headers=headers)
    indexes = index_resp.json().get('indexes', []) if index_resp.status_code == 200 else []
    
    return {
        "collection": collection_data,
        "attributes": attributes,
        "indexes": indexes
    }

def main():
    schema = {
        "databaseId": DATABASE_ID,
        "collections": {}
    }
    
    for coll_id in COLLECTION_IDS:
        data = fetch_collection_schema(coll_id)
        if data:
            schema["collections"][coll_id] = data
            
    output_file = 'appwrite_schema.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(schema, f, indent=4)
        
    print(f"\n✅ Schema exported successfully to {output_file}")

if __name__ == "__main__":
    main()
