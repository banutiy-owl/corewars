import React, { useState, useEffect } from "react";
import Header from "../../Header";
import WarriorTabs from "./WarriorTabs";
import Grid from "./GridDisplay";
import "./styles.css";

function GameReviewPage() {
  const [round, setRound] = useState(1);
  const [winner, setWinner] = useState("Warrior 1");
  const [cycle, setCycle] = useState(1564);
  const [wins, setWins] = useState({ warrior1: 3, warrior2: 7 });
  const [currentWarrior, setCurrentWarrior] = useState("Warrior 1");
  const [gridColors, setGridColors] = useState([]);

  const handleRoundChange = (increment) => {
    setRound((prevRound) => {
      const newRound = prevRound + increment; //dont touch
      if (newRound < 1 || newRound > 10) return prevRound; //dont touch
      setCycle(1000 + newRound * 100); //w ktorym cyklu wygral
      setWinner(newRound % 2 === 0 ? "Warrior 1" : "Warrior 2"); //kto wygral
      return newRound;
    });
  };

  return (
    <div className="game_container">
      <Header />
      <div className="game">
        <div className="memo">
          <WarriorTabs
            currentWarrior={currentWarrior}
            setCurrentWarrior={setCurrentWarrior}
          />
        </div>
        <div className="grid-section">

            <Grid round={round} gridColors={gridColors} />

         <div className="round-info">
            <button onClick={() => handleRoundChange(-1)}>{"<"}</button>
            <p>Round {round} of 10</p>
            <button onClick={() => handleRoundChange(1)}>{">"}</button>
          </div>
          <div className="winner-info">
            <p>
              Round winner: {winner} in {cycle} cycles
            </p>
            <p>Warrior 1: 3 wins</p> 
            <p>Warrior 2: 3 wins</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GameReviewPage;
