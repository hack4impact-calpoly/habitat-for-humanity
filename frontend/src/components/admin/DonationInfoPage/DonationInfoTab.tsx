import React, { useEffect, useState } from "react";
import { Auth } from "aws-amplify";
import { useNavigate } from "react-router-dom";

import { Grid, Radio, TextField } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../redux/store";

interface InfoTabProps {
  name?: string;
  dimensions?: string;
  photos?: { src: string }[];
  location?: string;
  dropOff?: boolean;
}

function DonationInfoTab(props: InfoTabProps): JSX.Element {
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
  const storedDonorID = useSelector(
    (state: RootState) => state.donation.donorID
  );
  const dispatch = useDispatch();
  const { name, dimensions, photos, location, dropOff } = props;
  const [age, setAge] = React.useState("");

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value);
  };

  return (
    <Grid container>
      <Grid item xs={12} sm={6} spacing={4}>
        <h2 style={{ marginTop: "3rem", color: `var(--orange)` }}>
          Donation Status
        </h2>
        <FormControl sx={{ width: { sm: "80%", lg: "50%" } }}>
          <Select
            value={age}
            onChange={handleChange}
            displayEmpty
            inputProps={{ "aria-label": "Without label" }}
          >
            <MenuItem value="" sx={{ color: "var(--orange)" }}>
              <em>Needs Approval</em>
            </MenuItem>
            <MenuItem value={10}>Approved and Scheduled</MenuItem>
            <MenuItem value={20}>Send Receipt</MenuItem>
            <MenuItem value={30}>Completed</MenuItem>
            <MenuItem value={40}>Rejected</MenuItem>
            <MenuItem value={40}>Soft Rejection</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6}>
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
          Item Information
        </h2>
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
      </Grid>
      <Grid item xs={12}>
        <h2 style={{ marginTop: "3rem", color: `var(--orange)` }}>Location</h2>
        <h4 id="Address">
          {storedDonation.address} <br /> {storedDonation.city},{" "}
          {storedDonation.state} {storedDonation.zipCode}
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
      </Grid>
      <Grid item xs={12}>
        <h2 style={{ marginTop: "3rem", color: `var(--orange)` }}>
          Time Availability
        </h2>
      </Grid>
    </Grid>
  );
}

export default DonationInfoTab;
