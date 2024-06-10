import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import WarriorList from "./WarriorList";
import axios from "axios";

import "./styles.list.css";

const WarriorsPage = () => {
  const [warriors, setWarriors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWarriors = async () => {
      try {
        const user_id = localStorage.getItem("user_id");
        if (!user_id) {
          navigate("/");
        }
        const response = await axios.get(`/get_warriors?user_id=${user_id}`);
        setWarriors(response.data);
      } catch (error) {
        console.error("Error fetching warriors:", error);
      }
    };
  fetchWarriors();
});

  const handleAddWarriorClick = () => {
    navigate("/warrior");
  };

  const handleEditWarrior = () => {
    navigate("/warrior");
  };


  const handleDeleteWarrior = () => {};

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
    </div>
  );
};

export default WarriorsPage;
