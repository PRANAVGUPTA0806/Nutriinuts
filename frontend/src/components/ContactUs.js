import React, { useState } from "react";
import "../styles/ContactUs.css";

function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    feedback: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    feedback: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear the error message for the field being typed in
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const validateForm = () => {
    let formIsValid = true;
    let newErrors = {};

    if (!formData.name.trim()) {
      formIsValid = false;
      newErrors.name = "Name is required.";
    }

    if (!formData.email.trim()) {
      formIsValid = false;
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      formIsValid = false;
      newErrors.email = "Invalid email address.";
    }

    if (!formData.phone.trim()) {
      formIsValid = false;
      newErrors.phone = "Phone number is required.";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      formIsValid = false;
      newErrors.phone = "Invalid phone number. Must be 10 digits.";
    }

    if (!formData.feedback.trim()) {
      formIsValid = false;
      newErrors.feedback = "Feedback or query is required.";
    }

    setErrors(newErrors);
    return formIsValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/submit`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const result = await response.json();

        if (response.ok) {
          alert("Your feedback is submitted");
          setFormData({
            name: "",
            email: "",
            phone: "",
            feedback: "",
          });
        } else {
          alert("serverError"+ result.message );
          setErrors({ ...errors, serverError: result.message });
        }
      } catch (error) {
        alert("serverError Failed to submit feedback." );
        setErrors({ ...errors, serverError: "Failed to submit feedback." });
      }
    }
  };

  return (
    <div className="contactUsMainContainer">
      <div className="contactUsDivHeading">
        <h1>Contact Us</h1>
      </div>
      <div className="feedbackFormDiv">
        <div className="feedbackFormDivHeading">
          <h1>Feedback or Query Form!!</h1>
        </div>
        <form onSubmit={handleSubmit} className="feedbackInputBox">
          <input
            type="text"
            name="name"
            placeholder="Enter Your Name"
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && <span className="errorText">{errors.name}</span>}

          <input
            type="email"
            name="email"
            placeholder="Enter Your Email ID"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <span className="errorText">{errors.email}</span>}

          <input
            type="text"
            name="phone"
            placeholder="Enter Your Phone Number"
            value={formData.phone}
            onChange={handleChange}
          />
          {errors.phone && <span className="errorText">{errors.phone}</span>}

          <textarea
            name="feedback"
            placeholder="Enter Your Feedback or Query"
            rows={12}
            cols={34}
            value={formData.feedback}
            onChange={handleChange}
          />
          {errors.feedback && <span className="errorText">{errors.feedback}</span>}

          <button type="submit" className="feedbackSubmitBtn">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default ContactUs;
