import React, { useEffect, useState } from "react";
import "./MyButton.css";

const MyButton = () => {
  const [isMobileScreen, setIsMobileScreen] = useState(false);

  useEffect(() => {
    const checkIfMobileScreen = () => {
      const screenWidth = window.innerWidth;
      setIsMobileScreen(screenWidth <= 768); // Adjust the breakpoint as per your needs
    };

    checkIfMobileScreen();
    window.addEventListener("resize", checkIfMobileScreen);

    return () => {
      window.removeEventListener("resize", checkIfMobileScreen);
    };
  }, []);

  const PracticeButtonChange = (): void => {
    const youtubeLink = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
    window.location.href = youtubeLink; // Redirect to YouTube link
  };

  return (
    <button
      type="button"
      value="practice"
      className="practice"
      onClick={PracticeButtonChange}
      style={{
        padding: "10px 45px",
        marginLeft: isMobileScreen ? "5vw" : "15vw",
      }}
    >
      Click Me
    </button>
  );
};

export default MyButton;
