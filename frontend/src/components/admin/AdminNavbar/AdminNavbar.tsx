import React from "react";
import { Link } from "react-router-dom";
import logo from "images/logo.png";

require("./AdminNavbar.css");

const navBarHeaders: string[] = [
  "Calendar",
  "Availablility",
  "Donation Approvals",
  "History",
  "Profile",
  "Sign Out",
];

// paths might change depending on how application routes are made
// test underline by setting either variable to "/"
const donationApprovalsPath: string = "/Admin/DonationApproval";
const signoutPath: string = "/";
const tempPath: string = "/Admin";

function AdminNavbar(): JSX.Element {
  const pagePath = window.location.pathname;

  const underline = (header: string): boolean => {
    if (
      header === navBarHeaders[2] &&
      pagePath.includes(donationApprovalsPath)
    ) {
      // For different donation pages
      return true;
    }
    // Waiting for adding admin profile edit page
    // else if (header === navBarHeaders[1] && page_path.includes(profile_path)) { //For different profile pages
    //    return true;
    // }
    return false;
  };

  const navlinkHandler = (header: string): string => {
    if (header === navBarHeaders[0]) {
      return "/Admin/Calendar";
    }
    if (header === navBarHeaders[1]) {
      return tempPath;
    }
    if (header === navBarHeaders[2]) {
      return tempPath;
    }
    if (header === navBarHeaders[3]) {
      return tempPath;
    }
    if (header === navBarHeaders[4]) {
      return tempPath;
    }
    if (header === navBarHeaders[5]) {
      return signoutPath;
    }
    // Sign Out to be implemented, just route to main page for now (login)
    console.log("Error: Unknown Header", header);
    return "/Admin";
  };

  return (
    <div id="adminNavbar">
      <img src={logo} alt="logo" id="adminNavbarLogo" />
      <div id="adminNavbarHeaders">
        {
          // need to add links to pages
        }
        {navBarHeaders?.map(
          (header: string, index: number): JSX.Element =>
            underline(header) ? (
              <div className="adminNavbarHeader" key={index}>
                <Link
                  id="adminNavbarUnderline"
                  className="adminNavbarLink"
                  to={navlinkHandler(header)}
                >
                  {header}
                </Link>
              </div>
            ) : (
              <Link
                key={index}
                className="adminNavbarLink"
                to={navlinkHandler(header)}
              >
                {header}
              </Link>
            )
        )}
      </div>
    </div>
  );
}

export default AdminNavbar;
