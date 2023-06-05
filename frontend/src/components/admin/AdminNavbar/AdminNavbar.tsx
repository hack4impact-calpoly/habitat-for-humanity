import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "images/ReStoreLogo.png";
import { Box, Menu, MenuItem, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

require("./AdminNavbar.css");

const CALENDAR_HEADER = 0;
const AVAILABILITY_HEADER = 1;
const DONATION_APPROVALS_HEADER = 2;
const HISTORY_HEADER = 3;
const PROFILE_HEADER = 4;
const SIGN_OUT_HEADER = 5;

const navBarHeaders: string[] = [
  "Calendar",
  "Availablility",
  "Active Donations",
  "Sign Out",
];

// paths might change depending on how application routes are made
// test underline by setting either variable to "/"
const donationApprovalsPath: string = "/Admin/DonationApproval";
const signoutPath: string = "/";
const adminHomePath: string = "/Admin";
const calendarPath: string = "/Admin/Calendar";
const donationInfoPath: string = "/Admin/DonationInfo";

function AdminNavbar(): JSX.Element {
  const navigate = useNavigate();
  const [anchor, setAnchor] = useState(null);
  const pagePath = window.location.pathname;

  const handleOpenNavMenu = (event: any) => {
    setAnchor(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchor(null);
  };

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
    if (header === navBarHeaders[CALENDAR_HEADER]) {
      return calendarPath;
    }
    if (header === navBarHeaders[AVAILABILITY_HEADER]) {
      return adminHomePath;
    }
    if (header === navBarHeaders[DONATION_APPROVALS_HEADER]) {
      return adminHomePath;
    }
    if (header === navBarHeaders[HISTORY_HEADER]) {
      return adminHomePath;
    }
    if (header === navBarHeaders[PROFILE_HEADER]) {
      return adminHomePath;
    }
    if (header === navBarHeaders[SIGN_OUT_HEADER]) {
      return signoutPath;
    }
    // Sign Out to be implemented, just route to main page for now (login)
    console.log("Error: Unknown Header", header);
    return "/Admin";
  };

  const renderDesktopNavbar = () => (
    <Box sx={styles.adminNavbar}>
      <a href="/Admin">
        <Box
          component="img"
          src={logo}
          alt="logo"
          sx={{ width: { md: "12rem" } }}
        />
      </a>
      <div id="adminNavbarHeaders">
        {
          // need to add links to pages
        }
        {navBarHeaders?.map(
          (header: string, index: number): JSX.Element =>
            underline(header) ? (
              <Box className="adminNavbarLink">
                <Link id="adminNavbarUnderline" to={navlinkHandler(header)}>
                  {header}
                </Link>
              </Box>
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
    </Box>
  );

  const renderMobileNavbar = () => (
    <Box
      sx={{
        ...styles.adminNavbar,
        padding: "1rem 1rem",
        display: { xs: "flex", md: "none" },
      }}
    >
      <a href="/Admin">
        <Box
          component="img"
          src={logo}
          alt="logo"
          sx={{ width: { xs: "10rem" } }}
        />
      </a>
      <IconButton
        size="large"
        aria-label="Menu"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleOpenNavMenu}
        sx={{ color: "black" }}
      >
        <MenuIcon />
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchor}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        open={Boolean(anchor)}
        onClose={handleCloseNavMenu}
        TransitionProps={{ timeout: 0 }}
      >
        {navBarHeaders?.map((page, index) => navItem(page, index))}
      </Menu>
    </Box>
  );

  const navItem = (item: any, index: number) => (
    <MenuItem
      key={index}
      onClick={() => {
        handleCloseNavMenu();
        navigate(navlinkHandler(item));
      }}
    >
      <Box
        key={index}
        href={navlinkHandler(item)}
        textAlign="center"
        component="a"
        sx={[
          {
            m: 0,
            textDecoration: "none",
            color: "#314d89",
            fontSize: "17px",
            fontWeight: "bold",
            paddingBottom: "2px",
            borderBottom: underline(item) ? "1.5px solid #314d89" : "none",
          },
        ]}
        onClick={() => navigate(navlinkHandler(item))}
      >
        {item}
      </Box>
    </MenuItem>
  );
  return (
    <>
      {renderDesktopNavbar()}
      {renderMobileNavbar()}
    </>
  );
}

const styles = {
  adminNavbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    backgroundColor: "var(--white-gray)",
    border: "2px solid var(--gray-light)",
    boxSizing: "border-box",
    boxShadow: "0px 4px 25px rgba(49, 77, 137, 0.05)",
    borderTop: "none",
    display: { xs: "none", md: "flex" },
    padding: "1rem 2rem",
  },
} as const;

export default AdminNavbar;
