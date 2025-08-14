import React, { useState } from 'react'
import FacialExpression from './components/FacialExpression'
import MoodSongs from './components/MoodSongs'
import './App.css'

const App = () => {

  const [Songs, setSongs] = useState([])

  return (
    <>
      <div className='main'>
        <FacialExpression setSongs={setSongs} />
        <MoodSongs Songs={Songs} />
      </div>
    </>
  )
}

export default App