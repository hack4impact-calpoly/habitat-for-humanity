import React, { useState } from "react";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";

interface AvailableTimes {
  day: string;
  hours: string[];
}

interface Availability extends AvailableTimes {
  selected: boolean[];
  volunteer: string[];
}

function AdminSchedulePage(props: { times: AvailableTimes[] }): JSX.Element {
  const { times } = props;
  const [availability, setAvailability] = useState<Availability[]>(
    times.map((time) => {
      const newTime = { ...time, selected: [], volunteer: [] };
      return newTime;
    })
  );

  return (
    <div id="DonInfo">
      <div id="DonationInfoPage">
        <div id="TimeHours">
          <h2 style={{ marginTop: "3rem", color: `var(--orange)` }}>
            Schedule Donation
          </h2>

          <div id="TimeTable" style={{ marginTop: "3rem" }}>
            {times.map((time, index) => {
              const { day } = time;
              const { hours } = time;
              return (
                <div style={{ marginTop: "3rem" }}>
                  <h2
                    className="donScheduleRow"
                    key={index}
                    style={{
                      color: `var(--primary)`,
                    }}
                  >
                    {day}
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
                            <h3>Assign Available Volunteers</h3>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {hours.map((hour, index1) => (
                          <TableRow key={index1}>
                            <TableCell sx={{ padding: 0, margin: 0 }}>
                              <Checkbox
                                key={index1}
                                checked={availability[index].selected[index1]}
                                onChange={(event) => {
                                  const newAvailability = [...availability];
                                  newAvailability[index].selected[index1] =
                                    event.target.checked;
                                  setAvailability(newAvailability);
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              <p>{hour}</p>
                            </TableCell>
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
                                value={availability[index].volunteer[index1]}
                                onChange={(event) => {
                                  const newAvailability = [...availability];
                                  newAvailability[index].volunteer[index1] =
                                    event.target.value;
                                  setAvailability(newAvailability);
                                }}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminSchedulePage;
