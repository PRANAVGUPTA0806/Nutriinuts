import React, { useState, useEffect } from "react";
import "../styles/StarRate.css";

const StarRate = ({ userId, productId, productModel }) => {
  const [rating, setRating] = useState(5); // Default rating is set to 5
  const [hover, setHover] = useState(null);
  const [totalStars] = useState(5); // Assuming 5 stars

  useEffect(() => {
    const fetchUserRating = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/rating/rating/${userId}/${productId}`);
        const data = await response.json();

        if (data.success) {
          setRating(data.rating); // Set the rating if found
        }
      } catch (error) {
        console.error("Error fetching user rating:", error);
      }
    };

    fetchUserRating();
  }, [userId, productId]); // Now, the useEffect depends only on userId and productId

  const saveRating = async (currentRating) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/rating/save-rating`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          productId,
          productModel, // Send the product model
          rating: currentRating,
        }),
      });

      const data = await response.json();

      if (data.success) {
        console.log("Rating saved successfully");
      } else {
        console.log("Error saving rating:", data.message);
      }
    } catch (error) {
      console.error("Error occurred while saving rating:", error);
    }
  };

  return (
    <>
      {[...Array(totalStars)].map((star, index) => {
        const currentRating = index + 1;

        return (
          <label key={index} className="starRatelabel">
            <input
              className="starinput"
              type="radio"
              name="rating"
              value={currentRating}
              onChange={() => {
                setRating(currentRating);
                saveRating(currentRating); // Save the rating when selected
              }}
            />
            <span
              className="star"
              style={{
                color: currentRating <= (hover || rating) ? "#ffc107" : "#e4e5e9",
              }}
              onMouseEnter={() => setHover(currentRating)}
              onMouseLeave={() => setHover(null)}
            >
              &#9733;
            </span>
          </label>
        );
      })}
      <p style={{ color: "black" }}>
        <br />
        "Your Rating": {rating}/5
      </p>
    </>
  );
};

export default StarRate;
