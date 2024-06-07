import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import WarriorList from "./WarriorList";

import "./styles.list.css";

const WarriorsPage = () => {
  const [warriors, setWarriors] = useState([
    { id: 1, name: "Warrior 1", busy: true, won: 2, lost: 1 },
    { id: 2, name: "Warrior 2", busy: false, won: 1, lost: 3 },
  ]);
  const navigate = useNavigate();

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
