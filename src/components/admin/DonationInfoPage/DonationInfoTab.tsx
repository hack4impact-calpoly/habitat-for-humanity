import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Grid, Radio, TextField } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import RadioGroup from "@mui/material/RadioGroup";
import "moment-timezone";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { Item } from "api/item";
import { User } from "api/user";
import { Event } from "api/event";
import { useDispatch } from "react-redux";
import { updateDonationStatus } from "../../../redux/eventSlice";
import { getPresignedImage } from "api/image";
import { updateNotes } from "../../../redux/donationSlice";
import { getEventByItemId } from "api/event";

interface InfoTabProps {
  item: Item;
  donor: User;
  timeSlots: TimeSlot[];
  notes: string;
  events: Event[];
  onNotesChange: (notes: string) => void;
}

export interface TimeSlot {
  id: string;
  eventStart: string;
  eventEnd: string;
  timeSlotString: string;
  dayString: string;
}

type ScheduledEvent = {
  startTime: string;
  endTime: string;
};

export function collectDates(timeSlots: TimeSlot[]) {
  const dates: string[] = [];
  if (
    !timeSlots ||
    timeSlots.length === 0 ||
    timeSlots[0].eventStart === undefined
  ) {
    return dates;
  }
  timeSlots.forEach((timeSlot) => {
    if (!dates.includes(timeSlot.dayString)) {
      dates.push(timeSlot.dayString);
    }
  });

  return dates;
}

function DonationInfoTab(props: InfoTabProps): React.ReactNode {
  const { item, donor, timeSlots, notes, events } = props;
  const [donationStatus, setDonationStatus] = useState<string>(item.status);
  const [pickup, setPickup] = useState<boolean>(true);
  const [images, setImages] = useState<string[]>([]);
  const [scheduledEvents, setScheduledEvents] = useState<ScheduledEvent[]>([]);

  const dispatch = useDispatch();

  useEffect(() => {
    setDonationStatus(item.status);
    setPickup(item.scheduling === "Pickup");
    const fetchUrls = async () => {
      const urls = await Promise.all(
        item.images.map((imageName: string) => getPresignedImage(imageName)),
      );
      setImages(urls);
    };
    const fetchScheduledEvent = async () => {
      if (
        item.status === "Approved and Scheduled" &&
        item.scheduling === "Pickup"
      ) {
        if (events) {
          const newScheduledEvents = events.map((event: Event) => ({
            startTime: new Date(event.startTime).toLocaleString("en-US", {
              timeZone: "America/Los_Angeles",
            }),
            endTime: new Date(event.endTime).toLocaleString("en-US", {
              timeZone: "America/Los_Angeles",
            }),
          }));

          setScheduledEvents(newScheduledEvents);
        }
      }
    };

    if (item && item.images) {
      fetchUrls();
    }
    if (item) {
      fetchScheduledEvent();
    }
  }, [item, events]);

  const handleStatusChange = (event: SelectChangeEvent) => {
    const newStatus = event.target.value;
    setDonationStatus(newStatus);
    dispatch(updateDonationStatus(newStatus));
  };

  const handleNotesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newNotes = event.target.value;
    props.onNotesChange(newNotes);
  };

  const dates = collectDates(timeSlots);

  return (
    <Grid container>
      <Grid item xs={12} sm={6}>
        <h2 style={{ marginTop: "3rem", color: `var(--orange)` }}>
          Donation Status
        </h2>
        <FormControl sx={{ width: { sm: "80%", lg: "50%" } }}>
          <Select
            value={donationStatus}
            onChange={handleStatusChange}
            displayEmpty
            // inputProps={{ "aria-label": "Without label" }}
          >
            <MenuItem value="Needs Approval" sx={{ color: "#FFA500" }}>
              <em>
                <b>Needs Approval</b>
              </em>
            </MenuItem>
            <MenuItem value="Approved and Scheduled">
              <em>
                <b>Approved and Scheduled</b>
              </em>
            </MenuItem>
            <MenuItem value="Completed" sx={{ color: "var(--secondary)" }}>
              <em>
                <b>Completed</b>
              </em>
            </MenuItem>
            <MenuItem value="Rejected" sx={{ color: "var(--orange)" }}>
              <em>
                <b>Rejected</b>
              </em>
            </MenuItem>
          </Select>
        </FormControl>
        <h2 style={{ color: `var(--orange)` }}>
          Changing the status begins the process that follows that stage — it
          doesn't complete the step itself.
        </h2>
      </Grid>
      <Grid item xs={12} sm={6}>
        {/* TODO: Implement notes functionality */}
        <h2 style={{ marginTop: "3rem", color: `var(--orange)` }}>Notes</h2>
        <TextField
          id="outlined-multiline-static"
          label=""
          multiline
          rows={4}
          fullWidth
          value={props.notes}
          onChange={handleNotesChange}
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
          <b>Item Name:</b> {item.name.join(", ")}
        </p>
        <p id="itemDimensions">
          <b>Item Dimensions: </b>
          {item.size.join(", ")}
        </p>
        {item.itemDetails && (
          <p id="itemDetails">
            <b>Item Details: </b>
            {item.itemDetails}
          </p>
        )}
        <p id="itemPhotos">
          <b>Item Photos</b>
        </p>
        <div id="ProductImages">
          {images && images.length > 0 ? (
            images.map((image, index) => (
              <div key={index} id="ProductImage">
                <img src={image || undefined} alt={`Item Image ${index + 1}`} />
              </div>
            ))
          ) : (
            <p>No images available</p> // If no images, display a fallback message
          )}
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
        <Grid item xs={6} id="SchedulingRadio">
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
      <Grid>
        {donationStatus === "Approved and Scheduled" &&
          pickup &&
          scheduledEvents && (
            <div style={{ marginTop: "1rem" }}>
              <h2 style={{ marginTop: "3rem", color: `var(--orange)` }}>
                Scheduled Pick Up Time
              </h2>
              {scheduledEvents.map((scheduledEvent, index) => (
                <div key={index}>
                  {scheduledEvent.startTime} - {scheduledEvent.endTime}
                </div>
              ))}
            </div>
          )}
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
