import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import AdminNavbar from "../AdminNavbar/AdminNavbar";

require("./ActiveDonationsPage.css");

const header = [
  "Donor",
  "Type",
  "Date/Time Received",
  "Date/Time Approved",
  "Status",
];

const dummyData = [
  {
    Donor: "John Doe",
    Type: "Pickup",
    DateRecieved: "Jan 11. at 8:11 AM",
    DateApproved: "N/A",
    Status: "Needs Approval",
  },
  {
    Donor: "Sally Smith",
    Type: "Drop off",
    DateRecieved: "Jan 11. at 8:12 AM",
    DateApproved: "Jan 14 at 5:20 PM",
    Status: "Scheduled",
  },
  {
    Donor: "John Doe",
    Type: "Pickup",
    DateRecieved: "Jan 11. at 8:11 AM",
    DateApproved: "N/A",
    Status: "Needs Approval",
  },
  {
    Donor: "Sally Smith",
    Type: "Drop off",
    DateRecieved: "Jan 11. at 8:12 AM",
    DateApproved: "Jan 14 at 5:20 PM",
    Status: "Scheduled",
  },
  {
    Donor: "John Doe",
    Type: "Pickup",
    DateRecieved: "Jan 11. at 8:11 AM",
    DateApproved: "N/A",
    Status: "Needs Approval",
  },
  {
    Donor: "Sally Smith",
    Type: "Drop off",
    DateRecieved: "Jan 11. at 8:12 AM",
    DateApproved: "Jan 14 at 5:20 PM",
    Status: "Scheduled",
  },
  {
    Donor: "John Doe",
    Type: "Pickup",
    DateRecieved: "Jan 11. at 8:11 AM",
    DateApproved: "N/A",
    Status: "Needs Approval",
  },
  {
    Donor: "Sally Smith",
    Type: "Drop off",
    DateRecieved: "Jan 11. at 8:12 AM",
    DateApproved: "Jan 14 at 5:20 PM",
    Status: "Scheduled",
  },
  {
    Donor: "John Doe",
    Type: "Pickup",
    DateRecieved: "Jan 11. at 8:11 AM",
    DateApproved: "N/A",
    Status: "Needs Approval",
  },
  {
    Donor: "Sally Smith",
    Type: "Drop off",
    DateRecieved: "Jan 11. at 8:12 AM",
    DateApproved: "Jan 14 at 5:20 PM",
    Status: "Scheduled",
  },
];

function ActiveDonationPage(): JSX.Element {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(8);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <div>
      <AdminNavbar />
      <div id="activeDonPage">
        <h1 id="activeDonHeader">Active Donations</h1>
        <TableContainer>
          <Table>
            <TableHead sx={{ minWidth: 650 }} aria-label="simple table">
              <TableRow>
                {header.map((h, index: number) => (
                  <TableCell key={index}>
                    <p className="tableCell">{h}</p>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {dummyData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((d, index) => (
                  // TODO: wrap parent link to new page
                  <TableRow key={index}>
                    <TableCell component="th" scope="row">
                      {d.Donor}
                    </TableCell>
                    <TableCell>{d.Type}</TableCell>
                    <TableCell>{d.DateRecieved}</TableCell>
                    <TableCell>{d.DateApproved}</TableCell>
                    {d.Status === "Scheduled" ? (
                      <TableCell>{d.Status}</TableCell>
                    ) : (
                      <TableCell>
                        <p className="needApproval">{d.Status}</p>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[8, 10, 15]}
            component="div"
            count={dummyData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      </div>
    </div>
  );
}

export default ActiveDonationPage;
