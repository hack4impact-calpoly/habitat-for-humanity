import React from "react";
import DonatorNavbar from "../../DonorNavbar/DonorNavbar";
import SubmitInfo from "../SubmitInfo";
import sofa1 from "../images/sofa-01.png";

require("./SubmitPickUpPage.css");

const imagesPool = [{ src: sofa1 }];

const address = "1 Grand Avenue \nSan Luis Obispo, CA 93407";

const avaiTimes = [
  {
    day: "Tuesday, January 11",
    hours: [
      "10:00 AM to 11:00AM",
      "11:00 AM to 12:00 PM",
      "12:00 PM to 1:00 PM",
      "1:00 PM to 2:00 PM",
      "3:00 PM to 4:00 PM",
      "4:00 PM to 5:00 PM",
    ],
  },
  {
    day: "Wednesday, January 12",
    hours: [
      "10:00 AM to 11:00AM",
      "11:00 AM to 12:00 PM",
      "12:00 PM to 1:00 PM",
    ],
  },
  {
    day: "Friday, January 14",
    hours: ["2:00 PM to 3:00PM", "3:00 PM to 4:00PM", "4:00 PM to 5:00PM"],
  },
];

function SubmitPickUpPage(): JSX.Element {
  return (
    <div>
      <DonatorNavbar />
      <div id="SubmitPickUpPage">
        <h2 id="Review">Review</h2>
        <p>Please review your donation information before you submit.</p>
        <SubmitInfo
          name="Sofa"
          dimensions='83" x 32" x 38"'
          photos={imagesPool}
          location={address}
          dropOff={false}
        />
        <div id="TimeHours">
          <h2 className="TimeAvailability">Time Availability</h2>
          <div id="TimeTable">
            {avaiTimes.map((element, index) => {
              const { day } = element;
              const { hours } = element;
              return (
                <tr key={index}>
                  <h4 className="donDropoffRow" key={index}>
                    {day}
                  </h4>
                  <div id="DayHours">
                    {hours.map((element1, index1) => (
                      <div id="EachDayHours">{element1}</div>
                    ))}
                  </div>
                </tr>
              );
            })}
          </div>
        </div>
        <div id="donDOButtons">
          <button type="button" className="backButton">
            Back
          </button>
          <button type="button" className="nextButton">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default SubmitPickUpPage;
