import React, { useState,useEffect } from "react";
import "../styles/LoginComponent.css";
import { Link, useNavigate } from "react-router-dom";
import eyeIcon from "../assets/eye.png"; 
import eyeSlashIcon from "../assets/eye-2.png";
import axios from "axios";
import Cookies from "js-cookie"; // Import js-cookie
import { useUser } from "../context/UserContext";

function LoginComponent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false); // State for Remember Me
  const [errorMessage, setErrorMessage] = useState(""); // New state for error messages
  const navigate = useNavigate(); // Hook to programmatically navigate
  const { setUserName, setToken,setid } = useUser(); // Get setUserName and setToken from context
  const [showPassword, setShowPassword] = useState(false);
  

  useEffect(() => {
    // Check if the user email is stored in cookies when the component mounts
    const savedEmail = Cookies.get("email");
    // const savedpass = Cookies.get("password");
    if (savedEmail ) {
      setEmail(savedEmail); // Auto-fill the email field
      // setPassword(savedpass); // Auto-fill the password field
      setRememberMe(true); // Set Remember Me to true
    }
  }, []);


  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev); // Toggle the password visibility
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
          password,rememberMe,
        }
      );
      if(response.data.token && response.data.role==='admin'){
      // Assuming the response contains the token
      const { token, name ,_id,imageUrl,role} = response.data;

      // Store token using context
      setToken(token);
      setUserName(name);
      setid(_id);
      localStorage.setItem('role',role);
      localStorage.setItem('avatar',imageUrl)
      if (rememberMe) {
        Cookies.set("email", email, { expires: 7 }); // Store the email in cookies for 7 days
        // Cookies.set("password", password, { expires: 7 });
      } else {
        Cookies.remove("email"); // Remove the email from cookies if not remembering
        // Cookies.remove("password");
      }

      // Redirect to the home page or wherever needed
      navigate("/admin/");
    }else {
      // console.log(response.data.message);
      alert("Unauthorized credentials ");
    }
    } catch (error) {
      setErrorMessage("Login failed. Please check your credentials.");
      console.error("There was an error logging in:", error);
    }
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
              onChange={(e) => {
                setPassword(e.target.value);
                
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
            {errorMessage && (
            <div id="error-message">{errorMessage}</div> // Display error message
          )}
          <div id="rememberAndNotAUserMainBox">
            <div id="rememberInputBox">
            <input
                type="checkbox"
                name="rememberme"
                id="rememberme"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)} // Set the rememberMe state
              />
              <span>Remember Me</span>
            </div>
          </div>
          <div id="forgotPasswordBox">
            <Link to="/forgot-password">
              <span>Forgot Password?</span>
            </Link>
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
