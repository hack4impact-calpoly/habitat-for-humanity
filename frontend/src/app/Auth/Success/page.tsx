"use client";

import React from "react";
import { useRouter } from "next/navigation";
import checkCircle from "../../../images/CheckCircle.png";

require("../../../App.css");

function SuccessPage(): React.ReactNode {
  const router = useRouter();
  const mainScreenPath: string = "/";

  const buttonNavigation = (e: React.MouseEvent<HTMLButtonElement>): void => {
    router.push(mainScreenPath);
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
