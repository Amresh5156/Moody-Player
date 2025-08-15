import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import './FacialExpression.css'
import axios from 'axios'

export default function FacialExpression({setSongs}) {
  const videoRef = useRef();
  const canvasRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
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
        };
      })
      .catch((err) => {
        setError('Camera access denied. Please allow camera permissions.');
        console.error("Error accessing webcam: ", err);
      });
  };

  async function detectMood() {
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
      const response = await axios.get(`http://localhost:3000/songs?mood=${_expression}`);
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
    if (isLoading) return 'Processing...';
    if (moodResult) return 'Mood Detected!';
    if (isVideoReady) return 'Ready';
    return 'Initializing...';
  };

  const getStatusClass = () => {
    if (error) return 'offline';
    if (isLoading) return 'processing';
    return '';
  };

  return (
    <div className='mood-player'>

      {/* Status Indicator */}
      <div className='status-indicator'>
        <div className={`status-dot ${getStatusClass()}`}></div>
        <span className='status-text'>{getStatusText()}</span>
      </div>

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

      {/* Mood Result Display */}
      {moodResult && (
        <div className='mood-result'>
          <h3>🎵 {moodResult.expression}</h3>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className='mood-result' style={{ borderColor: 'rgba(239, 68, 68, 0.5)' }}>
          <h3>⚠️ Error</h3>
          <p>{error}</p>
          {error.includes('Backend server') && (
            <div style={{ marginTop: '15px', padding: '10px', background: '#2d3748', borderRadius: '6px', fontSize: '0.9rem' }}>
              <p style={{ margin: '0 0 10px 0', color: '#cbd5e0' }}><strong>To fix this:</strong></p>
              <ol style={{ margin: '0', paddingLeft: '20px', color: '#cbd5e0' }}>
                <li>Open a new terminal</li>
                <li>Navigate to the BACKEND folder</li>
                <li>Run: <code style={{ background: '#4a5568', padding: '2px 6px', borderRadius: '4px' }}>npm start</code></li>
                <li>Make sure MongoDB is running</li>
              </ol>
            </div>
          )}
        </div>
      )}

      {/* Action Button */}
      <button 
        className={`mood-button ${isLoading ? 'loading' : ''}`}
        onClick={detectMood}
        disabled={!isVideoReady || isLoading}
      >
        {isLoading ? 'Detecting...' : 'Detect Mood'}
      </button>
    </div>
  );
}
