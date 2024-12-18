// Function to validate the password
const validatePassword = (password) => {
  if (password.length < 8) {
    return { valid: false, message: "Password is too short. It should be at least 8 characters long." };
  }
  if (!/[!@#$%^&*]/.test(password)) {
    return { valid: false, message: "Password must contain at least one special character" };
  }
  if (!/\d/.test(password)) {
    return { valid: false, message: "Password must contain at least one digit." };
  }
  return { valid: true };
};


module.exports = {
  validatePassword,
};