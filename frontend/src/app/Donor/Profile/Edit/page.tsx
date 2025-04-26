"use client";

import React, { useState, useEffect } from "react";
import { Box, useMediaQuery } from "@mui/material";
import { useRouter } from "next/navigation";
import { updateUserInfoAPI, updateUserPhone } from "api/user";
import DonatorNavbar from "components/donor/DonorNavbar/DonorNavbar";
import { useUser } from "@clerk/nextjs";
import { z } from "zod";
import {
  isValidPhoneNumber,
  parsePhoneNumberFromString,
} from "libphonenumber-js";
import { getUserByID } from "api/user";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";

require("../../../../App.css");

export type UserInfo = {
  firstName?: string;
  lastName?: string;
  email?: string;
};

function DonatorProfileEditPage(): React.ReactNode {
  const { user, isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const initialFirstName = user?.firstName;
  const initialLastName = user?.lastName;
  const initialEmail = user?.primaryEmailAddress?.emailAddress;
  let initialPhone: string | undefined = undefined;

  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [isPhoneValid, setIsPhoneValid] = useState<boolean>(true);

  useEffect(() => {
    // First check if auth is loaded and user is signed in
    if (!isLoaded) return; // Wait until auth state is determined
    
    if (!isSignedIn) {
      // If not signed in, redirect to login page
      router.push('/');
      return;
    }
    
    // Only proceed if user is signed in and has an ID
    if (user?.id) {
      setFirstName(user.firstName || "First Name Not Found");
      setLastName(user.lastName || "Last Name Not Found");
      setEmail(user.primaryEmailAddress?.emailAddress || "Email Not Found");
      
      const fetchData = async () => {
        try {
          const response = await getUserByID(user.id);
          const formattedPhone = response.phone
            ? parsePhoneNumberFromString(response.phone, "US")?.format("E.164") ||
              ""
            : "";
          setPhone(formattedPhone);
        } catch (error) {
          console.error("Error fetching user data:", error);
          // Handle error gracefully
        }
      };

      fetchData();
    }
  }, [user, isSignedIn, isLoaded, router]);

  const updateUserInfo = async (newUserInfo: UserInfo) => {
    if (!user) {
      console.error("User not found");
      return;
    }
    try {
      await updateUserInfoAPI(user.id, newUserInfo);
    } catch (error) {
      console.error("Error updating user info:", error);
      alert("Failed to update user information. Please try again.");
    }
  };

  const capitalizeFirstLetter = (s: string) => {
    if (!s) return "";
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
  };

  const buttonNavigation = (e: React.MouseEvent<HTMLButtonElement>): void => {
    const backPath: string = "/Donor/Profile";
    const saveChangesPath: string = "/Donor/Profile";
    if (e.currentTarget.value === "backButton") {
      router.push(backPath);
    } else if (e.currentTarget.value === "saveChangesButton") {
      if (submitData()) {
        router.push(saveChangesPath);
      }
    }
  };

  const submitData = () => {
    const emailSchema = z.string().email({ message: "Invalid email address" });

    const alerts: string[] = [];

    if (!firstName) alerts.push("First name can not be empty");
    if (!lastName) alerts.push("Last name can not be empty");
    if (!email) alerts.push("Email can not be empty");
    if (!isPhoneValid) alerts.push("Phone must be of valid format");

    try {
      emailSchema.parse(email);
    } catch (error: any) {
      alerts.push(error.message);
    }

    if (alerts.length > 0) {
      alerts.forEach((alertMessage) => alert(alertMessage));
      return false;
    }

    let newUserInfo: UserInfo = {};
    if (firstName && firstName !== initialFirstName) {
      newUserInfo.firstName = capitalizeFirstLetter(firstName);
    }
    if (lastName && lastName !== initialLastName) {
      newUserInfo.lastName = capitalizeFirstLetter(lastName);
    }
    if (email && email !== initialEmail) {
      newUserInfo.email = email;
    }
    
    try {
      if (phone && phone !== initialPhone) {
        if (user) {
          updateUserPhone(user.id, phone);
        }
      }
      updateUserInfo(newUserInfo);
      return true;
    } catch (error) {
      console.error("Error in submitData:", error);
      return false;
    }
  };

  const handlePhoneChange = (value: string | undefined) => {
    setPhone(value || ""); // Always update state first
    setIsPhoneValid(value ? isValidPhoneNumber(value) : false); // Validate separately
  };

  const isMobile = useMediaQuery("(max-width: 640px)");

  // If auth is still loading, show a loading state
  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  // If not signed in, don't render anything (will redirect in useEffect)
  if (!isSignedIn) {
    return null;
  }

  return (
    <div id="donatorProfileEditPage">
      <DonatorNavbar />
      <div id="editProfileBox">
        <p id="editProfileText">Edit Profile</p>
        <form id="form">
          <div id="DonorNameBox">
            <Box sx={{ display: isMobile ? "" : "flex", width: "80vw" }}>
              <div className="labelInputBox" id="firstNameBox">
                <Box sx={{ width: isMobile ? "80vw" : "200px" }}>
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
                <Box sx={{ width: isMobile ? "80vw" : "200px" }}>
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
            <PhoneInput
              className="inputBox"
              value={phone || ""}
              onChange={handlePhoneChange}
              defaultCountry="US"
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