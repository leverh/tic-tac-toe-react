const Cell = ({ value, onClick, isWinning }) => {
  return (
    <button
      className={`but ${value === 'X' ? 'blue' : value === 'O' ? 'red' : ''} ${isWinning ? 'winning-cell' : ''}`}
      onClick={onClick}
      aria-label={`${value || 'Empty'} cell`}
    >
      {value}
    </button>
  );
};

export default Cell;