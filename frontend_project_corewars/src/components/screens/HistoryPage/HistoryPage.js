import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../Header";
import GameList from "./GameList";
import axios from "axios";

import "./styles.css";

const HistoryPage = () => {
  const [games, setGames] = useState([]);
  const navigate = useNavigate();
  /*
  useEffect(() => {
    const fetchGames = async () => {
      try {
        const user_id = localStorage.getItem("user_id");
        if (!user_id) {
          navigate('/');
        }
        const response = await axios.get(`/get_games?user_id=${user_id}`);
        setGames(response.data);
      } catch (error) {
        console.error("Error fetching games:", error);
      }
    };

    fetchGames();
  });*/

  const handleShowGame = () => {
    navigate("/game-review");
  };

  const gamesWon = games.filter((game) => game.result === "won").length;
  const gamesLost = games.filter((game) => game.result === "lost").length;

  return (
    <div className="body">
      <Header />
      <h1 className="title">History</h1>
      <div className="games-statistics">
        <p className="won">Games won: {gamesWon}</p>
        <p className="lost">Games lost: {gamesLost}</p>
      </div>
      {games.length === 0 ? (
        <p className="yet">
          You don't have any games yet. Go to the "New game" page and start your
          record.
        </p>
      ) : (
        <GameList games={games} onShow={handleShowGame} />
      )}
    </div>
  );
};

export default HistoryPage;
