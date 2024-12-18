import React, { useEffect, useState } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "../styles/ImageSlider.css";
import { Carousel } from "react-responsive-carousel";
import axios from "axios";

function ImageSlider() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/home/`
        );
        setImages(response.data); 
        setLoading(false);
      } catch (error) {
        console.error("Error fetching images:", error);
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="imageSliderContainer">
      <Carousel
        autoPlay              // Enables automatic sliding
        infiniteLoop          // Keeps the carousel looping
        interval={2000}       // 2 seconds between slides
        showArrows={false}    // Hides the arrows
        showThumbs={false}    // Hides the thumbnail indicators
        showStatus={false}    // Hides the slide status
        stopOnHover={false}   // Keeps the autoplay even when hovered
        transitionTime={500}  // Sets the transition speed
      >
        {images.map((image, index) => (
          <div key={index} className="sliderImage">
            <img src={image.productImageUrl} alt={image.productName} />
          </div>
        ))}
      </Carousel>
    </div>
  );
}

export default ImageSlider;
