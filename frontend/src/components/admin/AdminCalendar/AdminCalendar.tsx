import FullCalendar, { EventContentArg } from "@fullcalendar/react";
import React from "react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import AdminNavbar from "../AdminNavbar/AdminNavbar";

require("./AdminCalendar.css");

// custom layout for a given event cell
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

function AdminCalendar(): JSX.Element {
  return (
    <div style={{ height: "100vh" }}>
      <AdminNavbar />

      <div id="smallCalendar" style={{ display: "flex", height: "100%" }}>
        <div className="smallCalendarContainer">
          <FullCalendar
            plugins={[dayGridPlugin]}
            showNonCurrentDates={false}
            initialView="dayGridMonth"
            headerToolbar={{
              start: "title",
              center: "",
              end: "prev,next",
            }}
            dayHeaderFormat={{
              weekday: "narrow",
            }}
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
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
export default AdminCalendar;
