import { useState } from "react";

function Square({ value, onSquareClick, isWinningSquare }) {
  return (
    <button className={"square" + (isWinningSquare ? " winning-square" : "")} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay, winningLine }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }

  // Status message updated to include draw case
   // Determine the current game status (winner, draw, or next player)
  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else if (squares.every(square => square !== null)) {
    status = "It's a draw!";
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  // Generate the board's rows and squares using nested loops
  const boardSize = 3;
  let rows = [];
  for (let i = 0; i < boardSize; i++) {
    let squaresInRow = [];
    for (let j = 0; j < boardSize; j++) {
      const index = i * boardSize + j;
      const isWinningSquare = winningLine && winningLine.includes(index);
      squaresInRow.push(
        <Square
          key={index}
          value={squares[index]}
          onSquareClick={() => handleClick(index)}
          isWinningSquare={isWinningSquare}
        />
      );
    }
    rows.push(<div className="board-row" key={i}>{squaresInRow}</div>);
  }

   // Return the board with status and rows
  return (
    <>
      <div className="status">{status}</div>
      {rows}
    </>
  );
}

export default function Game() {
   // State for history, currentMove, and sortAscending
  const [history, setHistory] = useState([{ squares: Array(9).fill(null), moveLocation: null }]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const current = history[currentMove];
  const currentSquares = current.squares;
   const [sortAscending, setSortAscending] = useState(true); 

   // Define a function to handle square clicks
  function handlePlay(nextSquares) {
    // handle square clicks
    const nextHistory = history.slice(0, currentMove + 1);
    // get the move location
    const moveLocation = getMoveLocation(nextSquares, currentSquares);
    // update the history
    setHistory([...nextHistory, { squares: nextSquares, moveLocation }]);
    // update the current move
    setCurrentMove(nextHistory.length);
  }

  // function to jump to a specific move
  function jumpTo(move) {
     // handle square clicks
    setCurrentMove(move);
  }

   // Map through the history to create a list of moves
  const moves = history.map((step, move) => {
    // Determine the description for each move
    const description = move ?
    // If there is a move location, include it in the description
      `Go to move #${move} (${step.moveLocation.join(", ")})` :
      "Start over";
      // Return a list item with a button
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

    // Calculate the winning line (if any)
  const winningLine = calculateWinner(currentSquares);

  // Return the Game component with the board, move history, and buttons
  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} winningLine={winningLine} />
      </div>
      <div className="game-info">
        <div className="move-number">You are at move #{currentMove}</div>
        <button onClick={() => setSortAscending(!sortAscending)}>
          Toggle Sort
        </button>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

// array of winning lines
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  // check if any winning line is filled with the same symbol
  for (let i = 0; i < lines.length; i++) {
    // destructure the line into a, b, and c
    const [a, b, c] = lines[i];
    // if all three squares are filled with the same symbol, return the symbol
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return lines[i];
    }
  }
  return null;
}

// getting the move location
function getMoveLocation(currentSquares, prevSquares) {
  // find the index of the changed square
  const index = currentSquares.findIndex((square, index) => square !== prevSquares[index]);
  // return the row and column numbers
  return [Math.floor(index / 3) + 1, index % 3 + 1];
}
