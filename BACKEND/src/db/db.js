const mongoose = require('mongoose');

console.log("MONGODB_URL from env:", `"${process.env.MONGODB_URL}"`);

function connectDB() {
    const mongoURI = process.env.MONGODB_URL;
    
    mongoose.connect(mongoURI)
    .then(() => {
        console.log('✅ Connected to MongoDB successfully');
    })
    .catch((error) => {
        console.error('❌ MongoDB connection error:', error.message);
        process.exit(1);
    });
}

module.exports = connectDB;