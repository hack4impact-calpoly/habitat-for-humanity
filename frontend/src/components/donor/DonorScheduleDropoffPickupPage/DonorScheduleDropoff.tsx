"use client";
import React from "react";
import { useRouter } from "next/navigation";

const pasoWeeklyHours = [
  { day: "Monday", hours: "Closed" },
  { day: "Tuesday", hours: "11:00 AM to 4:00 PM" },
  { day: "Wednesday", hours: "Closed" },
  { day: "Thursday", hours: "11:00 AM to 4:00 PM" },
  { day: "Friday", hours: "11:00 AM to 4:00 PM" },
  { day: "Saturday", hours: "11:00 AM to 4:00 PM" },
  { day: "Sunday", hours: "Closed" },
];

const sloWeeklyHours = [
  { day: "Monday", hours: "Closed" },
  { day: "Tuesday", hours: "11:00 AM to 4:00 PM" },
  { day: "Wednesday", hours: "11:00 AM to 4:00 PM" },
  { day: "Thursday", hours: "Closed" },
  { day: "Friday", hours: "11:00 AM to 4:00 PM" },
  { day: "Saturday", hours: "11:00 AM to 4:00 PM" },
  { day: "Sunday", hours: "Closed" },
];

function DonatorScheduleDropoff(): React.ReactNode {
  const router = useRouter();

  const buttonNavigation = (e: React.MouseEvent<HTMLButtonElement>): void => {
    const backPath: string = "/Donor/Donate/Location";
    const nextPath: string = "/Donor/Donate/Review";

    if (e.currentTarget.value === "backButton") {
      router.push(backPath);
    } else if (e.currentTarget.value === "nextButton") {
      router.push(nextPath);
    }
  };

  return (
    <div>
      <h2 className="donDropoffPickupHeader">
        Paso Robles ReStore Drop Off Hours
      </h2>
      <table>
        <tbody>
          {pasoWeeklyHours.map((element, index) => {
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
      <h2 className="donDropoffPickupHeader">SLO ReStore Drop Off Hours</h2>
      <table>
        <tbody>
          {sloWeeklyHours.map((element, index) => {
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
      <div>
        <p>
          <strong>Please note:</strong> Our stores may occasionally close for
          holidays, staff training, or other reasons. We encourage you to visit
          our website or follow us on social media for the most up-to-date
          information regarding store hours. For updates, follow us on Instagram
          at{" "}
          <a
            href="https://www.instagram.com/habitatslorestores/"
            target="_blank"
            style={{ color: "blue", textDecoration: "underline" }}
          >
            @habitatslorestores
          </a>
          .
        </p>
      </div>

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
