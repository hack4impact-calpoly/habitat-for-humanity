import React, { useState } from "react";
import "./MyButton.css";

const MyButton = () => {
  const [details, setDetails] = useState("");

  const handleClick = () => {
    setDetails("Jonathan Lau\nComputer Science\n3rd Year");
  };

  return (
    <div className="button-container">
      <button className="myButton" onClick={handleClick} type="button">
        {details || "Click Me!"}
      </button>
    </div>
  );
};

export default MyButton;
