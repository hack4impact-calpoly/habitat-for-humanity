import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "aws-amplify";
import { getUserByID } from "api/user";
import DonatorNavbar from "../DonorNavbar/DonorNavbar";

require("./DonorProfileEditPage.css");

function DonatorProfileEditPage(): JSX.Element {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  let processedPhoneNumber: number; // Phone number converted from string

  const [user, setUser] = useState<any>([]);

  useEffect(() => {
    async function getUser() {
      const userAuth = await Auth.currentUserInfo();
      const user = await getUserByID(userAuth.username);
      setUser(user);
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setEmail(user.email);
      setPhoneNumber(user.phone);
    }
    getUser();
  }, []);

  const navigate = useNavigate();

  const buttonNavigation = (e: React.MouseEvent<HTMLButtonElement>): void => {
    const backPath: string = "/Donor/Profile"; // Change once page is added
    const saveChangesPath: string = "/Donor/Profile";

    if (e.currentTarget.value === "backButton") {
      navigate(backPath);
    } else if (e.currentTarget.value === "saveChangesButton") {
      if (submitData()) {
        navigate(saveChangesPath);
      }
    }
  };

  /* ---------------Form Data Handling---------------------------*/
  // const getProfileData = () => {
  //     //backend code to get profile data
  // }

  // const displayProfileData = (profileData: Object) => {
  //     //set state variables with profile data, asynchronous
  // }

  const submitData = () => {
    const validData = validateForm();
    if (validData) {
      const JSONstring = getFormData();
      console.log(JSONstring);
      // PUT request(modify only, not create new) to backend code
      return true;
    }
    return false;
  };

  const getFormData = (): string => {
    /*
        Desc: Gets all form data and coverts it into JSON
        Return: JSON string
        */
    const accountData = {
      firstName,
      lastName,
      email,
      phoneNumber: processedPhoneNumber, // number(int) in form: 8057562501
    };
    return JSON.stringify(accountData);
  };

  /* -----------------------Form Validation-------------------------------*/
  const validateForm = (): boolean => {
    /*
        Desc: Validates all the form fields
        Return: boolean (true if all are valid, false if one is not)
        */
    const valid: boolean =
      validateName() &&
      validateEmail() &&
      validatePhoneNumber() &&
      processPhoneNumber();
    return valid;
  };

  const validateName = (): boolean => {
    /*
        Desc: Validates firstName and lastName
        Return: boolean (true if valid, false if not)
        */
    if (firstName === "" || lastName === "") {
      alert("Please add your first and last name");
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

  const validatePhoneNumber = (): boolean => {
    /*
        Desc: Validates phone number
        Return: boolean (true if valid, false if not)
        */
    if (phoneNumber === "") {
      alert("Please add a phone number");
      return false;
    }
    return true;
  };

  function processPhoneNumber(): boolean {
    /*
        Desc: Converts phoneNumber string to number. Saves it in global variable processedPhoneNumber
        Return: boolean (true if number successfuly processed, false if not)
        */
    try {
      const processedString = phoneNumber.replace(/[^0-9]/g, "");
      processedPhoneNumber = parseInt(processedString, 2);
    } catch (error) {
      console.error(error);
      alert(
        "Sorry there was an error processing your phone number. Please enter it in the form XXX-XXX-XXXX"
      );
      return false;
    }
    return true;
  }

  return (
    <div id="donatorProfileEditPage">
      <DonatorNavbar />
      <div id="editProfileBox">
        <p id="editProfileText">Edit Profile</p>
        <form id="form">
          <div id="nameBox">
            <div className="labelInputBox" id="firstNameBox">
              <p className="formLabel">First Name</p>
              <input
                className="inputBox"
                value={firstName}
                type="text"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFirstName(e.target.value)
                }
              />
            </div>
            <div className="labelInputBox" id="lastNameBox">
              <p className="formLabel">Last Name</p>
              <input
                className="inputBox"
                value={lastName}
                type="text"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setLastName(e.target.value)
                }
              />
            </div>
          </div>
          <div className="labelInputBox">
            <p className="formLabel">Email</p>
            <input
              className="inputBox"
              value={email}
              type="text"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
            />
          </div>
          <div className="labelInputBox">
            <p className="formLabel">Phone Number</p>
            <input
              className="inputBox"
              value={phoneNumber}
              type="text"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPhoneNumber(e.target.value)
              }
            />
          </div>
        </form>
        <div id="buttonBox">
          <button
            type="button"
            value="backButton"
            className="buttons"
            id="backButton"
            onClick={buttonNavigation}
          >
            Back
          </button>
          <div id="spacing" className="buttons" />
          <button
            type="submit"
            value="saveChangesButton"
            className="buttons"
            id="saveChangesButton"
            onClick={buttonNavigation}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default DonatorProfileEditPage;
