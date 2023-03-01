import FullCalendar from "@fullcalendar/react";
import React from "react";
import dayGridPlugin from "@fullcalendar/daygrid";
import AdminNavbar from "../AdminNavbar/AdminNavbar";

require("./AdminCalendar.css");

function AdminCalendar(): JSX.Element {
  return (
    <div>
      <AdminNavbar />

      <div style={{ display: "flex" }}>
        <div style={{ width: "30%", padding: "3%" }}>
          <FullCalendar plugins={[dayGridPlugin]} initialView="dayGridMonth" />
        </div>

        <div style={{ width: "80%", padding: "5%" }}>
          <FullCalendar plugins={[dayGridPlugin]} initialView="dayGridWeek" />
        </div>
      </div>
    </div>
  );
}
export default AdminCalendar;
