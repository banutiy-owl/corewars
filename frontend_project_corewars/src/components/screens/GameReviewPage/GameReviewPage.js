import React, { useState, useEffect } from "react";
import Header from "./Header"; // Adjust the import path as necessary
import WarriorTabs from "./WarriorTabs"; // Ensure this component is defined
import Grid from "./GridDisplay"; // Ensure this component is defined
import "./styles.css"; // Ensure this CSS file contains the necessary styles

function GameReviewPage() {
  const [round, setRound] = useState(1);
  const [winner, setWinner] = useState("Warrior 1");
  const [cycle, setCycle] = useState(1564);
  const [wins, setWins] = useState({ warrior1: 3, warrior2: 7 });
  const [currentWarrior, setCurrentWarrior] = useState("Warrior 1");
  const [gridColors, setGridColors] = useState([]);

  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  useEffect(() => {
    // Generate random colors for each cell in the grid
    const colors = Array.from({ length: 80000 }, () => ({
      background: getRandomColor(),
      border: getRandomColor(),
    }));
    setGridColors(colors);
  }, []);

  const handleRoundChange = (increment) => {
    setRound((prevRound) => {
      const newRound = prevRound + increment;
      if (newRound < 1 || newRound > 10) return prevRound;
      // Placeholder logic for updating state:
      setCycle(1000 + newRound * 100);
      setWinner(newRound % 2 === 0 ? "Warrior 1" : "Warrior 2");
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default GameReviewPage;
