import { useState } from 'react'
import Restart from './components/Restart'
import GameBoard from './components/GameBoard'
import Results from './components/Results';

const initialGameBoard = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

function App() {

  return (
    <section className='tic-tac-toe'>
      <Restart />
      <GameBoard board={initialGameBoard}/>
      <Results />
    </section>
  )
}

export default App
