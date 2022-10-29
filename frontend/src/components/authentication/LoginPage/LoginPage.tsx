import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Auth } from "aws-amplify";
import { CognitoUser } from "amazon-cognito-identity-js";

import VisibilityIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOffOutlined";
import InputAdornment from "@mui/material/InputAdornment";
import Input from "@mui/material/Input";
import IconButton from "@mui/material/IconButton";
import isEmail from "validator/lib/isEmail";

import logo from "images/logo.png";
import "./LoginPage.css";

function LoginPage(): JSX.Element {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState({
    value: "",
    showPassword: false,
  });
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const navigate = useNavigate();

  const forgotPasswordPath = "/ForgotPassword";
  const createAccountPath = "/CreateAccount";
  const verifyAccountPath: string = "/VerifyAccountPage";

  // Function for logging into AWS account, called in login function
  const awsLogin = async (): Promise<CognitoUser | any> => {
    const response = await Auth.signIn(email, password.value).catch(
      async (error) => {
        const { code } = error;
        switch (code) {
          case "NotAuthorizedException": {
            setPasswordError("Please enter valid credentials");
            return false;
          }
          case "UserNotFoundException": {
            setPasswordError("User does not exist");
            return false;
          }
          case "UserNotConfirmedException": {
            // only checks email, i.e. wrong password w/correct (unconfirmed) email will still cause the exception
            const errorMessage = await awsSendNewCode();
            navigate(verifyAccountPath, {
              state: {
                email,
                verificationError: errorMessage,
              },
            });
            return false;
          }
          default: {
            setPasswordError(error);
            return false;
          }
        }
      }
    );
    return response;
  };

  let awsSendNewCode = async (): Promise<any> => {
    let errorMessage = "";
    const response = await Auth.resendSignUp(email).catch((error) => {
      const { code } = error;
      console.log(error);
      switch (code) {
        case "LimitExceededException":
          errorMessage = "Too many tries, please try again later";
          break;
        default:
          errorMessage = error.message;
      }
    });
    return errorMessage;
  };

  const login = async (
    e: React.MouseEvent<HTMLButtonElement>
  ): Promise<any> => {
    e.preventDefault();
    const valid = checkCredentials();
    if (valid) {
      const checkAWS = await awsLogin();
      if (checkAWS) {
        navigate("/Donor");
      }
    }
    /*
        else if (valid && admin){
            navigate("/Admin/Home");
        }
        else if (valid && volunteer){
            navigate("/Donator/Home");
        }
        else{
            alert("Sorry an unexpected error occured while logging you in");
        }
        */
  };
  const checkCredentials = (): boolean => {
    // reset error messages
    setEmailError("");
    setPasswordError("");
    let noErrors = true;

    if (email === "") {
      setEmailError("Please enter an email");
      noErrors = false;
    } else if (!isEmail(email)) {
      setEmailError("Please enter a valid email (no spaces)");
      noErrors = false;
    }
    if (password.value === "") {
      setPasswordError("Please enter your password");
      noErrors = false;
    } // check other invalid errors
    return noErrors;
    // if no errors/valid login -> redirect to logged in page
  };

  return (
    <div id="loginBox">
      <img src={logo} alt="logo" id="loginLogo" />
      <form id="loginForm">
        <p className="loginLabel">Email</p>
        <input
          className="loginInput"
          type="text"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setEmail(event?.target?.value)
          }
        />
        <div className="inputError">{emailError}</div>
        <div id="loginPassword">
          <p className="loginLabel">Password</p>
          <Link to={forgotPasswordPath} id="loginForgotPassword">
            Forgot Password?
          </Link>
        </div>
        <Input
          className="loginInput"
          id="passwordBox"
          value={password.value}
          type={password.showPassword ? "text" : "password"}
          disableUnderline
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setPassword({ ...password, value: event?.target?.value })
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
                onMouseDown={(event: React.MouseEvent<HTMLButtonElement>) =>
                  event?.preventDefault()
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
        <div className="inputError">{passwordError}</div>
        <button type="button" id="loginSubmit" onClick={login}>
          Log In
        </button>
      </form>
      <div style={{ textAlign: "right", marginTop: "10px" }}>
        <p className="loginCreateAccount">{`Don't have an account? `}</p>
        <Link
          to={createAccountPath}
          className="loginCreateAccount"
          id="createAccountLink"
        >
          Create Account
        </Link>
      </div>
    </div>
  );
}

export default LoginPage;
