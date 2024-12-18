import React, { useState ,useEffect} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Payment.css";

function Payment() {
  const [contact, setContact] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("creditCard");
  const [payment_status1, setPaymentStatus] = useState("Pending");
  const [totalAmount, setTotalAmount] = useState(0);
  const orderId = localStorage.getItem("orderId");
  const navigate = useNavigate();

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
        if (data.shipping_information.shipping_address.phone) {
          setContact(data.shipping_information.shipping_address.phone);
        }
        setTotalAmount(data.order_summary.final_price);
      } catch (error) {
        console.error("Error fetching order details:", error);
        alert("Failed to fetch order details.");
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const handlePayment = async () => {
    try {
      // Get total price
      const orderid = localStorage.getItem("orderId");
      
      const { data } = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/payment/create-order`, {
        amount: totalAmount, // Use actual total price
      });

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: "INR",
        name: "Nutriinuts",
        description: "Transaction",
        order_id: data.id,
        handler: async (response) => {
          const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = response;

          const verificationResponse = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/payment/verify-signature`, {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
          });

          if (verificationResponse.data === "Payment verified successfully") {

              await updateOrderPayment(orderid, "Paid", razorpay_payment_id);
              await clearCart();
              alert("Payment successful!");
              navigate("/myorder");
            }
           else {
            await updateOrderPayment(orderid, "Failed", razorpay_payment_id);
            alert("Payment verification failed!");
          }
          
        },
        modal: {
          ondismiss: function () {
            (async () => {
              // Update order payment to "Failed"
              await updateOrderPayment(orderid, "Failed", "NA"); // Set transaction ID to "NA" or handle it accordingly
              alert('Payment failed or cancelled.');
            })();
          },},
        prefill: {
          name: localStorage.getItem("userName"),
          email: localStorage.getItem("email"),
          contact: contact && contact.startsWith("+91") ? contact : "+91" + (contact || ""),
        },
        theme: {
          color: "#3399cc",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      const orderid = localStorage.getItem("orderId");
      console.error("Payment error:", error);
      await updateOrderPayment(orderid, "Failed", "NA"); 
      alert("Payment failed. Please try again.");
    }
  };

  const updateOrderPayment = async (orderid, status, razorpay_payment_id) => {
    try {
      const paymentResponse = await axios.get(`https://api.razorpay.com/v1/payments/${razorpay_payment_id}`, {
          auth: {
              username: process.env.REACT_APP_RAZORPAY_KEY_ID,
              password: process.env.REACT_APP_RAZORPAY_KEY_SECRET, // Add your Razorpay Secret Key here
          },
      });

      // Extract payment method from the response
      const paymentMethod1 = paymentResponse.data.method; // This will give you the payment method used (e.g., "card", "netbanking", "upi")
      const payment_status2 = paymentResponse.data.status === "captured" ? "Paid" : "Failed";
      // Now you can handle the payment method as needed
      setPaymentMethod(paymentMethod1);
      setPaymentStatus(payment_status2);
  } catch (error) {
      console.error("Error fetching payment details:", error);
  }
    await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/my-orders/payment/${orderid}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        payment_method: razorpay_payment_id === "NA" ? "COD" : paymentMethod,
        transaction_id: razorpay_payment_id,
        payment_status: razorpay_payment_id === "NA" ? "Pending" : payment_status1,
      }),
    });
  };

  const clearCart = async () => {
    await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/cart/clear`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });
    localStorage.removeItem("orderId");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (["creditCard", "upi", "netBanking"].includes(paymentMethod)) {
      handlePayment();
    } else if (paymentMethod === "cod") {
      const orderid = localStorage.getItem("orderId");
      await updateOrderPayment(orderid, "Pending", "NA");
      await clearCart();
      alert("Order placed with Cash on Delivery!");
      navigate("/myorder");
    }
  };

  return (
    <div className="paymentContainer">
      <h2>Payment</h2>
      <form onSubmit={handleSubmit} className="paymentForm">
        {["creditCard", "upi", "netBanking", "cod"].map((method) => (
          <div key={method} className="paymentOption">
            <label className="customRadio">
              <input
                type="radio"
                value={method}
                checked={paymentMethod === method}
                onChange={() => setPaymentMethod(method)}
              />
              <span className="radioCheck"></span>
              {method.charAt(0).toUpperCase() + method.slice(1).replace(/([A-Z])/g, " $1")}
            </label>
          </div>
        ))}
        <button type="submit" className="payButton">Pay Now</button>
      </form>
    </div>
  );
}

export default Payment;
