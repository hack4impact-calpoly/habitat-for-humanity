import React from "react";
import DonatorNavbar from "../DonatorNavbar/DonatorNavbar";
require("./DonatorScheduleDropoffPage.css");

const weeklyHours = [
    { day: "Monday", hours: "Closed" },
    { day: "Tuesday", hours: "10:00 AM to 5:00 PM" },
    { day: "Wednesday", hours: "10:00 AM to 5:00 PM" },
    { day: "Thursday", hours: "10:00 AM to 5:00 PM" },
    { day: "Friday", hours: "10:00 AM to 5:00 PM" },
    { day: "Saturday", hours: "10:00 AM to 5:00 PM" },
    { day: "Sunday", hours: "Closed" },
];

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
                                <p id="radioDropoff" className="radioOptionLabel radioLabel"> I can drop off at the ReStore</p>
                            </div>
                            <div id="radioPickUp">
                                <input type="radio" className="radioOptionLabel" onChange={() => setIsDropoff(!isDropoff)} checked={!isDropoff} />
                                <p className="radioOptionLabel radioLabel">I need the item to be picked up</p>
                            </div>
                    </div>
                </div>
                {isDropoff ? (
                    <div>
                        <h2 className="donDropoffPickupHeader">ReStore Drop Off Hours</h2>
                        <table>
                            <tbody>
                                {weeklyHours.map((element, index) => {
                                    const day: string = element.day;
                                    const hours: string = element.hours;
                                    return (
                                        <tr key={index}>
                                            <td className="donDropoffRow" key={index + 7}>{day}</td>
                                            <td className="donDropoffRow donDropoffHours" key={index + 14}>{hours}</td>
                                        </tr>
                                );})}
                            </tbody>
                        </table>
                    </div>) : 
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
