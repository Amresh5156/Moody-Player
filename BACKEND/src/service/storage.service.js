var ImageKit = require("imagekit");
const mongoose = require('mongoose')

// Only initialize ImageKit if environment variables are available
var imagekit = null;
if (process.env.IMAGEKIT_PUBLIC_KEY && process.env.IMAGEKIT_PRIVATE_KEY && process.env.IMAGEKIT_URL_ENDPOINT) {
    imagekit = new ImageKit({
        publicKey : process.env.IMAGEKIT_PUBLIC_KEY,
        privateKey : process.env.IMAGEKIT_PRIVATE_KEY,
        urlEndpoint : process.env.IMAGEKIT_URL_ENDPOINT
    });
}

function uploadFile(file) {
    return new Promise((res, rej) => {
        if (!imagekit) {
            rej(new Error('ImageKit not configured. Please set IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, and IMAGEKIT_URL_ENDPOINT environment variables.'));
            return;
        }
        
        imagekit.upload({
            file:file.buffer,
            fileName:(new mongoose.Types.ObjectId()).toString(),
            folder: "Player-list"
        },(error,result) => {
            if(error) {
                rej(error);
            }else{
                res(result);
            }
        })
    })
}

module.exports = uploadFile;