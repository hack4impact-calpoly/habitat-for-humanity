"use client";

import FullCalendar from "@fullcalendar/react";
import {
  EventClickArg,
  EventContentArg,
  CalendarApi,
} from "@fullcalendar/core";
import React, { useState, useEffect, useRef } from "react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import { Modal, Box, Typography } from "@mui/material";
import { Types } from "mongoose";
import moment from "moment";
import AdminNavbar from "../../../components/admin/AdminNavbar/AdminNavbar";
import SmallCalendar from "../../../components/admin/AdminCalendar/SmallCalendar";
import { useRouter } from "next/navigation";
import { getEvents } from "../../../api/event";

require("../../../App.css");

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
  emailAddress: string;
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

function AdminCalendar() {
  const [open, setOpen] = useState(false);
  const [calendarEvents, setCalendarEvents] = useState<DonationEvent[]>([]);
  const [clickedEvent, setClickedEvent] = useState<EventClickArg>();
  const router = useRouter();
  const calendarRef = useRef<FullCalendar | null>(null);

  //  right now we are using an endpoint that does not filter by date

  useEffect(() => {
    console.log("calendar events updated", calendarEvents);
  }, [calendarEvents]);

  useEffect(() => {
    const fetchEvents = async () => {
      await getEvents()
        .then((data) => {
          const updatedEvents = data.map((event: any) => {
            const strippedStart = moment
              .utc(event.startTime)
              .utcOffset("-08:00")
              .format();
            const strippedEnd = moment
              .utc(event.endTime)
              .utcOffset("-08:00")
              .format();

            return {
              ...event,
              start: strippedStart,
              end: strippedEnd,
              textColor: "Black",
              backgroundColor: "transparent",
              borderColor: "transparent",
            };
          });

          setCalendarEvents(updatedEvents);
        })
        .catch((error) => console.error(error));
    };
    fetchEvents();
  }, []);

  function downloadCSV(data: string, filename: string) {
    const blob = new Blob([data], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const handleExportCSV = () => {
    const calendarApi: CalendarApi | null | undefined =
      calendarRef.current?.getApi();
    if (!calendarApi) return;

    const view = calendarApi.view;
    const start = view.activeStart;
    const end = view.activeEnd;

    const filteredEvents = calendarApi.getEvents().filter((event) => {
      const eventStart = new Date(event.start as unknown as string);
      return eventStart >= start && eventStart < end;
    });

    console.log(filteredEvents);

    const headers = [
      "Event Title",
      "Donor First Name",
      "Donor Last Name",
      "Phone",
      "Email",
      "Address",
      "City",
      "Zip Code",
      "Item/s",
      "Start Time",
      "End Time",
    ];

    const csvRows = [headers.join(",")];

    filteredEvents.forEach((event) => {
      const props = event.extendedProps;
      const row = [
        event.title,
        props.donorFirstName,
        props.donorLastName,
        props.phone,
        props.emailAddress,
        props.address,
        props.city,
        props.zipCode,
        props.itemName,
        new Date(event.start!).toLocaleString(),
        new Date(event.end!).toLocaleString(),
      ];
      csvRows.push(row.map((field) => `"${field}"`).join(",")); // Quotes needed for csv formatting
    });

    const csvContent = csvRows.join("\n");

    const formattedStartDate = start.toISOString().split("T")[0];
    downloadCSV(csvContent, `donations-week-${formattedStartDate}.csv`);
  };

  const renderModalComponent = (args: EventClickArg) => {
    //  sets a state var to true on click of an event
    //  we pass the information of any clicked event to a state var
    //  is used as onClick trigger for the main calender
    setClickedEvent(args);
    setOpen(true);
  };

  const closeModalComponent = () => {
    setOpen(false);
  };

  return (
    <div>
      {open && (
        <Modal open={open} onClose={closeModalComponent}>
          <Box className="modal-box">
            <Typography className="modal-address">
              {clickedEvent!.event.extendedProps.address}
            </Typography>
            <Typography component="div">
              <div className="modal-default-text">
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
                  },
                )}
                -
                {new Date(clickedEvent!.event.end!).toLocaleTimeString(
                  "en-US",
                  {
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                  },
                )}
              </div>
              <p style={{ marginTop: "0px", marginBottom: "0px" }}>
                <span className="modal-title-text">Donor </span>
                <span className="modal-default-text">
                  {clickedEvent!.event.extendedProps.donorFirstName}{" "}
                  {clickedEvent!.event.extendedProps.donorLastName}
                </span>
              </p>
              <p style={{ marginTop: "0px", marginBottom: "0px" }}>
                <span className="modal-title-text">Item </span>
                <span className="modal-default-text">
                  {clickedEvent!.event.extendedProps.itemName.join(", ")}
                </span>
              </p>

              <p style={{ marginTop: "0px", marginBottom: "0px" }}>
                <span className="modal-title-text">Phone </span>
                <span className="modal-default-text">
                  {clickedEvent!.event.extendedProps.phone}
                </span>
              </p>
              <span>
                {/* prettier-ignore */}
                <button
                  type="button"
                  className="view-donation-button"
                  onClick={() => {
                    router.push(
                      `/Admin/DonationInfo/${clickedEvent!.event.extendedProps.itemId}/`,
                    );
                    
                  }}
                >
                  View Donation
                </button>
              </span>
            </Typography>
          </Box>
        </Modal>
      )}
      <AdminNavbar />
      <div id="smallCalendar">
        {/* im not sure if i would need to pass props in the future
            so i created filler props */}
        <SmallCalendar address="xd" />

        <div id="myCalendar" className="mainCalendarContainer">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin]}
            initialView="timeGridWeek"
            slotLabelInterval="1:00"
            slotMinTime="08:00:00"
            allDaySlot={false}
            slotMaxTime="17:00:00"
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
            slotEventOverlap={false}
            height="auto"
            contentHeight="auto"
          />
          <div className="csvButton">
            <button onClick={handleExportCSV} className="exportButton">
              Export Week as CSV
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
//  controls how the inside of an event cell looks
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
