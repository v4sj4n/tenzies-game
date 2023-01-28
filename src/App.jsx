import { useState, useEffect } from 'react'
import Die from './Die'
import { nanoid } from 'nanoid'
import Confetti from 'react-confetti'

export default function App() {
  const [dice, setDice] = useState(allNewDice)
  const [tenzies, setTenzies] = useState(false)
  const [bestGame, setBestGame] = useState(
    JSON.parse(localStorage.getItem('rolls')) || 0
  )
  const [currentRolls, setCurrentRolls] = useState(0)

  useEffect(() => {
    const allHeld = dice.every((die) => die.isHeld)
    const firstValue = dice[0].value
    const allSameValue = dice.every((die) => die.value === firstValue)
    if (allHeld && allSameValue) {
      setTenzies(true)
      console.log('You won!')
      if (bestGame == 0 || currentRolls < bestGame) {
        setBestGame(currentRolls)
        localStorage.setItem('rolls', JSON.stringify(currentRolls))
      }
    }
  }, [dice])

  function generateNewDie() {
    return {
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid(),
    }
  }

  function allNewDice() {
    const newDice = []
    for (let i = 0; i < 10; i++) {
      newDice.push(generateNewDie())
    }
    return newDice
  }
  const diceElements = dice.map((die) => (
    <Die
      value={die.value}
      key={die.id}
      isHeld={die.isHeld}
      holdDice={() => holdDice(die.id)}
    />
  ))
  const rollDice = () => {
    if (!tenzies) {
      setDice((oldDice) =>
        oldDice.map((die) => {
          return die.isHeld ? die : generateNewDie()
        })
      )
      setCurrentRolls((prevRolls) => prevRolls + 1)
    } else {
      setTenzies(false)
      setCurrentRolls(0)
      setDice(allNewDice())
    }
  }

  const holdDice = (id) => {
    setDice((oldDice) =>
      oldDice.map((die) => {
        return die.id === id ? { ...die, isHeld: !die.isHeld } : die
      })
    )
  }

  return (
    <main>
      {tenzies && <Confetti />}
      <h1 className="title">Tenzies</h1>
      <p className="instructions">
        Roll until all dice are the same. Click each die to freeze it at its
        current value between rolls.
      </p>
      <div className="dice-container">{diceElements}</div>
      <p>Current rolls: {currentRolls} </p>
      <button
        className="roll-dice"
        onClick={rollDice}
      >
        {!tenzies ? 'Roll' : 'New Game'}
      </button>
      <div className="best-game">
        {bestGame != 0 && (
          <p>
            Fewest rolls to win a game: <span id='best-game-n'>{bestGame}</span>{' '}
          </p>
        )}
      </div>
    </main>
  )
}
