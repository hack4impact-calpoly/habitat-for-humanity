"use client";

import React, { useState, useEffect } from "react";
import { Box, useMediaQuery } from "@mui/material";
import { useRouter } from "next/navigation";
import { updateUserInfoAPI, updateUserPhone, getUserByID } from "api/user";
import DonatorNavbar from "components/donor/DonorNavbar/DonorNavbar";
import { useUser } from "@clerk/nextjs";
import { ClerkAPIError, EmailAddressResource } from "@clerk/types";
import { isClerkAPIResponseError } from "@clerk/nextjs/errors";
import { z } from "zod";
import PhoneInput from "react-phone-number-input";
import {
  isValidPhoneNumber,
  parsePhoneNumberFromString,
} from "libphonenumber-js";
import "react-phone-number-input/style.css";
require("../../../../App.css");

export type UserInfo = {
  firstName?: string;
  lastName?: string;
};

function DonatorProfileEditPage(): React.ReactNode {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  const [verifying, setVerifying] = useState(false);
  const [code, setCode] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const initialFirstName = user?.firstName;
  const initialLastName = user?.lastName;
  const initialEmail = user?.primaryEmailAddress?.emailAddress;
  let initialPhone: string | undefined = undefined;
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isPhoneValid, setIsPhoneValid] = useState(true);
  const [emailObject, setEmailObject] = useState<EmailAddressResource>();

  useEffect(() => {
    if (user?.id) {
      const fetchData = async () => {
        const response = await getUserByID(user.id);
        const formattedPhone = response.phone
          ? parsePhoneNumberFromString(response.phone, "US")?.format("E.164") ||
            ""
          : "";
        setPhone(formattedPhone);
      };

      setFirstName(user.firstName || "First Name Not Found");
      setLastName(user.lastName || "Last Name Not Found");
      setEmail(user.primaryEmailAddress?.emailAddress || "Email Not Found");

      fetchData();
    }
  }, [user?.id]);

  const capitalizeFirstLetter = (s: string) => {
    if (!s) return "";
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
  };

  const handleEmailVerificationSend = async (newEmail: string) => {
    if (!user || !isLoaded) {
      console.error("User data is not loaded yet.");
      return;
    }

    try {
      await user
        .createEmailAddress({
          email: newEmail,
        })
        .then(async (results) => {
          setEmailObject(results);
          console.log("Temporary email created:", results.emailAddress);
          await results?.prepareVerification({ strategy: "email_code" });
          console.log("Verification email sent.");
        });
    } catch (err) {
      return err;
    }
  };

  const handleEmailUpdate = async (verificationCode: string) => {
    if (!user || !isLoaded) {
      console.error("User data is not loaded yet.");
      return;
    }

    if (!emailObject) {
      console.error("Email object is not initialized.");
      return;
    }

    try {
      const verifiedEmail = await emailObject.attemptVerification({
        code: verificationCode,
      });

      if (verifiedEmail.verification.status === "verified") {
        console.log("Email successfully verified:", verifiedEmail.emailAddress);
        setEmailVerified(true);

        const oldEmail = user.emailAddresses.find(
          (email) => email.id !== verifiedEmail.id,
        );
        if (oldEmail) {
          await oldEmail.destroy();
        }
        submitData(); // Proceed with saving user data after verification
      } else {
        console.warn("Email verification failed. Not adding to the account.");
        await emailObject.destroy(); // Delete the unverified email
      }
    } catch (err) {
      console.error("Error updating email:", err);
    }
  };

  const buttonNavigation = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (e.currentTarget.value === "backButton") {
      router.push("/Donor/Profile");
    } else if (e.currentTarget.value === "saveChangesButton") {
      submitData();
    }
  };

  const submitData = async () => {
    const emailSchema = z.string().email({ message: "Invalid email address" });
    const alerts: string[] = [];

    if (!firstName) alerts.push("First name cannot be empty");
    if (!lastName) alerts.push("Last name cannot be empty");
    if (!email) alerts.push("Email cannot be empty");
    if (!isPhoneValid) alerts.push("Phone number is invalid");

    try {
      emailSchema.parse(email);
    } catch (error: any) {
      alerts.push(error.message);
    }

    if (alerts.length > 0) {
      alerts.forEach((alert) => console.warn(alert));
      return;
    }

    const newUserInfo: UserInfo = {};
    if (firstName && firstName !== initialFirstName) {
      newUserInfo.firstName = capitalizeFirstLetter(firstName);
    }
    if (lastName && lastName !== initialLastName) {
      newUserInfo.lastName = capitalizeFirstLetter(lastName);
    }
    if (phone && phone !== initialPhone) {
      if (user) {
        updateUserPhone(user.id, phone);
      }
    }
    if (user) {
      updateUserInfoAPI(user.id, newUserInfo);
    }
    if (email && email !== initialEmail) {
      try {
        setVerifying(true);
        handleEmailVerificationSend(email);
      } catch (err) {
        setVerifying(false);
        alert(err);
      }
    } else {
      router.push("/Donor/Profile");
    }
  };

  const handlePhoneChange = (value: string | undefined) => {
    setPhone(value || ""); // Always update state first
    setIsPhoneValid(value ? isValidPhoneNumber(value) : false); // Validate separately
  };

  const isMobile = useMediaQuery("(max-width: 640px)");

  if (verifying && !emailVerified) {
    return (
      <div id="forgotPasswordBox">
        <p id="forgotPasswordText">Confirm Email</p>
        <p className="forgotPasswordMessage">
          Please enter the confirmation code sent to your email.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleEmailUpdate(code);
          }}
        >
          <input
            value={code}
            className="inputBox"
            onChange={(e) => setCode(e.target.value)}
          />
          <button type="submit" id="sendButton">
            Verify
          </button>
        </form>
      </div>
    );
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
          <Box className="labelInputBox">
            <p className="formLabel">Email</p>
            <input
              className="inputBox"
              value={email}
              type="text"
              onChange={(e) => setEmail(e.target.value)}
            />
          </Box>
          <Box>
            <p className="formLabel">Phone Number</p>
            <PhoneInput
              className="inputBox"
              value={phone || ""}
              onChange={handlePhoneChange}
              defaultCountry="US"
            />
          </Box>
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
