import React from "react";
import { useNavigate } from "react-router-dom";

const weeklyHours = [
  { day: "Monday", hours: "Closed" },
  { day: "Tuesday", hours: "10:00 AM to 5:00 PM" },
  { day: "Wednesday", hours: "10:00 AM to 5:00 PM" },
  { day: "Thursday", hours: "10:00 AM to 5:00 PM" },
  { day: "Friday", hours: "10:00 AM to 5:00 PM" },
  { day: "Saturday", hours: "10:00 AM to 5:00 PM" },
  { day: "Sunday", hours: "Closed" },
];

function DonatorScheduleDropoff(): JSX.Element {
  const navigate = useNavigate();

  const buttonNavigation = (e: React.MouseEvent<HTMLButtonElement>): void => {
    const backPath: string = "/Donor/Donate/Location";
    const nextPath: string = "/Donor/Donate/Review";

    if (e.currentTarget.value === "backButton") {
      navigate(backPath);
    } else if (e.currentTarget.value === "nextButton") {
      navigate(nextPath);
    }
  };

  return (
    <div>
      <h2 className="donDropoffPickupHeader">ReStore Drop Off Hours</h2>
      <table>
        <tbody>
          {weeklyHours.map((element, index) => {
            const { day } = element;
            const { hours } = element;
            return (
              <tr key={index}>
                <td className="donDropoffRow" key={index + 7}>
                  {day}
                </td>
                <td className="donDropoffRow donDropoffHours" key={index + 14}>
                  {hours}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div id="donDropoffButtons">
        <button
          type="button"
          value="backButton"
          className="backButton"
          onClick={buttonNavigation}
        >
          Back
        </button>
        <button
          type="button"
          value="nextButton"
          className="nextButton"
          onClick={buttonNavigation}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default DonatorScheduleDropoff;
