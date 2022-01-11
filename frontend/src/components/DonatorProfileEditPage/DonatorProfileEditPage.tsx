import React, { useState } from "react";
import DonatorNavbar from "../DonatorNavbar/DonatorNavbar";
require("./DonatorProfileEditPage.css");

const DonatorProfileEditPage = () : JSX.Element =>  {

    return (
        <body id="donatorProfileEditPage">
            <DonatorNavbar />
            <div id="editProfileBox">
                <p id="editProfileText">Edit Profile</p>
                <form id="form">

                    <div id="nameBox">
                        <div className="labelInputBox" id="firstNameBox">
                            <p className="formLabel">First Name</p>
                            <input className="inputBox">

                            </input>
                        </div>
                        <div className="labelInputBox" id="lastNameBox">
                            <p className="formLabel">Last Name</p>
                            <input className="inputBox">

                            </input>
                        </div>
                    </div>
                    <div className="labelInputBox">
                        <p className="formLabel">Email</p>
                        <input className="inputBox">

                        </input>
                    </div>
                    <div className="labelInputBox">
                        <p className="formLabel">Phone Number</p>
                        <input className="inputBox">

                        </input>
                    </div>
                </form>
                <div id="buttonBox">
                    <button className="buttons" id="backButton">
                        Back
                    </button>
                    <button className="buttons" id="saveChangesButton">
                        Save Changes
                    </button>
                </div>
            </div>
        </body>
    )
}

export default DonatorProfileEditPage;