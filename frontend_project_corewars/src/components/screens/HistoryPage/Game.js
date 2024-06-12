import React from "react";

const Game = ({ game, onShow, game_number }) => (
  <div className="warrior-block">
    <h2>Game {game_number}</h2>
    <div className="stats">
      <p>
        <div className="wl_block">
          <span className="label1">{game.warrior_1_name}</span>
          <span className="win_warrior1">{game.warrior_1_wins} wins</span> <br />
        </div>
        <div className="wl_block">
          <span className="label2">{game.warrior_2_name}</span>
          <span className="win_warrior2">{game.warrior_2_wins} wins</span>
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
