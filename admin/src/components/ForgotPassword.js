import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "../styles/LoginComponent.css";
function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/user/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email }),
      });

      const data = await response.json(); // Parse the JSON response
      setMessage(data.message); // Display the message from the server

      if (response.ok) {
        setTimeout(() => {
            navigate('/login'); // Redirect to login after the timeout
          }, 3000); ;
      }
    } catch (error) {
      console.error("Error sending email:", error);
      setMessage("Failed to send reset email. Please try again.");
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
          <span>Forgot Password?</span>
        </div>
      <form id="loginInputField" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <div id="forgotPasswordBox">
            
              <h6>
                <Link to="/login"><span>Back to Login</span></Link>
              </h6>
            
          </div>
          {message && <p>{message}</p>}
         <div id="loginBtnContainer">
        <button type="submit">Send Reset Link</button>
        </div>
      </form>
     
      
      </div>
    </div>
  );
}

export default ForgotPassword;
