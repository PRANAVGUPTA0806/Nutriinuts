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
          src="https://res.cloudinary.com/dwprhpk9r/image/upload/v1737643273/cropped-OneSnack-Logo-without-bg-22_mttelg.png"
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
