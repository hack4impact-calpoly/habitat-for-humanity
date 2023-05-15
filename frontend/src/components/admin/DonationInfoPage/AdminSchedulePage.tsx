import React, { useState } from "react";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import moment from "moment";
import { Event } from "redux/donationSlice";
import {
  collectDates,
  belongsToDay,
  getDay,
  getTime,
  getDayShort,
} from "./DonationInfoTab";

function AdminSchedulePage(props: { times: Event[] }): JSX.Element {
  const { times } = props;

  const dates = collectDates(times);

  return (
    <div id="DonInfo">
      <div id="DonationInfoPage">
        <div id="TimeHours">
          <h2 style={{ marginTop: "3rem", color: `var(--orange)` }}>
            Schedule Donation
          </h2>

          <div id="TimeTable" style={{ marginTop: "3rem" }}>
            {dates.map((date, index) => (
              <div style={{ marginTop: "3rem" }}>
                <h2
                  className="donScheduleRow"
                  key={index}
                  style={{
                    color: `var(--primary)`,
                  }}
                >
                  {getDayShort(date)}
                </h2>
                <TableContainer id="ScheduleTable">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell align="left" sx={{ width: "1%" }}>
                          {" "}
                        </TableCell>
                        <TableCell align="left" sx={{ width: "30%" }}>
                          <h3>Time</h3>
                        </TableCell>
                        <TableCell align="left" sx={{ width: "70%" }}>
                          <h3>Assign Staff/Volunteers</h3>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {times.map((event, index) => {
                        if (belongsToDay(date, event)) {
                          return (
                            <TableRow key={index}>
                              <TableCell sx={{ padding: 0, margin: 0 }}>
                                <Checkbox key={index} />
                              </TableCell>
                              <TableCell>{`${getTime(event.start)} to ${getTime(
                                event.end
                              )}`}</TableCell>
                              <TableCell>
                                <TextField
                                  variant="outlined"
                                  margin="none"
                                  sx={{
                                    width: {
                                      sm: "100%",
                                      md: "80%",
                                      lg: "60%",
                                    },
                                  }}
                                />
                              </TableCell>
                            </TableRow>
                          );
                        }
                        return null;
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminSchedulePage;
