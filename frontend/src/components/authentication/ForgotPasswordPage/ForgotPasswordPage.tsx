import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "aws-amplify";

require("./ForgotPasswordPage.css");

function ForgotPasswordPage(): JSX.Element {
  const [email, setEmail] = useState<string>("");

  const navigate = useNavigate();

  // Function for calling Auth.forgotPassword, called in buttonNavigation
  const awsForgotPassword = async (): Promise<any> => {
    const response = await Auth.forgotPassword(email).catch((error) => {
      const { code } = error;
      console.log(error);
      switch (code) {
        case "UserNotFoundException":
          alert("Email does not exist in our system");
          return false;
        case "LimitExceededException":
          alert(
            "Too many tries, please wait and try again in a couple minutes"
          );
          return false;
        default:
          return true;
      }
    });
    return response;
  };
  const buttonNavigation = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): Promise<void> => {
    const mainScreenPath: string = "/"; // Main screen (login)
    const successPath: string = "/NewPassword";
    const checkAWS = await awsForgotPassword();
    const target = e.target as HTMLTextAreaElement;
    if (target.value === "sendButton") {
      if (submitData() && checkAWS) {
        navigate(successPath);
      }
    }
  };

  const submitData = (): boolean => {
    if (validateEmail()) {
      const JSONstring = getFormData();
      console.log(JSONstring);
      // connect to backend code
      return true;
    }
    return false;
  };

  const getFormData = (): string => {
    const forgotEmail = {
      email,
    };
    return JSON.stringify(forgotEmail);
  };

  const validateEmail = (): boolean => {
    /*
        Desc: Validates email
        Return: boolean (true if valid, false if not)
        */
    if (email === "") {
      alert("Please add email");
      return false;
    }
    if (!email.includes("@")) {
      alert("Please enter a valid email address");
      return false;
    }
    return true;
  };

  // HTML Body
  return (
    <div>
      <div id="forgotPasswordBox">
        <p id="forgotPasswordText">Forgot Password</p>
        <p className="forgotPasswordMessage">
          Please enter the email associated with your account to receive a
          confirmation code.
        </p>
        <p className="emailInput">Email</p>
        <input
          className="inputBox"
          type="text"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setEmail(e?.target?.value)
          }
        />
        <button
          value="sendButton"
          id="sendButton"
          onClick={buttonNavigation}
          type="submit"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
