import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOffOutlined";
import InputAdornment from "@mui/material/InputAdornment";
import Input from "@mui/material/Input";
import IconButton from "@mui/material/IconButton";
import { Auth } from "aws-amplify";

require("./NewPasswordPage.css");

function NewPasswordPage(): JSX.Element {
  const [email, setEmail] = useState<string>("");
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [password, setPassword] = useState({
    value: "",
    showPassword: false,
  });

  const navigate = useNavigate();
  const mainScreenPath: string = "/"; // Main screen (login)
  const successPath: string = "/CreateAccount/Success";

  // function for submitting new password
  const awsNewPasswordSubmit = async (): Promise<string | boolean> => {
    const response = await Auth.forgotPasswordSubmit(
      email,
      verificationCode,
      password.value
    ).catch((error) => {
      const { code } = error;
      console.log(error);
      switch (code) {
        case "CodeMismatchException":
          alert("Please enter a valid code");
          return false;
        case "ExpiredCodeException":
          alert("Code has expired");
          return false;
        case "LimitExceededException":
          alert("Too many attempts, please try again later");
          return false;
        default:
          alert("Something went wrong: ".concat(code.toString()));
      }
      return false;
    });
    return response;
  };

  const buttonNavigation = async (
    e: React.MouseEvent<HTMLButtonElement>
  ): Promise<any> => {
    const checkAWS = await awsNewPasswordSubmit();
    if (!checkAWS) return;
    navigate(successPath);
  };

  const getFormData = (): string => {
    /*
        Desc: Gets all form data and coverts it into JSON
        Return: JSON string
        */
    const accountData = {
      email,
      verificationCode,
      password: password.value,
    };
    return JSON.stringify(accountData);
  };

  // Form Validation Functions
  const validateForm = (): boolean => {
    /*
        Desc: Validates all the form fields
        Return: boolean (true if all are valid, false if one is not)
        */
    const valid: boolean =
      validateEmail() && validateCode() && validatePassword();
    return valid;
  };

  const validateCode = (): boolean => {
    /*
        Desc: Validates phone number
        Return: boolean (true if valid, false if not)
        */
    if (verificationCode === "") {
      alert("Please add a phone number");
      return false;
    }
    return true;
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
    // else if (check if email already exists)
    // alert("Account with this email already exists")
    return true;
  };

  const validatePassword = (): boolean => {
    /*
        Desc: Validates password
        Return: boolean (true if valid, false if not)
        */
    const MIN_PASSWORD_LENGTH = 6;
    if (password.value === "") {
      alert("Please add password");
      return false;
    }
    if (password.value.length < MIN_PASSWORD_LENGTH) {
      alert(
        `Please choose a password at least ${MIN_PASSWORD_LENGTH} characters long`
      );
      return false;
    }
    return true;
  };

  // HTML Body
  return (
    <div>
      <div id="newPasswordBox">
        <p id="newPasswordText">New Password</p>
        <form id="createAccountForm">
          <p className="forgotPasswordMessage">
            Please check your email for a verification code, and fill out the
            fields accordingly.
          </p>

          <div className="labelInputBox">
            <p className="formLabel">Email</p>
            <input
              className="inputBox"
              type="text"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
            />
          </div>

          <div className="labelInputBox">
            <p className="formLabel">Verification Code</p>
            <input
              className="inputBox"
              type="text"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                console.log(e.target.value);
                setVerificationCode(e.target.value);
              }}
            />
          </div>

          <div className="labelInputBox">
            <p className="formLabel">New Password</p>
            <Input
              className="inputBox"
              id="passwordBox"
              value={password.value}
              type={password.showPassword ? "text" : "password"}
              disableUnderline
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword({ ...password, value: e.target.value })
              }
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={() =>
                      setPassword({
                        ...password,
                        showPassword: !password.showPassword,
                      })
                    }
                    onMouseDown={(e: React.MouseEvent<HTMLButtonElement>) =>
                      e.preventDefault()
                    }
                    edge="end"
                  >
                    {password.showPassword ? (
                      <VisibilityIcon className="passwordIcon" />
                    ) : (
                      <VisibilityOffIcon className="passwordIcon" />
                    )}
                  </IconButton>
                </InputAdornment>
              }
            />
          </div>
        </form>
        <button
          type="submit"
          value="submitButton"
          id="submitButton"
          onClick={buttonNavigation}
        >
          Submit
        </button>
        {/* <div className="logInBox">
          <p className="createAccountLogin">Didn't receive a code?</p>
          <Link
            to={mainScreenPath}
            className="createAccountLogin"
            id="logInLink"
          >
            Resend Code
          </Link>
        </div> */}
      </div>
    </div>
  );
}

export default NewPasswordPage;
