"use client";

import React, { useEffect, useState } from "react";
import { updateDonorID } from "../../../../redux/donationSlice";
import { useRouter } from "next/navigation";
import DonatorNavbar from "components/donor/DonorNavbar/DonorNavbar";
import ProgressBar from "components/donor/donation/ProgressBar";
import { useSelector } from "react-redux";
import { Item, addItem } from "../../../../api/item";
import { RootState } from "../../../../redux/store";
import { useUser } from "@clerk/clerk-react";
import { getUserByID } from "api/user";

require("../../../../App.css");

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
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const storedDonation = useSelector((state: RootState) => state.donation);
  const { user } = useUser();
  const storedName = useSelector((state: RootState) => state.donation.name);
  const storedDimensions = useSelector(
    (state: RootState) => state.donation.dimensions,
  );
  const statePhotos = useSelector((state: RootState) => state.donation.photos);
  // console.log(
  //   "state.donation",
  //   useSelector((state: RootState) => state.donation),
  // );
  const collectionType = useSelector(
    (state: RootState) => state.donation.photos,
  );
  const stateTime = useSelector((state: RootState) => state.donation.photos);

  // storedPhotos is an array of images names,
  // if access is needed, images name can be used
  // to generate presigned urls.
  const storedPhotos = statePhotos.map((url) => {
    const parts = url.split("/");
    return parts[parts.length - 1].split("?")[0];
  });
  const storedLocation = useSelector(
    (state: RootState) => state.donation.address,
  );
  const storedDropOff = useSelector(
    (state: RootState) => state.donation.dropoff,
  );
  const storedEvents = useSelector(
    (state: RootState) => state.donation.pickupTimes,
  );

  name = storedName;
  dimensions = storedDimensions;
  photos = storedPhotos;
  location = storedLocation;
  dropOff = storedDropOff;

  const [dropOffOption, setDropOffOption] = useState(dropOff);
  const [serverError, setServerError] = useState<string>("");
  const router = useRouter();

  const sendToDB = async () => {
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
      timeAvailability: storedDonation.pickupTimes, // TODO
      timeSubmitted: new Date(),
      status: "Needs Approval",
    };
    const response = await addItem(donation);
    console.log("To be sent to DB:", donation);
    // const imagesUploaded = await sendImagesToS3();
    if (!response) {
      setServerError(
        "There was an error sending your donation. Please try again later.",
      );
    }
    return response;
  };

  useEffect(() => {
    if (user?.id) {
      // Check if user.id is defined
      const fetchData = async () => {
        const response = await getUserByID(user.id);
        setUserData({
          firstName: user.firstName || "First Name Not Found",
          lastName: user.lastName || "Last Name Not Found",
          email: user.primaryEmailAddress?.emailAddress || "Email Not Found",
          phone: response.phone || "Phone Not Found",
        });
        storedDonation.donorID = user.id;
      };

      fetchData(); // Fetch user data whenever the component is re-entered
    }
  }, [user]);

  const buttonNavigation = async (
    e: React.MouseEvent<HTMLButtonElement>,
  ): Promise<void> => {
    const backPath: string = "/Donor/Donate/ScheduleDropoffPickup";
    const nextPath: string = "/Donor/Donate/NextSteps";

    if (e.currentTarget.value === "backButton") {
      router.push(backPath);
    } else if (e.currentTarget.value === "nextButton") {
      if (await sendToDB()) {
        router.push(nextPath);
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
            <h2 id="ItemInfo">Contact Information</h2>
            <p id="itemName">
              <b>Name:</b> {userData.firstName} {userData.lastName}
            </p>
            <p id="itemDimensions">
              <b>Email: </b> {userData.email}
            </p>
            <p id="itemPhotos">
              <b>Phone Number: </b> {userData.phone}{" "}
            </p>
            <h2 id="ItemInfo">Item Information</h2>
            <p id="itemName">
              <b>Item Name:</b> {name}
            </p>
            <p id="itemDimensions">
              <b>Item Dimensions: </b>
              {dimensions}
            </p>
            <div id="ProductImages">
              {statePhotos.map((imagePresignedUrl: any, i: any) => (
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
              {storedDonation.address} <br /> {storedDonation.city},{" "}
              {storedDonation.state} {storedDonation.zipCode}
            </h4>
          </div>
          <div id="SchedulingInfo">
            <h2 id="Scheduling">Scheduling</h2>
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
                The item will be picked up during
              </p>
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
