import "./App.css";
import Body from "../src/components/Body";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import ShopByCategory from "./components/ShopByCategory";
import NewLaunches from "./components/NewLaunches";
import Gifting from "./components/Gifting";
import ContactUs from "./components/ContactUs";
import Blog from "./components/Blog";
import Footer from "./components/Footer";
import Cart from "./components/Cart";
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import ProductDetails from './components/ProductDetails';
import LoginComponent from "./components/LoginComponent";
import SignUpComponent from "./components/SignUpComponent";
import ErrorPage from "./components/ErrorPage";
import AboutUs from "./components/AboutUs";
import PrivacyPolicy from "./components/PrivacyPolicy";
import { useState, useEffect } from "react";
import Loader from "./components/Loader";
import { CartProvider } from "./context/CartContext"; // Import CartProvider
import Payment from "./components/Payment";
import { UserProvider } from "./context/UserContext";
import MyAccount from "./components/MyAccount";
import ProtectedRoute from "./components/ProtectedRoute";
import OrderSummary from "./components/OrderSummary";
import DeliveryAddress from "./components/DeliveryAddress";
import ReturnAndRefundPolicy from "./components/ReturnAndRefundPolicy"; // Import Refund Policy Component
import TermsAndConditions from "./components/TermsAndConditions";
import ProtectedRoute1 from "./components/ProtectedRoute1";
import MyOrderParent from "./components/MyOrderParent";
function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 4000);
  }, []); // Add dependency array to prevent infinite loop

  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <UserProvider>
          <CartProvider>
            <div className="App">
              <Navbar />
              <Routes>
                <Route path="/" element={<Body />} />
                <Route path="shopbycategory" element={<ShopByCategory />} />
                <Route path="newlaunches" element={<NewLaunches />} />
                <Route path="gifting" element={<Gifting />} />
                <Route path="contactus" element={<ContactUs />} />
                <Route path="blog" element={<Blog />} />
                <Route path="cart" element={<Cart />} />
                <Route path="myorder" element={<ProtectedRoute element={MyOrderParent} />} />
                <Route path="login" element={<ProtectedRoute1 element={LoginComponent} />} />
                <Route path="aboutus" element={<AboutUs />} />
                <Route path="privacypolicy" element={<PrivacyPolicy />} />
                <Route path="/product/:productId" element={<ProductDetails />} />
                <Route path="/returnandrefundpolicy" element={<ReturnAndRefundPolicy />} />
                <Route path="/termsandconditions" element={<TermsAndConditions />} />
                <Route path="/forgot-password" element={<ProtectedRoute1 element={ForgotPassword} />} />
                <Route path="/reset-password/:resetToken" element={<ProtectedRoute1 element={ResetPassword} />} />

                <Route
                  path="/delivery-address"
                  element={<ProtectedRoute element={DeliveryAddress} />}
                />
                <Route
                  path="/order-summary"
                  element={<ProtectedRoute element={OrderSummary} />}
                />
                <Route
                  path="/payment"
                  element={<ProtectedRoute element={Payment} />}
                />
                <Route
                  path="/account"
                  element={<ProtectedRoute element={MyAccount} />}
                />
                <Route path="signup" element={<ProtectedRoute1 element={SignUpComponent} />} />
                <Route path="error" element={<ErrorPage />} />
                <Route path="*" element={<Navigate to="/error" />} />
              </Routes>
              <Footer />
            </div>
          </CartProvider>
        </UserProvider>
      )}
    </div>
  );
}

export default App;
