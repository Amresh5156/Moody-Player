const express = require('express')
const multer = require('multer');
const uploadFile = require('../service/storage.service');
const router = express.Router();
const songModel = require("../models/song.models")

const upload = multer({storage:multer.memoryStorage()});

router.post('/songs',upload.single("audio"), async (req, res)=>{
    try {
        console.log(req.body);
        console.log(req.file);
        
        // Validate required fields
        if (!req.body.title || !req.body.artist || !req.body.mood || !req.file) {
            return res.status(400).json({
                error: 'Missing required fields',
                required: ['title', 'artist', 'mood', 'audio file']
            });
        }
        
        const fileData = await uploadFile(req.file)
        
        const song = await songModel.create({
            title:req.body.title,
            artist:req.body.artist,
            audio:fileData.url,
            mood:req.body.mood
        })

        res.status(201).json({
            message: 'Song created successfully',
            song: song
        });
    } catch (error) {
        console.error('Error creating song:', error);
        res.status(500).json({
            error: 'Failed to create song',
            message: error.message
        });
    }
})

router.get('/songs',async (req, res)=>{
    try {
        const {mood} = req.query
        
        if (!mood) {
            return res.status(400).json({
                error: 'Missing required parameter: mood'
            });
        }

        const songs = await songModel.find({
            mood: mood
        })

        res.status(200).json({
            message:"Songs Fetch Successfully",
            songs
        });
    } catch (error) {
        console.error('Error fetching songs:', error);
        res.status(500).json({
            error: 'Failed to fetch songs',
            message: error.message
        });
    }
})



module.exports = router;