import React from "react";
import DonatorNavbar from '../../DonorNavbar/DonorNavbar';
import SubmitInfo from "../SubmitInfo";
import sofa1 from "./../images/sofa-01.png";
import sofa2 from "./../images/sofa-02.png";
import sofa3 from "./../images/sofa-03.png";
import sofa4 from "./../images/sofa-04.png";
import sofa5 from "./../images/sofa-05.png";
import sofa6 from "./../images/sofa-06.png";
import sofa7 from "./../images/sofa-07.png";
import sofa8 from "./../images/sofa-08.png";
require("./SubmitPickUpMultiplePhotoPage.css");

const imagesPool = [
    { src: sofa1 },
    { src: sofa2 },
    { src: sofa3 },
    { src: sofa4 },
    { src: sofa5 },
    { src: sofa6 },
    { src: sofa7 },
    { src: sofa8 },
  ];

const address = "1 Grand Avenue \nSan Luis Obispo, CA 93407";

  const avaiTimes = [
    { day: "Tuesday, January 11",   hours: ["10:00 AM to 11:00AM", "11:00 AM to 12:00 PM", "12:00 PM to 1:00 PM", "1:00 PM to 2:00 PM", "3:00 PM to 4:00 PM", "4:00 PM to 5:00 PM"]},
    { day: "Wednesday, January 12", hours: ["10:00 AM to 11:00AM", "11:00 AM to 12:00 PM", "12:00 PM to 1:00 PM"]},
    { day: "Friday, January 14",    hours: ["2:00 PM to 3:00PM", "3:00 PM to 4:00PM", "4:00 PM to 5:00PM"]},
];


const SubmitPickUpMultiplePhotoPage = (): JSX.Element => {

    return (
        <body>
            <DonatorNavbar />
            <div id="SubmitPickUpPage">
                <h2 id="Review">Review</h2>
                <p>Please review your donation information before you submit.</p>
                <SubmitInfo name="Sofa" dimensions='83" x 32" x 38"' photos={imagesPool} location={address} dropOff={true}/>
                <div id="TimeHours">
                    <h2 className="TimeAvailability">Time Availability</h2>
                    <div id="TimeTable">
                            {avaiTimes.map((element, index) => {
                                const day: string = element.day;
                                const hours: string[] = element.hours;
                                return (
                                    <tr key={index}>
                                        <h4 className="donDropoffRow" key={index}>{day}</h4 >
                                        <div id="DayHours"> 
                                            {hours.map((element1, index1) => {return(<div id="EachDayHours">{element1}</div>)})}
                                        </div>
                                    </tr>
                                );
                            })}
                    </div>
                </div>
                <div id="donDOButtons">
                        <button className="backButton">Back</button>
                        <button className="nextButton">Next</button>
                </div>
            </div>
        </body>
    );
};

export default SubmitPickUpMultiplePhotoPage;
