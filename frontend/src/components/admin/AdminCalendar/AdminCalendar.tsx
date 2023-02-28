import FullCalendar from "@fullcalendar/react";
import React from "react";
import dayGridPlugin from "@fullcalendar/daygrid";
import AdminNavbar from "../AdminNavbar/AdminNavbar";

require("./AdminCalendar.css");

function AdminCalendar(): JSX.Element {
  return (
    <div>
      <AdminNavbar />

      <div>
        <FullCalendar plugins={[dayGridPlugin]} initialView="dayGridMonth" />
      </div>
    </div>
  );
}
export default AdminCalendar;
