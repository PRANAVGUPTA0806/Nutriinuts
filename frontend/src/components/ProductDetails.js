import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import "../styles/ProductDetails.css";
import StarRate from "./StarRate";

const ProductDetails = () => {
    const navigate = useNavigate();
    const { productId } = useParams(); // Extract productId from the URL
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingStates, setLoadingStates] = useState({});
    const [offer, setOfferText] = useState(null);

    const handleClick = (product) => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Login/Signup first");
            navigate("/login");
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

    const handleAddToCart = async (products_id) => {
        await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/cart`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ products_id, quantity: 1 }),
        });
    };

    useEffect(() => {
        const fetchProductDetails = async () => {
            const endpoints = [
                `${process.env.REACT_APP_BACKEND_URL}/api/allproducts/${productId}`,
                `${process.env.REACT_APP_BACKEND_URL}/api/gifting/${productId}`,
                `${process.env.REACT_APP_BACKEND_URL}/api/newlaunches/${productId}`
            ];

            
            for (const endpoint of endpoints) {
                try {
                    const response = await fetch(endpoint);
                    if (response.ok) {
                        const data = await response.json();
                        setProduct(data);
                        setLoading(false);
                        return;
                    }
                } catch (error) {
                    console.error(`Error fetching from ${endpoint}:`, error);
                }
            }

            setLoading(false);
        };

        const fetchOffers = async () => {
          try{
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/offers/offers`); // Adjust the URL as needed
            const data = await response.json();
        if (data.length > 0) {
          // Pick one random offer from the list
          const randomOffer = data[Math.floor(Math.random() * data.length)];
          setOfferText(randomOffer);
        }} catch (error) {
          console.error("Error fetching offers:", error);
        }
        };

        fetchProductDetails();
        fetchOffers();
    }, [productId]);

    if (loading) {
        return <div id='pc' style={{
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
      }}>Loading product details...</div>;
    }

    if (!product) {
        return <div id='ac' style={{
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
      }}>Product not found.</div>;
    }

    return (
        <div id="product-details">
            <div id="product-image-container">
                <img src={product.productImageUrl} alt={product.productName} />
                {/* Optional product slider can go here */}
            </div>
            <div id="product-info">
                <h2 id="product-name">{product.productName}</h2>
                <p id="product-price">Price: ₹{product.productPrice}</p>
                <p id="product-discount">{product.discountPercentage}</p> {/* Displaying discount */}
                <div id="product-rating">
                    <StarRate userId={localStorage.getItem("id")} productId={product._id} productModel="allProducts" />
                    {/* <p>Rating: {product.rating} / 5</p> */}
                </div>
                <div id="product-description">
                    <p>{product.productDescription}</p>
                </div>
                <div className="productAddToCartButton">
                    <button
                        className={loadingStates[product.products_id] ? "button loading" : "button"}
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
                {offer && offer.dis && offer.discountCode && offer.validTill && (
    <div id="offer-section">
        <span>
            Special Offer: Get Rs.{offer.dis}/- off by using code "{offer.discountCode}" valid till {new Date(offer.validTill).toLocaleDateString()}
        </span>
    </div>
)}
            </div>
        </div>
    );
};

export default ProductDetails;
