import React, { useState, useEffect } from "react";
import eyeIcon from "../assets/eye.png";
import eyeSlashIcon from "../assets/eye-2.png";
import "../styles/LoginComponent.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { userPhoneNoValidation, validatePassword } from "./valdations";
import axios from "axios";
import { useUser } from "../context/UserContext";

function SignUpComponent() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const { setUserName, setToken, setid } = useUser();
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isTypingPassword, setIsTypingPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check for token in URL (from Google OAuth redirect)
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    
    if (token) {
      fetchUserData(token);
    }
  }, [location]);

  const fetchUserData = async (token) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/auth/login/success`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          withCredentials: true
        }
      );

      const { user } = response.data;
      
      if (user) {
        handleAuthSuccess(
          token,
          user.name,
          user._id,
          user.imageUrl || '',
          user.email,
          user.authProvider
        );
      }
    } catch (error) {
      setErrorMessage("Failed to fetch user data. Please try again.");
      console.error("Error fetching user data:", error);
    }
  };

  const handlePhoneNumberChange = (e) => {
    const value = e.target.value;
    setPhoneNumber(value);

    if (value === "") {
      setPhoneError("");
    } else {
      if (!userPhoneNoValidation(value)) {
        setPhoneError("Phone number is invalid");
      } else {
        setPhoneError("");
      }
    }
  };

  useEffect(() => {
    if (userPhoneNoValidation(phoneNumber)) {
      setPhoneError("");
    } else if (phoneNumber) {
      setPhoneError("Phone number is invalid");
    }
  }, [phoneNumber]);

  useEffect(() => {
    const passwordValidation = validatePassword(password);
    if (password) {
      if (passwordValidation.valid) {
        setPasswordError("");
      } else {
        setPasswordError(passwordValidation.message);
      }
    } else {
      setPasswordError("");
    }
  }, [password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    // Validation
    if (!name || !email || !phoneNumber || !password) {
      setErrorMessage("All fields are required");
      return;
    }

    if (!userPhoneNoValidation(phoneNumber)) {
      setPhoneError("Phone number is invalid");
      return;
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      setPasswordError(passwordValidation.message);
      return;
    }

    if (phoneError || passwordError) {
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/user/register`,
        {
          name,
          email,
          phoneNumber,
          password,
        }
      );

      if (response.status === 200 || response.status === 201) {
        const { token, name: userName, _id, imageUrl ,authProvider} = response.data;
        handleAuthSuccess(token, userName, _id, imageUrl, email,authProvider);
        setErrorMessage("User Created successfully");
      } else {
        setErrorMessage("Registration failed. Please try again.");
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Registration failed. Please try again.");
      console.error("There was an error registering the user:", error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.REACT_APP_BACKEND_URL}/auth/google`;
  };

  const handleAuthSuccess = (token, name, _id, imageUrl, userEmail,authProvider) => {
    setToken(token);
    setUserName(name);
    setid(_id);
    localStorage.setItem('avatar', imageUrl);
    localStorage.setItem('email', userEmail);
    localStorage.setItem('isGoogleUser', authProvider==='google' ? 'true' : 'false');

    // Clear the URL parameters
    window.history.replaceState({}, document.title, window.location.pathname);
    navigate("/");
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
          <span>Register</span>
        </div>
        <form id="loginInputField" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="example@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="tel"
            placeholder="Enter Your Phone Number"
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
          />
          {phoneError && <span id="errorMessage">{phoneError}</span>}
          
          <div id="passwordContainer">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter Your Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setIsTypingPassword(true);
                if (e.target.value === "") {
                  setPasswordError("");
                  setIsTypingPassword(false);
                }
              }}
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

          {!isTypingPassword && (
            <span id="passwordHelp">
              Password must be at least 8 characters long, contain at least one uppercase letter,
              one lowercase letter, one number, and one special character.
            </span>
          )}
          {passwordError && <span id="errorMessage">{passwordError}</span>}
          {errorMessage && <span id="errorMessage">{errorMessage}</span>}

          <div id="rememberAndNotAUserMainBox">
            <div id="notAUserBox">
              <h6>
                Already a User?{" "}
                <Link to="/login">
                  <span>Login</span>
                </Link>
              </h6>
            </div>
          </div>
          <div id="forgotPasswordBox">
            <Link to="/forgot-password">
              <span>Forgot Password?</span>
            </Link>
          </div>
          <div className="google-login-container">
            <button 
              type="button" 
              onClick={handleGoogleLogin}
              className="google-login-button"
            >
              <img 
                src="https://developers.google.com/identity/images/g-logo.png" 
                alt="Google logo" 
              />
              Sign up with Google
            </button>
          </div>
          <div id="loginBtnContainer">
            <button type="submit">Register</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUpComponent;