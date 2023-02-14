import React from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "images/logo.png";

require("./DonorNavbar.css");

const navBarHeaders: string[] = ["Make a Donation", "Profile", "Sign Out"];

// paths might change depending on how application routes are made
// test underline by setting either variable to "/"
const donatePath: string = "/Donor";
const profilePath: string = "/Donor/Profile";

function DonatorNavbar(): JSX.Element {
  const navigate = useNavigate();

  const pagePath = window.location.pathname;

  const underline = (header: string): boolean => {
    if (
      header === navBarHeaders[0] &&
      (pagePath.includes(`${donatePath}/donate`) || pagePath === "/Donor")
    ) {
      // For different donation pages
      return true;
    }
    if (header === navBarHeaders[1] && pagePath.includes(profilePath)) {
      // For different profile pages
      return true;
    }
    return false;
  };

  const navlinkHandler = (header: string): string => {
    if (header === navBarHeaders[0]) {
      return donatePath;
    }
    if (header === navBarHeaders[1]) {
      return profilePath;
    }
    // Sign Out to be implemented, just route to main page for now (login)
    return "/";
  };

  return (
    <div id="donatorNavbar">
      <a href="/Donor">
        <img src={logo} alt="logo" id="donatorNavbarLogo" />
      </a>
      <div id="donatorNavbarHeaders">
        {
          // need to add links to pages
        }
        {navBarHeaders?.map(
          (header: string, index: number): JSX.Element =>
            underline(header) ? (
              <div className="donatorNavbarHeader" key={index}>
                <Link
                  id="donatorNavbarUnderline"
                  className="donatorNavbarLink"
                  to={navlinkHandler(header)}
                >
                  {header}
                </Link>
              </div>
            ) : (
              <Link
                key={index}
                className="donatorNavbarLink"
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

export default DonatorNavbar;
