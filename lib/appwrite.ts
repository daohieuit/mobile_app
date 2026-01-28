import { Account, Client, Databases, Storage } from 'react-native-appwrite';
import 'react-native-url-polyfill/auto';

// Initialize Appwrite Client
const client = new Client()
  .setProject('697668d20008048533e3')
  .setEndpoint('https://nyc.cloud.appwrite.io/v1');

// Initialize Appwrite Services
const account = new Account(client);
const databases = new Databases(client);
const storage = new Storage(client);

/**
 * Ping the Appwrite backend to verify the setup
 * This will throw an error if the connection fails
 */
export const pingAppwrite = async () => {
  try {
    // client.call expects a URL object in recent SDK versions
    const response = await client.call('GET', new URL(client.config.endpoint + '/health'));
    console.log('✅ Appwrite connection verified:', response);
    return response;
  } catch (error) {
    console.error('❌ Appwrite connection failed:', error);
    throw error;
  }
};

export { account, client, databases, storage };

