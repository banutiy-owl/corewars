import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import WarriorsTickList from "./WarriorsTickList";

import "./styles.css";

const NewGamePage = () => {
  const [warriors, setWarriors] = useState([
    { id: 1, name: "Warrior 1", busy: true, won: 2, lost: 1 },
    { id: 3, name: "Warrior 3", busy: false, won: 2, lost: 1 },
    { id: 2, name: "Warrior 2", busy: false, won: 1, lost: 3 },
  ]);
  const navigate = useNavigate();

  const [selectedWarrior, setSelectedWarrior] = useState(null);

  const handleTick = (id) => {
    setSelectedWarrior(selectedWarrior === id ? null : id);
  };

  const handleStartNewGame = () => {
    navigate("/game-review");
  };

  return (
    <div className="body">
      <Header />
      <h1 className="title">Choose your warrior</h1>

      <WarriorsTickList
        warriors={warriors}
        selectedWarrior={selectedWarrior}
        onTick={handleTick}
      />
      <button className="new-game-btn" onClick={handleStartNewGame}>
        Go
      </button>
    </div>
  );
};

export default NewGamePage;
