import { React, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../this.auth.css";
import {
  handleSignIn,
  handleUsernameChange,
  handlePasswordChange,
} from "../eventHandlers";

import user_icon from "../../../assets/person.png";
import password_icon from "../../../assets/password.png";
//import eye_opened from "../../assets/eye_opened.png";
import eye_opened_purple from "../../../assets/eye_opened_purple.png";
import eye_closed from "../../../assets/eye_closed.png";

import { Link } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const [isFocusedUsername, setIsFocusedUsername] = useState(false);
  const [isFocusedPassword, setIsFocusedPassword] = useState(false);

  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleFocusUsername = () => {
    setIsFocusedUsername(true);
    setIsFocusedPassword(false);
  };

  const handleFocusPassword = () => {
    setIsFocusedUsername(false);
    setIsFocusedPassword(true);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSignInWrapper = async () => {
    const signInSuccess = await handleSignIn(
      username,
      password,
      setPasswordError
    );

    if (signInSuccess) {
      navigate("/home");
    }
  };

  return (
    <div className="container">
      <div className="header">
        <div className="text">Login</div>
        <div className="underline"></div>
      </div>
      <div className="inputs">
        <div className={`input ${isFocusedUsername ? "focused-username" : ""}`}>
          <img src={user_icon} alt="" />
          <input
            type="text"
            placeholder="Username"
            onFocus={handleFocusUsername}
            onChange={(event) =>
              handleUsernameChange(event, setUsername, setUsernameError)
            }
          />
        </div>
        {usernameError && <div className="error-message">{usernameError}</div>}
        <div className={`input ${isFocusedPassword ? "focused-password" : ""}`}>
          <img src={password_icon} alt="" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            onFocus={handleFocusPassword}
            onChange={(event) =>
              handlePasswordChange(event, setPassword, setPasswordError)
            }
          />
          <img
            src={showPassword ? eye_opened_purple : eye_closed}
            alt=""
            className="eye-icon"
            onClick={togglePasswordVisibility}
          />
        </div>
        {passwordError && <div className="error-message">{passwordError}</div>}
      </div>
      <div className="submit-container">
        <div
          className="button"
          onClick={handleSignInWrapper
          }
        >
          Login
        </div>
      </div>
      <div className="have-account">
        Don't have an account? {"  "}
        <Link className="link" to="/register">
          <span>Sign up</span>
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
