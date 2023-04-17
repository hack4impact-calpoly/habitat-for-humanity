import FullCalendar, {
  EventClickArg,
  EventContentArg,
} from "@fullcalendar/react";
import React, { useState } from "react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import { Button, Modal, Box, Typography } from "@mui/material";
import AdminNavbar from "../AdminNavbar/AdminNavbar";

require("./AdminCalendar.css");

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  height: 350,
  bgcolor: "background.paper",
  border: "2px solid grey",
  boxShadow: 24,
  p: 4,
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
            <Typography id="modal-modal-title" variant="h6" component="h2">
              {clickedEvent!.event.extendedProps.address}
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              <p>
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
                <p> need to fetch name of person assigned to this</p>
              </p>
              <p>donor : {clickedEvent!.event.extendedProps.name}</p>
              <p>item: (need to fetch this)</p>
              <p>phone : {clickedEvent!.event.extendedProps.phone}</p>
              <button type="button">view donnation</button>
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
                start: "2023-03-07T10:00:00",
                end: "2023-03-07T11:00:00",
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
                start: "2023-02-26T08:00:00",
                end: "2023-02-26T11:00:00",
                name: "Jane Lee",
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
          fontSize: "15px",
          justifyContent: "center",
          marginTop: "0px",
          marginBottom: "0px",
        }}
      >
        {args.event.extendedProps.name}
      </h1>

      <div
        style={{ display: "flex", justifyContent: "center", fontSize: "10px" }}
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
