import React from "react";
import "../styles/TestimonialPage.css";

const testimonials = [
  {
    id: 1,
    name: "John Doe",
    location: "New York, USA",
    testimonial: "I absolutely love the variety of snacks available! They are perfect for my movie nights.",
    image: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    id: 2,
    name: "Jane Smith",
    location: "Los Angeles, USA",
    testimonial: "The quality of these snacks is amazing! I can't get enough of the makhana.",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
  },
  {
    id: 3,
    name: "Mike Johnson",
    location: "Chicago, USA",
    testimonial: "Fast delivery and delicious snacks. My family loves them!",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
  },
  {
    id: 4,
    name: "Sarah Lee",
    location: "Miami, USA",
    testimonial: "The dips are fantastic! Great flavors that everyone enjoys.",
    image: "https://randomuser.me/api/portraits/women/2.jpg",
  },
];

function TestimonialPage() {
  return (
    <div className="testimonialContainer">
      
      <h2>What Our Customers Say</h2>
      <div className="testimonialCards">
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="testimonialCard">
            <img src={testimonial.image} alt={testimonial.name} className="testimonialImage" />
            <div className="testimonialContent">
              <p className="testimonialText">"{testimonial.testimonial}"</p>
              <h4 className="testimonialName">{testimonial.name}</h4>
              <span className="testimonialLocation">{testimonial.location}</span>
            </div>
          </div>
        ))}
      </div>
      <div>
    </div><div>
    <img
    src="https://www.farmley.com/cdn/shop/files/FINALLLLLL_1800x.jpg?v=1674649795"
    alt="Promotional Banner"
    className="bannerImage"/>
    </div>
    </div>

    
    
  );
}

export default TestimonialPage;