import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import GameList from "./GameList";

import "./styles.css";

const HistoryPage = () => {
  const [games, setGames] = useState([
    {
      id: 1,
      name: "Game 2",
      warrior1: "Warrior 1",
      warrior1_wins: 2,
      warrior2: "Warrior 2",
      warrior2_wins: 1,
    },
    {
      id: 2,
      name: "Game 1",
      warrior1: "Warrior 1",
      warrior1_wins: 1,
      warrior2: "Warrior 2",
      warrior2_wins: 3,
    },
  ]);
  const navigate = useNavigate();

  const handleShowGame = () => {
    navigate("/game-review");
  };

  return (
    <div className="body">
      <Header />
      <h1 className="title">History</h1>

      <GameList games={games} onShow={handleShowGame} />
    </div>
  );
};

export default HistoryPage;
