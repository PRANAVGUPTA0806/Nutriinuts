import React from "react";
import ProductCard from "./ProductCard";
import "../styles/AllProductPage.css";
function AllProductPage() {
  return (
    <div>
      <hr className="borderComponentDivider" />
      <div className="headingContainer">
        <h3>Our Different Range of Products!!</h3>
      </div>
      <div className="productCardContainer">
        <ProductCard />
        <ProductCard />
        <ProductCard />
        <ProductCard />
        <ProductCard />
        <ProductCard />
        <ProductCard />
        <ProductCard />
        <ProductCard />
        <ProductCard />
        <ProductCard />
        <ProductCard />
      </div>
    </div>
  );
}

export default AllProductPage;
