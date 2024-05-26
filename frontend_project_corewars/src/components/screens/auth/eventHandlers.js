import {
  validateUsername,
  validateEmail,
  validatePassword,
  validatePasswordRepeat,
} from "./formValidations";

export const handleSignUp = (
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
    return;
  }
};

export const handleSignIn = (
  username,
  password,
  passwordRepeat,
  setUsernameError,
  setPasswordError,
  setPasswordRepeatError
) => {
  const usernameError = validateUsername(username);
  const passwordError = validatePassword(password);
  const passwordRepeatError = validatePassword(password, passwordRepeat);

  setUsernameError(usernameError);
  setPasswordError(passwordError);
  setPasswordRepeatError(passwordRepeatError);
  setPasswordError(passwordRepeatError);

  if (usernameError || passwordError || passwordRepeatError) {
    return;
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
