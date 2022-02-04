import React, { useState } from "react";
import { Link } from "react-router-dom";
import DonatorNavbar from '../DonatorNavbar/DonatorNavbar';
import pencil from "./../../images/pencil.png";
require("./DonatorProfile.css");

const DonatorProfilePage = (): JSX.Element => {
    const donatorProfileEditPath = "/donor/profile/edit";

    return (
        <body>
            <DonatorNavbar />
            <div id="donatorProfileBox">
                <div id="headerBox">
                    <div id="profileBox">
                        <p id="profile">Profile</p>
                    </div>
                    <div id="editBox">
                        <img id="pencil" src={pencil} />
                        {/* Need to Implement Link to DonatorProfileEditPage */}
                        <Link to={donatorProfileEditPath} id="edit">edit</Link>
                    </div>
                </div>
                <div id="nameBox">
                    <div className="headerBox">
                        <p className="infoHeader">Name</p>
                    </div>
                    <div className="infoBox">
                        {/* Need to implement displaying user data from backend */}
                        <p id="name">John Doe</p>
                    </div>
                </div>
                <div id="emailBox">
                    <div className="headerBox">
                        <p className="infoHeader">Email</p>
                    </div>
                    <div className="infoBox">
                        {/* Need to implement displaying user data from backend */}
                        <p id="email">johndoe@gmail.com</p>
                    </div>
                </div>
                <div id="phoneBox">
                    <div className="headerBox">
                        <p className="infoHeader">Phone</p>
                    </div>
                    <div className="infoBox">
                        {/* Need to implement displaying user data from backend */}
                        <p id="phone">(123)-456-789</p>
                    </div>
                </div>

            </div>
        </body >
    )
}

export default DonatorProfilePage;