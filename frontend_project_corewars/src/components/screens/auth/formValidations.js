export const validateUsername = (username) => {
  if (username === "") {
    return "Username field can't be empty";
  }
  if (/[^\w]/.test(username)) {
    return "Username cannot contain special characters";
  }
  return "";
};

export const validateEmail = (email) => {
  if (email === "") {
    return "Email field can't be empty";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return "Invalid email format";
  }

  return "";
};

export const validatePassword = (password) => {
  if (password === "") {
    return "Password field can't be empty";
  }

  if (password.length < 8) {
    return "Password must be at least 8 characters long";
  }

  const specialCharacters = /[!@#$%^&*(),.?":{}|<>]/;
  if (!specialCharacters.test(password)) {
    return "Password must contain at least one special character";
  }

  const numbers = /[0-9]/;
  if (!numbers.test(password)) {
    return "Password must contain at least one number";
  }
  return "";
};

export const validatePasswordRepeat = (password, passwordRepeat) => {
  if (passwordRepeat === "") {
    return "Password field can't be empty";
  }

  if (passwordRepeat.length < 8) {
    return "Password must be at least 8 characters long";
  }

  const specialCharacters = /[!@#$%^&*(),.?":{}|<>]/;
  if (!specialCharacters.test(passwordRepeat)) {
    return "Password must contain at least one special character";
  }

  const numbers = /[0-9]/;
  if (!numbers.test(passwordRepeat)) {
    return "Password must contain at least one number";
  }

  if (passwordRepeat!=password){
    return "Passwords must contain same characters"
  }

  return "";
};
