import React, { useState, useEffect } from "react";
import "../styles/Loader.css";
const TextTyper = () => {
  const [typedText, setTypedText] = useState("");
  const text = "Happy & Healthy Snacking !!!";

  useEffect(() => {
    let i = 0;
    const intervalId = setInterval(() => {
      setTypedText(text.substring(0, i + 1));
      i++;
      if (i > text.length) {
        clearInterval(intervalId);
      }
    }, 100); // adjust the speed to your needs
  }, [text]);

  return <span>{typedText}</span>;
};

const Loader = () => {
  return (
    <div className="loader-container">
      <div className="logo-container">
        <img
          src="https://res.cloudinary.com/dfagcn631/image/upload/v1721987516/logoimg_epbsrt.png"
          alt="Company Logo"
        />
      </div>
      <div className="text-container">
        <TextTyper />
      </div>
    </div>
  );
};

export default Loader;
