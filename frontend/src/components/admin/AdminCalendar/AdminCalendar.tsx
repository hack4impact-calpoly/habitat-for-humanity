import FullCalendar from "@fullcalendar/react";
import React from "react";
import dayGridPlugin from "@fullcalendar/daygrid";
import AdminNavbar from "../AdminNavbar/AdminNavbar";

require("./AdminCalendar.css");

function AdminCalendar(): JSX.Element {
  return (
    <div style={{ height: "100vh" }}>
      <AdminNavbar />

      <div style={{ display: "flex", height: "100%" }}>
        <div className="smallCalendarContainer">
          <FullCalendar plugins={[dayGridPlugin]} initialView="dayGridMonth" />
        </div>

        <div className="mainCalendarContainer">
          <FullCalendar plugins={[dayGridPlugin]} initialView="dayGridWeek" />
        </div>
      </div>
    </div>
  );
}
export default AdminCalendar;
