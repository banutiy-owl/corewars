import React, { useState } from "react";
import WarriorTick from "./WarriorTick";

const WarriorsTickList = ({ warriors, selectedWarrior, onTick }) => {
  const [tickedWarriorId, setTickedWarriorId] = useState(null);

  const handleTick = (warriorId) => {
    setTickedWarriorId(warriorId);
  };

  return (
    <div className="warrior-list">
      {warriors.length === 0 ? (
        <p>You have no warriors under your command yet.</p>
      ) : (
        warriors
          .filter((warrior) => !warrior.busy)
          .map((warrior) => (
            <WarriorTick
              key={warrior.id}
              warrior={warrior}
              selectedWarrior={selectedWarrior}
              onTick={onTick}
            />
          ))
      )}
    </div>
  );
};

export default WarriorsTickList;
