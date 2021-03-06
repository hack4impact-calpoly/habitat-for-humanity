import React from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "images/logo.png";
require('./DonorNavbar.css')

const navBarHeaders: string[] = [
    "Make a Donation",
    "Profile",
    "Sign Out"
];

// paths might change depending on how application routes are made
// test underline by setting either variable to "/"
const donate_path: string = "/Donor";
const profile_path: string = "/Donor/Profile"

const DonatorNavbar = (): JSX.Element => {
    let navigate = useNavigate();

    const page_path = window.location.pathname;

    const underline = (header: string): boolean => {
        if (header === navBarHeaders[0] && 
            (page_path.includes(donate_path + "/donate") 
            || (page_path === "/Donor"))) { // For different donation pages
            return true;
        } 
        else if (header === navBarHeaders[1] && page_path.includes(profile_path)) { //For different profile pages
            return true;
        }
        return false;
    }

    const navlinkHandler = (header : string) : string => {
        if (header === navBarHeaders[0]){
            return donate_path;
        }
        else if(header === navBarHeaders[1]){
            return profile_path;
        }
        else{
            //Sign Out to be implemented, just route to main page for now (login)
            return "/";
        }
    }

    return (
        <div id="donatorNavbar">
            <img src={logo} alt="logo" id="donatorNavbarLogo" onClick={() => navigate("/Donor")}/>
            <div id="donatorNavbarHeaders">
                {// need to add links to pages
}
                {navBarHeaders?.map((header: string, index: number): JSX.Element => {
                    return underline(header) ? (
                        <div className="donatorNavbarHeader" key={index}>
                            <Link id="donatorNavbarUnderline" className="donatorNavbarLink" to={navlinkHandler(header)}>{header}</Link>
                        </div> ) : ( 
                            <Link key={index} className="donatorNavbarLink" to={navlinkHandler(header)}>{header}</Link>
                        )
                })}
            </div>
        </div>
    )
}

export default DonatorNavbar;