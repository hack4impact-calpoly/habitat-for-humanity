"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Box } from "@mui/material";
// import pencil from "images/pencil.png";
import { useUser, RedirectToSignIn } from "@clerk/nextjs";
import DonatorNavbar from "components/donor/DonorNavbar/DonorNavbar";

require("../../../App.css");

function DonatorProfilePage(): React.ReactNode {
  const { user } = useUser();

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
                {user?.firstName && user?.lastName
                  ? `${user.firstName} ${user.lastName}`
                  : ""}
              </p>
            </div>
          </div>
          <div id="emailBox">
            <div className="headerBox">
              <p className="infoHeader">Email</p>
            </div>
            <div className="infoBox">
              {/* Need to implement displaying user data from backend */}
              <p id="email">{user?.emailAddresses[0].emailAddress}</p>
            </div>
          </div>
          <div id="phoneBox">
            <div className="headerBox">
              <p className="infoHeader">Phone</p>
            </div>
            <div className="infoBox">
              {/* Need to implement displaying user data from backend */}
              <p id="phone">N/A</p>
            </div>
          </div>
        </div>
      </Box>
    </div>
  );
}

export default DonatorProfilePage;
