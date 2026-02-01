import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import './FacialExpression.css'
import axios from 'axios'

export default function FacialExpression({setSongs}) {
  const videoRef = useRef();
  const canvasRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [moodResult, setMoodResult] = useState(null);
  const [error, setError] = useState(null);

  const loadModels = async () => {
    try {
      const MODEL_URL = '/models';
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
      setIsVideoReady(true);
    } catch (err) {
      setError('Failed to load AI models');
      console.error("Error loading models: ", err);
    }
  };

  const startVideo = () => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          setIsVideoReady(true);
          setCameraEnabled(true);
        };
      })
      .catch((err) => {
        setError('Camera access denied. Please allow camera permissions.');
        console.error("Error accessing webcam: ", err);
        setCameraEnabled(false);
      });
  };

  async function detectMood() {
    if (!cameraEnabled) return;
    if (!isVideoReady) return;
    
    setIsLoading(true);
    setError(null);
    setMoodResult(null);
    
    try {
      const detections = await faceapi
        .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();

      if(!detections || detections.length === 0){
        setError('No face detected. Please position your face in the camera view.');
        return;
      }

      let mostProbableExpression = 0;
      let _expression = '';

      for(const expression of Object.keys(detections[0].expressions)){
        if(detections[0].expressions[expression] > mostProbableExpression){
          mostProbableExpression = detections[0].expressions[expression];
          _expression = expression; 
        }
      }

      // Format the expression for display
      const formattedExpression = _expression
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      setMoodResult({
        expression: formattedExpression
      });

      // Fetch songs based on mood
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/songs?mood=${_expression}`);
      setSongs(response.data.songs);
      
    } catch (err) {
      setError('Failed to detect mood. Please try again.');
      console.error("Error detecting mood: ", err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadModels().then(startVideo);
    
    return () => {
      // Cleanup video stream on unmount
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  const getStatusText = () => {
    if (error) return 'Error';
    if (!cameraEnabled) return 'Enable Camera'
    if (isLoading) return 'Processing...';
    if (moodResult) return 'Mood Detected!';
    if (isVideoReady) return 'Ready';
    return 'Initializing...';
  };

  const getStatusClass = () => {
    if (error) return 'offline';
    if (!cameraEnabled) return 'Camera'
    if (isLoading) return 'processing';
    return '';
  };

  const toggleCamera = () => {
    setCameraEnabled(!cameraEnabled);
    if (cameraEnabled) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    } else {
      startVideo();
    }
  };
  
  return (
    <div className='mood-container'>
      <div className='mood-player'>
        {/* Video Container */}
        <div className='video-container'>
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
          />
          <canvas ref={canvasRef} />
        </div>
      </div>


      <div className='mood-display'>
        {/* Status Indicator */}
        <div className='status-indicator'>
          <div className={`status-dot ${getStatusClass()}`}></div>
          <span className={`status-text` }>{`${getStatusText()}`}</span>
        </div>

        {/* Mood Result Display */}
        {moodResult && (
          <div className='mood-result'>
            <h3>🎵 {moodResult.expression}</h3>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className='mood-result error'>
            <h3>⚠️ Error</h3>
            <p>{error}</p>
          </div>
        )}

        {/* Instructions */}
        {!moodResult && !error && (
          <div className='instructions'>
            <h3>📋 Instructions</h3>
            <ol>
              <li>Position your face in the camera view</li>
              <li>Make sure your face is clearly visible</li>
              <li>Click the "Detect Mood" button</li>
              <li>Wait for the AI to analyze your expression</li>
            </ol>
          </div>
        )}
       <div className='button-container'>
        <button className='camera-btn' onClick={toggleCamera}>
            {cameraEnabled ? 'Disable Camera' : 'Enable Camera'}
          </button>

          {/* Action Button */}
          <button 
            className={`mood-button ${isLoading ? 'loading' : ''}`}
            onClick={detectMood}
            disabled={!isVideoReady || isLoading}
          >
            {isLoading ? 'Detecting...' : 'Detect Mood'}
          </button>
       </div>
      </div>
      
    </div>
  );
}
