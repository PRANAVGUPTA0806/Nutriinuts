import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import Loader from "./Loader";
import axios from "axios";
import { useUser } from "../context/UserContext";

const ProtectedRoute1 = ({ element: Component }) => {
  const {  logout } = useUser();
  const [userDetails, setUserDetails] = useState(null);
  const [loading1, setLoading1] = useState(true);
  const location = useLocation();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/api/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setUserDetails(response.data);
        })
        .catch((error) => {
          console.error("Error fetching user profile:", error);
          logout(); 
          localStorage.removeItem('avatar');
          localStorage.removeItem('email');
          localStorage.removeItem('contact');
          localStorage.removeItem('isGoogleUser');
          localStorage.removeItem("token");
          localStorage.removeItem("id");
          localStorage.removeItem("userName");
        })
        .finally(() => {
          setLoading1(false);
        });
    } else {
      setLoading1(false);
    }
  }, [location,logout]);

  if (loading1) {
    return  <Loader />
  }

  

  if (!userDetails) {
    return <Component />;
  }

  return <Navigate to="/" state={{ from: location }} replace />;
};

export default ProtectedRoute1;
