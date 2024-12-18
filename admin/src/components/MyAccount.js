import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../styles/MyAccount.module.css";

function MyAccount() {
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    avatar: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state for avatar upload
  const [token, setToken] = useState("");
  const [errors, setErrors] = useState({});
  
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/api/user/profile`, {
          headers: { Authorization: `Bearer ${storedToken}` },
        })
        .then((response) => {
          setUserDetails({
            name: response.data.name,
            email: response.data.email,
            phoneNumber: response.data.phoneNumber,
            avatar: response.data.imageUrl || "",
          });
        })
        .catch((error) => {
          console.error("Error fetching user details:", error);
        });
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "phoneNumber") {
      const numericValue = value.replace(/\D/g, ""); // only allow digits
      setUserDetails({
        ...userDetails,
        [name]: numericValue,
      });

      if (numericValue.length === 0) {
        setErrors({ ...errors, phoneNumber: "" }); // Clear error when empty
      } else if (numericValue.length < 10) {
        setErrors({ ...errors, phoneNumber: "Phone number must be 10 digits." });
      } else if (numericValue.length > 10) {
        setErrors({ ...errors, phoneNumber: "Phone number cannot exceed 10 digits." });
      } else {
        setErrors({ ...errors, phoneNumber: "" }); // No error when exactly 10 digits
      }
    }

    // Password validation (dynamically as user types)
    if (name === "password") {
      setUserDetails({
        ...userDetails,
        [name]: value,
      });

      if (value.length === 0) {
        setErrors({ ...errors, password: "" }); // Clear error when empty
      } else if (value.length < 8) {
        setErrors({ ...errors, password: "Password is too short. It should be at least 8 characters long." });
      } else if (!/[!@#$%^&*]/.test(value)) {
        setErrors({ ...errors, password: "Password must contain at least one special character." });
      } else if (!/\d/.test(value)) {
        setErrors({ ...errors, password: "Password must contain at least one digit." });
      } else {
        setErrors({ ...errors, password: "" }); // Clear error when valid
      }
    }
  };

  const handleSave = () => {
    if (token) {
      axios
        .put(
          `${process.env.REACT_APP_BACKEND_URL}/api/user/profile`,
          {
            name: userDetails.name,
            email: userDetails.email,
            phoneNumber: userDetails.phoneNumber,
            avatar: userDetails.avatar,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then((response) => {
          setEditMode(false);
          localStorage.setItem("avatar", response.data.imageUrl);
          alert("Profile updated successfully!"); // Success message
          
        })
        .catch((error) => {
          console.error("Error updating profile:", error);
          alert("Error updating profile."); // Error message
        });
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUploadAvatar = async () => {
    if (selectedFile) {
      setLoading(true); // Start loader
      const formData = new FormData();
      formData.append("image", selectedFile);

      try {
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/api/upload`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUserDetails((prevDetails) => ({
          ...prevDetails,
          avatar: response.data.imageUrl,
        }));
        alert("Avatar uploaded successfully!"); // Success message
      } catch (error) {
        console.error("Error uploading avatar:", error);
        alert("Error uploading avatar."); // Error message
      } finally {
        setLoading(false); // Stop loader
      }
    }
  };

  return (
    <div className={styles.myAccountContainer}>
      <h2>My Account</h2>
      <div className={styles.profileDetails}>
        <label>Name:</label>
        {editMode ? (
          <input
            type="text"
            name="name"
            value={userDetails.name}
            onChange={handleInputChange}
          />
        ) : (
          <span>{userDetails.name}</span>
        )}
      </div>
      <div className={styles.profileDetails}>
        <label>Email:</label>
        {editMode ? (
          <input
            type="email"
            name="email"
            value={userDetails.email}
            onChange={handleInputChange}
          />
        ) : (
          <span>{userDetails.email}</span>
        )}
      </div>
      <div className={styles.profileDetails}>
        <label>Phone Number:</label>
        {editMode ? (
          <div>
          <input
            type="tel"
            name="phoneNumber"
            value={userDetails.phoneNumber}
            onChange={handleInputChange}
          />
          {errors.phoneNumber && <span className={styles.error}>{errors.phoneNumber}</span>}
        </div>
        ) : (
          <span>{userDetails.phoneNumber}</span>
        )}
      </div>
      <div className={styles.actions}>
        {editMode ? (
          <button onClick={handleSave} className={styles.saveButton}>
            Save
          </button>
        ) : (
          <button
            onClick={() => setEditMode(true)}
            className={styles.editButton}
          >
            Edit Profile
          </button>
        )}
      </div>
      <div className={styles.avatarContainer}>
        <img
          src={
            userDetails.avatar ||
            "https://res.cloudinary.com/dfagcn631/image/upload/v1727625796/uploads/defaultavatar.png"
          }
          alt="User Avatar"
          className={styles.avatar}
        />
        {editMode && (
          <>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            <button onClick={handleUploadAvatar} className={styles.uploadButton} disabled={loading}>
              {loading ? "Uploading..." : "Set Avatar"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default MyAccount;
