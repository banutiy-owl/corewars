import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Header from "../../Header";
import Popup from "../../Popup";
import WarriorList from "./WarriorList";

import "./styles.css";
import config from "../../../config";

const WarriorsPage = () => {
  const [warriors, setWarriors] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [isError, setIsError] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

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
        setPopupMessage("Failed to fetch warriors. Please try again later.");
        setShowPopup(true);
        setIsError(true);
      }
    };
    const fetchData = async () => {
      fetchWarriors();
      setLoading(false);
    };
    fetchData();
}, [navigate]);


  const handleAddWarriorClick = () => {
    navigate("/add-warrior");
  };

  const handleEditWarrior = (warrior) => {
    navigate(`/edit-warrior`, {state: {warrior: warrior}});
  };

  const handleDeleteWarrior = async (warriorId) => {
    try {
      await axios.delete(`${config.getWarriorUrl()}/${warriorId}`);
      navigate('/warriors');
      setPopupMessage("Warrior deleted successfully.");
      setShowPopup(true);
      setIsError(true);
    } catch (error) {
      setPopupMessage("Error deleting warrior:", error);
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
        <h1 className="title">Warriors</h1>
        <p className="loading">Loading...</p>
      </div>
    );
  }

  return (
    <div className="body">
      <Header />
      <h1 className="title">Warriors</h1>
      <button className="add-warrior-btn" onClick={handleAddWarriorClick}>
        Add Warrior
      </button>
      <WarriorList
        warriors={warriors}
        onEdit={handleEditWarrior}
        onDelete={handleDeleteWarrior}
      />
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

export default WarriorsPage;
