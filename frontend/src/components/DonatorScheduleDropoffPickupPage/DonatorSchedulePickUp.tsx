import React from "react";
import DonatorNavbar from "../DonatorNavbar/DonatorNavbar";
import FullCalendar, { DateSelectArg } from "@fullcalendar/react";
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
require("./DonatorSchedulePickUp.css")

const DonatorSchedulePickUp = (): JSX.Element => {
    // Existing events
    const [events, setEvents] = React.useState([
            { title: 'event 1', start: '2022-02-05T00:00:39Z', end: '2022-02-05T01:00:39Z' },
            { title: 'event 2', start: '2022-02-06T00:00:39Z', end: '2022-02-06T01:00:39Z' }
    ])

    const [calendarEvent, setCalendarEvent] = React.useState({
        date: new Date(),
        dateString: "",
        start: "",
        startTime: "",
        end: "",
        endTime: ""
    });

    const [item, setItem] = React.useState("");
    const [address, setAddress] = React.useState("");

    const onClickCalendar = (info: DateSelectArg): void => {
        const start_date = info?.start;
        const end_date = info?.end;
        console.log(info)
        setCalendarEvent({
            date: start_date,
            dateString: start_date.toISOString().split('T')[0],
            start: start_date.toISOString(),
            startTime: start_date.toTimeString().split(' ')[0],
            end: end_date.toISOString(),
            endTime: end_date.toTimeString().split(' ')[0]
        })
        
    }

    const onClickAddEvent = (): void => {
        if (item === "" || address === "") {
            alert("Please complete the form");
            return;
        }
        const title = "Donator Pickup: " + item + " at " + address;
        setEvents([...events, { title: title, start: calendarEvent.start, end: calendarEvent.end }])
    }

    return (
        <body>
            <DonatorNavbar />
            <div id="donatorPickupPage">
                <div id="calendarView">
                    <FullCalendar
                        plugins={[timeGridPlugin, interactionPlugin]}
                        initialView="timeGridWeek"
                        events={events}
                        height={600}
                        slotMinTime={'9:00:00'}
                        slotMaxTime={'18:00:00'}
                        selectable={true}
                        unselectAuto={false}
                        longPressDelay={1}
                        select={onClickCalendar}
                    />
                </div>
                <div id="calendarEdit">
                    <h1>Create an Event</h1>
                    <p>Click the calendar to select date and time. Press and drag to extend start and end time.</p>
                    <p>Item</p>
                    <input type="text" onChange={e => setItem(e?.target?.value)} />
                    <p>Address</p>
                    <input type="text" onChange={e => setAddress(e?.target?.value)}/>
                    <p>Date</p>
                    <input type="date" value={calendarEvent.dateString != null ? calendarEvent.dateString : ""} readOnly />
                    <p>Start time</p>
                    <input type="time" value={calendarEvent.startTime != null ? calendarEvent.startTime : ""} readOnly />
                    <p>End time</p>
                    <input type="time" value={calendarEvent?.endTime != null ? calendarEvent.endTime : ""} readOnly />
                    <br />
                    <br />
                    <button onClick={onClickAddEvent}>Create event</button>
                </div>
            </div>
        </body>
    )
}

export default DonatorSchedulePickUp;