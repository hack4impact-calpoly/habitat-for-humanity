import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import FullCalendar, { DateSelectArg } from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import moment from "moment";
import Checkbox from "@mui/material/Checkbox";
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { RadioButtonChecked } from "@mui/icons-material";

import { useDispatch, useSelector } from 'react-redux';
import { updatePickupTimes, Event} from "redux/donationSlice";
import { RootState } from '../../../redux/store'
require("./DonorSchedulePickUp.css");

const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
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

// Dummy times
const listTimes: Event[] = [
    {
        start: "2022-02-25T18:00:00Z",
        end: "2022-02-25T19:00:00Z"
    },
    {
        start: "2022-02-25T19:00:00Z",
        end: "2022-02-25T20:00:00Z"
    },
    {
        start: "2022-02-25T20:00:00Z",
        end: "2022-02-25T21:00:00Z"
    },
    {
        start: "2022-02-25T21:00:00Z",
        end: "2022-02-25T22:00:00Z"
    },
    {
        start: "2022-02-25T22:00:00Z",
        end: "2022-02-25T23:00:00Z"
    },
    {
        start: "2022-02-25T23:00:00Z",
        end: "2022-02-25T00:00:00Z"
    },
    {
        start: "2022-02-25T00:00:00Z",
        end: "2022-02-25T01:00:00Z"
    }
];



const DonatorSchedulePickUp = (): JSX.Element => {
    const today = new Date();
    const storedEvents = useSelector((state: RootState) => state.donation.pickupTimes);
    const [header, setHeader] = useState<string>(`${monthNames[today.getMonth()]}, ${weekdays[today.getDay()]} ${String(today.getDate())}`);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [events, setEvents] = useState<Event[]>(storedEvents);
    const [times, setTimes] = useState<Event[]>(listTimes);
    const [pickupError, setPickupError] = useState<string>("");

    const dispatch = useDispatch();

    const onClickCalendar = (info: DateSelectArg): void => {
        const start_date = info?.start;
        setSelectedDate(start_date);
        setHeader(`${monthNames[start_date.getMonth()]}, ${weekdays[start_date.getDay()]} ${String(start_date.getDate())}`);
        // Re render checked boxes
        setTimes([]);
        setTimes(listTimes);
    };

    const updateStore = () => {
        dispatch(updatePickupTimes(events));
     }

    const validInput = () =>  {
        let valid = true;
        setPickupError("");
        debugger;
        if (events.length === 0) {
            setPickupError("Please select at least one pickup time");
            valid = false;
        }
        return valid;
    }

    let navigate = useNavigate();

    const buttonNavigation = (e: React.MouseEvent<HTMLButtonElement>): void => {
        const backPath: string = "/Donor/Donate/Location";
        const nextPath: string = "/Donor/Donate/Review";

        if (e.currentTarget.value === "backButton") {
            navigate(backPath);
        }
        else if (e.currentTarget.value === "nextButton") {
            if (validInput()) {
                updateStore();
                navigate(nextPath);
            }
        }
    }

    const addEvent = (start: string, end: string) => {
        var date: string = selectedDate.toISOString().split("T")[0];
        var startTime: string = date + "T" + start.split("T")[1];
        var endTime: string = date + "T" + end.split("T")[1];

        setEvents([...events, {
            start: startTime,
            end: endTime
        }])
    }

    return (
        <div>
            <h2 className="donDropoffPickupHeader">Time Availability</h2>
            <div id="donatorPickupPage">
                <div id="calendarView">
                    <FullCalendar
                        plugins={[dayGridPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        events={events}
                        slotMinTime={"10:00:00"}
                        slotMaxTime={"18:00:00"}
                        selectable={true}
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
                    <p id="donatorPickupDesc">Please select multiple dates and times you are available, and our staff will choose from your availability.</p>
                    <div id="donatorPickupEvents">
                        {times.map(availEvent => {
                            const startTime = moment.utc(availEvent.start).local().format("hh:mm A").replace(/^(?:00:)?0?/, '');
                            const endTime = moment.utc(availEvent.end).local().format("hh:mm A").replace(/^(?:00:)?0?/, '');
                            return (
                                    <div className="donatorPickUpTime">
                                        <Checkbox
                                            icon={<RadioButtonUncheckedIcon />}
                                            checkedIcon={<CheckCircleIcon />}
                                            onClick={() => addEvent(availEvent.start, availEvent.end)}
                                        />
                                        {`${startTime} to ${endTime}`}
                                    </div>
                            )})}
                        </div>
                </div>
            </div>
            <div id="donPickupButtons">
                <button value="backButton" className="donPickupButton backButton" onClick={buttonNavigation}>Back</button>
                <button value="nextButton" className="donPickupButton nextButton" onClick={buttonNavigation}>Next</button>
            </div>
        </div>
    );
};

export default DonatorSchedulePickUp;
