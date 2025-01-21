import React, { useState } from "react";
import "./MyButton.css";

const MyButton = () => {
  const [details, setDetails] = useState("");

  const handleClick = () => {
    setDetails("Anthony Mendoza\n3rd Year\nComputer Science");
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
