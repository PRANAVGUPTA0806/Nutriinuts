import React, { useState, useEffect } from "react";
import blankCart from "../assets/emptyCart.svg";
import { useNavigate } from "react-router-dom";
import "../styles/Cart.css";
import { faPlus, faMinus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [appliedDiscountCode, setAppliedDiscountCode] = useState("");
  const [totalPrice1, setTotalPrice1] = useState(0);
  const [subPrice1, setSubPrice1] = useState(0);
  const [delPrice1, setDelPrice1] = useState(0);
  const [taxPrice1, setTaxPrice1] = useState(0);
  const navigate = useNavigate();

  const isLoggedIn = !!localStorage.getItem("token");
  useEffect(() => {
    fetchCart();
  }, []);

  // Fetch cart items from backend
  const fetchCart = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/cart`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      setCartItems(data.products || []);
      setTotalPrice1(data.totalPrice);
      setSubPrice1(data.subtotal);
      setDelPrice1(data.delivery);
      setTaxPrice1(data.tax);
      setAppliedDiscountCode(data.discountCode || "N/A");
      setDiscount(data.dis);
    } catch (error) {
      console.error("Error fetching cart:", error);
      alert("Failed to fetch cart items.");
    }
  };

  // Add to cart function
  const handleAddToCart = async (products_id) => {
    try {
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item._id === products_id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
      await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ products_id, quantity: 1 }),
      });
      fetchCart(); // Refresh cart after adding
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add item to cart.");
    }
  };

  // Remove from cart function
  const handleRemoveFromCart = async (products_id) => {
    try {
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item._id === products_id && item.quantity > 1
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
      );
      await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/cart/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ products_id, quantity: 1 }),
      });
      fetchCart(); // Refresh cart after removing
    } catch (error) {
      console.error("Error removing from cart:", error);
      alert("Failed to remove item from cart.");
    }
  };

  // Remove an entire item from cart
  const handleRemoveItemFromCart = async (products_id) => {
    try {
      setCartItems((prevItems) =>
        prevItems.filter((item) => item._id !== products_id)
      );
      await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/cart/remove1`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ products_id }),
      });
      fetchCart(); // Refresh cart after removing the item
    } catch (error) {
      console.error("Error removing item from cart:", error);
      alert("Failed to remove item from cart.");
    }
  };

  // Clear the cart
  const handleClearCart = async () => {
    try {
      await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/cart/clear`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setCartItems([]); // Clear cart in UI
    } catch (error) {
      console.error("Error clearing cart:", error);
      alert("Failed to clear cart.");
    }
  };
  const removeDiscount = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/cart/remove-discount`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("token")}`, // Assuming user token for authentication
        }
      });

      const data = await response.json();
      setAppliedDiscountCode("");
      setDiscount(data.dis || 0);
      fetchCart();
      if (response.ok) {
        console.log(data);
        // Update total price, discount, and other cart states here
      } else {
        console.error("Error:", data.message);
      }
    } catch (error) {
      console.error("Error removing discount", error);
    }
  };

  // Apply coupon
  const applyCoupon = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/cart/apply-discount`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ discountCode: coupon }),
        }
      );
      if (!response.ok) throw new Error("Failed to apply discount");
      const data = await response.json();
      setDiscount(data.dis || 0);
      setAppliedDiscountCode(data.discountCode);
      alert("Discount applied!");
      fetchCart();
    } catch (error) {
      console.error("Error applying coupon:", error);
      alert("Invalid coupon code");
    }
  };





  const handleCheckout = () => {
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      navigate("/delivery-address");
    }
  };

  return (
    <div className="mainCartContainer">
      {cartItems.length === 0 ? (
        <div className="blankCartContainer">
          <img src={blankCart} alt="Empty cart" />
          <div className="cartHeading">
            <h1>Your Cart is Empty!!</h1>
          </div>
        </div>
      ) : (
        <div className="cartContent">
          <div className="cartItemsContainer">
            <div className="headingCartDeleteContainer">
              <h1>Your Cart Items:{cartItems.length}</h1>
              <span>
                <FontAwesomeIcon
                  onClick={handleClearCart}
                  style={{
                    marginLeft: "5px",
                    borderRadius: "5px",
                    backgroundColor: "lightgray",
                    cursor: "pointer",
                  }}
                  icon={faTrash}
                />
              </span>
            </div>

            {cartItems.map((item) => (
              <div key={item.products_id} className="cartItemBox">
                <div className="cartItemMainBox">
                  <div className="cartProductImage">
                    <img src={item.productImageUrl} alt={item.productName} />
                  </div>
                  <div className="cartProductDetails">
                    <div className="cartProductName">{item.productName}</div>
                    <div className="cartProductPrice">
                      Rs. {parseFloat(item.productPrice).toFixed(2)}
                    </div>
                  </div>
                </div>
                <span>
                  <span onClick={() => handleAddToCart(item.products_id)}>
                    <FontAwesomeIcon
                      style={{
                        borderRadius: "5px",
                        backgroundColor: "lightgray",
                        cursor: "pointer",
                      }}
                      icon={faPlus}
                    />
                  </span>
                  {item.quantity}
                  <span onClick={() => handleRemoveFromCart(item.products_id)}>
                    <FontAwesomeIcon
                      style={{
                        marginLeft: "5px",
                        borderRadius: "5px",
                        backgroundColor: "lightgray",
                        cursor: "pointer",
                      }}
                      icon={faMinus}
                    />
                  </span>
                </span>
                <span>
                  Total: Rs.
                  {(item.quantity * item.productPrice).toFixed(2)}
                </span>
                <div className="cartCrossButton">
                  <button
                    className="removeButton"
                    onClick={() => handleRemoveItemFromCart(item.products_id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="orderSummaryCartCard">
            <h2>Order Summary</h2>
            <div className="summaryItemCartCard">
              <span>Total Price:</span>
              <h6>Rs. {subPrice1.toFixed(2)}</h6>
            </div>
            <div className="summaryItemCartCard">


              {appliedDiscountCode && (
                <>
                  <span> Discount Code: </span>
                  <div className="summaryItemCartDivider">
                    <h6>{appliedDiscountCode} </h6>
                    <FontAwesomeIcon
                      icon={faTrash}
                      onClick={removeDiscount}
                      style={{ cursor: "pointer", marginLeft: "10px", color: "red" }}
                    />
                  </div>

                </>

              )}
            </div>
            <div className="summaryItemCartCard">
              <span>Discount:</span>
              <h6>Rs. {(discount).toFixed(2)}</h6>
            </div>
            <div className="summaryItemCartCard">
              <span>Delivery Charge:</span>
              <h6>Rs. {delPrice1.toFixed(2)}</h6>
            </div>
            <div className="summaryItemCartCard">
              <span>Tax:</span>
              <h6>Rs. {taxPrice1.toFixed(2)}</h6>
            </div>
            <div className="couponContainerCartCard">
              <input
                type="text"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                placeholder="Enter coupon code"
              />
              <button onClick={applyCoupon}>Apply Coupon</button>
            </div>
            <div className="summaryItemCartCard">
              <span>Total After Discount:</span>
              <h6>Rs. {totalPrice1.toFixed(2)}</h6>
            </div>
            <div className="cartCheckoutButtonCard">
              <button onClick={handleCheckout}>Checkout</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
