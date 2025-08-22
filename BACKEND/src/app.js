const express = require('express');
const songRoutes = require("./routes/song.routes")
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Add request size limits for file uploads
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Server is running' });
});

app.use("/", songRoutes)



module.exports = app;