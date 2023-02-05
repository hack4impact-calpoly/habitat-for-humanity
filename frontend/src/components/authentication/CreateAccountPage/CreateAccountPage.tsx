import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Auth } from "aws-amplify";

import VisibilityIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOffOutlined";
import InputAdornment from "@mui/material/InputAdornment";
import Input from "@mui/material/Input";
import IconButton from "@mui/material/IconButton";
import isEmail from "validator/lib/isEmail";
import isMobilePhone from "validator/lib/isMobilePhone";
import { v4 as uuidv4 } from "uuid";
/* Backend */
import { addUser, User } from "api/user";
// import { debug } from "console";

require("./CreateAccountPage.css");

const CreateAccountPage = (): JSX.Element => {
  // const { uuid } = require('uuidv4');
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

  // Error messages
  const [userTypeError, setUserTypeError] = useState<string>("");
  const [nameError, setNameError] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [phoneNumberError, setPhoneNumberError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  let processedPhoneNumber: number; // Phone number converted from string

  const navigate = useNavigate();
  const mainScreenPath: string = "/"; // Main screen (login)
  const successPath: string = "/VerifyAccountPage";

  // Mobile View
  let nameBox: string = "nameBox";
  let administrator: string = "administrator";
  let accountTypeBox: string = "accountTypeBox";
  const [width, setWidth] = useState(window.innerWidth);

  const buttonNavigation = async (
    e: React.MouseEvent<HTMLButtonElement>
  ): Promise<any> => {
    e.preventDefault();
    let checkAWS = false;
    const valid = validateForm();

    if (valid) {
      checkAWS = await awsSignUp();
      console.log(checkAWS);
      if (checkAWS) {
        const user = await getFormData();
        addUser(user);
        navigate(successPath, {
          state: {
            email,
          },
        });
      }
    }
  };

  // awsSignUp to create an account for authentication, called in buttonNavigation
  let awsSignUp = async (): Promise<any> => {
    const username = email;
    const p = password.value;
    // let userID = ;
    // setID(userID);
    // console.log(userID)
    console.log(id);
    const response = await Auth.signUp({
      username,
      password: p,
      attributes: {
        "custom:id": id,
      },
      // const id = uuid.v4();
      // let response = await Auth.signUp(email, password.value, id): Observable<any> {
      //     const signUpParams: any = {
      //         email,
      //         password,
      //         attributes: {
      //             'custom:id': id,
      //         }
      //     };
      // return fromPromise(Auth.signUp(
      //     signUpParams
      // )
    }).catch((error) => {
      setPasswordError(error.message);
      return false;
    });
    return response;
  };

  async function getFormData() {
    /*
        Desc: Gets all form data and coverts it into JSON
        Return: JSON string
        */
    // let userAuth = await Auth.currentUserInfo();
    // console.log(userAuth);
    // let userAuth2 = await Auth.currentAuthenticatedUser();
    // console.log(userAuth2.username);
    // console.log(id);

    const accountData = {
      userType,
      firstName,
      lastName,
      email,
      phone: phoneNumber, // number(int) in form: 8057562501
      id,
      // password: password.value
    };
    return accountData as User;
  }

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
    if (firstName.match("\\s+")) {
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
    if (lastName.match("\\s+")) {
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
        `Please choose a password at least ${MIN_PASSWORD_LENGTH} characters long`
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
          "Please enter your phone number in the form XXX-XXX-XXXX"
        );
        return false;
      }
      // processedPhoneNumber = parseInt(processedString);
      setPhoneNumber(processedString);
    } catch (error) {
      console.error(error);
      setPhoneNumberError(
        "Sorry there was an error processing your phone number. Please enter it in the form XXX-XXX-XXXX"
      );
      return false;
    }
    return true;
  }

  function checkError(type: string) {
    validateForm();
  }

  // Mobile View

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [width]);

  // useEffect(() => {
  //   width < 640 && handleSideNavToggle();
  // }, [width]);

  // function handleSideNavToggle() {
  //   console.log("Mobile View Success");
  // }

  if (width <= 640) {
    nameBox = "";
    administrator = "admin";
    accountTypeBox = "";
  }

  // HTML Body
  return (
    <div>
      <div id="createAccountBox">
        <p id="createAccountText">Create an Account</p>
        <form id="createAccountForm">
          {/* Div for the user type section */}
          <div id={accountTypeBox}>
            <p id="userTypeLabel"> I am a </p>
            <div className="accountLabel">
              <input
                type="radio"
                className="userTypeButton"
                value="donor" // Specifies the value for the useState
                name="userType" // connects all options under group "userType" -> only one can be selected at a time
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setUserType(e.target.value);
                  validateUserType(e.target.value);
                }}
              />
              donor
              <input
                type="radio"
                className="userTypeButton"
                value="volunteer"
                name="userType"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setUserType(e.target.value);
                  validateUserType(e.target.value);
                }}
              />
              volunteer
              <input
                type="radio"
                className="userTypeButton"
                value="administrator"
                name="userType"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setUserType(e.target.value);
                  validateUserType(e.target.value);
                }}
              />
              {administrator}
            </div>
          </div>
          <div className="inputError">{userTypeError}</div>

          <div id={nameBox}>
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
        <button
          type="submit"
          value="signUpButton"
          id="signUpButton"
          onClick={buttonNavigation}
        >
          Sign Up
        </button>
        <div className="logInBox">
          <p className="createAccountLogin">Already have an account?</p>
          <Link
            to={mainScreenPath}
            className="createAccountLogin"
            id="logInLink"
          >
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
};

// const styles = {

//     @media only screen and (max-width: 640px) {
//         nameBox: {
//             display: "flex",
//             flexDirection: "column",
//             width: "100%",
//             alignItems: "left",
//             flexWrap: "wrap",
//         },
//     },
// } as const;

export default CreateAccountPage;
