export default function ErrorPage({errorMessage, onRestart}) {
  return (
    <div id="game-over" className="error-page">
      <h2>An error has occurred, try later</h2>
      {/* <p>{errorMessage}</p> */}
      <p>
        <button onClick={onRestart}>Restart</button>
      </p>
    </div>
  )
}