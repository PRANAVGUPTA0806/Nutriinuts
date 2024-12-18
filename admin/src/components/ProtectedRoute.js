import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import Loader from "./Loader";
import axios from "axios";
import { useUser } from "../context/UserContext";

const ProtectedRoute = ({ element: Component }) => {
  const {  logout } = useUser();
  const [userDetails, setUserDetails] = useState(null);
  const [loading1, setLoading1] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/api/user/profile`, {
          headers: { Authorization: `Bearer ${storedToken}` },
        })
        .then((response) => {
          if (response.data.role === "admin") {
            setUserDetails(response.data);
          } else {
            console.warn("Unauthorized: User is not an admin.");
            logout();
            localStorage.removeItem("token");
            localStorage.removeItem("id");
          localStorage.removeItem("userName");
          localStorage.removeItem('avatar');
          localStorage.removeItem('email');
          localStorage.removeItem('contact');
          localStorage.removeItem('isGoogleUser');
          }
        })
        .catch((error) => {
          console.error("Error fetching user profile:", error);
          logout();
          localStorage.removeItem("token");
          localStorage.removeItem("id");
          localStorage.removeItem("userName");
          localStorage.removeItem('avatar');
          localStorage.removeItem('email');
          localStorage.removeItem('contact');
          localStorage.removeItem('isGoogleUser');
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
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Component />;
};

export default ProtectedRoute;
