import React from "react";
import DonatorNavbar from "../DonatorNavbar/DonatorNavbar";
import DonatorScheduleDropoff from "./DonatorScheduleDropoff";
require("./DonatorScheduleDropoffPickupPage.css");

const DonatorScheduleDropoffPage = (): JSX.Element => {
    const [isDropoff, setIsDropoff] = React.useState<boolean>(true)

    return (
        <body>
            <DonatorNavbar />
            <div id="donDropoffPage">
                <div>
                    <h2 id="donPDHeader">Scheduling</h2>
                    <h4>Does the donation need to be picked up or can you drop it off at our ReStore?</h4>
                    <div id="donPDOptions">
                            <div>
                                <input type="radio" className="radioOptionLabel" onChange={() => setIsDropoff(!isDropoff)} checked={isDropoff} />
                                <p id="radioDropoff" className="radioOptionLabel radioLabel">I can drop off at the ReStore</p>
                            </div>
                            <div id="radioPickUp">
                                <input type="radio" className="radioOptionLabel" onChange={() => setIsDropoff(!isDropoff)} checked={!isDropoff} />
                                <p className="radioOptionLabel radioLabel">I need the item to be picked up</p>
                            </div>
                    </div>
                </div>
                {isDropoff ? <DonatorScheduleDropoff /> : 
                    // TODO: Implement pick up option
                    null}
                <div id="donDropoffButtons">
                    {// TODO: Add links to back and next buttons }
}                    <button className="backButton">Back</button>
                    <button className="nextButton">Next</button>
                </div>
            </div>
        </body>
    );
};

export default DonatorScheduleDropoffPage;
