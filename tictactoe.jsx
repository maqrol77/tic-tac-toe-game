const Board = ({ onWin }) => {
  const [player, setPlayer] = React.useState(1);
  const [gameState, setGameState] = React.useState([]);
  const [status, setStatus] = React.useState("No Winner Yet");
  const [gameOver, setGameOver] = React.useState(false); // New state variable

  React.useEffect(() => {
    const winner = checkForWinner(gameState);
    setStatus(winner);
    if (winner !== "No Winner Yet" && winner !== "Draw" && !gameOver) { // Check if game is not over
      onWin(winner);
      setGameOver(true); // Set game over once the winner is determined
    }
  }, [gameState, onWin, gameOver]); // Include gameOver in the dependency array

  const takeTurn = (id) => {
    if (status !== "No Winner Yet" || gameOver) return; // Check if game is not over
    setGameState([...gameState, { id: id, player: player }]);
    setPlayer((player + 1) % 2);
  };

  const resetGame = () => {
    setGameState([]);
    setPlayer(1);
    setStatus("No Winner Yet");
    setGameOver(false); // Reset game over state
  };

  React.useEffect(() => {
    setStatus(checkForWinner(gameState));
  }, [gameState]);

  function renderSquare(i) {
    return (
      <Square
        key={i}
        takeTurn={takeTurn}
        id={i}
        player={player}
        gameState={gameState}
      />
    );
  }

  return (
    <div className="game-board">
      <div className="grid-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="grid-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="grid-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
      <div id="info">
        <h1 id="turn">Next Player: {player === 0 ? "Player O" : "Player X"}</h1>
        <h1>Winner is: {status}</h1>
      </div>
      <div className="reset-button-container">
        <button className="reset-button" onClick={resetGame}>
          Reset Game
        </button>
      </div>
    </div>
  );
};

const Square = ({ takeTurn, id, player, gameState }) => {
  const mark = ["O", "X"];
  const isFilled = gameState.some((item) => item.id === id);
  const filledByPlayer = gameState.find((item) => item.id === id)?.player;

  const handleClick = () => {
    if (isFilled || gameState.length === 9) return;
    takeTurn(id);
  };

  return (
    <button
      className={isFilled ? (filledByPlayer === 0 ? "red" : "white") : ""}
      onClick={handleClick}
    >
      {isFilled && <h1 className="mark">{mark[filledByPlayer]}</h1>}
    </button>
  );
};

const Game = () => {
  const [xWins, setXWins] = React.useState(0);
  const [oWins, setOWins] = React.useState(0);

  const handleWin = (winner) => {
    if (winner === "Player X") {
      setXWins(xWins + 1);
    } else if (winner === "Player O") {
      setOWins(oWins + 1);
    }
  };

  return (
    <div className="game">
      <div className="counter">
      <h2 style={{ color: "red" }}>O Wins: {oWins}</h2>
      <h2 style={{ color: "blue" }}>X Wins: {xWins}</h2>
      </div>
      <Board onWin={handleWin} />
    </div>
  );
};

const win = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const checkForWinner = (gameState) => {
  if (gameState.length < 5) return "No Winner Yet";
  let p0 = gameState.filter((item) => item.player === 0).map((item) => item.id);
  let pX = gameState.filter((item) => item.player === 1).map((item) => item.id);

  for (let i = 0; i < win.length; i++) {
    let [a, b, c] = win[i];
    if (p0.includes(a) && p0.includes(b) && p0.includes(c)) {
      return "Player O";
    }
    if (pX.includes(a) && pX.includes(b) && pX.includes(c)) {
      return "Player X";
    }
  }

  if (gameState.length === 9) return "Draw";
  return "No Winner Yet";
};

ReactDOM.render(<Game />, document.getElementById("root"));
