import React, { useState, useEffect } from "react";
import "../styles/LoginComponent.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import eyeIcon from "../assets/eye.png";
import eyeSlashIcon from "../assets/eye-2.png";
import axios from "axios";
import Cookies from "js-cookie";
import { useUser } from "../context/UserContext";

function LoginComponent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { setUserName, setToken, setid } = useUser();

  useEffect(() => {
    // Check for token in URL (from Google OAuth redirect)
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    
    if (token) {
      fetchUserData(token);
    }

    // Check remembered email
    const savedEmail = Cookies.get("email");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
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

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    
    if (!email || !password) {
      setErrorMessage("Both fields are required");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/user/login`,
        {
          email,
          password,
          rememberMe,
        }
      );

      const { token, name, _id, imageUrl,authProvider } = response.data;
      handleAuthSuccess(token, name, _id, imageUrl, email,authProvider);
      
    } catch (error) {
      setErrorMessage("Login failed. Please check your credentials.");
      console.error("There was an error logging in:", error);
    }
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

    if (rememberMe) {
      Cookies.set("email", userEmail, { expires: 7 });
    } else {
      Cookies.remove("email");
    }

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
          <span>Login</span>
        </div>
        <form id="loginInputField" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Enter Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div id="passwordContainer">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter Your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
          {errorMessage && (
            <div id="error-message">{errorMessage}</div>
          )}
          <div id="rememberAndNotAUserMainBox">
            <div id="rememberInputBox">
              <input
                type="checkbox"
                name="rememberme"
                id="rememberme"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Remember Me</span>
            </div>
            <div id="notAUserBox">
              <h6>
                Not a User?{" "}
                <Link to="/signup">
                  <span>Register</span>
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
              Sign in with Google
            </button>
          </div>
          <div id="loginBtnContainer">
            <button type="submit">Login</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginComponent;