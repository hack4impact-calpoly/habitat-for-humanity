import React from "react";
import { useNavigate } from "react-router-dom";
import checkCircle from "../../../images/CheckCircle.png";

require("./SuccessPage.css");

function SuccessPage(): JSX.Element {
  const navigate = useNavigate();
  const mainScreenPath: string = "/";

  const buttonNavigation = (e: React.MouseEvent<HTMLButtonElement>): void => {
    navigate(mainScreenPath);
  };

  return (
    <div id="successBox">
      <img id="checkCircle" src={checkCircle} alt="checkCircle" />
      <h1>Success</h1>
      <p>You have successfully signed up for an account.</p>
      <button type="submit" id="successButton" onClick={buttonNavigation}>
        Log In
      </button>
    </div>
  );
}

export default SuccessPage;
