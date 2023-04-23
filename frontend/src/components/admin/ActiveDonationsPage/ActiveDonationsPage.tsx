import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import { User, getDonors } from "api/user";
import { Item, getItems } from "../../../api/item";
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
  const [items, setItems] = useState<Item[]>([]);
  const [donors, setDonors] = useState<User[]>([]);

  useEffect(() => {
    getItems().then((res) => setItems(res));
    getDonors().then((res) => setDonors(res));
    console.log(items);
  }, []);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const getDonorName = (id: string) => {
    const donor = donors.find((d) => d.id === id);
    return `${donor?.firstName} ${donor?.lastName}`;
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
              {items
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((d, index) => (
                  // TODO: wrap parent link to new page
                  <TableRow key={index}>
                    <TableCell component="th" scope="row">
                      {getDonorName(d.donorId)}
                    </TableCell>
                    <TableCell>{d.scheduling}</TableCell>
                    <TableCell>{d.timeSubmitted}</TableCell>
                    <TableCell>{d.timeApproved}</TableCell>
                    {d.status === "Approved" ? (
                      <TableCell>{d.status}</TableCell>
                    ) : (
                      <TableCell>
                        <Link to={d.status}>
                          <p className="needApproval">{d.status}</p>
                        </Link>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[8, 10, 15]}
            component="div"
            count={items.length}
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
