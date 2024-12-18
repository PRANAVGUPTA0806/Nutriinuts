// Function to validate the phone number
const userPhoneNoValidation = (phoneNumber) => {
  const phoneNoRegex = /^[0-9]{10}$/;
  return phoneNoRegex.test(phoneNumber);
};

// Function to validate the password
const validatePassword = (password) => {
  if (password.length < 8) {
    return { valid: false, message: "Password is too short. It should be at least 8 characters long." };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: "Password must contain at least one uppercase letter." };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: "Password must contain at least one lowercase letter." };
  }
  if (!/\d/.test(password)) {
    return { valid: false, message: "Password must contain at least one digit." };
  }
  if (!/[!@#$%^&*]/.test(password)) {
    return { valid: false, message: "Password must contain at least one special character." };
  }
  
  return { valid: true };
};


module.exports = {
  userPhoneNoValidation,
  validatePassword,
};