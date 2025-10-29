import React from 'react';
import './StartScreen.css';

const StartScreen = ({ onStart }) => {
  return (
    <div className="start-screen">
      <div className="start-content">
        <h1 className="game-title">
          <span className="title-line">💖 Love Quest 💖</span>
          <span className="subtitle">Your Adventure</span>
        </h1>
        
        <div className="story-text">
          <p>Go on a magical adventure</p>
          <p>to find your one true love!</p>
          <p className="heart-text">Collect hearts along the way ❤️</p>
        </div>
        
        <button className="start-button" onClick={onStart}>
          Start Adventure
        </button>
        
        <div className="controls-info">
          <p>Controls:</p>
          <p>← → Arrow Keys: Move</p>
          <p>↑ Arrow Key or Space: Jump</p>
        </div>
      </div>
      
      <div className="floating-hearts">
        <span className="heart heart-1">💕</span>
        <span className="heart heart-2">💖</span>
        <span className="heart heart-3">💝</span>
        <span className="heart heart-4">💗</span>
      </div>
    </div>
  );
};

export default StartScreen;