import React from "react";

function WarriorTabs({ currentWarrior, setCurrentWarrior, warriors }) {
  /*const warriorCode = {
    "Warrior 1": "Code for Warrior 1...",
    "Warrior 2": "Code for Warrior 2...",
  };*/

  return (
    <div className="warrior-tabs">
      <div className="tab-buttons">
        {Object.keys(warriors).map((warrior) => (
          <button
            key={warrior}
            className={currentWarrior === warrior ? "active" : ""}
            onClick={() => setCurrentWarrior(warrior)}
          >
            {warriors[warrior].name}
          </button>
        ))}
      </div>
      <div className="code-display">
        <pre>{warriors[currentWarrior]?.code}</pre>
      </div>
    </div>
  );
}

export default WarriorTabs;
