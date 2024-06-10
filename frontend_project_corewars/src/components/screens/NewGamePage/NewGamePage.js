import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import WarriorsTickList from "./WarriorsTickList";
import axios from "axios";


import "./styles.css";

const NewGamePage = () => {
  const [warriors, setWarriors] = useState([]);
  const navigate = useNavigate();

  const [selectedWarrior, setSelectedWarrior] = useState(null);

  useEffect(() => {
    const fetchWarriors = async () => {
      try {
        const user_id = localStorage.getItem("user_id");
        if (!user_id) {
          navigate("/");
        }
        const response = await axios.get('http://127.0.0.1:5000/get_warriors', {
          params: {
            user_id : user_id
          }
        });
        setWarriors(response.data);
      } catch (error) {
        console.error("Error fetching warriors:", error);
      }
    };
  fetchWarriors();
}, []);

  const handleTick = (id) => {
    setSelectedWarrior(selectedWarrior === id ? null : id);
  };

  const handleStartNewGame = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/new_game', {
        warrior_id: selectedWarrior
      });
      console.log(response.data);
      window.location.reload();
    } catch (error) {
      console.error("Error starting new game:", error);
    }
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
