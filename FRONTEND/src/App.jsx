import React, { useState } from 'react'
import FacialExpression from './components/FacialExpression'
import MoodSongs from './components/MoodSongs'
import './App.css'
import './components/SongsCard.css'

const App = () => {

  const [Songs, setSongs] = useState([])

  return (
    <>
      <div className='main'>
        <div className='app-header'>
          <h1>Moody Player</h1>
          <p>Your AI-powered music companion that matches your mood</p>
        </div>
        <FacialExpression setSongs={setSongs} />
        <MoodSongs Songs={Songs} />
      </div>
    </>
  )
}

export default App