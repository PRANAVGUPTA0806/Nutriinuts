import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "../styles/Navbar.module.css";
import userLogo from "../assets/userLogo.png";
import { useUser } from "../context/UserContext";

function Navbar() {
  const { userName, logout } = useUser();
  const [isActive, setIsActive] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const toggleActiveClass = () => {
    setIsActive(!isActive);
  };

  const removeActive = () => {
    setIsActive(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  return (
    <div className="App">
      <header className="App-header">
        <nav className={`${styles.navbar}`}>
          <Link to="/" className={`${styles.logo}`}>
            <img
              className="companyLogo"
              src="https://res.cloudinary.com/dfagcn631/image/upload/v1721987516/logoimg_epbsrt.png"
              alt="logo"
            />
            <h4>Nutriinuts Admin</h4>
          </Link>
          <ul className={`${styles.navMenu} ${isActive ? styles.active : ""}`}>
            <li onClick={removeActive}>
              <Link to="/" className={`${styles.navLink}`}>
                Home
              </Link>
            </li>
            {localStorage.getItem('token') && (
  <li onClick={removeActive}>
    <Link to="/admin" className={`${styles.navLink}`}>
      Dashboard
    </Link>
  </li>
)}

          </ul>
          <div className={`${styles.userCartContainer}`}>
            {/* User dropdown */}
            <div
              className={`${styles.userBoxContainer}`}
              onMouseEnter={() => {
                removeActive();
                toggleDropdown();
              }}
              onMouseLeave={() => {closeDropdown();}}
            >
              <img src={ localStorage.getItem('avatar')? localStorage.getItem('avatar') : userLogo} alt="User Avatar" className={`${styles.userLogo} ${styles.avatar}`} />
              {isDropdownOpen && (
                <div className={`${styles.dropdown}`}>
                  <span>{userName ? `Hi, ${userName}` : "Hi, Guest"}</span>
                  <hr className={styles.dropdownDivider} />{" "}
                  {/* Divider after Hi, User */}
                  {userName && (
                    <>
                      <Link to="/account" className={`${styles.dropdownLink}`} >
                        My Account
                      </Link>
                      <hr className={styles.dropdownDivider} />{" "}
                    </>
                  )}
                  {/* <hr className={styles.dropdownDivider} />{" "} */}
                  {/* Divider after Contact Us */}
                  {userName ? (
                    <button
                    onClick={() => {
                      logout(); 
                      closeDropdown();
                      localStorage.removeItem("token");
                      localStorage.removeItem("id");
                      localStorage.removeItem("userName");
                      localStorage.removeItem('role');
                      localStorage.removeItem('avatar');
                    }}
                      className={`${styles.logoutButton}`}
                    >
                      Logout
                    </button>
                  ) : (
                    <Link to="/login" className={`${styles.loginButton}`}>
                      Login
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
          <div
            className={`${styles.hamburger} ${isActive ? styles.active : ""}`}
            onClick={toggleActiveClass}
          >
            <span className={`${styles.bar}`}></span>
            <span className={`${styles.bar}`}></span>
            <span className={`${styles.bar}`}></span>
          </div>
        </nav>
      </header>
    </div>
  );
}

export default Navbar;
