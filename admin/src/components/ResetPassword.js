import React, { useState } from 'react';
import axios from 'axios';
import eyeIcon from "../assets/eye.png"; 
import "../styles/LoginComponent.css";
import eyeSlashIcon from "../assets/eye-2.png";
import { useParams, useNavigate } from 'react-router-dom';

function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const { resetToken } = useParams(); // Get the token from the URL
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);
  // Regular expression for password validation
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!passwordRegex.test(password)) {
      setMessage("Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.patch(`${process.env.REACT_APP_BACKEND_URL}/api/user/reset-password/${resetToken}`, {password });
      setMessage(response.data.message);
      // Optionally redirect to login or another page
      navigate('/login');
    } catch (error) {
      console.error("Error resetting password:", error);
      setMessage("Failed to reset password. Please try again.");
    }
  };
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev); // Toggle the password visibility
  };
  const togglePasswordVisibility1 = () => {
    setShowPassword1((prev) => !prev); // Toggle the password visibility
  };

  return (
    <div id="loginComponentContainer">
        <div id="insideContainer card1">
        <div id="logoDivBox">
          <div>
            <img
              id="imgPngLogo"
              src="https://res.cloudinary.com/dwprhpk9r/image/upload/v1737643273/cropped-OneSnack-Logo-without-bg-22_mttelg.png"
              alt="NutriiNuts Logo"
            />
          </div>
          
        </div>
        <hr id="borderComponentDivider" />
        <div id="loginTextBox">
          <span>Reset Password</span>
        </div>
      <form id="loginInputField" onSubmit={handleSubmit}>
      <div id="passwordContainer">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Enter New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
              type="button"
              onClick={togglePasswordVisibility}
              id="togglePasswordButton"
            >
              <img
                src={showPassword ? eyeSlashIcon : eyeIcon}
                alt={showPassword ? "Hide password" : "Show password"}
                width="24"
                height="24"
              />
            </button>
            </div>
            <div id="passwordContainer">
        <input
          type={showPassword1 ? "text" : "password"}
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button
              type="button"
              onClick={togglePasswordVisibility1}
              id="togglePasswordButton"
            >
              <img
                src={showPassword1 ? eyeSlashIcon : eyeIcon}
                alt={showPassword1 ? "Hide password" : "Show password"}
                width="24"
                height="24"
              />
            </button>
            </div>
        <span id="passwordHelp">
              Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.
            </span>
        <div id="loginBtnContainer">
        <button type="submit">Reset Password</button>
        </div>
      </form>
      {message && <p>{message}</p>}
      </div>
    </div>
  );
}

export default ResetPassword;
