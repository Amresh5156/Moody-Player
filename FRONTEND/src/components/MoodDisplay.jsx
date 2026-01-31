import React from 'react';
import './MoodDisplay.css';
import FacialExpression from './FacialExpression';
import './FacialExpression.css'

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
    <div></div>
  );
};

export default MoodDisplay;
