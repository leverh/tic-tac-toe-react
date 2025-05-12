import React from 'react';
import Cell from './Cell';

const Board = ({ board, onCellClick, winningLine }) => {
  const isWinningCell = (index) => {
    return winningLine ? winningLine.includes(index) : false;
  };
  
  return (
    <div className="game">
      {board.map((value, index) => (
        <Cell
          key={index}
          value={value}
          onClick={() => onCellClick(index)}
          isWinning={isWinningCell(index)}
        />
      ))}
    </div>
  );
};

export default Board;