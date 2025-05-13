import botImage from "../assets/bot.png"

export default function GameBoard({ board }) {
  return (
      <div id="board">
        <ol id="game-board">
          {board.map((row, rowIndex) => (
            <li key={rowIndex}>
              <ol>
                {row.map((col, colIndex) => (
                  <li className="box" key={colIndex}>
                    <button>
                    </button>
                  </li>
                ))}
              </ol>
            </li>
          ))}
        </ol>
      </div>
  );
}
