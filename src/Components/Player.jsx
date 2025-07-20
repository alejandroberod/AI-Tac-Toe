import { useState } from "react";

export default function Player({ name, symbol, isActive, onChangeName }) {
  const [playerName, setPlayerName] = useState(name)
  const [isEditing, setIsEditing] = useState(false);

  function handleEditClick() {
    setIsEditing((prevState) => !prevState);
    if (isEditing) {
      onChangeName(symbol, playerName)
    }
  }

  function handleChange(event) {
    console.log(event.target.target)
    setPlayerName(event.target.value)
  }

  let spanPlayerName = <span className="player-name">{playerName}</span>

  if (isEditing) {
    spanPlayerName = <input type="text" required value={playerName} onChange={handleChange}/>
  }

  return (
    <li className={`${isActive ? 'active' : undefined} ${name.toLowerCase() === 'ia' ? 'bot' : 'user'}` }>
      <span className="player">
        {spanPlayerName}
        <span className="player-symbol">{symbol}</span>
      </span>
      {name.toLowerCase() != 'ia' && <button onClick={handleEditClick}>{isEditing ? 'Save' : 'Edit'}</button>}
      
    </li>
  );
}
