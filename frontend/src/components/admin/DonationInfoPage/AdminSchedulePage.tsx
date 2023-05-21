import React, { useEffect, useState } from "react";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Button } from "@mui/material";

import { useDispatch } from "react-redux";
import { clearAll, clearTimeSlots, updateTimeSlots } from "redux/eventSlice";
import { collectDates, TimeSlot } from "./DonationInfoTab";

function AdminSchedulePage(props: { timeSlots: TimeSlot[] }): JSX.Element {
  const { timeSlots } = props;
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<TimeSlot[]>([]);

  const dates = collectDates(timeSlots);

  useEffect(() => {
    updateStore();
  }, [selectedTimeSlots]);

  const handleCheckbox =
    (timeSlot: TimeSlot) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const isChecked = event.target.checked;
      setSelectedTimeSlots((prevSelectedTimeSlots) => {
        if (isChecked) {
          return [...prevSelectedTimeSlots, timeSlot];
        }
        return prevSelectedTimeSlots.filter(
          (ts) => ts.timeSlotString !== timeSlot.timeSlotString
        );
      });
    };

  const handleVolunteerInput =
    (timeSlot: TimeSlot) => (event: React.ChangeEvent<HTMLInputElement>) => {
      timeSlot.volunteer = event.target.value;
    };

  const dispatch = useDispatch();
  const updateStore = () => {
    clearTimeSlots();
    dispatch(updateTimeSlots(selectedTimeSlots));
  };

  return (
    <div id="DonInfo">
      <Button onClick={() => console.log(selectedTimeSlots)}>
        Check timeslots
      </Button>
      <div id="DonationInfoPage">
        <div id="TimeHours">
          <h2 style={{ marginTop: "3rem", color: `var(--orange)` }}>
            Schedule Donation
          </h2>

          <div id="TimeTable" style={{ marginTop: "3rem" }}>
            {dates.map((date, index) => (
              <div style={{ marginTop: "3rem" }} key={index}>
                <h2
                  className="donScheduleRow"
                  style={{
                    color: `var(--primary)`,
                  }}
                >
                  {date}
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
                      {timeSlots.map((timeSlot, index1) => {
                        if (timeSlot.dayString === date) {
                          return (
                            <TableRow key={index1}>
                              <TableCell sx={{ padding: 0, margin: 0 }}>
                                <Checkbox
                                  key={index1}
                                  onChange={handleCheckbox(timeSlot)}
                                  checked={selectedTimeSlots.includes(timeSlot)}
                                />
                              </TableCell>
                              <TableCell>{timeSlot.timeSlotString}</TableCell>
                              <TableCell>
                                <TextField
                                  variant="outlined"
                                  margin="none"
                                  label="Name"
                                  sx={{
                                    width: {
                                      sm: "100%",
                                      md: "80%",
                                      lg: "60%",
                                    },
                                  }}
                                  onChange={handleVolunteerInput(timeSlot)}
                                  disabled={
                                    !selectedTimeSlots.includes(timeSlot)
                                  }
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
