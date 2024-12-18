import React, { useState, useEffect } from "react";
import "../styles/ShopByCategory.css";
import { useNavigate } from "react-router-dom";
import StarRate from "./StarRate";
const ShopByCategory = () => {
  const navigate=useNavigate();
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [loadingStates, setLoadingStates] = useState({});
  const [suggestions, setSuggestions] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1); 
  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`); // Use navigate to go to the product details page
  };
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/allProducts`);
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);
// Add to cart function
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
    if (searchTerm.length > 0) {
      const filteredSuggestions = products
        .filter((product) =>
          product.productName.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .map((product) => product.productName);
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [searchTerm, products]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setHighlightedIndex(-1); // Reset highlighted index on input change
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    // Use a timeout to ensure state update before hiding suggestions
    setTimeout(() => {
      hideSuggestions();
    }, 0);
  };

  const handleFilterChange = (filter) => {
    setSelectedFilters((prevSelectedFilters) =>
      prevSelectedFilters.includes(filter)
        ? prevSelectedFilters.filter((f) => f !== filter)
        : [...prevSelectedFilters, filter]
    );
  };

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

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.productName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      selectedFilters.length > 0
        ? selectedFilters.some((filter) =>
            product.productName.toLowerCase().includes(filter.toLowerCase())
          )
        : true;
    return matchesSearch && matchesFilter;
  });

  const categoryLabel =
    selectedFilters.length > 0
      ? selectedFilters
          .map((filter) => filter.charAt(0).toUpperCase() + filter.slice(1))
          .join(", ")
      : "All Products";

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      setHighlightedIndex((prevIndex) =>
        Math.min(prevIndex + 1, suggestions.length - 1)
      );
      e.preventDefault();
    } else if (e.key === "ArrowUp") {
      setHighlightedIndex((prevIndex) =>
        Math.max(prevIndex - 1, 0)
      );
      e.preventDefault();
    } else if (e.key === "Enter") {
      if (highlightedIndex >= 0) {
        handleSuggestionClick(suggestions[highlightedIndex]);
        e.preventDefault();
      }
    }
  };

  const hideSuggestions = () => {
    setSuggestions([]);
    setHighlightedIndex(-1);
  };

  return (
    <div className="shopByCategoryContainer">
      <div className="filterComponentContainer">
        <h3>Shop By Category</h3>
        <hr className="borderComponentDivider" />
        <ul style={{ listStyleType: "none", padding: 0 }}>
          <li>
            <label className="checkBoxLabelContainer">
              <input
                type="checkbox"
                value="makhana"
                onChange={() => handleFilterChange("makhana")}
                checked={selectedFilters.includes("makhana")}
              />
              Makhanas (Fox Nuts)
            </label>
          </li>
          <li>
            <label className="checkBoxLabelContainer">
              <input
                type="checkbox"
                value="chips"
                onChange={() => handleFilterChange("chips")}
                checked={selectedFilters.includes("chips")}
              />
              Chips
            </label>
          </li>
          {/* <li>
            <label className="checkBoxLabelContainer">
              <input
                type="checkbox"
                value="dips"
                onChange={() => handleFilterChange("dips")}
                checked={selectedFilters.includes("dips")}
              />
              Dips
            </label>
          </li> */}
        </ul>
      </div>
      <div className="productCardComponent">
        <div className="search-container">
          <input
            type="text"
            className="search-box"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown} // Add keydown handler
          />
          {suggestions.length > 0 && (
            <ul className={`suggestions-list ${suggestions.length > 0 ? 'active' : ''}`}>
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className={`suggestion-item ${index === highlightedIndex ? 'highlighted' : ''}`}
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>
        <hr className="borderComponentDivider" />
        <h3 className="allProductsHeadingBox">
          {categoryLabel} ({filteredProducts.length})
        </h3>
        <div className="mainBoxContainerAllProducts1">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div key={product._id} className="productCard2 card-1">
                <div className="productImageContainer">
                  <img
                    src={product.productImageUrl}
                    alt={product.productName}
                    onClick={() => handleProductClick(product._id)} // Navigate to the product details page on click
                    style={{ cursor: "pointer" }} 
                  />
                </div>
                <div className="productNameContainer"
                onClick={() => handleProductClick(product._id)} // Navigate to the product details page on product name click
                style={{ cursor: "pointer" }}
                >
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
      </div>
    </div>
  );
};

export default ShopByCategory;
