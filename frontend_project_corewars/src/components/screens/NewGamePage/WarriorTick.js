import React, { useState } from "react";

const WarriorTick = ({ warrior, selectedWarrior, onTick }) => {
  const handleTick = () => {
    onTick(warrior.id);
  };

  return (
    <div className="warrior-block">
      <h2>{warrior.name}</h2>
      <div className="stats">
        <p>
          <div className="wl_block">
            <span className="label">Won:</span>
            <span className="won">{warrior.won}</span> <br />
          </div>
          <div className="wl_block">
            <span className="label">Lost:</span>
            <span className="lost">{warrior.lost}</span>
          </div>
        </p>
      </div>
      <div className="status">
        <span className={`status ${warrior.busy ? "busy" : "free"}`}>
          {warrior.busy ? "Busy" : "Free"}
        </span>
      </div>
      <label className="checkbox-container">
        <input
          type="checkbox"
          checked={selectedWarrior === warrior.id}
          onChange={handleTick}
        />
        <span className="checkmark"></span>
      </label>
    </div>
  );
};

export default WarriorTick;
