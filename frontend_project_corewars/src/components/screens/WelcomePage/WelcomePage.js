import React from "react";
import "./WelcomePage.css";

import { Link } from "react-router-dom";

const WelcomePage = () => {
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
        <Link to="/login">
          <div className="button">Login</div>
        </Link>
        <Link to="/register">
          <div className="button">Sign up</div>
        </Link>
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
