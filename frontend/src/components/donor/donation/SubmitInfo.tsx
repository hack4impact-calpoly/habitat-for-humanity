import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DonatorNavbar from "components/donor/DonorNavbar/DonorNavbar";
import ProgressBar from "components/donor/donation/ProgressBar";
import { useSelector } from "react-redux";
import { Box, Container, Grid, Radio } from "@mui/material";
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
    <Grid container justifyContent="center" id="SubmitInfoPage">
      {!component && <DonatorNavbar />}
      <Grid
        container
        justifyContent="center"
        direction="column"
        sx={{
          padding: { xs: "0 10%", sm: "0px 15%", md: "10px 20%" },
          marginTop: { xs: "0", sm: "0px", md: "0 10px" },
        }}
      >
        <Grid item>{!component && <ProgressBar activeStep={4} />}</Grid>
        <Grid item className="submitDonationInfoReview" spacing={0}>
          <h2 id="Review" style={{ marginTop: 0 }}>
            Review
          </h2>
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
          <h2 id="Scheduling">Scheduling</h2>
          <h4 id="SchdulingDesc">
            Does the donation need to be picked up or can you drop it off at our
            ReStore?
          </h4>
          <Grid
            className="dropOffOptions"
            container
            spacing={1}
            justifyItems="start"
            sx={{
              direction: { sm: "row", xs: "column" },
            }}
          >
            <Grid item>
              <input
                type="radio"
                checked={dropOffOption}
                onClick={() => setDropOffOption(true)}
              />
              <p id="radioDropoff" className="radioOptionLabel">
                I can drop off at the ReStore
              </p>
            </Grid>
            <Grid item id="radioPickUp" alignItems="center">
              <input
                type="radio"
                checked={!dropOffOption}
                onClick={() => setDropOffOption(false)}
              />
              <p className="radioOptionLabel">
                I need the item to be picked up
              </p>
            </Grid>
          </Grid>
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
        </Grid>
        <Grid item className="inputError">
          {serverError}
        </Grid>
        {!component && (
          <Grid
            container
            direction="row"
            padding="30px 0px"
            spacing={{ xs: 1, sm: 0 }}
            justifyContent="start"
            alignItems="center"
          >
            <Grid item>
              <button
                type="button"
                value="backButton"
                className="donPickupButton backButton"
                onClick={buttonNavigation}
              >
                Back
              </button>
            </Grid>
            <Grid item>
              <button
                type="button"
                value="nextButton"
                className="donPickupButton nextButton"
                onClick={buttonNavigation}
              >
                Next
              </button>
            </Grid>
          </Grid>
        )}
      </Grid>
    </Grid>
  );
};

export default SubmitInfo;
