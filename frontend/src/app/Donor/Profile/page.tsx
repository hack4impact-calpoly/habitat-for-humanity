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
    address: {
      street: "",
      city: "",
      state: "",
      zip: "",
    },
  });

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      router.push("/");
      return;
    }

    if (user?.id) {
      user?.reload();
      const fetchData = async () => {
        try {
          const response = await getUserByID(user.id);
          setUserData({
            firstName: user.firstName || "First Name Not Found",
            lastName: user.lastName || "Last Name Not Found",
            email: user.primaryEmailAddress?.emailAddress || "Email Not Found",
            phone: response.phone || "Phone Not Found",
            address: {
              street: response.address?.street || "N/A",
              city: response.address?.city || "N/A",
              state: response.address?.state || "N/A",
              zip: response.address?.zip || "N/A", 
            },
          });
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };

      fetchData();
    }
  }, [user, isSignedIn, isLoaded, router]);

  const donatorProfileEditPath = "/Donor/Profile/Edit";

  if (!isLoaded) return <div>Loading...</div>;
  if (!isSignedIn) return null;

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
          <hr style={{ margin: "1px 0", borderTop: "1px solid #ccc" }} />
          <div id="addressBox">
            <div className="headerBox">
              <p className="infoHeader">Address</p>
            </div>
            <div className="infoBox">
              <p id="address">
                {userData.address.street}, {userData.address.city}, {userData.address.state} {userData.address.zip}
              </p>
            </div>
          </div>
        </div>
      </Box>
    </div>
  );
}

export default DonatorProfilePage;
