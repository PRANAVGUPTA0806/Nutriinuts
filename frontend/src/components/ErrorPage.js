import React from "react";
import "../styles/ErrorPage.css";
import { Link } from "react-router-dom";

function ErrorPage() {
  return (
    <div class="errorPageMainContainer">
      <div className="errorMsgContent">
        <h2 class="error">404</h2>
        <p>PAGE NOT FOUND</p>
        <p>It looks like nothing was found at this location.</p>
      </div>
      <div className="errorBackToHomeBtn">
        <Link to="/">
          <button>BACK TO HOME</button>
        </Link>
      </div>
    </div>
  );
}

export default ErrorPage;
