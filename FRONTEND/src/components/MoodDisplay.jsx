import React from 'react';
import './MoodDisplay.css';

const MoodDisplay = ({ isVideoReady, isLoading, moodResult, error }) => {
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
    <div className='mood-display'>
      {/* Status Indicator */}
      <div className='status-indicator'>
        <div className={`status-dot ${getStatusClass()}`}></div>
        <span className='status-text'>{getStatusText()}</span>
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
    </div>
  );
};

export default MoodDisplay;
