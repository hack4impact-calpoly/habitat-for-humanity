import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import { User, getDonors } from "api/user";
import moment from "moment";
import "moment-timezone";
import { Item, getItems } from "../../../api/item";
import AdminNavbar from "../AdminNavbar/AdminNavbar";

require("./ActiveDonationsPage.css");

const header = [
  "Donor",
  "Type",
  "Date/Time Received",
  "Date/Time Approved-Rejected",
  "Status",
];

function ActiveDonationPage(): JSX.Element {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(8);
  const [items, setItems] = useState<Item[]>([]);
  const [donors, setDonors] = useState<User[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    getItems().then((res) => setItems(res));
    getDonors().then((res) => setDonors(res));
  }, []);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const getDonorName = (id: string) => {
    const donor = donors.find((d) => d.id === id);
    return `${donor?.firstName} ${donor?.lastName}`;
  };

  const convertTime = (time: Date) =>
    time ? moment(time).format("MMM Do [at] h:mm A") : "N/A";

  const sortReceivedTime = (don1: any, don2: any) => {
    if (don1.timeSubmitted > don2.timeSubmitted) {
      return -1;
    }
    return 1;
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
                {header.map((h, index) => (
                  <TableCell key={index}>
                    <p className="tableCell">{h}</p>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {items
                ?.sort((a, b) => sortReceivedTime(a, b))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((d, index) => (
                  // TODO: wrap parent link to new page
                  <TableRow
                    key={index}
                    // to={`DonationInfo/${d._id}`}
                    onClick={() => {
                      navigate(`DonationInfo/${d._id}/`);
                    }}
                    style={{ textDecoration: "none" }}
                    className="tableRow"
                  >
                    <TableCell scope="row">{getDonorName(d.donorId)}</TableCell>
                    <TableCell>{d.scheduling}</TableCell>
                    <TableCell>{convertTime(d.timeSubmitted)}</TableCell>
                    <TableCell>{convertTime(d.timeApproved)}</TableCell>
                    {d.status === "Approved and Scheduled" ? (
                      <TableCell>
                        <p style={{ margin: 0 }}>{d.status}</p>
                      </TableCell>
                    ) : (
                      <TableCell>
                        <p className="needApproval">{d.status}</p>
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
