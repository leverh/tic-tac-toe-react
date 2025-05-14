import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Board from './components/Board';
import GameInfo from './components/GameInfo';
import ThreeDScene from './components/ThreeDScene';
import ParticleBackground from './components/ParticleBackground';
import Footer from './components/Footer';
import './styles/index.css';

// Win/Draw Modal Component
const WinModal = ({ winner, resetGame }) => {
  let message;
  let icon;
  let color;

  if (winner === 'X') {
    message = 'You Won!';
    icon = '🏆';
    color = 'rgba(165, 145, 255, 0.95)'; // Player X
  } else if (winner === 'O') {
    message = 'AI Won!';
    icon = '🤖';
    color = 'rgba(255, 123, 123, 0.95)'; // Player O
  } else {
    message = "It's a Draw!";
    icon = '🤝';
    color = 'rgba(123, 232, 232, 0.95)'; // Draw
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(5px)',
        WebkitBackdropFilter: 'blur(5px)'
      }}
      onClick={resetGame}
    >
      <motion.div 
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.1 }}
        style={{
          background: `linear-gradient(135deg, ${color}, rgba(0, 0, 0, 0.7))`,
          borderRadius: '1.5rem',
          padding: '3rem 4rem',
          boxShadow: '0 1rem 3rem rgba(0, 0, 0, 0.3)',
          textAlign: 'center',
          maxWidth: '90%',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          position: 'relative',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>{icon}</div>
        <h2 style={{ 
          fontSize: '3rem', 
          color: 'white', 
          marginBottom: '1.5rem',
          fontWeight: 800,
          textShadow: '0 0.2rem 0.5rem rgba(0, 0, 0, 0.3)'
        }}>
          {message}
        </h2>
        <motion.button
          whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
          whileTap={{ scale: 0.95 }}
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '2rem',
            padding: '1rem 2.5rem',
            fontSize: '1.6rem',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 0.4rem 1rem rgba(0, 0, 0, 0.2)',
            outline: 'none'
          }}
          onClick={resetGame}
        >
          Play Again
        </motion.button>
        <div style={{
          position: 'absolute',
          top: '-50%',
          left: '-50%',
          width: '200%',
          height: '200%',
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
          zIndex: -1
        }}></div>
      </motion.div>
    </motion.div>
  );
};

