import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../Header";
import GameList from "./GameList";
import axios from "axios";

import "./styles.css";

const HistoryPage = () => {
  const [games, setGames] = useState([]);
  const [gamesWon, setGamesWon] = useState(0);
  const [gamesLost, setGamesLost] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const user_id = localStorage.getItem("user_id");
        if (!user_id) {
          navigate('/');
          return;
        }
        const response = await axios.get('http://127.0.0.1:5000/user_info', {
          params: {
            id: user_id
          }
        });
        setGamesWon(response.data.won);
        setGamesLost(response.data.lost);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };
    const fetchGames = async () => {
      try {
        const user_id = localStorage.getItem("user_id");
        if (!user_id) {
          navigate('/');
        }
        const response = await axios.get('http://127.0.0.1:5000/get_games', {
          params: {
            user_id : user_id
          }
        }, []);
        setGames(response.data);
      } catch (error) {
        console.error("Error fetching games:", error);
      }
    };
    const fetchData = async () => {
      await fetchUserInfo();
      await fetchGames();
      setLoading(false);
    };
    fetchData();
  }, [navigate]);

  const handleShowGame = (game) => {
    navigate("/game-review", {state: {game_id: game.id}});
  };

  /*const gamesWon = games.filter((game) => game.result === "won").length;
  const gamesLost = games.filter((game) => game.result === "lost").length;*/
  if (loading) {
    return (
      <div className="body">
        <Header />
        <h1 className="title">History</h1>
        <p className="loading">Loading...</p>
      </div>
    );
  }
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
