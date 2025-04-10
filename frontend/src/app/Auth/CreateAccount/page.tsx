"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Box, useMediaQuery } from "@mui/material";

import VisibilityIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOffOutlined";
import InputAdornment from "@mui/material/InputAdornment";
import Input from "@mui/material/Input";
import IconButton from "@mui/material/IconButton";
import isEmail from "validator/lib/isEmail";
import isMobilePhone from "validator/lib/isMobilePhone";
import { v4 as uuidv4 } from "uuid";

/* Backend */
import { addUser, updateMetadata, User } from "api/user";
import { BsBoxArrowInDown } from "react-icons/bs";

import { useSignUp } from "@clerk/nextjs";

// import { debug } from "console";

require("../../../App.css");

function CreateAccountPage(): React.ReactNode {
  // const { uuid } = require('uuidv4');
  const { isLoaded, signUp, setActive } = useSignUp();
  const [verifying, setVerifying] = useState(false);
  const [code, setCode] = useState("");
  const [userType, setUserType] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [password, setPassword] = useState({
    value: "",
    showPassword: false,
  });
  const [id, setID] = useState<string>(uuidv4());

  // error messages
  const [userTypeError, setUserTypeError] = useState<string>("");
  const [nameError, setNameError] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [phoneNumberError, setPhoneNumberError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  let processedPhoneNumber: number; // Phone number converted from string

  const router = useRouter();
  const mainScreenPath: string = "/Auth/Login"; // Main screen (login)
  // const successPath: string = "/VerifyAccountPage";

  // Form Validation Functions
  const validateForm = (): boolean => {
    /*
        Desc: Validates all the form fields
        Return: boolean (true if all are valid, false if one is not)
        */
    let valid: boolean = validateUserType(userType);
    valid = validateName(firstName, lastName) && valid;
    valid = validateEmail(email) && valid;
    valid = validatePhoneNumber(phoneNumber) && valid;
    valid = validatePassword(password) && valid;
    return valid;
  };

  const validateUserType = (userType: string): boolean => {
    /*
        Desc: Validates userTypes (donor, volunteer, administrator)
        Return: boolean (true if valid, false if not)
        */
    if (userType === "") {
      setUserTypeError("Please select an account type");
      return false;
    }
    setUserTypeError("");
    return true;
  };

  const validateName = (firstName: string, lastName: string): boolean => {
    /*
        Desc: Validates firstName and lastName
        Return: boolean (true if valid, false if not)
        */
    // setErrorMessages({...errorMessagesInitial});
    if (!validateFirstName(firstName) && !validateLastName(lastName)) {
      setNameError("Please enter your full name");
      return false;
    }
    if (validateFirstName(firstName) && validateLastName(lastName)) {
      return true;
    }
    return false;
  };
  const validateFirstName = (firstName: string): boolean => {
    /*
        Desc: Validates firstName and lastName
        Return: boolean (true if valid, false if not)
        */
    // setErrorMessages({...errorMessagesInitial});
    if (!firstName || firstName.match("\\s+")) {
      setNameError("Please enter your first name");
      return false;
    }
    setNameError("");
    return true;
  };

  const validateLastName = (lastName: string): boolean => {
    /*
        Desc: Validates firstName and lastName
        Return: boolean (true if valid, false if not)
        */
    // setErrorMessages({...errorMessagesInitial});
    if (!lastName || lastName.match("\\s+")) {
      setNameError("Please enter your last name");
      return false;
    }
    setNameError("");
    return true;
  };

  const validatePhoneNumber = (phoneNumber: string): boolean => {
    /*
        Desc: Validates phone number
        Return: boolean (true if valid, false if not)
        */
    if (phoneNumber === "") {
      setPhoneNumberError("Please enter a phone number");
      return false;
    }
    if (!processPhoneNumber(phoneNumber)) {
      return false;
    }
    setPhoneNumberError("");
    return true;
  };

  const validateEmail = (email: string): boolean => {
    /*
        Desc: Validates email
        Return: boolean (true if valid, false if not)
        */
    if (email === "") {
      setEmailError("Please enter your email");
      return false;
    }
    if (!isEmail(email)) {
      setEmailError("Please enter a valid email address");
      return false;
    }
    setEmailError("");
    return true;
  };

  const validatePassword = (password: { value: string }): boolean => {
    /*
        Desc: Validates password
        Return: boolean (true if valid, false if not)
        */
    const MIN_PASSWORD_LENGTH = 8;
    if (password.value === "") {
      setPasswordError("Please enter a password");
      return false;
    }
    if (password.value.length < MIN_PASSWORD_LENGTH) {
      setPasswordError(
        `Please choose a password at least ${MIN_PASSWORD_LENGTH} characters long`,
      );
      return false;
    }
    setPasswordError("");
    return true;
  };

  function processPhoneNumber(phoneNumber: string): boolean {
    /*
    Desc: Converts phoneNumber string to number. Saves it in global variable processedPhoneNumber
    Return: boolean (true if number successfuly processed, false if not)
    */
    try {
      const processedString = phoneNumber.replace(/[^0-9]/g, "");
      if (!isMobilePhone(processedString, "en-US")) {
        setPhoneNumberError(
          "Please enter your phone number in the form XXX-XXX-XXXX",
        );
        return false;
      }
      setPhoneNumber("+" + processedString);
    } catch (error) {
      console.error(error);
      setPhoneNumberError(
        "Sorry there was an error processing your phone number. Please enter it in the form XXX-XXX-XXXX",
      );
      return false;
    }
    return true;
  }

  // checks if page is in mobile view
  const isMobile = useMediaQuery("(max-width: 640px)");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoaded) return;
    const valid = validateForm();
    if (valid) {
      try {
        console.log(phoneNumber);
        await signUp.create({
          firstName,
          lastName,
          emailAddress: email,
          password: password.value,
        });

        await signUp.prepareEmailAddressVerification({
          strategy: "email_code",
        });

        setVerifying(true);
      } catch (err: any) {
        if (err.errors?.some((e: any) => e.code === 'form_identifier_exists')) {
          setEmailError('Email is taken, please try another.')
        } else if (err.errors?.some((e: any) => e.code === 'form_password_length_too_short')) {
          setEmailError('Password must be at least 8 characters or more.');
        } else if (err.errors?.som((e: any) => e.code === 'form_password_pwned')) {
          setPasswordError('Password has been found in an online data breach. For account safety, please use a different password.')
        }
        console.error(JSON.stringify(err, null, 2));
      }
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoaded) return;

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (signUpAttempt.status === "complete") {
        await updateMetadata(userType, signUpAttempt.createdUserId);
        await setActive({ session: signUpAttempt.createdSessionId });
        
        if (signUpAttempt.createdUserId != null) {
          const userData = {
            id: signUpAttempt.createdUserId,
            phone: phoneNumber,
          };
          await addUser(userData);
          console.log("User data added successfully");
          router.push("/");
        } else {
          console.error("Error userId not created.");
        }
        router.push("/");
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error("Error:", JSON.stringify(err, null, 2));
    }
  };

  // Display the verification form to capture the OTP code
  if (verifying) {
    return (
      <div id="forgotPasswordBox">
        <p id="forgotPasswordText">Confirm Email</p>
        <p className="forgotPasswordMessage">
          Please enter the confirmation code that has been sent to your email.
        </p>
      <>
        <h1>Verify your email</h1>
        <form onSubmit={handleVerify}>
          <label id="code">Enter your verification code</label>
          <input
            value={code}
            className="inputBox"
            id="code"
            name="code"
            onChange={(e) => setCode(e.target.value)}
          />
          <button type="submit" id="sendButton">
            Verify
          </button>
          <button type="submit">Verify</button>
        </form>
        </div>
      </>
    );
  }

  // HTML Body
  return (
    <>
      <Box id="createAccountStyles" sx={styles.container}>
        <Box id="createAccountBox">
          <p id="createAccountText">Create an Account</p>
          <form id="createAccountForm">
            {/* Div for the user type section */}
            <div id="accountTypeBox">
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  width: "100%",
                }}
              >
                <Box sx={{ marginBottom: { xs: "10px", md: "0rem" } }}>
                  <p id="userTypeLabel"> I am a </p>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "left",
                    gap: "0.5rem",
                    width: "100%",
                  }}
                >
                  <Box className="radioContainer">
                    <input
                      type="radio"
                      className="userTypeButton"
                      value="Donor" // Specifies the value for the useState
                      name="userType" // connects all options under group "userType" -> only one can be selected at a time
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setUserType(e.target.value);
                        validateUserType(e.target.value);
                      }}
                    />
                    <span className="accountLabel">Donor</span>
                  </Box>
                  <Box className="radioContainer">
                    <input
                      type="radio"
                      className="userTypeButton"
                      value="Volunteer"
                      name="userType"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setUserType(e.target.value);
                        validateUserType(e.target.value);
                      }}
                    />
                    <span className="accountLabel">Volunteer</span>
                  </Box>
                </Box>
              </Box>
            </div>

            <div className="inputError">{userTypeError}</div>
            <div id="nameBox">
              <Box
                sx={{
                  display: "flex",
                  flexDirection: isMobile ? "column" : "row",
                  width: "100%",
                }}
              >
                <div className="labelInputBox" id="firstNameBox">
                  <p className="formLabel">First Name</p>
                  <input
                    className="inputBox"
                    type="text"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setFirstName(e.target.value);
                      validateFirstName(e.target.value);
                    }}
                  />
                </div>
                <div className="labelInputBox" id="lastNameBox">
                  <p className="formLabel">Last Name</p>
                  <input
                    className="inputBox"
                    type="text"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setLastName(e.target.value);
                      validateLastName(e.target.value);
                    }}
                  />
                </div>
              </Box>
            </div>
            <div className="inputError">{nameError}</div>

            <div className="labelInputBox">
              <p className="formLabel">Email</p>
              <input
                className="inputBox"
                type="text"
                autoComplete="email"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setEmail(e.target.value);
                  validateEmail(e.target.value);
                }}
              />
              <div className="inputError">{emailError}</div>
            </div>

            <div className="labelInputBox">
              <p className="formLabel">Phone Number</p>
              <input
                className="inputBox"
                type="text"
                autoComplete="phone"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setPhoneNumber(e.target.value);
                  validatePhoneNumber(e.target.value);
                }}
              />
              <div className="inputError">{phoneNumberError}</div>
            </div>

            <div className="labelInputBox">
              <p className="formLabel">Password</p>
              <Input
                className="inputBox"
                id="passwordBox"
                value={password.value}
                type={password.showPassword ? "text" : "password"}
                disableUnderline
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setPassword({ ...password, value: e.target.value });
                  validatePassword({ ...password, value: e.target.value });
                }}
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
              <div className="inputError">{passwordError}</div>
            </div>
          </form>
          <div id="clerk-captcha"></div>
          <button
            type="submit"
            value="signUpButton"
            id="signUpButton"
            onClick={handleSubmit}
          >
            Sign Up
          </button>
          <div className="logInBox">
            <p className="createAccountLogin">Already have an account?</p>
            <Link
              href={mainScreenPath}
              className="createAccountLogin"
              id="logInLink"
            >
              Log In
            </Link>
          </div>
        </Box>
      </Box>
    </>
  );
}

const styles = {
  container: {
    display: "flex",
    width: "100%",
    height: "100%",
    justifyContent: "center",
  },
  createAccountCard: {
    width: "50%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    boxSizing: "border-box",
    textAlign: "center",
    backgroundColor: "white",
    boxShadow: "0px 10px 24px rgba(0, 0, 0, 0.25)",
  },
} as const;

export default CreateAccountPage;