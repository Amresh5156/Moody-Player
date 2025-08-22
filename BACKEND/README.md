# Moody Player Backend

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create a `.env` file in the BACKEND folder with:
```
PORT=3000
MONGODB_URL=mongodb://localhost:27017/moody-player
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
```

### 3. Start MongoDB
Make sure MongoDB is running on your system:
```bash
# On Windows (if installed as a service)
# MongoDB should start automatically

# On macOS/Linux
mongod
```

### 4. Start the Server
```bash
npm start
```

Or for development with auto-restart:
```bash
npm run dev
```

### 5. Test the API
The server will be running on `http://localhost:3000`

## API Endpoints

- `GET /songs?mood={mood}` - Get songs by mood
- `POST /songs` - Upload a new song

## Troubleshooting

If you get "Backend server is not running" error:
1. Make sure you're in the BACKEND folder
2. Run `npm start`
3. Check if MongoDB is running
4. Verify the server starts without errors
