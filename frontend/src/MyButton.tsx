import React, { useState } from "react";
import "./MyButton.css";

function MyButton() {
  const [showInfo, setShowInfo] = useState(false);

  const handleClick = () => {
    setShowInfo(!showInfo);
  };

  return (
    <div className="style">
      <button type="button" onClick={handleClick}>
        {showInfo ? "Click Me!" : "Go back"}
      </button>
      {showInfo && <p>Hi, my name is Anna Huang!</p>}
    </div>
  );
}

export default MyButton;
