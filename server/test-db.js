const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://daizmiguel76:Miguel@cluster0.7nmuvoj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

async function testConnection() {
    try {
        console.log('Attempting to connect to MongoDB...');
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Successfully connected to MongoDB!');
        
        // Test creating a collection
        const db = mongoose.connection.db;
        await db.createCollection('test');
        console.log('Successfully created test collection!');
        
        // List all collections
        const collections = await db.listCollections().toArray();
        console.log('Available collections:', collections.map(c => c.name));
        
    } catch (error) {
        console.error('MongoDB connection error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

testConnection(); 