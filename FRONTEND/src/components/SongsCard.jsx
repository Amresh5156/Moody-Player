import React from 'react'

const SongsCard = ({ title, artist, audio, index, isPlaying, onPlayPause }) => {
    
  return (
    <div className='song' key={index}>
        <div className='title'>
            <h3>{title}</h3>
            <p>{artist}</p>
        </div>

        <div className='play-pause-button'>
            <button onClick={() => onPlayPause(index)}>
                {isPlaying === index ? '⏸️' : '▶️'}
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