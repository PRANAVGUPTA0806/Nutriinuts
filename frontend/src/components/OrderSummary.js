import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/OrderSummary.css";

function OrderSummary() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [deliveryAddress, setDeliveryAddress] = useState({});
  const [totalAmount, setTotalAmount] = useState(0);
  const orderId = localStorage.getItem("orderId"); // Assuming you store the order ID in local storage

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/my-orders/${orderId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch order details");
        }

        const data = await response.json();
        setCartItems(data.order_summary.items);
        setDeliveryAddress(data.shipping_information.shipping_address);
        setTotalAmount(data.order_summary.final_price);
      } catch (error) {
        console.error("Error fetching order details:", error);
        alert("Failed to fetch order details.");
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const handleProceedToPayment = () => {
    navigate("/payment");
  };

  return (
    <div className="orderSummaryContainer">
      <h2>Order Summary</h2>
      <div className="addressSummary">
        <h3>Delivery Address:</h3>
        <p>{deliveryAddress.addressLine1}</p>
        {deliveryAddress.addressLine2 && <p>{deliveryAddress.addressLine2}</p>}
        <p>{deliveryAddress.city}</p>
        <p>{deliveryAddress.state}</p>
        <p>{deliveryAddress.zip}</p>
        <p>{deliveryAddress.country}</p>
        <p>{deliveryAddress.phone}</p>
      </div>
      <div className="cartSummary">
        <h3>Items:</h3>
        {cartItems.map((item) => (
          <div key={item.products_id}>
            <p>{item.productName}</p>
          </div>
        ))}
        <h3>Total: Rs. {totalAmount.toFixed(2)}</h3>
      </div>
      <button onClick={handleProceedToPayment}>Proceed to Payment</button>
    </div>
  );
}

export default OrderSummary;
