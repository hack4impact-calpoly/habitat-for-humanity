import FullCalendar, {
  EventClickArg,
  EventContentArg,
} from "@fullcalendar/react";
import React, { useState, useEffect } from "react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import { Modal, Box, Typography } from "@mui/material";
import { Types } from "mongoose";
import AdminNavbar from "../AdminNavbar/AdminNavbar";
import SmallCalendar from "./SmallCalendar";

require("./AdminCalendar.css");

interface DonationEvent {
  title: string;
  startTime: Date;
  endTime: Date;
  volunteerId: Types.ObjectId;
  itemId: Types.ObjectId;
  address: string;
  city: string;
  zipCode: string;
  volunteerFirstName: string;
  volunteerLastName: string;
  donorFirstName: string;
  donorLastName: string;
  itemName: string;
  phone: string;
  pickupAvailability: string[][];
  location: string;
}

const eventHeader = {
  display: "flex",
  fontSize: "14px",
  marginTop: "7px",
  marginBottom: "5px",
  marginLeft: "5px",
  marginRight: "5px",
  lineHeight: "15px",
};

const eventDiv = {
  display: "flex",
  fontSize: "10px",
  marginLeft: "5px",
  marginRight: "5px",
  fontFamily: "Rubik",
};

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 380,
  height: 247,
  bgcolor: "background.paper",
  border: "1px solid #DFDFDF",
  boxShadow: "10px 4px 20px rgba(49, 77, 137, 0.1)",
  p: 4,
};

const modalAddressStyle = {
  color: "#314D89",
  fontFamily: "Rubik",
  fontStyle: "normal",
  fontWeight: "bold",
  fontSize: "13px",
  lineHeight: "15px",
  marginBottom: "10px",
};

const modalDefaultText = {
  color: "#000000",
  fontFamily: "Rubik",
  fontStyle: "normal",
  fontWeight: "400",
  fontSize: "13px",
  lineHeight: "15px",
  marginTop: "5px",
  marginBottom: "5px",
};

const modalTitleText = {
  color: "#011338",
  fontFamily: "Rubik",
  fontStyle: "normal",
  fontWeight: "bolder",
  fontSize: "13px",
  lineHeight: "15px",
  marginTop: "5px",
  marginBottom: "5px",
};

const viewDonnationButton = {
  width: "112px",
  height: "30px",
  background: "#314D89",
  color: "white",
  fontFamily: "Rubik",
  fontStyle: "normal",
  fontWeight: "400",
  fontSize: "13px",
  lineHeight: "15px",
  marginTop: "15px",
  boxShadow: "none",
  borderTopWidth: "0px",
  borderBottomWidth: "0px",
  borderRightWidth: "0px",
  borderLeftWidth: "0px",
};

