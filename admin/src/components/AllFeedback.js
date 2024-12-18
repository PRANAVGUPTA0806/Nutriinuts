import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/AllFeedback.css";

const AllFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Fetch all feedbacks from the backend
  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/feedbacks`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Make sure you are sending the auth token if needed
          },
        });
        setFeedbacks(response.data);
      } catch (error) {
        console.error("Error fetching feedback:", error);
      }
    };

    fetchFeedbacks();
  }, []);

  // Handle deleting a feedback
  const handleDelete = async (id) => {
    // Ask for confirmation before proceeding with the deletion
    const isConfirmed = window.confirm("Are you sure you want to delete this feedback?");
  
    if (isConfirmed) {
      try {
        await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/feedback/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
  
        // Remove the deleted feedback from the state
        setFeedbacks(feedbacks.filter((feedback) => feedback._id !== id));
  
        // Show success alert
        alert("Feedback deleted successfully.");
      } catch (error) {
        // console.error("Error deleting feedback:", error);
        // Show error alert
        alert("Failed to delete feedback. Please try again later.");
      }
    }
  };
  
  

  // Filter feedbacks based on the search query
  const filteredFeedbacks = feedbacks.filter((feedback) =>
    feedback.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    feedback.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    feedback.feedback.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="feedback-container">
      <h2>All Feedback</h2>
      
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search feedback"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-bar"
      />

      {/* Feedback Table */}
      
      <div className='jj1'>
      <table className="feedback-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Feedback</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredFeedbacks.map((feedback) => (
            <tr key={feedback._id}>
              <td>{feedback.name}</td>
              <td>{feedback.email}</td>
              <td>{feedback.phone}</td>
              <td>{feedback.feedback}</td>
              <td>
                <button onClick={() => handleDelete(feedback._id)} className="delete-btn">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default AllFeedback;
