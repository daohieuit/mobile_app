const https = require('https');
const fs = require('fs');

const ENDPOINT = 'https://nyc.cloud.appwrite.io/v1';
const PROJECT_ID = '697668d20008048533e3';
const DATABASE_ID = '6977db47002be9bd55d6';
const API_KEY = 'standard_16f41e45cb6ed6a2c63d173605d214bd4d1813cecccf493859899890201815fb69260a49e32f7f18c2a48035d0c096b58f676d7ac905c66fd545ff7f49165b53111e8aac5a983c385bde3823bc50bceae919c5edd2e45f8cca678e77069b38e8affb3a55c9783bf2d5efc9977e01d9ae8130df59a0611a3a1b4634d9a2c58207';

const COLLECTION_IDS = ["users", "docks", "vocabularies", "study_logs", "daily_streaks", "quiz_results"];

const headers = {
    'X-Appwrite-Project': PROJECT_ID,
    'X-Appwrite-Key': API_KEY,
    'Content-Type': 'application/json'
};

function makeRequest(url) {
    return new Promise((resolve, reject) => {
        https.get(url, { headers }, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve(JSON.parse(data));
                } else {
                    reject(new Error(`Status ${res.statusCode}: ${data}`));
                }
            });
        }).on('error', reject);
    });
}

async function fetchCollectionSchema(collectionId) {
    console.log(`Fetching schema for collection: ${collectionId}...`);
    try {
        const collection = await makeRequest(`${ENDPOINT}/databases/${DATABASE_ID}/collections/${collectionId}`);
        const attrData = await makeRequest(`${ENDPOINT}/databases/${DATABASE_ID}/collections/${collectionId}/attributes`);
        const indexData = await makeRequest(`${ENDPOINT}/databases/${DATABASE_ID}/collections/${collectionId}/indexes`);

        return {
            collection,
            attributes: attrData.attributes || [],
            indexes: indexData.indexes || []
        };
    } catch (error) {
        console.error(`Error fetching collection ${collectionId}:`, error.message);
        return null;
    }
}

async function main() {
    const schema = {
        databaseId: DATABASE_ID,
        collections: {}
    };

    for (const collId of COLLECTION_IDS) {
        const data = await fetchCollectionSchema(collId);
        if (data) {
            schema.collections[collId] = data;
        }
    }

    const outputFile = 'appwrite_schema.json';
    fs.writeFileSync(outputFile, JSON.stringify(schema, null, 4));
    console.log(`\n✅ Schema exported successfully to ${outputFile}`);
}

main();
