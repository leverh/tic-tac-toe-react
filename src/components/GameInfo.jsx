import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaCircle, FaEquals } from 'react-icons/fa';
import '../styles/index1.css';

const GameInfo = ({ 
  currentPlayer, 
  winner, 
  scores, 
  difficulty, 
  setDifficulty,
  showThreeD,
  toggleThreeD
}) => {
  let statusText;
  let statusClass;

  if (winner === 'X') {
    statusText = 'You won!';
    statusClass = 'player-turn';
  } else if (winner === 'O') {
    statusText = 'AI won!';
    statusClass = 'computer-turn';
  } else if (winner === 'draw') {
    statusText = "It's a draw!";
    statusClass = 'draw';
  } else {
    statusText = currentPlayer === 'X' ? 'Your turn (X)' : "AI's turn (O)";
    statusClass = currentPlayer === 'X' ? 'player-turn' : 'computer-turn';
  }

  const scoreTransition = {
    initial: { opacity: 0, scale: 0.8, y: -10 },
    animate: { opacity: 1, scale: 1.2, y: 0 },
    exit: { opacity: 0, scale: 0.8, y: -10 },
    transition: { duration: 0.4 }
  };

  return (
  <motion.div 
    className="game-info"
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.2 }}
  >
    <div className={`status ${statusClass}`}>{statusText}</div>

    <motion.div 
      className="scoreboard glass"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      {[ 
        { label: 'You (X)', icon: <FaTimes color="#3498db" />, score: scores.X },
        { label: 'AI (O)', icon: <FaCircle color="#e74c3c" />, score: scores.O },
        { label: 'Draws', icon: <FaEquals color="#95a5a6" />, score: scores.draws }
      ].map(({ label, icon, score }) => (
        <motion.div 
          className="score-item neon"
          key={label}
          whileHover={{ scale: 1.05 }}
        >
          <div className="score-label">{icon} {label}</div>
          <AnimatePresence mode="wait">
            <motion.div
              key={score}
              className="score-value gradient"
              initial={scoreTransition.initial}
              animate={scoreTransition.animate}
              exit={scoreTransition.exit}
              transition={scoreTransition.transition}
            >
              {score}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      ))}
    </motion.div>

    <motion.div 
      className="control-panel"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
    >
      <div className="difficulty">
        <p className="difficulty-label">AI Difficulty:</p>
        <div className="btn-group">
          {['easy', 'medium', 'hard'].map((level) => (
            <motion.button 
              key={level}
              className={`difficulty-btn ${difficulty === level ? 'active' : ''}`}
              onClick={() => setDifficulty(level)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="view-mode">
        <p className="view-mode-label">Game View:</p>
        <>
          <motion.button 
            className={`view-mode-btn ${showThreeD ? 'active' : ''}`}
            onClick={toggleThreeD}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {showThreeD ? '3D View' : '2D View'}
          </motion.button>

          {showThreeD && (
  <motion.div
    className="rotate-hint"
    style={{
      fontSize: "1.3rem",
      color: "#1E293B",
      textShadow: "0 0 8px rgba(165, 145, 255, 0.4)",
      marginTop: "1.5rem",
      fontWeight: 500,
      letterSpacing: "0.03rem",
      background: "rgba(255, 255, 255, 0.1)",
      backdropFilter: "blur(5px)",
      WebkitBackdropFilter: "blur(5px)",
      padding: "0.8rem 1.2rem",
      borderRadius: "2rem",
      border: "1px solid rgba(255, 255, 255, 0.08)",
      display: "inline-flex",
      alignItems: "center",
      maxWidth: "fit-content",
      boxShadow: "0 0.2rem 0.8rem rgba(0, 0, 0, 0.1)"
    }}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 1.2 }}
    whileHover={{ 
      scale: 1.05,
      y: -2, 
      boxShadow: "0 0.4rem 1rem rgba(0, 0, 0, 0.15)",
      background: "rgba(255, 255, 255, 0.15)"
    }}
  >
    <span style={{ marginRight: "8px" }}>✋</span> Drag to explore 3D view
  </motion.div>
)}
        </>
      </div>
    </motion.div>
  </motion.div>
);
}

export default GameInfo;
