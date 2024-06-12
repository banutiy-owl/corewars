import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../Header";
import Popup from "../../Popup";
import WarriorsTickList from "./WarriorsTickList";
import axios from "axios";

import "./styles.css";
import config from "../../../config";

const NewGamePage = () => {
  const [warriors, setWarriors] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [isError, setIsError] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const [selectedWarrior, setSelectedWarrior] = useState(null);
  
  useEffect(() => {
    const fetchWarriors = async () => {
      try {
        const user_id = localStorage.getItem("user_id");
        if (!user_id) {
          navigate("/");
        }
        const response = await axios.get(config.getWarriorsUrl(), {
          params: {
            user_id : user_id
          }
        });
        setWarriors(response.data);
      } catch (error) {
        console.error("Error fetching warriors:", error);
        setIsError(true);
        setPopupMessage("Failed to fetch warriors. Please try again later.");
        setShowPopup(true);
      }
    };
    const fetchData = async () => {
      fetchWarriors();
      setLoading(false);
    };
    fetchData();
}, [navigate]);

  const handleTick = (id) => {
    setSelectedWarrior(selectedWarrior === id ? null : id);
  };

  const handleStartNewGame = async () => {
    try {
      setIsError(false);
      setPopupMessage("Loading...");
      setShowPopup(true);
      const response = await axios.post(config.getGameUrl(), {
        warrior_id: selectedWarrior
      });
      setIsError(true);
      setPopupMessage(response.data.message);
    } catch (error) {
      setPopupMessage(`Error starting new game: ${error.response.data.error}`);
      setShowPopup(true);
      setIsError(true);
    }
  };

  const handlePopupClose = () => {
    setShowPopup(false);
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="body">
        <Header />
        <h1 className="title">Choose your warrior</h1>
        <p className="loading">Loading...</p>
      </div>
    );
  }

  return (
    <div className="body">
      <Header />
      <h1 className="title">Choose your warrior</h1>

      <WarriorsTickList
        warriors={warriors}
        selectedWarrior={selectedWarrior}
        onTick={handleTick}
      />
      <button
        className="new-game-btn"
        onClick={handleStartNewGame}
        disabled={warriors.length === 0}
      >
        Go
      </button>
      {showPopup && (
        <Popup
          isError={isError}
          message={popupMessage}
          onClose={handlePopupClose}
        />
      )}
    </div>
  );
};

export default NewGamePage;
