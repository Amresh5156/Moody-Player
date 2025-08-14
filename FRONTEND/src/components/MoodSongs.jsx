import React, { useState } from 'react'
import './MoodSongs.css'
import SongsCard from './SongsCard';

const MoodSongs = ({ Songs }) => {

    const [isPlaying, setIsPlaying] = useState(null);

    const handlePlayPause = (index) => {
        if (isPlaying === index) {
            setIsPlaying(null);
        } else {
            setIsPlaying(index);
        }
    }    

    return (
        <div className='mood-songs'>
            <h2>Recommended Songs</h2>

            {Songs.map((song, index) => (
                <SongsCard 
                    key={index}
                    title={song.title}
                    artist={song.artist}
                    audio={song.audio}
                    index={index}
                    isPlaying={isPlaying}
                    onPlayPause={handlePlayPause}
                />
            ))}
        </div>
    )
}

export default MoodSongs