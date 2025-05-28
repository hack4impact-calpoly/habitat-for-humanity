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
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import {
  CountryCode,
  isValidPhoneNumber,
  parsePhoneNumberFromString,
} from "libphonenumber-js";

/* Backend */
import { addUser, updateMetadata, User } from "api/user";

import { useSignUp } from "@clerk/nextjs";

// import { debug } from "console";

require("../../../App.css");

function CreateAccountPage(): React.ReactNode {
  // const { uuid } = require('uuidv4');
  const { isLoaded, signUp, setActive } = useSignUp();
  const [verifying, setVerifying] = useState(false);
  const [code, setCode] = useState("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [password, setPassword] = useState({
    value: "",
    showPassword: false,
  });
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>("US");
  const [street, setStreet] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [zip, setZip] = useState<string>("");
  const [agreedToMarketing, setAgreedToMarketing] = useState<boolean>(false);

  // error messages
  const [userTypeError, setUserTypeError] = useState<string>("");
  const [nameError, setNameError] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [phoneNumberError, setPhoneNumberError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [homeAddressError, setHomeAddressError] = useState<string>("");
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
    let valid: boolean = validateName(firstName, lastName);
    valid = validateEmail(email) && valid;
    valid = validatePhoneNumber(phoneNumber) && valid;
    valid = validatePassword(password) && valid;
    valid = validateAddressFields() && valid;
    return valid;
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

  const validatePhoneNumber = (phoneNumber: string | undefined): boolean => {
    /*
        Desc: Validates phone number
        Return: boolean (true if valid, false if not)
        */
    if (!phoneNumber || phoneNumber === "") {
      setPhoneNumberError("Please enter a phone number");
      return false;
    } else if (!processPhoneNumber(phoneNumber)) {
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

  const validateAddressFields = (): boolean => {
    if (!street || !city || !state || !zip) {
      setHomeAddressError("Please enter your home address");
      return false;
    }
    setHomeAddressError("");
    return true;
  };

  function processPhoneNumber(phoneNumber: string): boolean {
    /*
    Desc: Converts phoneNumber string to number. Saves it in global variable processedPhoneNumber
    Return: boolean (true if number successfuly processed, false if not)
    */
    try {
      const processedString = phoneNumber.replace(/(?!^\+)[^\d]/g, "");
      if (!isMobilePhone(processedString, "en-US")) {
        setPhoneNumberError(
          "Please enter your phone number in the form XXX-XXX-XXXX",
        );
        return false;
      }
      setPhoneNumber(processedString);
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
        if (err.errors?.some((e: any) => e.code === "form_identifier_exists")) {
          setEmailError("Email is taken, please try another.");
        } else if (
          err.errors?.some(
            (e: any) => e.code === "form_password_length_too_short",
          )
        ) {
          setEmailError("Password must be at least 8 characters or more.");
        } else if (
          err.errors?.some((e: any) => e.code === "form_password_pwned")
        ) {
          setPasswordError(
            "Password has been found in an online data breach. For account safety, please use a different password.",
          );
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
        if (signUpAttempt.createdSessionId) {
          await updateMetadata(signUpAttempt.createdUserId);
        }
        await setActive({ session: signUpAttempt.createdSessionId });

        if (signUpAttempt.createdUserId != null) {
          const userData = {
            id: signUpAttempt.createdUserId,
            phone: phoneNumber,
            address: {
              street,
              city,
              state,
              zip,
            },
            marketingOption: agreedToMarketing,
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

  const handlePhoneChange = (value: string | undefined) => {
    if (value && isValidPhoneNumber(value)) {
      // Parse the phone number for the specified country (e.g., 'US')
      const parsedPhone = parsePhoneNumberFromString(value, selectedCountry);
      if (parsedPhone) {
        // Set the formatted phone number (E.164 format)
        setPhoneNumber(parsedPhone.format("E.164"));
        setPhoneNumberError(""); // Clear any previous error
      } else {
        setPhoneNumberError("Please enter a valid phone number");
      }
    } else {
      setPhoneNumberError("Please enter a valid phone number");
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
        <form onSubmit={handleVerify}>
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
        </form>
      </div>
    );
  }

  // HTML Body
  return (
    <>
      <Box id="createAccountStyles" sx={styles.container}>
        <Box id="createAccountBox">
          <img src="/images/ReStoreLogo.png" alt="logo" id="loginLogo" />
          <form id="createAccountForm">
            <div className="inputError">{userTypeError}</div>
            <div id="nameBox">
              <Box
                sx={{
                  display: "flex",
                  flexDirection: isMobile ? "column" : "row",
                  width: "100%",
                }}
              >
                <Box className="labelInputBox" id="firstNameBox">
                  <p className="formLabel">First Name</p>
                  <input
                    className="inputBox"
                    type="text"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setFirstName(e.target.value);
                      validateFirstName(e.target.value);
                    }}
                  />
                </Box>
                <Box className="labelInputBox" id="lastNameBox">
                  <p className="formLabel">Last Name</p>
                  <input
                    className="inputBox"
                    type="text"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setLastName(e.target.value);
                      validateLastName(e.target.value);
                    }}
                  />
                </Box>
              </Box>
            </div>
            <div className="inputError">{nameError}</div>

            <Box className="labelInputBox">
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
            </Box>

            <Box className="labelInputBox">
              <p className="formLabel">Phone Number</p>
              <PhoneInput
                className="inputBox"
                value={phoneNumber || ""}
                onChange={handlePhoneChange}
                defaultCountry="US"
                international={false}
                onCountryChange={(country) =>
                  setSelectedCountry(country || "US")
                }
              />
            </Box>

            <Box className="labelInputBox">
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
            </Box>
            {/* Street + City Row */}
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <Box sx={{ flex: 2 }}>
                <p className="formLabel">Street Address</p>
                <input
                  className="inputBox"
                  type="text"
                  onChange={(e) => setStreet(e.target.value)}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <p className="formLabel">City</p>
                <input
                  className="inputBox"
                  type="text"
                  onChange={(e) => setCity(e.target.value)}
                />
              </Box>
            </Box>

            {/* State + ZIP Row */}
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mt: 2 }}>
              <Box sx={{ flex: 1 }}>
                <p className="formLabel">State</p>
                <input
                  className="inputBox"
                  type="text"
                  onChange={(e) => setState(e.target.value)}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <p className="formLabel">ZIP Code</p>
                <input
                  className="inputBox"
                  type="text"
                  onChange={(e) => setZip(e.target.value)}
                />
              </Box>
            </Box>
            <Box sx={{ mt: 2 }}>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "0.95rem",
                }}
              >
                <input
                  type="checkbox"
                  checked={agreedToMarketing}
                  onChange={(e) => setAgreedToMarketing(e.target.checked)}
                />
                Receive marketing information from Habitat for Humanity
              </label>
            </Box>
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
