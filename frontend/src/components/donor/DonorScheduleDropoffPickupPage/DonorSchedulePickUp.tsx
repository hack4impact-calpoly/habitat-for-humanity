import "moment-timezone";
import "@fullcalendar/react/dist/vdom";

import moment from "moment";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Event, updatePickupTimes } from "redux/donationSlice";

import { Calendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar, { DateSelectArg } from "@fullcalendar/react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import Checkbox from "@mui/material/Checkbox";

import { RootState } from "../../../redux/store";

require("./DonorSchedulePickUp.css");

const weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// returns hour intervals for calendarEdit given an ISO 8601 string
const getHourIntervals = (curDay: string): { start: string; end: string }[] => {
  const startDate = moment(curDay).tz("UTC").startOf("day").add(18, "hours");
  const fourPM = moment(startDate).add(-18, "hours").toISOString();
  const threePM = moment(startDate).add(5, "hours").toISOString();
  const intervals: { start: string; end: string }[] = [];
  for (let i = 0; i < 5; i++) {
    const start = moment(startDate).add(i, "hours").toISOString();
    const end = moment(startDate)
      .add(i + 1, "hours")
      .toISOString();
    intervals.push({ start, end });
  }

  intervals.push({ start: threePM, end: fourPM });

  return intervals;
};

function DonatorSchedulePickUp(): JSX.Element {
  const today = new Date();
  const storedEvents = useSelector(
    (state: RootState) => state.donation.pickupTimes
  );
  const [header, setHeader] = useState<string>(
    `${monthNames[today.getMonth()]}, ${weekdays[today.getDay()]} ${String(
      today.getDate()
    )}`
  );
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>(storedEvents);
  const [times, setTimes] = useState<Event[]>(
    getHourIntervals(moment().toISOString())
  );
  const [pickupError, setPickupError] = useState<string>("");

  const dispatch = useDispatch();

  const onClickCalendar = (info: DateSelectArg): void => {
    const startDate = info?.start;
    setSelectedDate(startDate);
    setHeader(
      `${monthNames[startDate.getMonth()]}, ${
        weekdays[startDate.getDay()]
      } ${String(startDate.getDate())}`
    );
    // Re render checked boxes
    setTimes(getHourIntervals(startDate.toISOString()));
  };

  const updateStore = () => {
    dispatch(updatePickupTimes(events));
  };

  const validInput = () => {
    let valid = true;
    setPickupError("");

    if (events.length === 0) {
      setPickupError("Please select at least one pickup time");
      valid = false;
    }
    return valid;
  };

  const navigate = useNavigate();

  const buttonNavigation = (e: React.MouseEvent<HTMLButtonElement>): void => {
    const backPath: string = "/Donor/Donate/Location";
    const nextPath: string = "/Donor/Donate/Review";

    if (e.currentTarget.value === "backButton") {
      navigate(backPath);
    } else if (e.currentTarget.value === "nextButton") {
      if (validInput()) {
        updateStore();
        navigate(nextPath);
      }
    }
  };

  const addEvent = (start: string, end: string) => {
    const date: string = selectedDate.toISOString().split("T")[0];
    const startTime: string = `${date}T${start.split("T")[1]}`;
    const endTime: string = `${date}T${end.split("T")[1]}`;
    // only add if events doesn't already contain the time
    if (
      events.filter((e) => e.start === startTime && e.end === endTime)
        .length === 0
    ) {
      setEvents([
        ...events,
        {
          start: startTime,
          end: endTime,
        },
      ]);
    }
  };

  // removes all events from events with given start and end
  const removeEvent = (start: string, end: string) => {
    const date: string = selectedDate.toISOString().split("T")[0];
    const startTime: string = `${date}T${start.split("T")[1]}`;
    const endTime: string = `${date}T${end.split("T")[1]}`;
    setEvents(events.filter((e) => e.start !== startTime && e.end !== endTime));
  };

  // evaluates event's presence in a list of events.
  const evaluateEventPresence = (startTime: string, endTime: string): boolean =>
    events.some((event) => event.start === startTime && event.end === endTime);

  return (
    <div>
      <h2 className="donDropoffPickupHeader">Time Availability</h2>
      <div id="donatorPickupPage">
        <div id="calendarView">
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={events}
            slotMinTime="10:00:00"
            slotMaxTime="18:00:00"
            selectable
            unselectAuto={false}
            longPressDelay={1}
            select={onClickCalendar}
            validRange={(now) => {
              const copyNow = new Date();
              const endDate = new Date(copyNow.setMonth(now.getMonth() + 1));
              return {
                start: now,
                end: endDate,
              };
            }}
            windowResizeDelay={0}
          />
          <div className="inputError">{pickupError}</div>
        </div>
        <div id="calendarEdit">
          <h1 id="donatorPickupHeader">{header}</h1>
          <p id="donatorPickupDesc">
            Please select multiple dates and times you are available, and our
            staff will choose from your availability.
          </p>
          <div id="donatorPickupEvents">
            {times.map((availEvent) => {
              const startTime = moment
                .utc(availEvent.start)
                .local()
                .format("hh:mm A")
                .replace(/^(?:00:)?0?/, "");
              const endTime = moment
                .utc(availEvent.end)
                .local()
                .format("hh:mm A")
                .replace(/^(?:00:)?0?/, "");
              return (
                <div className="donatorPickUpTime">
                  <Checkbox
                    icon={<RadioButtonUncheckedIcon />}
                    checkedIcon={<CheckCircleIcon />}
                    onChange={(e) =>
                      e.target.checked
                        ? addEvent(availEvent.start, availEvent.end)
                        : removeEvent(availEvent.start, availEvent.end)
                    }
                    checked={evaluateEventPresence(
                      availEvent.start,
                      availEvent.end
                    )}
                  />
                  {`${startTime} to ${endTime}`}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div id="donPickupButtons">
        <button
          type="button"
          value="backButton"
          className="donPickupButton backButton"
          onClick={buttonNavigation}
        >
          Back
        </button>
        <button
          type="button"
          value="nextButton"
          className="donPickupButton nextButton"
          onClick={buttonNavigation}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default DonatorSchedulePickUp;
