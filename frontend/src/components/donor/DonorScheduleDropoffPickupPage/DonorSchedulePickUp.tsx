"use client";
import "moment-timezone";
import moment from "moment";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { Event, updatePickupTimes } from "../../../redux/donationSlice";

import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { DateSelectArg } from "@fullcalendar/core";
import FullCalendar from "@fullcalendar/react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import Checkbox from "@mui/material/Checkbox";

import { RootState } from "../../../redux/store";

require("../../../App.css");

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

const firstValidDate = (date: Date): Date => {
  let copyDate = new Date(date);
  while (copyDate.getDay() !== 3 && copyDate.getDay() !== 4) {
    copyDate.setDate(copyDate.getDate() + 1);
  }
  return copyDate;
};

// returns the four fixed intervals for calendarEdit given an ISO 8601 string
const getHourIntervals = (curDay: string): { start: string; end: string }[] => {
  const localDate = moment(curDay).local().startOf("day");

  return [
    {
      start: localDate.clone().hour(9).minute(0).second(0).utc().toISOString(),
      end: localDate.clone().hour(10).minute(30).second(0).utc().toISOString(),
    },
    {
      start: localDate
        .clone()
        .hour(10)
        .minute(30)
        .second(0)
        .utc()
        .toISOString(),
      end: localDate.clone().hour(12).minute(0).second(0).utc().toISOString(),
    },
    {
      start: localDate.clone().hour(13).minute(0).second(0).utc().toISOString(),
      end: localDate.clone().hour(14).minute(30).second(0).utc().toISOString(),
    },
    {
      start: localDate
        .clone()
        .hour(14)
        .minute(30)
        .second(0)
        .utc()
        .toISOString(),
      end: localDate.clone().hour(16).minute(0).second(0).utc().toISOString(),
    },
  ];
};

function DonatorSchedulePickUp(): React.ReactNode {
  const today = new Date();
  const storedEvents = useSelector(
    (state: RootState) => state.donation.pickupTimes,
  );
  const [header, setHeader] = useState<string>(
    `${monthNames[firstValidDate(today).getMonth()]}, ${
      weekdays[firstValidDate(today).getDay()]
    } ${firstValidDate(today).getDate()}`,
  );
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>(storedEvents);
  const [times, setTimes] = useState<Event[]>(
    getHourIntervals(moment().toISOString()),
  );
  const [pickupError, setPickupError] = useState<string>("");

  const dispatch = useDispatch();
  const router = useRouter();

  const onClickCalendar = (info: DateSelectArg): void => {
    const startDate = info.start;
    setSelectedDate(startDate);
    setHeader(
      `${monthNames[startDate.getMonth()]}, ${
        weekdays[startDate.getDay()]
      } ${startDate.getDate()}`,
    );
    setTimes(getHourIntervals(startDate.toISOString()));
  };

  const updateStore = () => {
    dispatch(updatePickupTimes(events));
  };

  const validInput = () => {
    let valid = true;
    setPickupError("");
    if (events.length < 2) {
      setPickupError("Please select at least two pickup times");
      valid = false;
    }
    return valid;
  };

  const buttonNavigation = (e: React.MouseEvent<HTMLButtonElement>): void => {
    if (e.currentTarget.value === "backButton") {
      router.push("/Donor/Donate/Location");
    } else if (e.currentTarget.value === "nextButton") {
      if (validInput()) {
        updateStore();
        router.push("/Donor/Donate/Review");
      }
    }
  };

  const addEvent = (start: string, end: string) => {
    const date = selectedDate.toISOString().split("T")[0];
    const startTime = `${date}T${start.split("T")[1]}`;
    const endTime = `${date}T${end.split("T")[1]}`;
    if (!events.find((e) => e.start === startTime && e.end === endTime)) {
      setEvents([...events, { start: startTime, end: endTime }]);
    }
  };

  const removeEvent = (start: string, end: string) => {
    const date = selectedDate.toISOString().split("T")[0];
    const startTime = `${date}T${start.split("T")[1]}`;
    const endTime = `${date}T${end.split("T")[1]}`;
    setEvents(
      events.filter((e) => !(e.start === startTime && e.end === endTime)),
    );
  };

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
            selectable
            selectConstraint={{ daysOfWeek: [3, 4] }}
            unselectAuto={false}
            longPressDelay={1}
            select={onClickCalendar}
            validRange={(now) => {
              const startDate = firstValidDate(new Date());
              const endDate = new Date();
              endDate.setMonth(endDate.getMonth() + 1);
              return { start: startDate, end: endDate };
            }}
            businessHours={{ daysOfWeek: [3, 4] }}
            windowResizeDelay={0}
          />
          <div className="inputError">{pickupError}</div>
        </div>

        <div id="calendarEdit">
          <h1 id="donatorPickupHeader">{header}</h1>
          <h2 className="font-bold">
            For donation pickups located in{" "}
            <span className="underline">North County,</span> please select times
            on <span className="underline">Wednesday.</span>
            <br />
            For donation pickups located in{" "}
            <span className="underline">South County,</span> please select times
            on <span className="underline">Thursday.</span>
          </h2>
          <p id="donatorPickupDesc">
            Please select multiple dates and times you are available, and our
            staff will choose from your availability.
          </p>
          <div id="donatorPickupEvents">
            {times.map((availEvent, idx) => {
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
                <div
                  className="donatorPickUpTime"
                  key={idx}
                  onClick={() => {
                    // Toggle the checkbox state manually when the entire div is clicked
                    const currentChecked = evaluateEventPresence(
                      availEvent.start,
                      availEvent.end,
                    );
                    if (currentChecked) {
                      removeEvent(availEvent.start, availEvent.end);
                    } else {
                      addEvent(availEvent.start, availEvent.end);
                    }
                  }}
                  style={{ cursor: "pointer" }} // Optional: ensures the pointer cursor is displayed
                >
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
                      availEvent.end,
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
