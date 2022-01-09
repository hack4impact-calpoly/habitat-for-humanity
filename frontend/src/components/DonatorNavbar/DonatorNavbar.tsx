import React from "react";
import logo from "./../../images/logo.png";
require('./DonatorNavbar.css')

const navBarHeaders: string[] = [
    "Make a Donation",
    "Profile",
    "Sign Out"
];

// paths might change depending on how application routes are made
// test underline by setting either variable to "/"
const donate_path: string = "/donate";
const profile_path: string = "/profile"

const DonatorNavbar = (): JSX.Element => {
    const page_path = window.location.pathname;

    const underline = (header: string): boolean => {
        if (header === navBarHeaders[0] && page_path === donate_path) {
            return true;
        } else if (header === navBarHeaders[1] && page_path === profile_path) {
            return true;
        }
        return false;
    }

    return (
        <div id="donatorNavbar">
            <img src={logo} alt="logo" id="donatorNavbarLogo" />
            <div id="donatorNavbarHeaders">
                {// need to add links to pages
}
                {navBarHeaders.map((header: string): JSX.Element => {
                    return underline(header) ? (
                        <div className="donatorNavbarHeader">
                            <p>{header}</p>
                            <hr id="donatorNavbarUnderline" />
                        </div> ) : ( 
                            <p className="donatorNavbarHeader">{header}</p>
                        )
                })}
            </div>
        </div>
    )
}

export default DonatorNavbar;