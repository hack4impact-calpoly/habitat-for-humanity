import React, { useEffect, useState } from "react";
import { Auth } from "aws-amplify";
import { useNavigate } from "react-router-dom";

import { Grid, Radio, TextField } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import RadioGroup from "@mui/material/RadioGroup";
import "moment-timezone";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { Item } from "api/item";
import { User } from "api/user";
import { useDispatch } from "react-redux";
import { updateDonationStatus } from "redux/eventSlice";

interface InfoTabProps {
  item: Item;
  donor: User;
  timeSlots: TimeSlot[];
}

export interface TimeSlot {
  id: string;
  eventStart: string;
  eventEnd: string;
  timeSlotString: string;
  dayString: string;
  volunteer: string;
}

export function collectDates(timeSlots: TimeSlot[]) {
  const dates: string[] = [];
  if (timeSlots[0].eventStart === undefined) return dates;
  timeSlots.forEach((timeSlot) => {
    if (!dates.includes(timeSlot.dayString)) {
      dates.push(timeSlot.dayString);
    }
  });
  return dates;
}

function DonationInfoTab(props: InfoTabProps): JSX.Element {
  const { item, donor, timeSlots } = props;
  const [donationStatus, setDonationStatus] = useState<string>(item.status);
  const [pickup, setPickup] = useState<boolean>(true);

  useEffect(() => {
    setDonationStatus(item.status);
    updateDonationStatus(donationStatus);
    setPickup(item.scheduling === "Pickup");
  }, [item]);

  const handleChange = (event: SelectChangeEvent) => {
    setDonationStatus(event.target.value);
    updateStoredStatus(event.target.value);
  };

  const dates = collectDates(timeSlots);

  const dispatch = useDispatch();
  const updateStoredStatus = (status: string) => {
    dispatch(updateDonationStatus(status));
  };

  return (
    <Grid container>
      <Grid item xs={12} sm={6}>
        <h2 style={{ marginTop: "3rem", color: `var(--orange)` }}>
          Donation Status
        </h2>
        <FormControl sx={{ width: { sm: "80%", lg: "50%" } }}>
          <Select
            value={donationStatus}
            onChange={handleChange}
            displayEmpty
            // inputProps={{ "aria-label": "Without label" }}
          >
            <MenuItem value="Needs Approval" sx={{ color: "var(--orange)" }}>
              <em>
                <b>Needs Approval</b>
              </em>
            </MenuItem>
            <MenuItem value="Approved and Scheduled">
              Approved and Scheduled
            </MenuItem>
            <MenuItem value="Send Receipt" sx={{ color: "var(--orange)" }}>
              <em>
                <b>Send Receipt</b>
              </em>
            </MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
            <MenuItem value="Rejected">Rejected</MenuItem>
            <MenuItem value="Soft Rejection">Soft Rejection</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6}>
        {/* TODO: Implement notes functionality */}
        <h2 style={{ marginTop: "3rem", color: `var(--orange)` }}>Notes</h2>
        <TextField
          id="outlined-multiline-static"
          label=""
          multiline
          rows={4}
          defaultValue=""
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <h2 style={{ marginTop: "3rem", color: `var(--orange)` }}>
          Contact Information
        </h2>
        <p id="donorName">
          <b>Name:</b> {`${donor.firstName} ${donor.lastName}`}
        </p>
        <p id="donorEmail">
          <b>Email:</b> {donor.email}
        </p>
        <p id="donorPhone">
          <b>Phone: </b> {donor.phone}
        </p>
      </Grid>
      <Grid item xs={12}>
        <h2 style={{ marginTop: "3rem", color: `var(--orange)` }}>
          Item Information
        </h2>
        <p id="itemName">
          <b>Item Name:</b> {item.name}
        </p>
        <p id="itemDimensions">
          <b>Item Dimensions: </b>
          {item.size}
        </p>
        <p id="itemPhotos">
          <b>Item Photos</b>
        </p>
        <div id="ProductImages">
          {/* TODO: Add photos */}
          {/* {photos?.map((imgSrc, index) => (
            <div key={index} id="SingleImages">
              <img src={imgSrc.src} alt="n" />
            </div>
          ))} */}
        </div>
      </Grid>
      <Grid item xs={12}>
        <h2 style={{ marginTop: "3rem", color: `var(--orange)` }}>Location</h2>
        <h4 id="Address">
          {item.address} <br /> {item.city}, {item.state} {item.zipCode}
        </h4>
      </Grid>
      <Grid item xs={12}>
        <h2 style={{ marginTop: "3rem", color: `var(--orange)` }}>
          Scheduling
        </h2>
        <h4 id="SchdulingDesc">
          Does the donation need to be picked up or can you drop it off at our
          ReStore?
        </h4>
        <Grid item xs={6}>
          <FormControl component="fieldset">
            <RadioGroup aria-label="gender" name="gender1" value={pickup} row>
              <FormControlLabel
                value={pickup}
                checked={!pickup}
                control={<Radio />}
                disabled={pickup}
                label="I can drop off at the ReStore"
              />
              <FormControlLabel
                checked={pickup}
                value={!pickup}
                control={<Radio />}
                disabled={!pickup}
                label="I need the item to be picked up"
              />
            </RadioGroup>
          </FormControl>
        </Grid>
      </Grid>
      <Grid item xs={12} display={!pickup ? "none" : "block"}>
        <h2 style={{ marginTop: "3rem", color: `var(--orange)` }}>
          Time Availability
        </h2>
        {dates.map((date, index) => (
          <div id="availability" key={index}>
            <h3>{date}</h3>
            <div
              style={{ display: "flex", flexDirection: "row", columnGap: 15 }}
            >
              {timeSlots.map((timeSlot, index1) => {
                if (timeSlot.dayString === date)
                  return (
                    <p
                      key={index1}
                      style={{
                        border: "2px solid #acacac",
                        boxSizing: "border-box",
                        width: 212,
                        height: 49,
                        display: "flex",
                        paddingTop: 13,
                        justifyContent: "center",
                      }}
                    >
                      {timeSlot.timeSlotString}
                    </p>
                  );

                return null;
              })}
            </div>
          </div>
        ))}
      </Grid>
    </Grid>
  );
}

export default DonationInfoTab;
