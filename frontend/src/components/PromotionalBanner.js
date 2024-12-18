import React, { useEffect, useState } from "react";
import "../styles/PromotionalBanner.css";

function PromotionalBanner() {
  const [offer, setOffer] = useState(null);

  useEffect(() => {
    const fetchOffer = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/offers/offers`); // Fetch all offers
        const data = await response.json();
        if (data.length > 0) {
          // Pick one random offer from the list
          const randomOffer = data[Math.floor(Math.random() * data.length)];
          setOffer(randomOffer);
        }
      } catch (error) {
        console.error("Error fetching offers:", error);
      }
    };

    fetchOffer();
  }, []);

  return (
    <div className="marquee">
      <div className="insideMarqueeContainer">
        {offer ? (
          <span className="firstSpan">
            Get Rs.{offer.dis}/- off by Discount using code "{offer.discountCode}" valid till {new Date(offer.validTill).toLocaleDateString()}
          </span>
        ) : (
          <span>Loading offers...</span>
        )}
      </div>
    </div>
  );
}

export default PromotionalBanner;
