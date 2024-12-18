import React, { useState, useEffect } from "react";
import "../styles/Gifting.css";
import { useNavigate } from "react-router-dom";
import StarRate from "./StarRate";

function Gifting() {
  const navigate=useNavigate();
  const [products, setProducts] = useState([]);
  const [loadingStates, setLoadingStates] = useState({});
  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`); // Use navigate to go to the product details page
  };
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/gifting`);
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleClick = (product) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Login/Signup first"); // Show the alert
      navigate("/login"); // Redirect to the login page
      return;
    }
    setLoadingStates((prevStates) => ({
      ...prevStates,
      [product.products_id]: true,
    }));

    setTimeout(() => {
      handleAddToCart(product._id)
      setLoadingStates((prevStates) => ({
        ...prevStates,
        [product.products_id]: false,
      }));
    }, 1000);
  };
  const handleAddToCart = async (products_id) => {
    await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ products_id, quantity: 1 }),
    }); // Refresh cart after adding
  };
  return (
    <div id="giftingMainContainer">
      <div id="giftingHeading">
        <span>Gifting</span>
      </div>
      <div id="giftingContainer">
        <div id="mainBoxContainerAllProducts">
          {products.length > 0 ? (
            products.map((product) => (
              <div
                key={product.products_id}
                id={`productCard-${product.products_id}`}
                className="card-1"
              >
                <div id={`productImageContainer-${product.products_id}`}>
                  <img
                    src={product.productImageUrl}
                    alt={product.productName}
                    onClick={() => handleProductClick(product._id)} // Navigate to the product details page on click
                    style={{ cursor: "pointer" }} 
                  />
                </div>
                <div id={`productNameContainer-${product.products_id}`}
                onClick={() => handleProductClick(product._id)} // Navigate to the product details page on click
                style={{ cursor: "pointer" }} >
                  <span>{product.productName}</span>
                </div>
                <div id={`productPriceContainer-${product.products_id}`}>
                  <span>Rs. {product.productPrice}</span>
                  </div>
                <div id={`productPriceContainer-${product.products_id}`}>
                  <StarRate userId={localStorage.getItem("id")} productId={product._id} productModel="gifting"/>
                </div>
                <div id={`productAddToCartButton-${product.products_id}`}>
                  <button
                    id={`button-${product.products_id}`}
                    className={
                      loadingStates[product.products_id]
                        ? "button loading"
                        : "button"
                    }
                    onClick={() => handleClick(product)}
                    disabled={loadingStates[product.products_id]}
                  >
                    <span>Add to cart</span>
                    <div className="cart">
                      <svg viewBox="0 0 36 26">
                        <polyline points="1 2.5 6 2.5 10 18.5 25.5 18.5 28.5 7.5 7.5 7.5"></polyline>
                        <polyline points="15 13.5 17 15.5 22 10.5"></polyline>
                      </svg>
                    </div>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div>No products found.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Gifting;