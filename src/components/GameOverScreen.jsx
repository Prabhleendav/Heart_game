import React from 'react';
import './GameOverScreen.css';

const GameOverScreen = ({ isVictory, score, level, onRestart }) => {
  return (
    <div className="game-over-screen">
      <div className="game-over-content">
        {isVictory ? (
          <div className="victory-message">
            <h1 className="victory-title">💕 Love Found! 💕</h1>
            <div className="victory-gif-container">
              <img 
                src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExeHlveHF0MWlpdDNyN25idTc0dmN4bzdqdDUxc2V1M3JjOHhkY2QyayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/zDGLgdXn2iEcyCHESH/giphy.gif"
                alt="Victory Celebration"
                className="victory-gif"
              />
            </div>
            <p className="victory-text">
              Successfully completed your quest!
            </p>
            <p className="victory-subtext">
              True love conquers all! 
            </p>
            <div className="celebration">
              <span className="celebration-heart">💖</span>
              <span className="celebration-heart">💕</span>
              <span className="celebration-heart">💝</span>
            </div>
          </div>
        ) : (
          <div className="game-over-message">
            <h1 className="game-over-title">Game Over</h1>
            <p className="game-over-text">
              Don't give up! Love is worth fighting for! 💪
            </p>
          </div>
        )}
        
        <div className="final-stats">
          <p>Hearts Collected: {score} 💖</p>
          <p>Level Reached: {level}</p>
        </div>
        
        <button className="restart-button" onClick={onRestart}>
          {isVictory ? 'Play Again' : 'Try Again'}
        </button>
      </div>
    </div>
  );
};

export default GameOverScreen;