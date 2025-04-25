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
import { User, getDonors } from "api/user";
import moment from "moment";
import "moment-timezone";
import { Item, getItems } from "../../../api/item";
import AdminNavbar from "../../../components/admin/AdminNavbar/AdminNavbar";
import DownloadButton from "components/admin/DonationInfoPage/DownloadButton";

require("../../../App.css");

const header = [
  "Donor",
  "Type",
  "Date/Time Received",
  "Date/Time Approved-Rejected",
  "Status",
];

export default function ActiveDonationPage(): React.ReactNode {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(8);
  const [items, setItems] = useState<Item[]>([]);
  const [donors, setDonors] = useState<User[]>([]);

  const router = useRouter();

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

  const convertTime = (time: Date | undefined): string =>
    time ? moment(time).format("MMM Do [at] h:mm A") : "N/A";

  const sortReceivedTime = (don1: any, don2: any) => {
    if (don1.timeSubmitted > don2.timeSubmitted) {
      return -1;
    }
    return 1;
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const exportCSV = () => {
    const columnsToExport = [
      "donorId",
      "name",
      "size",
      "address",
      "city",
      "zipCode",
      "scheduling",
      "timeAvailability",
      "timeSubmitted",
      "status",
    ];

    const processedData = items?.map((row) => {
      const newRow: Record<string, any> = {};
      columnsToExport.forEach((col) => {
        // Use keyof Item to tell TypeScript that col is a key of Item
        if (
          row[col as keyof Item] !== null &&
          row[col as keyof Item] !== undefined
        ) {
          if (col === "timeAvailability" || col === "timeSubmitted") {
            const date =
              typeof row[col] === "string" ? new Date(row[col]) : row[col];
            newRow[col] = convertTime(date);
          } else if (col === "donorId") {
            newRow[col] = getDonorName(row[col]);
          } else {
            newRow[col] = row[col as keyof Item];
          }
        }
      });
      return newRow;
    });

    // Helper function to convert snake case to human-readable format
    const toTitleCase = (str: string): string =>
      str
        .replace(/([a-z])([A-Z])/g, "$1 $2") // Add space between camelCase words
        .split(" ") // Split into words
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letter of each word
        .join(" ");

    const csvRows = [
      columnsToExport
        .map((col) => (col === "donorId" ? "Donor Name" : toTitleCase(col))) // Switch donorId to Donor Name
        .join(","), // header
      ...processedData.map((row) =>
        columnsToExport
          .map((col) => {
            // Convert each value, handle donorId, and format for CSV
            return `"${row[col] ?? "".toString().replace(/"/g, '""')}"`;
          })
          .join(","),
      ),
    ];

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "active_donations.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <AdminNavbar />
      <div id="activeDonPage">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h1 id="activeDonHeader">Active Donations</h1>
          <DownloadButton onClick={exportCSV} />
        </div>
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
                ?.filter(
                  (item) =>
                    item.status === "Approved and Scheduled" ||
                    item.status === "Send Receipt",
                )
                .sort((a, b) => sortReceivedTime(a, b))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((d, index) => (
                  // TODO: wrap parent link to new page
                  <TableRow
                    key={index}
                    // to={`DonationInfo/${d._id}`}
                    onClick={() => {
                      router.push(`DonationInfo/${d._id}/`);
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
