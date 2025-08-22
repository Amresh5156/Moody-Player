const mongoose = require('mongoose');

console.log("MONGODB_URL from env:", `"${process.env.MONGODB_URL}"`);

function connectDB() {
    return new Promise((resolve, reject) => {
        const mongoURI = process.env.MONGODB_URL;
        
        if (!mongoURI) {
            reject(new Error('MONGODB_URL environment variable is not set'));
            return;
        }
        
        // Check if already connected
        if (mongoose.connection.readyState === 1) {
            console.log('✅ MongoDB already connected');
            resolve();
            return;
        }
        
        mongoose.connect(mongoURI, {
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
        })
        .then(() => {
            console.log('✅ Connected to MongoDB successfully');
            resolve();
        })
        .catch((error) => {
            console.error('❌ MongoDB connection error:', error.message);
            reject(error);
        });
    });
}

module.exports = connectDB;