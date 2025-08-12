import React, { useEffect, useRef } from 'react';
import * as faceapi from 'face-api.js';
import './FacialExpression.css'
import axios from 'axios'



export default function FacialExpression({setSongs}) {
  const videoRef = useRef();
  const canvasRef = useRef();

  const loadModels = async () => {
    const MODEL_URL = '/models';
    await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
    await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
  };

  const startVideo = () => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
      })
      .catch((err) => console.error("Error accessing webcam: ", err));
  };

  async function detectMood() {
    const detections = await faceapi
          .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
          .withFaceExpressions();

          let mostProableExpression = 0;
          let _expression = '';

          if(!detections || detections.length === 0){
            console.log("no face detected");
            return;
          }

          for( const expression of Object.keys(detections[0].expressions)){
            if( detections[0].expressions[ expression] > mostProableExpression){
                mostProableExpression = detections[0].expressions[ expression ]
                _expression = expression;
                }
            }
             
            axios.get(`http://localhost:3000/songs?mood=${_expression}`)
            .then(res => {
              console.log(res.data); 
              setSongs(res.data.songs);
            })
  }

  useEffect(() => {
    
    loadModels().then(startVideo);
  }, []);

  return (
    <div className='mood-player'>
      <video
        ref={videoRef}
        autoPlay
        muted
      />
      
      <button onClick={detectMood}>Detect Mood</button>
    </div>
  );
}
