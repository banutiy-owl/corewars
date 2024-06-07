import React from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate("/home");
  };

  const handleHistoryClick = () => {
    navigate("/history");
  };

  const handleNewGame = () => {
    navigate("/new-game");
  };

  const handleWarriorsClick = () => {
    navigate("/warriors");
  };

  return (
    <header>
      <div className="left">
        <button className="header-btn" onClick={handleHomeClick}>
          Home
        </button>
      </div>
      <div className="right">
        <button className="header-btn" onClick={handleWarriorsClick}>
          Warriors
        </button>
        <button className="header-btn" onClick={handleNewGame}>
          New Game
        </button>
        <button className="header-btn" onClick={handleHistoryClick}>
          History
        </button>
      </div>
    </header>
  );
};

export default Header;
