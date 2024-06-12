import {
  validateUsername,
  validateEmail,
  validatePassword,
  validatePasswordRepeat,
} from "./formValidations";
import axios from 'axios';
import config from "../../../config";

export const handleSignUp = async (
  username,
  email,
  password,
  passwordRepeat,
  setUsernameError,
  setEmailError,
  setPasswordError,
  setPasswordRepeatError
) => {
  const usernameError = validateUsername(username);
  const emailError = validateEmail(email);
  const passwordError = validatePassword(password);
  const passwordRepeatError = validatePasswordRepeat(password, passwordRepeat);

  setUsernameError(usernameError);
  setEmailError(emailError);
  setPasswordError(passwordError);
  setPasswordRepeatError(passwordRepeatError);

  if (usernameError || emailError || passwordError || passwordRepeatError) {
    return false;
  }

  try {
    const response = await axios.post(config.getRegisterUrl(), {
      username,
      email,
      password,
      confirm_password: passwordRepeat
    });
    console.log(response.data.message);
    localStorage.setItem("user_id", response.data.user_id);
    localStorage.setItem("username", username);
    return true;
  } catch (error) {
    if (error.response) {
        const errorMessage = error.response.data.error;
        if (errorMessage.includes('username')) setUsernameError(errorMessage);
        else if (errorMessage.includes('email')) setEmailError(errorMessage);
        else if (errorMessage.includes('Password')) setPasswordError(errorMessage);
        else setPasswordRepeatError(errorMessage);
      }
      return false;
    }
};

export const handleSignIn = async (
  username,
  password,
  setPasswordError,
) => {
  try {
    const response = await axios.post(config.getLogingUrl(), {
      login: username,
      password: password,
    });
    console.log(response.data.message);
    localStorage.setItem("user_id", response.data.user_id);
    localStorage.setItem("username", username);
    return true;
  } catch (error) {
    setPasswordError(error.response.data.error);
    return false;
  }
};

export const handleUsernameChange = (event, setUsername, setUsernameError) => {
  setUsername(event.target.value);
  setUsernameError("");
};

export const handleEmailChange = (event, setEmail, setEmailError) => {
  setEmail(event.target.value);
  setEmailError("");
};

export const handlePasswordChange = (event, setPassword, setPasswordError) => {
  setPassword(event.target.value);
  setPasswordError("");
};

export const handlePasswordRepeatChange = (
  event,
  setPasswordRepeat,
  setPasswordRepeatError
) => {
  setPasswordRepeat(event.target.value);
  setPasswordRepeatError("");
};
