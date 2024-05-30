// src/components/NewWarrior.js
import React, { useState } from "react";

const NewWarrior = ({ onAdd }) => {
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name) {
      onAdd(name);
      setName("");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      
    </form>
  );
};

export default NewWarrior;
