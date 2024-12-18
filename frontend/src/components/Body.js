import React, { useState, useEffect } from "react";
import PromotionalBanner from "./PromotionalBanner";
import ImageSlider from "./ImageSlider";
import TestimonialPage from "./TestimonialPage";
import "../styles/Body.css";
import { useNavigate } from "react-router-dom";
import StarRate from "./StarRate";

function Body() {
  const navigate=useNavigate();
  const [products, setProducts] = useState([]);
  const [loadingStates, setLoadingStates] = useState({}); 
  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`); // Use navigate to go to the product details page
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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/allProducts`);
        const data = await response.json();

        // Filter products based on categories
        const filterCategory = (category) =>
          data
            .filter((product) =>
              product.productName.toLowerCase().includes(category)
            )
            .slice(0, 4);

        const makhanaProducts = filterCategory("makhana");
        const dipsProducts = filterCategory("dips");
        const chipsProducts = filterCategory("chips");

        // Combine the filtered products
        const filteredProducts = [
          ...makhanaProducts,
          ...dipsProducts,
          ...chipsProducts,
        ];
        setProducts(filteredProducts);
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
      handleAddToCart(product._id);
      setLoadingStates((prevStates) => ({
        ...prevStates,
        [product.products_id]: false,
      }));
    }, 1000);
  };

  return (
    <div>
      <PromotionalBanner />
      <ImageSlider />
      <div className="mainBoxContainerAllProducts">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.products_id} className="productCard1 card-1">
              <div className="productImageContainer">
                <img src={product.productImageUrl} alt={product.productName} onClick={() => handleProductClick(product._id)} // Navigate to the product details page on click
                    style={{ cursor: "pointer" }} />
              </div>
              <div className="productNameContainer"
              onClick={() => handleProductClick(product._id)} // Navigate to the product details page on click
              style={{ cursor: "pointer" }} >
                <span>{product.productName}</span>
              </div>
              <div className="productPriceContainer">
                  <span>Rs. {product.productPrice}</span>
                  </div>
                <div className="productPriceContainer">
                  <StarRate userId={localStorage.getItem("id")} productId={product._id} productModel="allProducts"/>
                </div>
              <div className="productAddToCartButton">
                <button
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
      <TestimonialPage />
    </div>
  );
}

export default Body;
