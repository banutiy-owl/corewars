import React from "react";

const Game = ({ game, onShow }) => (
  <div className="warrior-block">
    <h2>{game.name}</h2>
    <div className="stats">
      <p>
        <div className="wl_block">
          <span className="label1">Warrior 1:</span>
          <span className="win_warrior1">{game.warrior1_wins} wins</span> <br />
        </div>
        <div className="wl_block">
          <span className="label2">Warrior 2:</span>
          <span className="win_warrior2">{game.warrior2_wins} wins</span>
        </div>
      </p>
    </div>
    
    <div className="actions">
      <button
        className="show"
        onClick={() => onShow(game)}
      >
        Show
      </button>
    
    </div>
  </div>
);

export default Game;
