"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Box } from "@mui/material";
// import pencil from "images/pencil.png";
import { useUser } from "@clerk/nextjs";
import DonatorNavbar from "components/donor/DonorNavbar/DonorNavbar";
import { getUserByID } from "api/user";


require("../../../App.css");

function DonatorProfilePage(): React.ReactNode {
  const { user } = useUser();
  user?.reload();
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  
  useEffect(() => {
    if (user?.id) {  // Check if user.id is defined
      const fetchData = async () => {
        const response = await getUserByID(user.id);
        setUserData({
          firstName: user.firstName || "First Name Not Found",
          lastName: user.lastName || "Last Name Not Found",
          email: user.primaryEmailAddress?.emailAddress || "Email Not Found",
          phone: response.phone || "Phone Not Found",
        });
      };
  
      fetchData();  // Fetch user data whenever the component is re-entered
    }
  }, [user]); 
  
  const donatorProfileEditPath = "/Donor/Profile/Edit";

  

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
              {/* Need to Implement Link to DonatorProfileEditPage */}
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
              {/* Need to implement displaying user data from backend */}
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
              {/* Need to implement displaying user data from backend */}
              <p id="email">{userData.email}</p>
            </div>
          </div>
          <div id="phoneBox">
            <div className="headerBox">
              <p className="infoHeader">Phone</p>
            </div>
            <div className="infoBox">
              {/* Need to implement displaying user data from backend */}
              <p id="phone">{userData.phone}</p>
            </div>
          </div>
        </div>
      </Box>
    </div>
  );
}

export default DonatorProfilePage;
