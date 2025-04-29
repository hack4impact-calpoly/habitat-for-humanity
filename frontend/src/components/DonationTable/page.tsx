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
import { useAuth } from "@clerk/clerk-react";

import AdminNavbar from "components/admin/AdminNavbar/AdminNavbar";
import DonorNavbar from "components/donor/DonorNavbar/DonorNavbar";
import { Item, getItems, getItemsByDonorID } from "api/item";
import { User, getDonors, getClerkUser } from "api/user";

import "../../../App.css";

export type DonationTableMode = "approval" | "active" | "history";

interface DonationTableProps {
  mode: DonationTableMode;
}

const headers = {
  approval: 
    ["Donor", 
     "Type", 
     "Date/Time Received", 
     "Date/Time Approved-Rejected", 
     "Status"],
  active: 
    ["Donor",
     "Type",
     "Date/Time Received",
    "Date/Time Approved-Rejected",
    "Status"],
  history: 
    ["Donation Item",
     "Type", 
     "Date/Time Received", 
     "Date/Time Approved", 
     "Status"],
};

export default function DonationTable({ mode }: DonationTableProps) {
  const router = useRouter();
  const { userId } = useAuth();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [items, setItems] = useState<Item[]>([]);
  const [donors, setDonors] = useState<User[]>([]);
  const [donorInfoMap, setDonorInfoMap] = useState<Record<string, { firstName: string; lastName: string }>>({});

  useEffect(() => {
    const fetchData = async () => {
      if (mode === "history" && userId) {
        const res = await getItemsByDonorID(userId);
        setItems(res);
      } else {
        const res = await getItems();
        setItems(res);
        if (mode !== "history") {
          const donorList = await getDonors();
          setDonors(donorList);
        }
      }
    };
    fetchData();
  }, [mode, userId]);

  useEffect(() => {
    const fetchDonorNames = async () => {
      const uniqueIds = Array.from(new Set(items.map((i) => i.donorId)));
      const map: Record<string, any> = { ...donorInfoMap };
      await Promise.all(
        uniqueIds.map(async (id) => {
          if (!map[id]) {
            try {
              const donor = await getClerkUser(id);
              map[id] = donor;
            } catch (e) {
              console.error("Failed to fetch donor info for:", id);
            }
          }
        })
      );
      setDonorInfoMap(map);
    };
    if (mode === "approval" && items.length > 0) {
      fetchDonorNames();
    }
  }, [items, mode, donorInfoMap]); // <--- added donorInfoMap to dependency

  const filteredItems = items.filter((item) => {
    if (mode === "approval") {
      return item.status === "Needs Approval" || item.status === "Send Receipt";
    }
    if (mode === "active") {
      return item.status === "Approved and Scheduled" || item.status === "Send Receipt";
    }
    if (mode === "history") {
        return item.status === "Completed" || item.status === "Rejected";
    }
    return true;
  });

  const titleMap = {
    approval: "Donation Approvals",
    active: "Active Donations",
    history: "Donation History",
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const getDonorName = (id: string) => {
    if (mode === "approval") {
      const donor = donorInfoMap[id];
      return donor ? `${donor.firstName} ${donor.lastName}` : "Loading...";
    }
    const donor = donors.find((d) => d.id === id);
    return donor ? `${donor.firstName} ${donor.lastName}` : "Unknown Donor";
  };

  const convertTime = (time: Date | undefined) =>
    time ? moment(time).format("MMM Do [at] h:mm A") : "N/A";

  const sortReceivedTime = (a: any, b: any) => (a.timeSubmitted > b.timeSubmitted ? -1 : 1);

  return (
    <div>
      {mode === "history" ? <DonorNavbar /> : <AdminNavbar />}
      <div id={mode === "history" ? "DonHistoryPage" : "activeDonPage"}>
        <h1 id={mode === "history" ? "DonHistoryHeader" : "activeDonHeader"}>
          {titleMap[mode]}
        </h1>
        <TableContainer sx={{ width: "100%", maxWidth: "100vw", padding: 0 }}>
          <Table sx={{ minWidth: 100, borderCollapse: "collapse" }}>
            <TableHead>
              <TableRow>
                {headers[mode].map((h, index) => (
                  <TableCell key={index}>
                    <p className="tableCell">{h}</p>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredItems
                .sort((a, b) => sortReceivedTime(a, b))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((d, index) => (
                  <TableRow
                    key={index}
                    className="tableRow"
                  >
                    {mode === "history" ? (
                      <>
                        <TableCell>{d.name?.join(", ")}</TableCell>
                        <TableCell>{d.scheduling}</TableCell>
                        <TableCell>{convertTime(d.timeSubmitted)}</TableCell>
                        <TableCell>{convertTime(d.timeApproved)}</TableCell>
                        <TableCell>
                          <p className={d.status === "Approved and Scheduled" ? "approved" : "needApproval"}>
                            {d.status}
                          </p>
                        </TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell>{getDonorName(d.donorId)}</TableCell>
                        <TableCell>{d.scheduling}</TableCell>
                        <TableCell>{convertTime(d.timeSubmitted)}</TableCell>
                        <TableCell>{convertTime(d.timeApproved)}</TableCell>
                        <TableCell>
                          <p className={d.status === "Approved and Scheduled" ? "" : "needApproval"}>
                            {d.status}
                          </p>
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[8, 10, 15]}
            component="div"
            count={filteredItems.length}
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
