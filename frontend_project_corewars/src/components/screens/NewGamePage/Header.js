import React from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate("/home");
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
        <button className="header-btn">History</button>
      </div>
    </header>
  );
};

export default Header;
