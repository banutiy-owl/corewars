import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

import "./styles.css";


const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

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

  const handleLogOut = () => {
    navigate("/");
  };

  const getButtonClass = (path) => {
    return location.pathname === path ? "header-btn active" : "header-btn";
  };

  return (
    <header>
      <div className="left">
        <button className={getButtonClass("/home")} onClick={handleHomeClick}>
          Home
        </button>
      </div>
      <div className="right">
        <button
          className={getButtonClass("/warriors")}
          onClick={handleWarriorsClick}
        >
          Warriors
        </button>
        <button className={getButtonClass("/new-game")} onClick={handleNewGame}>
          New Game
        </button>
        <button
          className={getButtonClass("/history")}
          onClick={handleHistoryClick}
        >
          History
        </button>
        <button className="header-btn" onClick={handleLogOut}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
