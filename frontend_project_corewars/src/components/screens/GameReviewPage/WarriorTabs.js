import React from "react";

function WarriorTabs({ currentWarrior, setCurrentWarrior }) {
  const warriorCode = {
    "Warrior 1": "Code for Warrior 1...",
    "Warrior 2": "Code for Warrior 2...",
  };

  return (
    <div className="warrior-tabs">
      <div className="tab-buttons">
        {Object.keys(warriorCode).map((warrior) => (
          <button
            key={warrior}
            className={currentWarrior === warrior ? "active" : ""}
            onClick={() => setCurrentWarrior(warrior)}
          >
            {warrior}
          </button>
        ))}
      </div>
      <div className="code-display">
        <pre>{warriorCode[currentWarrior]}</pre>
      </div>
    </div>
  );
}

export default WarriorTabs;
