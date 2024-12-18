import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import LoginComponent from "./components/LoginComponent";
import Body from "../src/components/Body";
import ErrorPage from "./components/ErrorPage";
import PrivacyPolicy from "./components/PrivacyPolicy";
import { useState, useEffect } from "react";
import Loader from "./components/Loader";
import { UserProvider } from "./context/UserContext";
import MyAccount from "./components/MyAccount";
import ProtectedRoute from "./components/ProtectedRoute";
import ReturnAndRefundPolicy from "./components/ReturnAndRefundPolicy"; 
import TermsAndConditions from "./components/TermsAndConditions";
import ProtectedRoute1 from "./components/ProtectedRoute1";
import Admin from "./components/Admin";
import AllUser from "./components/AllUser";
import AllProduct from "./components/AllProduct";
import Allnewlaunch from "./components/Allnewlaunch";
import Allgiftings from "./components/Allgiftings";
import AllOrder from "./components/AllOrder";
import AllBlog from "./components/AllBlog";
import AllFeedback from "./components/AllFeedback";
import AllOffers from "./components/AllOffers";
import AllHome from "./components/AllHome";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 4000);
    return () => clearTimeout(timer); // Clean up the timer
  }, []); 

  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <UserProvider>
          <div className="App">
            <Navbar />
            <Routes>
              <Route path="/" element={<Body />} />
              <Route path="login" element={<ProtectedRoute1 element={LoginComponent} />} />
              <Route path="privacypolicy" element={<PrivacyPolicy />} />
              <Route path="/returnandrefundpolicy" element={<ReturnAndRefundPolicy />} />
              <Route path="/termsandconditions" element={<TermsAndConditions />} /> 
              <Route path="/forgot-password" element={<ProtectedRoute1 element={ForgotPassword} />} />
              <Route path="/reset-password/:resetToken" element={<ProtectedRoute1 element={ResetPassword} />} /> 
              <Route path="/account" element={<ProtectedRoute element={MyAccount} />} />
              
              <Route path="/admin/*" element={<ProtectedRoute element={Admin}/>}>
                <Route path="allhome" element={<AllHome />} />
                <Route path="allusers" element={<AllUser />} />
                <Route path="allproduct" element={<AllProduct />} />
                <Route path="newlaunch" element={<Allnewlaunch />} />
                <Route path="gifting" element={<Allgiftings />} />
                <Route path="allorders" element={<AllOrder />} />
                <Route path="allblog" element={<AllBlog />} />
                <Route path="allfeedback" element={<AllFeedback />} />
                <Route path="alloffers" element={<AllOffers />} />
              </Route>

              <Route path="error" element={<ErrorPage />} />
              <Route path="*" element={<Navigate to="/error" />} />
            </Routes>
            <Footer />
          </div>
        </UserProvider>
      )}
    </div>
  );
}

export default App;
