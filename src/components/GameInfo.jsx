import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaCircle, FaEquals } from 'react-icons/fa';

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
          <motion.button 
            className={`view-mode-btn ${showThreeD ? 'active' : ''}`}
            onClick={toggleThreeD}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {showThreeD ? '3D View' : '2D View'}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default GameInfo;
