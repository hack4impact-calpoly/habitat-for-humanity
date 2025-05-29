"use client";

import React, { useState, useEffect } from "react";
import { Box, useMediaQuery } from "@mui/material";
import { useRouter } from "next/navigation";
import {
  updateUserInfoAPI,
  updateUserMongo,
  getUserByID,
  Address,
} from "api/user";
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
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  const [verifying, setVerifying] = useState(false);
  const [code, setCode] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const initialFirstName = user?.firstName;
  const initialLastName = user?.lastName;
  const initialEmail = user?.primaryEmailAddress?.emailAddress;
  let initialPhone: string | undefined = undefined;
  let initialAddress: Address | undefined = undefined;
  let initialMarketing: boolean = false;
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState<Address>({
    street: "",
    city: "",
    state: "",
    zip: "",
  });
  const [marketing, setMarketing] = useState<boolean>(false);
  const [isPhoneValid, setIsPhoneValid] = useState(true);
  const [emailObject, setEmailObject] = useState<EmailAddressResource>();

  useEffect(() => {
    // First check if auth is loaded and user is signed in
    if (!isLoaded) return; // Wait until auth state is determined

    if (!isSignedIn) {
      // If not signed in, redirect to login page
      router.push("/");
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
            ? parsePhoneNumberFromString(response.phone, "US")?.format(
                "E.164",
              ) || ""
            : "";
          setPhone(formattedPhone);
          initialPhone = formattedPhone;
          const address = response.address;
          initialAddress = address;
          setAddress(address);
          initialMarketing = response.marketingOption;
          setMarketing(response.marketingOption);
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

  const handleEmailVerificationSend = async (newEmail: string) => {
    if (!user || !isLoaded) {
      console.error("User data is not loaded yet.");
      return;
    }

    try {
      // Create and send verification
      const createdEmail = await user.createEmailAddress({ email: newEmail });
      setEmailObject(createdEmail);

      await createdEmail.prepareVerification({ strategy: "email_code" });
      setVerifying(true);
    } catch (err) {
      setVerifying(false);
      if (err instanceof Error) {
        alert(`Failed to send verification email: ${err.message || err}`);
      } else {
        alert(`Failed to send verification email: ${err}`);
      }

      console.error("Failed to send verification email:", err);
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
        setEmailVerified(true);

        for (const email of user.emailAddresses) {
          if (email.id !== verifiedEmail.id) {
            try {
              await email.destroy();
            } catch (err) {
              console.error("Error deleting old email:", err);
            }
          }
        }
      } else {
        console.error("Email verification failed. Not adding to the account.");
        await emailObject.destroy(); // Delete the unverified email
      }
      router.push("/Donor/Profile");
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
    if (!address.street) alerts.push("Street address cannot be empty");
    if (!address.city) alerts.push("City cannot be empty");
    if (!address.state) alerts.push("State cannot be empty");
    if (!address.zip) alerts.push("ZIP code cannot be empty");

    try {
      emailSchema.parse(email);
    } catch (error: any) {
      alerts.push(error.message);
    }

    if (alerts.length > 0) {
      alerts.forEach((alert) => console.error(alert));
      return;
    }

    const newUserInfo: UserInfo = {};
    if (firstName && firstName !== initialFirstName) {
      newUserInfo.firstName = capitalizeFirstLetter(firstName);
    }
    if (lastName && lastName !== initialLastName) {
      newUserInfo.lastName = capitalizeFirstLetter(lastName);
    }
    try {
      if (
        (phone && phone !== initialPhone) ||
        address !== initialAddress ||
        marketing !== initialMarketing
      ) {
        if (user) {
          await updateUserMongo(user.id, phone, address, marketing);
        }
      }
      await updateUserInfo(newUserInfo);
    } catch (error) {
      console.error("Error in submitData:", error);
    }
    if (email && email !== initialEmail) {
      try {
        await handleEmailVerificationSend(email);
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

  // If auth is still loading, show a loading state
  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  // If not signed in, don't render anything (will redirect in useEffect)
  if (!isSignedIn) {
    return null;
  }

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
    <>
      <DonatorNavbar />
      <div id="donatorProfileEditPage">
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
            <Box className="labelInputBox">
              <p className="formLabel">Street Address</p>
              <input
                className="inputBox"
                value={address.street}
                type="text"
                onChange={(e) =>
                  setAddress({ ...address, street: e.target.value })
                }
              />
            </Box>
            <Box className="labelInputBox">
              <p className="formLabel">City</p>
              <input
                className="inputBox"
                value={address.city}
                type="text"
                onChange={(e) =>
                  setAddress({ ...address, city: e.target.value })
                }
              />
            </Box>
            <div id="DonorNameBox">
              <Box sx={{ display: isMobile ? "" : "flex", width: "80vw" }}>
                <div className="labelInputBox" id="firstNameBox">
                  <Box sx={{ width: isMobile ? "80vw" : "200px" }}>
                    <p className="formLabel">State</p>
                    <input
                      className="inputBox"
                      value={address.state}
                      type="text"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setAddress({ ...address, state: e.target.value })
                      }
                    />
                  </Box>
                </div>
                <div className="labelInputBox" id="lastNameBox">
                  <Box sx={{ width: isMobile ? "80vw" : "200px" }}>
                    <p className="formLabel">Zip</p>
                    <input
                      className="inputBox"
                      value={address.zip}
                      type="text"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setAddress({ ...address, zip: e.target.value })
                      }
                    />
                  </Box>
                </div>
              </Box>
            </div>
            <Box className="labelInputBox">
              <p
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "0.95rem",
                  marginTop: "20px",
                }}
              >
                <input
                  type="checkbox"
                  checked={marketing}
                  onChange={(e) => setMarketing(e.target.checked)}
                />
                Receive marketing information from Habitat for Humanity
              </p>
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
    </>
  );
}

export default DonatorProfileEditPage;
