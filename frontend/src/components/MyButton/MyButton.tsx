import React from "react";
import "./MyButton.css";

const MyButton: React.FC = () => {
  return (
    <button onClick={() => alert("Henry Clicked This Button!")}>
      Click Me
    </button>
  );
};

export default MyButton;
