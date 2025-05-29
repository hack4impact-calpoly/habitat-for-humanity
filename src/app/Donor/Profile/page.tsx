"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Box } from "@mui/material";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import DonatorNavbar from "components/donor/DonorNavbar/DonorNavbar";
import { getUserByID } from "api/user";

require("../../../App.css");

function DonatorProfilePage(): React.ReactNode {
  const { user, isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    marketingOption: false,
  });

  useEffect(() => {
    // First check if auth is loaded and user is signed in
    if (!isLoaded) return; // Wait until auth state is determined

    if (!isSignedIn) {
      // If not signed in, redirect to login page
      router.push("/");
      return;
    }

    // Only fetch data if user is signed in and has an ID
    if (user?.id) {
      user?.reload();
      const fetchData = async () => {
        try {
          const response = await getUserByID(user.id);
          const address = response.address;
          setUserData({
            firstName: user.firstName || "First Name Not Found",
            lastName: user.lastName || "Last Name Not Found",
            email: user.primaryEmailAddress?.emailAddress || "Email Not Found",
            phone: response.phone || "Phone Not Found",
            address: address
              ? `${address.street}, ${address.city}, ${address.state} ${address.zip}`
              : "Address Not Found",
            marketingOption: response.marketingOption,
          });
        } catch (error) {
          console.error("Error fetching user data:", error);
          // Handle error gracefully - don't crash the app
        }
      };

      fetchData();
    }
  }, [user, isSignedIn, isLoaded, router]);

  const donatorProfileEditPath = "/Donor/Profile/Edit";

  // If auth is still loading, show a loading state
  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  // If not signed in, don't render anything (will redirect in useEffect)
  if (!isSignedIn) {
    return null;
  }

  return (
    <div>
      <DonatorNavbar />
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div id="donatorProfileBox">
          <div id="headerBox">
            <div id="profileBox">
              <p id="profile">Profile</p>
            </div>
            <div id="editBox">
              <img alt="pencil" id="pencil" src="/images/pencil.png" />
              <Link href={donatorProfileEditPath} id="edit">
                edit
              </Link>
            </div>
          </div>
          <div id="nameBox">
            <div className="headerBox">
              <p className="infoHeader">Name</p>
            </div>
            <div className="infoBox">
              <p id="name">
                {userData.firstName} {userData.lastName}
              </p>
            </div>
          </div>
          <div id="emailBox">
            <div className="headerBox">
              <p className="infoHeader">Email</p>
            </div>
            <div className="infoBox">
              <p id="email">{userData.email}</p>
            </div>
          </div>
          <div id="phoneBox">
            <div className="headerBox">
              <p className="infoHeader">Phone</p>
            </div>
            <div className="infoBox">
              <p id="phone">{userData.phone}</p>
            </div>
          </div>
          <div id="addressBox">
            <div className="headerBox">
              <p className="infoHeader">Address</p>
            </div>
            <div className="infoBox">
              <p id="address">{userData.address}</p>
            </div>
          </div>
          <div id="marketingBox">
            <div className="headerBox">
              <p className="infoHeader">Agreed to Marketing</p>
            </div>
            <div className="infoBox">
              <p id="marketing">{userData.marketingOption ? "Yes" : "No"}</p>
            </div>
          </div>
        </div>
      </Box>
    </div>
  );
}

export default DonatorProfilePage;
