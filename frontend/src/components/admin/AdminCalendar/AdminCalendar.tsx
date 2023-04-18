import FullCalendar, {
  EventClickArg,
  EventContentArg,
} from "@fullcalendar/react";
import React, { useState } from "react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import { Modal, Box, Typography } from "@mui/material";
import AdminNavbar from "../AdminNavbar/AdminNavbar";

require("./AdminCalendar.css");

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
  const [clickedEvent, setEvent] = useState<EventClickArg>();

  const renderModalComponent = (args: EventClickArg) => {
    console.log(args.event.extendedProps.address);
    setEvent(args);
    setOpen(true);
  };

  const closeModalComponent = () => {
    setOpen(false);
  };

  return (
    <div>
      {open ? (
        <Modal
          open={open}
          onClose={closeModalComponent}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
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
                <button type="button" style={viewDonnationButton}>
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
        <div className="smallCalendarContainer">
          <FullCalendar
            plugins={[dayGridPlugin]}
            showNonCurrentDates={false}
            initialView="dayGridMonth"
            dayCellClassNames={addCustomClassNames}
            headerToolbar={{
              start: "title",
              center: "",
              end: "prev,next",
            }}
            dayHeaderFormat={{
              weekday: "narrow",
            }}
            events={[
              {
                backgroundColor: "#97e4fc",
                start: "2023-03-07",
                display: "background",
              },
              {
                backgroundColor: "#97e4fc",
                start: "2023-02-26",
                display: "background",
              },
            ]}
          />
        </div>

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
            events={[
              {
                textColor: "black",
                backgroundColor: "transparent",
                borderColor: "transparent",
                start: "2023-04-17T10:00:00",
                end: "2023-04-17T11:00:00",
                name: "Jane Lee",
                address: "1 Mustang Drive San Luis Obispo, Ca 93407",
                email: "janetesting@gmail.com",
                phone: "805-555-5555",
                volunteer: "Real Person",
              },
              {
                textColor: "black",
                backgroundColor: "transparent",
                borderColor: "transparent",
                title: `Jane Lee 1 Mustang Drive
                San Luis Obispo, Ca
                93407
                `,
                start: "2023-04-19T08:00:00",
                end: "2023-04-19T09:00:00",
                name: "Eduardo Huezo-Lopez",
                address: "1 Mustang Drive San Luis Obispo, Ca 93407",
                email: "janetesting@gmail.com",
                phone: "805-555-5555",
                volunteer: "Real Person",
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}

function customEvent(args: EventContentArg) {
  return (
    <div>
      <h1
        style={{
          display: "flex",
          fontSize: "14px",
          marginTop: "7px",
          marginBottom: "5px",
          marginLeft: "5px",
          marginRight: "5px",
          lineHeight: "15px",
        }}
      >
        {args.event.extendedProps.name}
      </h1>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          fontSize: "10px",
          marginLeft: "5px",
          marginRight: "5px",
          fontFamily: "Rubik",
        }}
      >
        {args.event.extendedProps.address}
      </div>
    </div>
  );
}

function addCustomClassNames(info: any) {
  // add classnames that decide how each cell is styled
  // used to add past days grey color
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
