import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "images/ReStore-Logo.png";
import { Box, Menu, MenuItem, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

require("./DonorNavbar.css");

const navBarHeaders: string[] = ["Make a Donation", "Profile", "Sign Out"];

// paths might change depending on how application routes are made
// test underline by setting either variable to "/"
const donatePath: string = "/Donor";
const profilePath: string = "/Donor/Profile";

function DonatorNavbar(): JSX.Element {
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

  const renderDesktopNavbar = () => (
    <Box sx={styles.donatorNavbar}>
      <a href="/Donor">
        <Box
          component="img"
          src={logo}
          alt="logo"
          sx={{ width: { md: "12rem" } }}
        />
      </a>
      <div id="donatorNavbarHeaders">
        {
          // need to add links to pages
        }
        {navBarHeaders?.map(
          (header: string, index: number): JSX.Element =>
            underline(header) ? (
              <Box className="donatorNavbarLink">
                <Link id="donatorNavbarUnderline" to={navlinkHandler(header)}>
                  {header}
                </Link>
              </Box>
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
    </Box>
  );

  const renderMobileNavbar = () => (
    <Box
      sx={{
        ...styles.donatorNavbar,
        padding: "1rem 1rem",
        display: { xs: "flex", md: "none" },
      }}
    >
      <a href="/Donor">
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
  donatorNavbar: {
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

export default DonatorNavbar;
