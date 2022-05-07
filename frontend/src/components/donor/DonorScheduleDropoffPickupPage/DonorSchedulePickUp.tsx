import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import FullCalendar, { DateSelectArg } from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import moment from "moment";
import Checkbox from "@mui/material/Checkbox";
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
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

// Get available events for specific date from database
const times = [
    {
        title: "Donator Pickup",
        start: "2022-02-25T18:00:39Z",
        end: "2022-02-25T19:00:39Z",
    },
    {
        title: "Donator Pickup",
        start: "2022-02-25T19:00:39Z",
        end: "2022-02-25T20:00:39Z",
    },
    {
        title: "Donator Pickup",
        start: "2022-02-25T20:00:39Z",
        end: "2022-02-25T21:00:39Z",
    },
    {
        title: "Donator Pickup",
        start: "2022-02-25T21:00:39Z",
        end: "2022-02-25T22:00:39Z",
    },
    {
        title: "Donator Pickup",
        start: "2022-02-25T22:00:39Z",
        end: "2022-02-25T23:00:39Z",
    },
    {
        title: "Donator Pickup",
        start: "2022-02-25T23:00:39Z",
        end: "2022-02-25T00:00:39Z",
    },
    {
        title: "Donator Pickup",
        start: "2022-02-25T00:00:39Z",
        end: "2022-02-25T01:00:39Z",
    }
];

// Get existing events from database
const events = [
    {
        title: "Donator Pickup",
        start: "2022-02-19T18:00:00Z",
        end: "2022-02-19T19:00:00Z",
    },
    {
        title: "Donator Pickup",
        start: "2022-02-20T00:00:00Z",
        end: "2022-02-20T01:00:00Z",
    },
];


const DonatorSchedulePickUp = (): JSX.Element => {    
    const formatDate = (date: Date): string => {
        return date.toISOString().split('T')[0];
    }

    const today = new Date();
    const [header, setHeader] = useState<string>(`${monthNames[today.getMonth()]}, ${weekdays[today.getDay()]} ${String(today.getDate())}`);
    const [selectedDate, setSelectedDate] = useState<string>(formatDate(today));
    const [selectedDateTimes, setSelectedDateTimes] = useState<Map<string, any[]>>(new Map<string, any[]>());

    console.log(selectedDate);
    
    const onClickCalendar = (info: DateSelectArg): void => {
        const start_date = info?.start;
        setHeader(`${monthNames[start_date.getMonth()]}, ${weekdays[start_date.getDay()]} ${String(start_date.getDate())}`);
        setSelectedDate(formatDate(start_date));
    };

    // TODO: Send donator availability to database
    const pushToDatabase = () => {
        console.log("Pushed");
        return;
    }
    
    let navigate = useNavigate();

    const buttonNavigation = (e : React.MouseEvent<HTMLButtonElement>) : void => {
        const backPath : string = "/Donor/Donate/Location";
        const nextPath : string = "/Donor/Donate/Review";

        if(e.currentTarget.value === "backButton"){
            navigate(backPath);
        }
        else if(e.currentTarget.value === "nextButton"){
            pushToDatabase();
            navigate(nextPath);
        }
    }

    const isChecked = () => {

    }

    const onClickDateTime = (startTime: string, endTime: string) => {
        const start = selectedDate + startTime.split('T')[1];
        const end = selectedDate + endTime.split('T')[1];
        
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
                                        onClick={() => onClickDateTime(availEvent.start, availEvent.end)}
                                    />
                                    {`${startTime} to ${endTime}`}
                                </div>
                            )
                        })}
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
