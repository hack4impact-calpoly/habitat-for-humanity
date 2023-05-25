import React from "react";
import ProgressBar from "components/donor/donation/ProgressBar";
import DonatorNavbar from "../../DonorNavbar/DonorNavbar";
import SubmitInfo from "../SubmitInfo";
import sofa1 from "../images/sofa-01.png";

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

const imagesPool: string[] = [ sofa1 ];

function SubmitDropOffPage(): JSX.Element {
  return (
    <div>
      <DonatorNavbar />
      <div id="SubmitDropOffPage">
        <h2 id="Review">Review</h2>
        <p>Please review your donation information before you submit.</p>
        <SubmitInfo
          name="Sofa"
          dimensions='83" x 32" x 38"'
          photos={imagesPool}
          location={address}
          dropOff
        />
        <div id="StoreHours">
          <h2 id="DropOffHours">ReStore Drop Off Hours</h2>
          <table>
            <div>
              {weeklyHours.map((element, index) => {
                const { day } = element;
                const { hours } = element;
                return (
                  <tr key={index}>
                    <td className="donDropoffRow" key={index + 7}>
                      {day}
                    </td>
                    <td
                      className="donDropoffRow donDropoffHours"
                      key={index + 14}
                    >
                      {hours}
                    </td>
                  </tr>
                );
              })}
            </div>
          </table>
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

export default SubmitDropOffPage;
