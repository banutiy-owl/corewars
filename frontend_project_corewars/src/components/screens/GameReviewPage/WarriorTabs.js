import React from "react";

function WarriorTabs({ currentWarrior, setCurrentWarrior, warriors }) {

  const getButtonStyle = (warrior) => {
    if (currentWarrior === warrior) {
      return warrior === "Warrior 1" ? { backgroundColor: "#f03838" } : { backgroundColor: "#4d27c9" };
    }
    return {};
  };

  return (
    <div className="warrior-tabs">
      <div className="tab-buttons">
        {Object.keys(warriors).map((warrior) => (
          <button
            key={warrior}
            className={currentWarrior === warrior ? "active" : ""}
            onClick={() => setCurrentWarrior(warrior)}
            style={getButtonStyle(warrior)}
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
