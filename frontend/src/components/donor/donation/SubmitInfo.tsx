import React, { useEffect, useState } from "react";
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
  photos?: string[];
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
  const storedPhotos = useSelector((state: RootState) => state.donation.photos);
  const storedLocation = useSelector(
    (state: RootState) => state.donation.address
  );
  const storedDropOff = useSelector(
    (state: RootState) => state.donation.dropoff
  );

  name = storedName;
  dimensions = storedDimensions;
  photos = storedPhotos;
  location = storedLocation;
  dropOff = storedDropOff;

  const [dropOffOption, setDropOffOption] = useState(dropOff);
  const [serverError, setServerError] = useState<string>("");
  const navigate = useNavigate();

  /* convert array of base64-encoded back into array of image files */
  const convertToFiles = (photos: string[]): File[] => {
    const files: File[] = [];
    photos.forEach((photo, index) => {
      const byteString = atob(photo.split(",")[1]);
      const mimeString = photo.split(",")[0].split(":")[1].split(";")[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: mimeString });
      // Create a file object with a unique name
      const fileName = `image-${index}.${mimeString.split("/")[1]}`;
      const file = new File([blob], fileName, { type: mimeString });
      files.push(file);
    });
    return files;
  };

  /* print the converted array to console */
  console.log("photos: ", convertToFiles(photos));

  const sendToDB = async () => {
    const donation: Item = {
      name: storedDonation.name,
      size: storedDonation.dimensions,
      photos: storedDonation.photos,
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
              {photos.map((base64String: any, i: any) => (
                <img
                  src={base64String}
                  alt="uploaded"
                  key={i}
                  id="ProductImage"
                />
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