function AdminCalendar(): JSX.Element {
  const [open, setOpen] = useState(false);
  const [calendarEvents, setCalendarEvents] = useState<DonationEvent[]>([]);
  const [clickedEvent, setClickedEvent] = useState<EventClickArg>();

  //  right now we are using an endpoint that does not filter by date
  useEffect(() => {
    console.log("calendar events updated", calendarEvents);
  }, [calendarEvents]);

  useEffect(() => {
    //  need to change the ways that events are stored
    //  so that the match the input that full calendar expects
    fetch("http://localhost:3001/api/events/")
      .then((response) => response.json())
      .then((data) => {
        const updatedEvents = data.map((event: DonationEvent) => ({
          ...event, // spread the existing properties of the event object
          //  start: event.startTime.toString().split(".")[0],
          start: "2023-04-17T09:00:00",
          end: "2023-04-17T10:00:00",
          //  end: event.endTime.toString().split(".")[0],
          textColor: "Black",
          backgroundColor: "transparent",
          borderColor: "transparent",
        }));

        console.log("update: ", updatedEvents);
        setCalendarEvents(updatedEvents);
      })
      .catch((error) => console.error(error));
  }, []);

  const renderModalComponent = (args: EventClickArg) => {
    //  sets a state var to true on click of an event
    //  we pass the information of any clicked event to a different state
    //  is used as onClick event for the main calender
    setClickedEvent(args);
    setOpen(true);
  };

  const closeModalComponent = () => {
    setOpen(false);
  };

  return (
    <div>
      {open ? (
        <Modal open={open} onClose={closeModalComponent}>
          <Box sx={style}>
            <Typography style={modalAddressStyle}>
              {clickedEvent!.event.extendedProps.address}
            </Typography>
            <Typography>
              <p style={modalDefaultText}>
                {new Date(clickedEvent!.event.start!).toLocaleDateString(
                  "en-US",
                  {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                  }
                )}
                -
                {new Date(clickedEvent!.event.end!).toLocaleTimeString(
                  "en-US",
                  {
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                  }
                )}
                <p style={{ marginTop: "10px", marginBottom: "0px" }}>
                  <span style={modalTitleText}>Volunteer </span>
                  <span style={modalDefaultText}>
                    {clickedEvent!.event.extendedProps.volunteer}
                  </span>
                </p>
              </p>
              <p style={{ marginTop: "0px", marginBottom: "0px" }}>
                <span style={modalTitleText}>Donor </span>
                <span style={modalDefaultText}>
                  {clickedEvent!.event.extendedProps.name}
                </span>
              </p>
              <p style={{ marginTop: "0px", marginBottom: "0px" }}>
                <span style={modalTitleText}> Item</span>
                <span style={modalDefaultText}> (need to fetch this)</span>
              </p>

              <p style={{ marginTop: "0px", marginBottom: "0px" }}>
                <span style={modalTitleText}>Phone </span>
                <span style={modalDefaultText}>
                  {clickedEvent!.event.extendedProps.phone}
                </span>
              </p>
              <span>
                <button
                  type="button"
                  style={viewDonnationButton}
                  onClick={() => {
                    window.location.href = "/Admin/DonationInfo";
                  }}
                >
                  View Donation
                </button>
              </span>
            </Typography>
          </Box>
        </Modal>
      ) : (
        console.log("no valid data")
      )}

      <AdminNavbar />

      <div id="smallCalendar" style={{ display: "flex", height: "100%" }}>
        <SmallCalendar address="xd" />

        <div id="myCalendar" className="mainCalendarContainer">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin]}
            initialView="timeGridWeek"
            slotLabelInterval="1:00"
            slotMinTime="08:00:00"
            allDaySlot={false}
            slotMaxTime="18:00:00"
            slotDuration="01:00:00"
            eventContent={customEvent}
            eventClick={renderModalComponent}
            dayCellClassNames={addCustomClassNames}
            titleFormat={{
              month: "long",
              day: "numeric",
              separator: " - ",
              omitCommas: true,
            }}
            dayHeaderFormat={{
              weekday: "short",
              day: "numeric",
            }}
            slotLabelFormat={{
              hour: "numeric",
              hour12: true,
            }}
            headerToolbar={{
              start: "title",
              center: "",
              end: "prev,next",
            }}
            events={[...calendarEvents]}
          />
        </div>
      </div>
    </div>
  );
}

function customEvent(args: EventContentArg) {
  //  sets up the styling and content of an event cell
  return (
    <div>
      <h1 style={eventHeader}>
        {args.event.extendedProps.donorFirstName}{" "}
        {args.event.extendedProps.donorLastName}
      </h1>

      <div style={eventDiv}>
        {args.event.extendedProps.address} {args.event.extendedProps.city}{" "}
        {args.event.extendedProps.zipcode}
      </div>
    </div>
  );
}

function addCustomClassNames(info: any) {
  // add classnames that styles past days as grey
  const classNames = [];

  if (info.date < new Date()) {
    classNames.push("past-day");
  }

  if (info.isToday) {
    classNames.push("today");
  }

  return classNames;
}
export default AdminCalendar;