import React, { useState } from "react";
import WarriorTick from "./WarriorTick";

const WarriorsTickList = ({ warriors, selectedWarrior, onTick }) => {

  return (
    <div className="warrior-list">
      {warriors.length === 0 ? (
        <p className="yet">You have no warriors able to game now.</p>
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
