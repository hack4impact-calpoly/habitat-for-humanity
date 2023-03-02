import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DonatorNavbar from "components/donor/DonorNavbar/DonorNavbar";
import ProgressBar from "components/donor/donation/ProgressBar";
import { useSelector } from "react-redux";
import { Event } from "redux/donationSlice";
import moment from "moment";
import { Item, addItem } from "../../../api/item";
import { RootState } from "../../../redux/store";

require("./SubmitInfo.css");

interface DummyComponentProps {
  name?: string;
  dimensions?: string;
  photos?: { src: string }[];
  location?: string;
  dropOff?: boolean;
  pickupTimes?: Event[];
  component?: boolean;
}
// TODO: eventually use DonorScheduleDropoff/Pickup pages instead of this component
const SubmitInfo: React.FC<DummyComponentProps> = ({
  name,
  dimensions,
  photos,
  location,
  dropOff,
  pickupTimes,
  component,
}) => {
  const storedDonation = useSelector((state: RootState) => state.donation);

  const storedName = useSelector((state: RootState) => state.donation.name);
  const storedDimensions = useSelector(
    (state: RootState) => state.donation.dimensions
  );
  const storedLocation = useSelector(
    (state: RootState) => state.donation.address
  );
  const storedDropOff = useSelector(
    (state: RootState) => state.donation.dropoff
  );

  const storedPickupTimes = useSelector(
    (state: RootState) => state.donation.pickupTimes
  );
  console.log(storedPickupTimes);
  const prevDate: string = "";

  // This is for preprocessing the pickUp times to get them into an array of arrays
  const groupedTimes: Record<string, any[]> = {};
  storedPickupTimes.forEach((time) => {
    const day = moment(time.start).format("dddd, MMMM Do");
    if (!groupedTimes[day]) {
      groupedTimes[day] = [];
    }
    groupedTimes[day].push(time);
  });

  const processedTimes = Object.entries(groupedTimes).map(([day, times]) => [
    day,
    times,
  ]);

  name = storedName;
  dimensions = storedDimensions;
  location = storedLocation;
  dropOff = storedDropOff;
  pickupTimes = storedPickupTimes;

  const [dropOffOption, setDropOffOption] = useState(dropOff);
  const [serverError, setServerError] = useState<string>("");
  const navigate = useNavigate();

  const sendToDB = async () => {
    const donation: Item = {
      name: storedDonation.name,
      size: storedDonation.dimensions,
      address: storedDonation.address,
      city: storedDonation.city,
      state: storedDonation.state,
      zipCode: storedDonation.zipCode.toString(),
      scheduling: storedDonation.dropoff ? "Dropoff" : "Pickup",
      timeAvailability: [[new Date(), new Date()]], // TODO
      timeSubmitted: new Date(),
      status: "Needs Approval",
    };
    const response = await addItem(donation);
    if (!response) {
      setServerError(
        "There was an error sending your donation. Please try again later."
      );
    }
    return response;
  };

  const buttonNavigation = async (
    e: React.MouseEvent<HTMLButtonElement>
  ): Promise<void> => {
    const backPath: string = "/Donor/Donate/ScheduleDropoffPickup";
    const nextPath: string = "/Donor/Donate/NextSteps";

    if (e.currentTarget.value === "backButton") {
      navigate(backPath);
    } else if (e.currentTarget.value === "nextButton") {
      if (await sendToDB()) {
        navigate(nextPath);
      }
    }
  };

  return (
    <div>
      {!component && <DonatorNavbar />}

      <div id={!component ? "MainContainer" : ""}>
        <div id="SubmitInfoPage">
          <div id="information">
            {!component && <ProgressBar activeStep={4} />}
            <h2 id="Review">Review</h2>
            <p>Please review your donation information before you submit.</p>
            <h2 id="ItemInfo">Item Information</h2>
            <p id="itemName">
              <b>Item Name:</b> {name}
            </p>
            <p id="itemDimensions">
              <b>Item Dimensions: </b>
              {dimensions}
            </p>
            <p id="itemPhotos">
              <b>Item Photos</b>
            </p>
            <div id="ProductImages">
              {photos?.map((imgSrc, index) => (
                <div key={index} id="SingleImages">
                  <img src={imgSrc.src} alt="n" />
                </div>
              ))}
            </div>
            <h2 id="Location">Location</h2>
            <h4 id="Address">
              {storedDonation.address} <br /> {storedDonation.city},{" "}
              {storedDonation.state} {storedDonation.zipCode}
            </h4>
          </div>
          <div id="SchedulingInfo">
            <h2 id="Scheduling">Scheduling</h2>
            <h4 id="SchdulingDesc">
              Does the donation need to be picked up or can you drop it off at
              our ReStore?
            </h4>
          </div>
          {/* if they can drop off at restore, show hours
          if they need pick up, show their selected times */}
          <div id="donPDOptions">
            <div>
              <input
                type="radio"
                className="radioOptionLabelCircle"
                checked={dropOffOption}
                onChange={() => setDropOffOption(true)}
              />
              <p id="radioDropoff" className="radioOptionLabel radioLabel">
                I can drop off at the ReStore
              </p>
            </div>
            <br />
            <div id="radioPickUp">
              <input
                type="radio"
                className="radioOptionLabelCircle"
                checked={!dropOffOption}
                onChange={() => setDropOffOption(false)}
              />
              <p className="radioOptionLabel radioLabel">
                I need the item to be picked up
              </p>
            </div>
          </div>
          {dropOffOption ? (
            <div id="ReStoreHours">
              <h2 id="ReStore">ReStore Drop Off Hours</h2>
              <div id="ReStoreHoursTable">
                <div className="ReStoreHoursTableItem">
                  <p>Monday</p>
                  <p>Closed</p>
                </div>
                <div className="ReStoreHoursTableItem">
                  <p>Tuesday</p>
                  <p>10:00 AM to 5:00 PM</p>
                </div>
                <div className="ReStoreHoursTableItem">
                  <p>Wednesday</p>
                  <p>10:00 AM to 5:00 PM</p>
                </div>
                <div className="ReStoreHoursTableItem">
                  <p>Thursday</p>
                  <p>10:00 AM to 5:00 PM</p>
                </div>
                <div className="ReStoreHoursTableItem">
                  <p>Friday</p>
                  <p>10:00 AM to 5:00 PM</p>
                </div>
                <div className="ReStoreHoursTableItem">
                  <p>Saturday</p>
                  <p>10:00 AM to 5:00 PM</p>
                </div>
                <div className="ReStoreHoursTableItem">
                  <p>Sunday</p>
                  <p>Closed</p>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <h2 id="ReStore">Time Availability</h2>
              <div id="times">
                {processedTimes.map(([day, times], index) => (
                  <div key={index} className="timeAvailability">
                    <div className="dayTitle">
                      <b>{day}</b>
                    </div>
                    {Array.isArray(times) &&
                      times.map((time, index) => {
                        if (typeof time === "object" && time !== null) {
                          return (
                            <p key={index} className="timeBox">
                              {`${moment(time.start).format("LT")} to ${moment(
                                time.end
                              ).format("LT")}`}
                            </p>
                          );
                        }
                        return null;
                      })}
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="inputError">{serverError}</div>
          {!component && (
            <div
              id="donPickupButtons"
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
              }}
            >
              <button
                type="button"
                value="backButton"
                className="donPickupButton backButton"
                onClick={buttonNavigation}
                style={{ padding: "10px 45px" }}
              >
                Back
              </button>
              <button
                type="button"
                value="nextButton"
                className="donPickupButton nextButton"
                onClick={buttonNavigation}
                style={{ padding: "10px 45px" }}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubmitInfo;
