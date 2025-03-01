"use client";

import React, { useState, useEffect } from "react";
import { Box, useMediaQuery } from "@mui/material";
import { useRouter } from "next/navigation";
import { updateUserInfoAPI } from "api/user";
import DonatorNavbar from "components/donor/DonorNavbar/DonorNavbar";
import { useUser } from "@clerk/nextjs";
import { z } from "zod";

require("../../../../App.css");

export type UserInfo = {
  firstName?: string;
  lastName?: string;
  email?: string;
};

function DonatorProfileEditPage(): React.ReactNode {
  const { user, isLoaded } = useUser();
  const initialFirstName = user?.firstName;
  const initialLastName = user?.lastName;
  const initialEmail = user?.primaryEmailAddress?.emailAddress;

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  let processedPhoneNumber: number; // Phone number converted from string

  useEffect(() => {
    if (isLoaded && user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setEmail(user.primaryEmailAddress?.emailAddress || "");
    }
  }, [isLoaded, user]);

  const updateUserInfo = async (newUserInfo: UserInfo) => {
    if (!user) {
      console.error("User not found");
      return;
    }
    updateUserInfoAPI(user.id, newUserInfo);
  };

  const capitalizeFirstLetter = (s: string) => {
    if (!s) return ""; // Handle empty or falsy strings
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
  };

  const router = useRouter();

  const buttonNavigation = (e: React.MouseEvent<HTMLButtonElement>): void => {
    const backPath: string = "/Donor/Profile"; // Change once page is added
    const saveChangesPath: string = "/Donor/Profile";
    console.log("event", e.currentTarget.value);
    if (e.currentTarget.value === "backButton") {
      router.push(backPath);
    } else if (e.currentTarget.value === "saveChangesButton") {
      if (submitData()) {
        router.push(saveChangesPath);
      }
    }
  };

  const submitData = () => {
    // Email validation schema
    const emailSchema = z.string().email({ message: "Invalid email address" });

    // Store alerts in an array and display all at once to avoid multiple alert pop-ups
    const alerts: string[] = [];

    // Check for empty fields and collect appropriate error messages
    if (!firstName) alerts.push("First name can not be empty");
    if (!lastName) alerts.push("Last name can not be empty");
    if (!email) alerts.push("Email can not be empty");

    // Email validation
    try {
      emailSchema.parse(email);
    } catch (error: any) {
      alerts.push(error.message);
    }

    // If any alerts were collected, show them at once
    if (alerts.length > 0) {
      alerts.forEach((alertMessage) => alert(alertMessage));
      return false; // Prevent further execution if validation fails
    }

    let newUserInfo: UserInfo = {};
    // Update fields only if they have changed and are different from the initial values
    if (firstName && firstName !== initialFirstName) {
      newUserInfo.firstName = capitalizeFirstLetter(firstName);
    }
    if (lastName && lastName !== initialLastName) {
      newUserInfo.lastName = capitalizeFirstLetter(lastName);
    }
    if (email && email !== initialEmail) {
      newUserInfo.email = email;
    }
    // If phone needs to be handled:
    // if (phone && phone !== initialPhone) {
    //   handleChangePhone(phone);
    // }
    updateUserInfo(newUserInfo);

    return true; // Return true if everything is successful
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
        "Sorry there was an error processing your phone number. Please enter it in the form XXX-XXX-XXXX",
      );
      return false;
    }
    return true;
  }

  const isMobile = useMediaQuery("(max-width: 640px)");

  return (
    <div id="donatorProfileEditPage">
      <DonatorNavbar />
      <div id="editProfileBox">
        <p id="editProfileText">Edit Profile</p>
        <form id="form">
          <div id="DonorNameBox">
            <Box
              sx={{
                display: isMobile ? "" : "flex",
                width: "80vw",
              }}
            >
              <div className="labelInputBox" id="firstNameBox">
                <Box
                  sx={{
                    width: isMobile ? "80vw" : "200px",
                  }}
                >
                  <p className="formLabel">First Name</p>
                  <input
                    className="inputBox"
                    value={firstName}
                    type="text"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFirstName(e.target.value)
                    }
                  />
                </Box>
              </div>
              <div className="labelInputBox" id="lastNameBox">
                <Box
                  sx={{
                    width: isMobile ? "80vw" : "200px",
                  }}
                >
                  <p className="formLabel">Last Name</p>
                  <input
                    className="inputBox"
                    value={lastName}
                    type="text"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setLastName(e.target.value)
                    }
                  />
                </Box>
              </div>
            </Box>
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
