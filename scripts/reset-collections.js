const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb+srv://slaybib:asdf1234@cluster0.euxaa.mongodb.net/Coderush_Hackathon?retryWrites=true&w=majority&appName=Cluster0';

async function resetCollections() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db('Coderush_Hackathon');
    
    // Drop conversations collection
    try {
      await db.collection('conversations').drop();
      console.log('Conversations collection dropped');
    } catch (error) {
      console.log('Conversations collection does not exist or already dropped');
    }
    
    // Drop messages collection
    try {
      await db.collection('messages').drop();
      console.log('Messages collection dropped');
    } catch (error) {
      console.log('Messages collection does not exist or already dropped');
    }
    
    console.log('Collections reset successfully');
  } catch (error) {
    console.error('Error resetting collections:', error);
  } finally {
    await client.close();
  }
}

resetCollections();