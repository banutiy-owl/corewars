import React, { useState } from "react";
import Header from "./Header";
import WarriorList from "./WarriorList";
import NewWarrior from "./NewWarrior";
import { addWarrior, editWarrior, deleteWarrior } from "./warriorService";
import "./styles.css";

const WarriorsPage = () => {
  const [warriors, setWarriors] = useState([
    { id: 1, name: "Warrior 1", busy: true, won: 2, lost: 1 },
    { id: 2, name: "Warrior 2", busy: false, won: 1, lost: 3 },
    ]);

  const handleAddWarrior = (name) => {
    const updatedWarriors = addWarrior(warriors, name);
    setWarriors(updatedWarriors);
  };

  const handleEditWarrior = (warrior) => {
    const updatedWarriors = editWarrior(warriors, warrior);
    setWarriors(updatedWarriors);
  };

  const handleDeleteWarrior = (id) => {
    const updatedWarriors = deleteWarrior(warriors, id);
    setWarriors(updatedWarriors);
  };

  return (
    <div className="body">
      <Header />
      <h1 className="title">Warriors</h1>
      <button className="add-warrior-btn">Add Warrior</button>
      <WarriorList
        warriors={warriors}
        onEdit={handleEditWarrior}
        onDelete={handleDeleteWarrior}
      />
    </div>
  );
};

export default WarriorsPage;
