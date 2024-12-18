import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
const UserContext = createContext();
export const UserProvider = ({ children }) => {
  const [userName, setUserName] = useState(() => {
    const savedUserName = localStorage.getItem("userName");
    return savedUserName || "";
  });
  const [token, setToken] = useState(() => {
    const savedToken = localStorage.getItem("token");
    return savedToken || "";
  });
  const [_id,setid]=useState(()=>{
    const savedid = localStorage.getItem("id");
    return savedid || "";
  })

  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setUserLoggedIn(!!userName); // Update the userLoggedIn state
    // Store userName and token in localStorage whenever they change
    localStorage.setItem("userName", userName);
    localStorage.setItem("token", token);
    localStorage.setItem("id",_id);
  }, [userName, token,_id]);

  const logout = useCallback(() => {
    // setUserName("");
    // setToken("");
    // setid("");
    localStorage.removeItem("userName");
    localStorage.removeItem("token");
    localStorage.removeItem("id");
    setUserLoggedIn(false); // Reset userLoggedIn state
    // localStorage.clear(); // Clear all local storage
    navigate("/login"); // Redirect to login page after logout
  }, [navigate]);

  return (
    <UserContext.Provider
      value={{ userName, token,_id,setid,setUserName, setToken, logout, userLoggedIn }}
    >
      {children}
    </UserContext.Provider>
  );
};
export const useUser = () => useContext(UserContext);