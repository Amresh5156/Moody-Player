const app = require("./BACKEND/src/app.js");
const connectDB = require("./BACKEND/src/db/db.js");

// Ensure DB connects only once
let isConnected = false;

module.exports = async function handler(req, res) {
  try {
    if (!isConnected) {
      await connectDB();
      isConnected = true;
    }
    return app(req, res); // Let express handle the route
  } catch (error) {
    console.error('Handler error:', error);
    res.status(500).json({ 
      error: 'Internal server error', 
      message: error.message 
    });
  }
}