function App() {
  const [gameState, setGameState] = useState({
    board: Array(9).fill(null),
    currentPlayer: 'X',
    winner: null,
    winningLine: null,
    isGameOver: false,
    difficulty: 'medium'
  });

  const [scores, setScores] = useState({
    X: 0,
    O: 0,
    draws: 0
  });

  const [showThreeD, setShowThreeD] = useState(true);

  useEffect(() => {
    const savedScores = localStorage.getItem('react-tic-tac-toe-scores');
    if (savedScores) {
      try {
        setScores(JSON.parse(savedScores));
      } catch (e) {
        console.error("Error loading scores:", e);
      }
    }

    const savedDifficulty = localStorage.getItem('react-tic-tac-toe-difficulty');
    if (savedDifficulty) {
      setGameState(prev => ({
        ...prev,
        difficulty: savedDifficulty
      }));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('react-tic-tac-toe-scores', JSON.stringify(scores));
  }, [scores]);

  useEffect(() => {
    console.log("Game state updated:", gameState);
    if (gameState.winner) {
      console.log("Winner:", gameState.winner, "Winning Line:", gameState.winningLine);
    }
  }, [gameState]);

  const checkWinner = (board) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6]             // diagonals
    ];

    for (const line of lines) {
      const [a, b, c] = line;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        console.log("Winner found!", board[a], "Winning line:", line);
        return { winner: board[a], winningLine: line };
      }
    }

    if (board.every(cell => cell !== null)) {
      console.log("Draw detected");
      return { winner: 'draw', winningLine: null };
    }

    return { winner: null, winningLine: null };
  };

  const handleCellClick = (index) => {
    if (gameState.board[index] || gameState.winner) return;

    const newBoard = [...gameState.board];
    newBoard[index] = gameState.currentPlayer;

    const { winner, winningLine } = checkWinner(newBoard);
    
    if (winner) {
      handleGameEnd(winner, winningLine, newBoard);
      return;
    }

    setGameState(prevState => ({
      ...prevState,
      board: newBoard,
      currentPlayer: 'O'
    }));

    setTimeout(() => makeComputerMove(newBoard), 500);
  };

  const makeComputerMove = (board) => {
    const winCheck = checkWinner(board);
    if (winCheck.winner) return;

    let computerMoveIndex;

    if (gameState.difficulty === 'easy') {
      computerMoveIndex = getRandomMove(board);
    } else if (gameState.difficulty === 'hard') {
      computerMoveIndex = getBestMove(board);
    } else {
      computerMoveIndex = Math.random() < 0.5 ? 
        getBestMove(board) : 
        getRandomMove(board);
    }

    if (computerMoveIndex !== null) {
      const newBoard = [...board];
      newBoard[computerMoveIndex] = 'O';
      
      const { winner, winningLine } = checkWinner(newBoard);
      
      if (winner) {
        handleGameEnd(winner, winningLine, newBoard);
      } else {
        setGameState(prevState => ({
          ...prevState,
          board: newBoard,
          currentPlayer: 'X',
        }));
      }
    }
  };

  const handleGameEnd = (winner, winningLine, board) => {
  console.log("GAME END - Winner:", winner, "Winning Line:", winningLine);
  
  setGameState(prevState => ({
    ...prevState,
    board: board,
    winningLine: winningLine,
    isGameOver: true,
  }));

  if (winner === 'X') {
    setScores(prev => ({ ...prev, X: prev.X + 1 }));
  } else if (winner === 'O') {
    setScores(prev => ({ ...prev, O: prev.O + 1 }));
  } else if (winner === 'draw') {
    setScores(prev => ({ ...prev, draws: prev.draws + 1 }));
  }
  
  setTimeout(() => {
    setGameState(prevState => ({
      ...prevState,
      winner: winner  
    }));
  }, 1000);  
};

  const getRandomMove = (board) => {
    const emptyIndices = board
      .map((cell, index) => cell === null ? index : null)
      .filter(index => index !== null);
      
    if (emptyIndices.length === 0) return null;
    return emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
  };

  const getBestMove = (board) => {
    const winMove = findWinningMove(board, 'O');
    if (winMove !== null) return winMove;
    
    const blockMove = findWinningMove(board, 'X');
    if (blockMove !== null) return blockMove;
    
    if (board[4] === null) return 4;

    const corners = [0, 2, 6, 8].filter(i => board[i] === null);
    if (corners.length > 0) {
      return corners[Math.floor(Math.random() * corners.length)];
    }

    const sides = [1, 3, 5, 7].filter(i => board[i] === null);
    if (sides.length > 0) {
      return sides[Math.floor(Math.random() * sides.length)];
    }
    
    return null;
  };

  const findWinningMove = (board, player) => {
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        const testBoard = [...board];
        testBoard[i] = player;

        const { winner } = checkWinner(testBoard);
        
        if (winner === player) return i;
      }
    }
    return null;
  };

  const resetGame = () => {
    console.log("Game reset");
    setGameState({
      ...gameState,
      board: Array(9).fill(null),
      currentPlayer: 'X',
      winner: null,
      winningLine: null,
      isGameOver: false
    });
  };

  const setDifficulty = (difficulty) => {
    setGameState(prev => ({
      ...prev,
      difficulty
    }));
    localStorage.setItem('react-tic-tac-toe-difficulty', difficulty);
  };

  const toggleThreeD = () => {
    setShowThreeD(prev => !prev);
  };

  const currentYear = new Date().getFullYear();

  console.log("Rendering App with state:", {
    board: gameState.board,
    winner: gameState.winner,
    winningLine: gameState.winningLine,
    currentPlayer: gameState.currentPlayer
  });

  return (
    <>
      <ParticleBackground />
      <motion.div
        className="app-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h1 
          className="title"
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
        >
          Tic Tac Toe
        </motion.h1>
        
        <div className="game-container">
          <GameInfo 
            currentPlayer={gameState.currentPlayer}
            winner={gameState.winner}
            scores={scores}
            difficulty={gameState.difficulty}
            setDifficulty={setDifficulty}
            showThreeD={showThreeD}
            toggleThreeD={toggleThreeD}
          />

          <div className="board-container">
            {showThreeD ? (
              <ThreeDScene 
                board={gameState.board} 
                onCellClick={handleCellClick} 
                winningLine={gameState.winningLine}
                scores={scores}
              />
            ) : (
              <Board 
                board={gameState.board}
                onCellClick={handleCellClick}
                winningLine={gameState.winningLine}
              />
            )}
          </div>

          <motion.button 
            id="reset" 
            onClick={resetGame}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            New Game
          </motion.button>
        </div>
        
      </motion.div>
      <Footer />
      
      <AnimatePresence>
        {gameState.winner && (
          <WinModal 
            winner={gameState.winner} 
            resetGame={resetGame} 
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default App;