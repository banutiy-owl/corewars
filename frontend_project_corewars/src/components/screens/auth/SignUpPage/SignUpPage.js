import { React, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../this.auth.css";
import {
  handleSignUp,
  handleUsernameChange,
  handleEmailChange,
  handlePasswordChange,
} from "../eventHandlers";

import user_icon from "../../../assets/person.png";
import email_icon from "../../../assets/email.png";
import password_icon from "../../../assets/password.png";
//import eye_opened from "../../assets/eye_opened.png";
import eye_opened_purple from "../../../assets/eye_opened_purple.png";
import eye_closed from "../../../assets/eye_closed.png";

import { Link } from "react-router-dom";

const SignUpPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordRepeat, setShowPasswordRepeat] = useState(false);

  const [isFocusedUsername, setIsFocusedUsername] = useState(false);
  const [isFocusedEmail, setIsFocusedEmail] = useState(false);
  const [isFocusedPassword, setIsFocusedPassword] = useState(false);
  const [isFocusedPasswordRepeat, setIsFocusedPasswordRepeat] = useState(false);

  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [passwordRepeat, setPasswordRepeat] = useState("");
  const [passwordErrorRepeat, setPasswordErrorRepeat] = useState("");

  const handleFocusUsername = () => {
    setIsFocusedUsername(true);
    setIsFocusedEmail(false);
    setIsFocusedPassword(false);
  };

  const handleFocusEmail = () => {
    setIsFocusedUsername(false);
    setIsFocusedEmail(true);
    setIsFocusedPassword(false);
    setIsFocusedPasswordRepeat(false);
  };

  const handleFocusPassword = () => {
    setIsFocusedUsername(false);
    setIsFocusedEmail(false);
    setIsFocusedPassword(true);
    setIsFocusedPasswordRepeat(false);
  };

  const handleFocusPasswordRepeat = () => {
    setIsFocusedUsername(false);
    setIsFocusedEmail(false);
    setIsFocusedPassword(false);
    setIsFocusedPasswordRepeat(true);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const togglePasswordRepeatVisibility = () => {
    setShowPasswordRepeat(!showPasswordRepeat);
  };

  const handleSignUpWrapper = async () => {
    const signUpSuccess = await handleSignUp(
      username,
      email,
      password,
      passwordRepeat,
      setUsernameError,
      setEmailError,
      setPasswordError,
      setPasswordErrorRepeat
    );

    if (signUpSuccess) {
      navigate("/home");
    }
  };

  return (
    <div className="container">
      <div className="header">
        <div className="text">Sign Up</div>
        <div className="underline"></div>
      </div>
      <div className="inputs">
        <div className={`input ${isFocusedUsername ? "focused-username" : ""}`}>
          <img src={user_icon} alt="" />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onFocus={handleFocusUsername}
            onChange={(event) =>
              handleUsernameChange(event, setUsername, setUsernameError)
            }
          />
        </div>
        {usernameError && <div className="error-message">{usernameError}</div>}
        <div className={`input ${isFocusedEmail ? "focused-email" : ""}`}>
          <img src={email_icon} alt="" />
          <input
            type="email"
            placeholder="Email"
            onFocus={handleFocusEmail}
            value={email}
            onChange={(event) =>
              handleEmailChange(event, setEmail, setEmailError)
            }
          />
        </div>
        {emailError && <div className="error-message">{emailError}</div>}
        <div className={`input ${isFocusedPassword ? "focused-password" : ""}`}>
          <img src={password_icon} alt="" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            onFocus={handleFocusPassword}
            value={password}
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

        <div
          className={`input ${
            isFocusedPasswordRepeat ? "focused-password-repeat" : ""
          }`}
        >
          <img src={password_icon} alt="" />
          <input
            type={showPasswordRepeat ? "text" : "password"}
            placeholder="Repeat password"
            onFocus={handleFocusPasswordRepeat}
            value={passwordRepeat}
            onChange={(event) =>
              handlePasswordChange(
                event,
                setPasswordRepeat,
                setPasswordErrorRepeat
              )
            }
          />
          <img
            src={showPasswordRepeat ? eye_opened_purple : eye_closed}
            alt=""
            className="eye-icon"
            onClick={togglePasswordRepeatVisibility}
          />
        </div>
        {passwordErrorRepeat && (
          <div className="error-message">{passwordErrorRepeat}</div>
        )}
      </div>
      <div className="submit-container">
        <div
          className="button"
          onClick={handleSignUpWrapper}
        >
          Sign up
        </div>
      </div>
      <div className="have-account">
        Already have an account?{" "}
        <Link className="link" to="/login">
          <span>Login</span>
        </Link>
      </div>
    </div>
  );
};

export default SignUpPage;
