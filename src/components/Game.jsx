import React, { useEffect, useRef, useState } from 'react';
import GameEngine from './GameEngine';
import StartScreen from './StartScreen';
import GameOverScreen from './GameOverScreen';
import './Game.css';

const Game = () => {
  const canvasRef = useRef(null);
  const gameEngineRef = useRef(null);
  const [gameState, setGameState] = useState('start'); // 'start', 'playing', 'gameOver', 'victory'
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);

  useEffect(() => {
    if (gameState === 'playing' && canvasRef.current) {
      gameEngineRef.current = new GameEngine(
        canvasRef.current,
        {
          onScoreChange: setScore,
          onGameOver: () => setGameState('gameOver'),
          onVictory: () => setGameState('victory'),
          onLevelComplete: () => setLevel(prev => prev + 1),
          level: level
        }
      );
      gameEngineRef.current.start();
    }

    return () => {
      if (gameEngineRef.current) {
        gameEngineRef.current.stop();
      }
    };
  }, [gameState, level]);

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setLevel(1);
  };

  const restartGame = () => {
    setGameState('start');
    setScore(0);
    setLevel(1);
  };

  return (
    <div className="game-container">
      {gameState === 'start' && (
        <StartScreen onStart={startGame} />
      )}
      
      {gameState === 'playing' && (
        <div className="game-wrapper">
          <div className="game-ui">
            <div className="score">Hearts: {score}</div>
            <div className="level">Level: {level}</div>
          </div>
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            className="game-canvas"
          />
          <div className="game-instructions">
            <p>Use ARROW KEYS to move • SPACEBAR to jump</p>
            <p>Collect hearts and find your love! 💕</p>
          </div>
        </div>
      )}
      
      {(gameState === 'gameOver' || gameState === 'victory') && (
        <GameOverScreen
          isVictory={gameState === 'victory'}
          score={score}
          level={level}
          onRestart={restartGame}
        />
      )}
    </div>
  );
};

export default Game;