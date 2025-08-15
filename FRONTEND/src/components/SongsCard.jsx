import React from 'react'

const SongsCard = ({ title, artist, audio, index, isPlaying, onPlayPause }) => {
    
  return (
    <div className={`song ${isPlaying === index ? 'playing' : ''}`} key={index}>
        <div className='title'>
            <h3>{title}</h3>
            <p>{artist}</p>
        </div>

        <div className='play-pause-button'>
            <button onClick={() => onPlayPause(index)}>
                <img
                    src={isPlaying === index
                        ? "https://img.icons8.com/ios-glyphs/24/pause--v1.png"
                        : "https://img.icons8.com/material-sharp/28/play--v1.png"}
                    alt={isPlaying === index ? "Pause" : "Play"}
                />
            </button>
            {isPlaying === index && (
                <audio 
                    src={audio}
                    style={{ display: 'none' }}
                    autoPlay
                />
            )}
        </div>
    </div> 
  )
}

export default SongsCard