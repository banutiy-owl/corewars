import React from "react";
import { useNavigate } from "react-router-dom";

import "./WelcomePage.css";

const WelcomePage = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login"); 
  };

  const handleSignupClick = () => {
    navigate("/register");
  };
  return (
    <div className="container">
      <div className="header">
        <div className="text">
          Welcome to
        </div>
        <div className="text">
        COREWARS
        </div>
        <div className="underline"></div>
      </div>
      <div className="submit-container">
        <div className="button" onClick={handleLoginClick}>Login</div> {/* Use onClick event handler */}
        <div className="button" onClick={handleSignupClick}>Sign up</div> {/* Use onClick event handler */}
      </div>

      <div className="description-text">
        Core Wars is a programming game in which two or more programs run in a
        simulated computer with the goal of terminating every other program and
        surviving as long as possible.
      </div>
    </div>
  );
};

export default WelcomePage;
