import React from "react";

function WarriorTabs({ currentWarrior, setCurrentWarrior }) {
  const warriorCode = {
    "Warrior 1": "Code for Warrior 1...", // tutaj kod
    "Warrior 2": "Code for Warrior 2...", //tutaj kod
  };


  const getButtonStyle = (warrior) => {
    if (currentWarrior === warrior) {
      return warrior === "Warrior 1" ? { backgroundColor: "#f03838" } : { backgroundColor: "#4d27c9" };
    }
    return {};
  };

  return (
    <div className="warrior-tabs">
      <div className="tab-buttons">
        {Object.keys(warriorCode).map((warrior) => (
          <button
            key={warrior}
            className={currentWarrior === warrior ? "active" : ""}
            onClick={() => setCurrentWarrior(warrior)}
            style={getButtonStyle(warrior)}
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
