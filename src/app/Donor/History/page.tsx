"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import { User, getUserByID } from "api/user";
import moment from "moment";
import "moment-timezone";
import { useSelector, useDispatch } from "react-redux";
import { updateDonorID } from "../../../redux/donationSlice";
import { RootState } from "../../../redux/store";
import { Item, getItemsByDonorID } from "../../../api/item";
import DonorNavbar from "components/donor/DonorNavbar/DonorNavbar";
import { useAuth } from "@clerk/clerk-react";

require("../../../App.css");

const header = [
  { label: "Donation Item", key: "name" },
  { label: "Type", key: "scheduling" },
  { label: "Date/Time Received", key: "timeSubmitted" },
  { label: "Date/Time Approved", key: "timeApproved" },
  { label: "Status", key: "status" },
];

function DonationHistory(): React.ReactNode {
  const { userId } = useAuth();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(8);
  const [items, setItems] = useState<Item[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: string;
  }>({
    key: "timeSubmitted",
    direction: "desc",
  });

  const router = useRouter();

  useEffect(() => {
    if (userId) {
      getItemsByDonorID(userId).then((res) => setItems(res));
    }
  }, [userId]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const convertTime = (time: Date | undefined) =>
    time ? moment(time).format("MMM Do [at] h:mm A") : "N/A";

  const sortReceivedTime = (don1: any, don2: any) => {
    if (don1.timeSubmitted > don2.timeSubmitted) {
      return -1;
    }
    return 1;
  };

  const handleSort = (key: string) => {
    setSortConfig((prevSort) => ({
      key,
      direction:
        prevSort.key === key && prevSort.direction === "asc" ? "desc" : "asc",
    }));
  };

  const sortedItems = [...items].sort((a, b) => {
    const key = sortConfig.key as keyof Item;

    const valueA = a[key] ?? ""; // Default to empty string if undefined
    const valueB = b[key] ?? ""; // Default to empty string if undefined

    if (valueA < valueB) return sortConfig.direction === "asc" ? -1 : 1;
    if (valueA > valueB) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  return (
    <div>
      <DonorNavbar />
      <div id="DonHistoryPage">
        <h1 id="DonHistoryHeader">Donation History</h1>
        <TableContainer
          sx={{
            width: "100%",
            maxWidth: "100vw",
            padding: 0,
          }}
        >
          <Table
            sx={{
              minWidth: 100,
              borderCollapse: "collapse",
            }}
          >
            <TableHead aria-label="donation history table">
              <TableRow>
                {header.map((h, index) => (
                  <TableCell
                    key={index}
                    onClick={() => handleSort(h.key)}
                    style={{
                      cursor: "pointer",
                      backgroundColor:
                        sortConfig.key === h.key ? "#f0f0f0" : "inherit", // Highlight sorted column
                    }}
                  >
                    <p className="tableCell">
                      {h.label}
                      <img
                        src={"/images/arrow.png"}
                        alt="Sort Icon"
                        style={{
                          width: 12,
                          marginLeft: 5,
                          opacity: 0.6, // Make arrows slightly faded
                        }}
                      />
                    </p>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedItems.length > 0 ? (
                sortedItems
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((d, index) => (
                    <TableRow
                      key={index}
                      onClick={() => {
                        router.push(`/Donor/History/DonationInfo/${d._id}/`);
                      }}
                      className="tableRow"
                    >
                      <TableCell scope="row">{d.name.join(", ")}</TableCell>
                      <TableCell>{d.scheduling}</TableCell>
                      <TableCell>{convertTime(d.timeSubmitted)}</TableCell>
                      <TableCell>{convertTime(d.timeApproved)}</TableCell>
                      <TableCell>
                        <p
                          className={
                            d.status === "Approved and Scheduled"
                              ? "approved"
                              : "needApproval"
                          }
                        >
                          {d.status}
                        </p>
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No items found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[8, 10, 15]}
            component="div"
            count={items?.length}
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

export default DonationHistory;