import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/DeliveryAddress.css";

function DeliveryAddress() {
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");
  const [totalPrice1, setTotalPrice1] = useState(0);
  const [discount1, setDiscount] = useState(0);
  const [id,setId]=useState("");
  const [subPrice1, setSubPrice1] = useState(0);
  const [delPrice1, setDelPrice1] = useState(0);
  const [taxPrice1, setTaxPrice1] = useState(0);
  const [phone, setPhone] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  // Regex patterns
  const postalCodeRegex = /^[0-9]{6}$/;
  const phoneRegex = /^[0-9]{10}$/;

  // Fetch cart items from backend
  useEffect(() => {
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
      setDiscount(data.dis);
      setId(data._id);
      } catch (error) {
        console.error("Error fetching cart:", error);
        alert("Failed to fetch cart items.");
      } finally {
      }
    };

    fetchCart();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!postalCodeRegex.test(postalCode)) {
      alert("Invalid postal code format.");
      return;
    }

    if (!phoneRegex.test(phone)) {
      alert("Invalid phone number format.");
      return;
    }

    // Prepare order data
    const orderData = {
      cartid:id,
      order_summary: {
        items: cartItems,
        total_price: subPrice1,
        total_tax:taxPrice1,
        final_price:totalPrice1,
        discount:discount1,
        shipping_fee:delPrice1,
      },
      billing_information: {
        billing_address: {
          addressLine1,
          addressLine2,
          city,
          state,
          zip: postalCode,
          country,
          phone,
        },
      },
      shipping_information: {
        shipping_address: {
          addressLine1,
          addressLine2,
          city,
          state,
          zip: postalCode,
          country,
          phone,
        },
      },
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error("Failed to create order");
      }

      const data = await response.json();
      console.log(data); // Handle the response as needed
      localStorage.setItem("orderId", data.id);
      navigate("/order-summary");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="deliveryAddressContainer">
      <h2>Delivery Address</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Address Line 1"
          value={addressLine1}
          onChange={(e) => setAddressLine1(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Address Line 2"
          value={addressLine2}
          onChange={(e) => setAddressLine2(e.target.value)}
        />
        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="State"
          value={state}
          onChange={(e) => setState(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Postal Code"
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          required
        />
        <input
          type="tel"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <button type="submit">Continue to Order Summary</button>
      </form>
    </div>
  );
}

export default DeliveryAddress;
