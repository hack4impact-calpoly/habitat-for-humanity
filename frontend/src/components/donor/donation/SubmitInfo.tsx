import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DonatorNavbar from "components/donor/DonorNavbar/DonorNavbar";
import ProgressBar from "components/donor/donation/ProgressBar";
import { useSelector } from "react-redux";
import { Item, addItem } from "../../../api/item";

import { RootState } from "../../../redux/store";

require("./SubmitInfo.css");

interface DummyComponentProps {
  name?: string;
  dimensions?: string;
  photos?: { src: string }[];
  location?: string;
  dropOff?: boolean;
  component?: boolean;
}
// TODO: eventually use DonorScheduleDropoff/Pickup pages instead of this component
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
  const storedLocation = useSelector(
    (state: RootState) => state.donation.address
  );
  const storedDropOff = useSelector(
    (state: RootState) => state.donation.dropoff
  );

  name = storedName;
  dimensions = storedDimensions;
  location = storedLocation;
  dropOff = storedDropOff;

  const [dropOffOption, setDropOffOption] = useState(dropOff);
  const [serverError, setServerError] = useState<string>("");
  const navigate = useNavigate();

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

  const sendToDB = async () => {
    const donation: Item = {
      name: storedDonation.name,
      size: storedDonation.dimensions,
      address: storedDonation.address,
      city: storedDonation.city,
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

  return (
    <div>
      {!component && <DonatorNavbar />}

      <div id={!component ? "MainContainer" : ""}>
        <div id="SubmitInfoPage">
          <div id="information">
            {!component && <ProgressBar activeStep={4} />}
            {/* <h2 id="Review">Review</h2>
                        <p>Please review your donation information before you submit.</p> */}
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
              {storedDonation.address}, {storedDonation.city}{" "}
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
                checked={dropOff}
                onChange={() => setDropOffOption(true)}
              />
              <p id="radioDropoff" className="radioOptionLabel radioLabel">
                I can drop off at the ReStore
              </p>
            </div>
            <div id="radioPickUp">
              <input
                type="radio"
                className="radioOptionLabelCircle"
                checked={!dropOff}
                onChange={() => setDropOffOption(false)}
              />
              <p className="radioOptionLabel radioLabel">
                I need the item to be picked up
              </p>
            </div>
          </div>
          <div className="inputError">{serverError}</div>
          {!component && (
            <div
              id="donPickupButtons"
              style={{ display: "flex", flexDirection: "row" }}
            >
              <button
                type="button"
                value="backButton"
                className="donPickupButton backButton"
                onClick={buttonNavigation}
              >
                Back
              </button>
              <div style={{ flexGrow: 1 }} />
              <button
                type="button"
                value="nextButton"
                className="donPickupButton nextButton"
                onClick={buttonNavigation}
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
