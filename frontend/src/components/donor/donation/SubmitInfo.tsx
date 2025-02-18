import React, { useEffect, useState } from "react";
import { Auth } from "aws-amplify";
import { updateDonorID } from "redux/donationSlice";
import { useNavigate } from "react-router-dom";
import DonatorNavbar from "components/donor/DonorNavbar/DonorNavbar";
import ProgressBar from "components/donor/donation/ProgressBar";
import { useSelector, useDispatch } from "react-redux";
import { Item, addItem } from "../../../api/item";
import { RootState } from "../../../redux/store";

require("./SubmitInfo.css");

interface DummyComponentProps {
  name?: string;
  dimensions?: string;
  photos?: string[];
  location?: string;
  dropOff?: boolean;
  component?: boolean;
}

/**
 * Custom interface to represent an event with a start date string.
 * Adjust the fields to match your actual event structure.
 */
interface ScheduledEvent {
  start: string;
  // Add other properties as needed, e.g.: title?: string;
}

/**
 * Validates the donor's scheduled pickup times.
 * Accepts an array of either strings or ScheduledEvent objects.
 * For ScheduledEvent objects, it assumes there is a 'start' property that is a valid date string.
 * @param pickupTimes - An array of scheduled times (string | ScheduledEvent).
 * @returns true if the times are valid, false otherwise.
 */
const checkScheduledTimes = (
  pickupTimes: Array<string | ScheduledEvent> | undefined
): boolean => {
  if (!pickupTimes) {
    console.error("Pickup times are undefined.");
    return false;
  }
  if (!Array.isArray(pickupTimes)) {
    console.error("Pickup times are not stored as an array.");
    return false;
  }
  if (pickupTimes.length === 0) {
    console.error("No pickup times have been selected.");
    return false;
  }

  let isValid = true;
  pickupTimes.forEach((time) => {
    let date: Date;

    if (typeof time === "string") {
      // Directly parse the string as a Date
      date = new Date(time);
    } else if (typeof time === "object" && time !== null && "start" in time) {
      // If it's a ScheduledEvent with a 'start' property
      date = new Date((time as ScheduledEvent).start);
    } else {
      // Fallback: safely convert 'time' to a string before creating a new Date
      const fallbackStr = String(time);
      date = new Date(fallbackStr);
    }

    if (Number.isNaN(date.getTime())) {
      console.error(
        `Invalid date format for pickup time: ${JSON.stringify(time)}`
      );
      isValid = false;
    }
  });

  return isValid;
};

const SubmitInfo: React.FC<DummyComponentProps> = ({
  name,
  dimensions,
  photos,
  location,
  dropOff,
  component,
}) => {
  const storedDonation = useSelector((state: RootState) => state.donation);

  const storedName = useSelector((state: RootState) => state.donation.name);
  const storedDimensions = useSelector(
    (state: RootState) => state.donation.dimensions
  );
  const statePhotos = useSelector((state: RootState) => state.donation.photos);
  const storedPhotos = statePhotos.map((url) => {
    const parts = url.split("/");
    return parts[parts.length - 1].split("?")[0];
  });

  const storedLocation = useSelector(
    (state: RootState) => state.donation.address
  );
  const storedDropOff = useSelector(
    (state: RootState) => state.donation.dropoff
  );
  const storedDonorID = useSelector(
    (state: RootState) => state.donation.donorID
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // If you need to set donorID from Auth on every render, uncomment useEffect
  // useEffect(() => {
  //   Auth.currentUserInfo().then((user) => {
  //     const { attributes = {} } = user;
  //     dispatch(updateDonorID(attributes['custom:id']));
  //   });
  // }, [dispatch]);

  // Override props with stored values from Redux
  name = storedName;
  dimensions = storedDimensions;
  photos = storedPhotos;
  location = storedLocation;
  dropOff = storedDropOff;

  const [dropOffOption, setDropOffOption] = useState(dropOff);
  const [serverError, setServerError] = useState<string>("");

  const sendToDB = async () => {
    // Validate scheduled times before sending
    if (!checkScheduledTimes(storedDonation.pickupTimes)) {
      setServerError(
        "Invalid scheduled times. Please select valid pickup times before submitting."
      );
      return false;
    }

    const donation: Item = {
      name: storedDonation.name,
      size: storedDonation.dimensions,
      photos: storedPhotos,
      address: storedDonation.address,
      city: storedDonation.city,
      state: storedDonation.state,
      zipCode: storedDonation.zipCode.toString(),
      donorId: storedDonation.donorID,
      timeApproved: new Date(),
      scheduling: storedDonation.dropoff ? "Dropoff" : "Pickup",
      timeAvailability: storedDonation.pickupTimes, // Validated times
      timeSubmitted: new Date(),
      status: "Needs Approval",
    };

    const response = await addItem(donation);
    console.log("To be sent to DB:", donation);

    if (!response) {
      setServerError(
        "There was an error sending your donation. Please try again later."
      );
      return false;
    }

    return true;
  };

  const buttonNavigation = async (
    e: React.MouseEvent<HTMLButtonElement>
  ): Promise<void> => {
    const backPath = "/Donor/Donate/ScheduleDropoffPickup";
    const nextPath = "/Donor/Donate/NextSteps";

    if (e.currentTarget.value === "backButton") {
      navigate(backPath);
    } else if (e.currentTarget.value === "nextButton") {
      const success = await sendToDB();
      if (success) {
        navigate(nextPath);
      }
    }
  };

  return (
    <div>
      {!component && <DonatorNavbar />}
      {console.log(storedDonation.pickupTimes)}
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
              {statePhotos.map((imagePresignedUrl: string, i: number) => (
                <img
                  src={imagePresignedUrl}
                  alt="uploaded"
                  key={i}
                  id="ProductImage"
                />
              ))}
            </div>

            <h2 id="Location">Location</h2>
            <h4 id="Address">
              {storedDonation.address}
              <br />
              {storedDonation.city}, {storedDonation.state}{" "}
              {storedDonation.zipCode}
            </h4>
          </div>

          <div id="SchedulingInfo">
            <h2 id="Scheduling">Scheduling</h2>
            <h4 id="SchdulingDesc">
              Does the donation need to be picked up or can you drop it off at
              our ReStore?
            </h4>
          </div>

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

          <div className="inputError">{serverError}</div>

          {!component && (
            <div
              id="donPickupButtons"
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
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
