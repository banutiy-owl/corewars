import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

import "./styles.css";
import homeIcon from './assets/home.png';
import historyIcon from './assets/history-w.png';
import newGameIcon from './assets/game.png';
import warriorsIcon from './assets/warrior.png';
import logoutIcon from './assets/logout.png';


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
    localStorage.clear();
  };

  const getButtonClass = (path) => {
    return location.pathname === path ? "header-btn active" : "header-btn";
  };

  return (
    <header>
      <div className="left">
        <button className={getButtonClass("/home")} onClick={handleHomeClick}>
        <img src={homeIcon} alt="Home" className="icon" /> Home
        </button>
      </div>
      <div className="right">
        <button
          className={getButtonClass("/warriors")}
          onClick={handleWarriorsClick}
        >
          <img src={warriorsIcon} alt="Warriors" className="icon" /> Warriors
        </button>
        <button className={getButtonClass("/new-game")} onClick={handleNewGame}>
        <img src={newGameIcon} alt="New Game" className="icon" /> New Game
        </button>
        <button
          className={getButtonClass("/history")}
          onClick={handleHistoryClick}
        >
          <img src={historyIcon} alt="History" className="icon" /> History
        </button>
        <button className="header-btn" onClick={handleLogOut}>
        <img src={logoutIcon} alt="Logout" className="icon" /> Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
