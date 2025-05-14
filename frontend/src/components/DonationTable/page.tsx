// components/admin/DonationsTable/DonationsTable.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import moment from "moment";
import "moment-timezone";
import { Item, getItemsByStatus } from "api/item";
import { getClerkUser } from "api/user";

type DonationViewType = "approvals" | "active" | "history";

const header = [
  "Donor",
  "Type",
  "Date/Time Received",
  "Date/Time Approved-Rejected",
  "Status",
];

interface DonationsTableProps {
  viewType: DonationViewType;
}

export default function DonationsTable({ viewType }: DonationsTableProps): React.ReactNode {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [items, setItems] = useState<Item[]>([]);
  const [donorInfoMap, setDonorInfoMap] = useState<
    Record<string, { firstName: string; lastName: string }>
  >({});

  const router = useRouter();

  useEffect(() => {
    getItemsByStatus(viewType).then((res) => setItems(res));
  }, []);

  useEffect(() => {
    const fetchDonorNames = async () => {
      const uniqueDonorIds = Array.from(
        new Set(items.map((item) => item.donorId)),
      );
      const map: Record<string, any> = { ...donorInfoMap };

      await Promise.all(
        uniqueDonorIds.map(async (id) => {
          if (!map[id]) {
            try {
              const donor = await getClerkUser(id);
              map[id] = donor;
            } catch (e) {
              console.error("Failed to fetch donor for id:", id);
            }
          }
        }),
      );

      setDonorInfoMap(map);
    };

    if (items.length > 0) {
      fetchDonorNames();
    }
  }, [items]);

  const getDonorName = (id: string) => {
    const donor = donorInfoMap[id];
    return donor ? `${donor.firstName} ${donor.lastName}` : "Loading...";
  };

  const convertTime = (time: Date | undefined): string =>
    time ? moment(time).format("MMM Do [at] h:mm A") : "N/A";

  const sortReceivedTime = (don1: any, don2: any) =>
    don1.timeSubmitted > don2.timeSubmitted ? -1 : 1;

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const getTitle = () => {
    switch (viewType) {
      case "approvals": return "Donation Approvals";
      case "active": return "Active Donations";
      case "history": return "Donation History";
      default: return "";
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Completed":
        return { margin: 0, color: "#4CAF50" };
      case "Needs Approval":
      case "Send Receipt":
        return { margin: 0, color: "#FFA500" };
      case "Approved and Scheduled":
        return { margin: 0 };
      case "Rejected":
        return { margin: 0, color: "#FF0000" };
      default:
        return { margin: 0 };
    }
  };

  return (
    <div id="activeDonPage">
      <h1 id="activeDonHeader">{getTitle()}</h1>
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
              .sort((a, b) => sortReceivedTime(a, b))
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((d, index) => (
                <TableRow
                  key={index}
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
                  <TableCell>
                    <p style={getStatusStyle(d.status)}>{d.status}</p>
                  </TableCell>
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
  );
}