import { useEffect, useRef, useState } from "react";

import GameBoard from "./components/GameBoard";
import Player from "./components/Player";
import Log from "./components/Log";
import { WINNING_COMBINATIONS } from "./winning-combinations";
import GameOver from "./components/GameOver";
import { setTurn } from "./http";
import ThinkModal from "./components/Thinking/ThinkModal";
import ErrorPage from "./components/ErrorPage";

const PLAYERS = {
  X: "Player 1",
  O: "IA",
};

const initialGameBoard = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

function deriveActivePlayer(gameTurns) {
  let currentPlayer = "X";

  if (gameTurns.length > 0 && gameTurns[0].player === "X") {
    currentPlayer = "O";
  }

  return currentPlayer;
}

function deriveGameBoard(gameTurns) {
  let gameBoard = [...initialGameBoard.map((array) => [...array])];

  for (const turn of gameTurns) {
    const { square, player } = turn;
    const { row, col } = square;

    gameBoard[row][col] = player;
  }

  return gameBoard;
}

function deriveWinner(gameBoard, players) {
  let winner = null;

  for (const combination of WINNING_COMBINATIONS) {
    const firstSquareSymbol =
      gameBoard[combination[0].row][combination[0].column];
    const secondSquareSymbol =
      gameBoard[combination[1].row][combination[1].column];
    const thirdSquareSymbol =
      gameBoard[combination[2].row][combination[2].column];

    if (
      firstSquareSymbol &&
      firstSquareSymbol === secondSquareSymbol &&
      firstSquareSymbol === thirdSquareSymbol
    ) {
      winner = players[firstSquareSymbol];
    }
  }

  return winner;
}

function App() {
  const [gameTurns, setGameTurns] = useState([]);
  const [players, setPlayers] = useState(PLAYERS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const dialog = useRef();

  useEffect(() => {
    if (loading) {
      dialog.current.showModal();
    } else {
      dialog.current.close();
    }
  }, [loading]);

  const activePlayer = deriveActivePlayer(gameTurns);
  const gameBoard = deriveGameBoard(gameTurns);
  const winner = deriveWinner(gameBoard, players);
  const hasDraw = gameTurns.length === 9 && !winner;

  function handleSelectSquare(rowIndex, colIndex) {
    setGameTurns((prevTurns) => {
      const currentPlayer = deriveActivePlayer(prevTurns);

      const updatedTurns = [
        { square: { row: rowIndex, col: colIndex }, player: currentPlayer },
        ...prevTurns,
      ];
      callApi(updatedTurns, currentPlayer);
      return updatedTurns;
    });
  }

  async function callApi(turn, player) {
    const currentBoard = deriveGameBoard(turn);
    const isWinner = deriveWinner(currentBoard, players);

    const draw = currentBoard.every((row) => row.every((move) => move != null));

    try {
      setLoading(true);
      if (!isWinner && !draw && player === "X") {
        const response = await setTurn(currentBoard);
        if (response.error) {
          console.error("Error desde la API:", response.error);
          setError(response.error);
          return;
        }
        const { row, col } = response;
        handleSelectSquare(row, col);
      }
    } catch (error) {
      console.error("Error de red o inesperado:", error);
      setError(error.message || "Error desconocido");
    } finally {
      setLoading(false);
    }
  }

  function handleRestart() {
    setGameTurns([]);
    if (error) {
      setError(false)
    }
  }

  function handlePlayerNameChange(symbol, newName) {
    setPlayers((prevPlayers) => {
      return {
        ...prevPlayers,
        [symbol]: newName,
      };
    });
  }

  return (
    <main>
      <div id="game-container">
        <ol id="players" className="highlight-player">
          <Player
            name="Player 1"
            symbol="X"
            isActive={activePlayer === "X"}
            onChangeName={handlePlayerNameChange}
          />
          <Player
            name="IA"
            symbol="O"
            isActive={activePlayer === "O"}
            onChangeName={handlePlayerNameChange}
          />
        </ol>
        {(winner || hasDraw) && (
          <GameOver winner={winner} onRestart={handleRestart} />
        )}
        {error && <ErrorPage errorMessage={error} onRestart={handleRestart} />}
        <GameBoard
          onSelectSquare={handleSelectSquare}
          board={gameBoard}
          activePlayer={activePlayer}
        />
        <ThinkModal ref={dialog} />
      </div>
      <Log turns={gameTurns} />
    </main>
  );
}

export default App;
