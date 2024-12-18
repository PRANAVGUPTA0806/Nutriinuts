// Validation utility for phone numbers
const userPhoneNoValidation = (phoneNumber) => {
  const phoneNoRegex = /^[0-9]{10}$/;
  return phoneNoRegex.test(phoneNumber);
};

module.exports = {
  userPhoneNoValidation,
};
