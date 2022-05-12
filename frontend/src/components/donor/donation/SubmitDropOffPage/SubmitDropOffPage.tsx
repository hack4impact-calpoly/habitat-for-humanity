import React from "react";
import DonatorNavbar from '../../DonorNavbar/DonorNavbar';
import SubmitInfo from "../SubmitInfo";
import sofa1 from "./../images/sofa-01.png";
require("./SubmitDropOffPage.css");

const weeklyHours = [
    { day: "Monday", hours: "Closed" },
    { day: "Tuesday", hours: "10:00 AM to 5:00 PM" },
    { day: "Wednesday", hours: "10:00 AM to 5:00 PM" },
    { day: "Thursday", hours: "10:00 AM to 5:00 PM" },
    { day: "Friday", hours: "10:00 AM to 5:00 PM" },
    { day: "Saturday", hours: "10:00 AM to 5:00 PM" },
    { day: "Sunday", hours: "Closed" },
];

const address = "1 Grand Avenue \nSan Luis Obispo, CA 93407";

const imagesPool = [
    { src: sofa1 },
  ];
  

const SubmitDropOffPage = (): JSX.Element => {

    return (
        <body>
            <DonatorNavbar />
            <div id="SubmitDropOffPage">
                <SubmitInfo name="Sofa" dimensions='83" x 32" x 38"' photos={imagesPool} location={address} dropOff={true}/>
                <div id="StoreHours">
                    <h2 id="DropOffHours">ReStore Drop Off Hours</h2>
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
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                <div id="donDOButtons">
                        <button className="backButton">Back</button>
                        <button className="nextButton">Next</button>
                </div>
            </div>
        </body>
    );
};

export default SubmitDropOffPage;
