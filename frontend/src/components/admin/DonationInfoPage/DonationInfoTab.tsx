import React, { useEffect, useState } from "react";
import { Auth } from "aws-amplify";
import { useNavigate } from "react-router-dom";

import { Grid, Radio, TextField } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import FormControlLabel from "@mui/material/FormControlLabel";
import RadioGroup from "@mui/material/RadioGroup";
import moment from "moment";
import "moment-timezone";
import { Event } from "redux/donationSlice";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { Item } from "api/item";
import { User } from "api/user";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../redux/store";

interface InfoTabProps {
  item: Item;
  donor: User;
}
export function collectDates(events: Event[]) {
  const dates: string[] = [];
  events.forEach((event) => {
    const date = event.start.split("T")[0];
    if (!dates.includes(date)) {
      dates.push(date);
    }
  });
  return dates;
}

export function belongsToDay(date: string, event: Event) {
  return event.start.split("T")[0] === date;
}

export const getTime = (time: string) =>
  time ? moment(time).format("h:mm A") : "N/A";

export const getDay = (time: string) =>
  time ? moment(time).utc().format("dddd, MMMM Do YYYY") : "N/A";

export const getDayShort = (time: string) =>
  time ? moment(time).format("dddd, MMMM Do YYYY") : "N/A";

function DonationInfoTab(props: InfoTabProps): JSX.Element {
  const { item, donor } = props;
  const [donationStatus, setDonationStatus] = useState<string>(item.status);

  const handleChange = (event: SelectChangeEvent) => {
    setDonationStatus(event.target.value);
  };

  const [pickup, setPickup] = React.useState(true);
  const dates = collectDates(item.timeAvailability);

  return (
    <Grid container>
      <Grid item xs={12} sm={6} spacing={4}>
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
            <MenuItem value="" sx={{ color: "var(--orange)" }}>
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
                value={!pickup}
                control={<Radio />}
                disabled
                label="I can drop off at the ReStore"
              />
              <FormControlLabel
                value={pickup}
                control={<Radio />}
                label="I need the item to be picked up"
              />
            </RadioGroup>
          </FormControl>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <h2 style={{ marginTop: "3rem", color: `var(--orange)` }}>
          Time Availability
        </h2>
        {dates.map((date, index) => (
          <div id="availability">
            <h3>{getDayShort(date)}</h3>
            <div
              style={{ display: "flex", flexDirection: "row", columnGap: 15 }}
            >
              {item.timeAvailability.map((element, index) => {
                if (belongsToDay(date, element))
                  return (
                    <p
                      key={index}
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
                      {getTime(element.start)} to {getTime(element.end)}
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
