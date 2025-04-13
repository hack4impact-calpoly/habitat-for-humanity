import FullCalendar from "@fullcalendar/react";
import React from "react";
import dayGridPlugin from "@fullcalendar/daygrid";

require("../../../App.css");

interface SmallCalendarProps {
  address: string;
}

function SmallCalendar({ address }: SmallCalendarProps): React.ReactNode {
  return (
    <>
      <style>
        {`
          .fc-event {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            padding: 2px 4px;
            font-size: 0.75rem;
            line-height: 1rem;
          }

          .fc-daygrid-event {
            max-height: 3em;
          }

          .fc-daygrid-event-harness {
            margin-bottom: 2px;
          }
        `}
      </style>

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
    </>
  );
}

export default SmallCalendar;

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

/*
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
*/
