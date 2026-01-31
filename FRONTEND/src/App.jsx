import React, { useState } from 'react'
import FacialExpression from './components/FacialExpression'
import MoodDisplay from './components/MoodDisplay'
import MoodSongs from './components/MoodSongs'
import './App.css'
import './components/SongsCard.css'

const App = () => {
  const [Songs, setSongs] = useState([]);
  const [moodResult, setMoodResult] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);

  return (
    <>
      <div className='main'>
        <div className='app-header'>
          <h1 className='project'> Moody Player </h1>
          <p className='project-des'>AI that senses your mood and shapes the music around you.</p>
        </div>
        
        <div className='main-content'>
          <div className='video-section'>
            <FacialExpression 
              setSongs={setSongs}
              setMoodResult={setMoodResult}
              setError={setError}
              setIsLoading={setIsLoading}
              setIsVideoReady={setIsVideoReady}
            />
          </div>
          
          {/* <div className='mood-section'>
            <MoodDisplay 
              isVideoReady={isVideoReady}
              isLoading={isLoading}
              moodResult={moodResult}
              error={error}
            />
          </div> */}
        </div>
        
        <MoodSongs Songs={Songs} />
      </div>
    </>
  )
}

export default App