import { motion } from 'framer-motion';

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

  return (
    <motion.div 
      className="game-info"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className={`status ${statusClass}`}>
        {statusText}
      </div>
      
      <motion.div 
        className="scoreboard"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="score-item">
          <span className="score-label">You (X):</span>
          <motion.span 
            className="score-value"
            key={scores.X}
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.5 }}
          >
            {scores.X}
          </motion.span>
        </div>
        
        <div className="score-item">
          <span className="score-label">AI (O):</span>
          <motion.span 
            className="score-value"
            key={scores.O}
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.5 }}
          >
            {scores.O}
          </motion.span>
        </div>
        
        <div className="score-item">
          <span className="score-label">Draws:</span>
          <motion.span 
            className="score-value"
            key={scores.draws}
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.5 }}
          >
            {scores.draws}
          </motion.span>
        </div>
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