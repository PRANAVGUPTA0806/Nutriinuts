import React, { useState } from "react";
import "../styles/ProductCard.css";

function ProductCard(props) {
  //Add to Cart Animation Logic
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = (event) => {
    if (!isLoading) {
      setIsLoading(true);
      setTimeout(() => setIsLoading(false), 3700);
      props.onClick?.(event); // Call passed onClick handler if present
    }
    event.preventDefault();
  };
  //Add to Cart Animation Ends Here

  return (
    <div className="productCard card-1">
      <div className="productImageContainer">
        <img
          src="https://res.cloudinary.com/dfagcn631/image/upload/v1721987516/productimgsample_w540lq.png"
          alt=""
        />
      </div>
      <div className="productNameContainer">
        <span>Chocolate - Makhanas (Fox Nuts)</span>
      </div>
      <div className="productPriceContainer">
        <span>Rs. 345</span>
      </div>
      <div className="productAddToCartButton">
        <button
          class="button"
          className={isLoading ? "button loading" : "button"}
          onClick={handleClick}
          disabled={isLoading}
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
  );
}

export default ProductCard;
