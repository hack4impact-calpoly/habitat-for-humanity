"use client";

import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import { Item, getItemsByStatus } from "api/item";
import { getClerkUser } from "api/user";
import moment from "moment";
import { getReceipts, Receipt } from "api/receipt";
import { useRouter } from "next/navigation";

const headers = ["Item", "Location", "Donor", "Date - Time", "Receipt"];
const gridCols = "1.2fr 1.8fr 1fr 1fr 0.8fr";

interface DonationDetailsProps {
  items: Item[];
}

export default function DonationDetails({
  items,
}: DonationDetailsProps): React.ReactNode {
  const [donorInfoMap, setDonorInfoMap] = useState<
    Record<string, { firstName: string; lastName: string }>
  >({});
  const [receiptMap, setReceiptMap] = useState<Record<string, Receipt>>({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);

  const router = useRouter();

  useEffect(() => {
    getReceipts().then((receipts) => {
      const map: Record<string, Receipt> = {};
      receipts.forEach((r) => {
        map[r.itemId] = r;
      });
      setReceiptMap(map);
    });
  }, []);

  useEffect(() => {
    if (items.length === 0) return;
    const fetchDonorNames = async () => {
      const uniqueDonorIds = Array.from(
        new Set(items.map((item) => item.donorId).filter((id) => id !== "")),
      );
      const map: Record<string, { firstName: string; lastName: string }> = {};
      await Promise.all(
        uniqueDonorIds.map(async (id) => {
          try {
            map[id] = await getClerkUser(id);
          } catch (error) {
            console.error("Failed to fetch donor for id:", id, error);
          }
        }),
      );
      setDonorInfoMap(map);
    };
    fetchDonorNames();
  }, [items]);

  const getDonorName = (item: Item) => {
    if (!item.donorId) return item.donorName ?? "Unknown";
    const donor = donorInfoMap[item.donorId];
    return donor ? `${donor.firstName} ${donor.lastName}` : "Loading...";
  };

  const handleDownload = (receipt: Receipt) => {
    const byteArray = Uint8Array.from(atob(receipt.pdf), (c) =>
      c.charCodeAt(0),
    );
    const blob = new Blob([byteArray], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `receipt-${receipt.itemId}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ padding: "32px" }}>
      <h1 style={{ fontSize: "32px", fontWeight: 600, marginBottom: "24px" }}>
        Donation Details
      </h1>

      <TableContainer>
        <Table
          aria-label="donation details table"
          style={{ tableLayout: "fixed" }}
        >
          <TableHead>
            <TableRow
              style={{
                backgroundColor: "#f5f5f5",
                borderRadius: "16px 16px 0 0",
                display: "grid",
                gridTemplateColumns: gridCols,
                padding: "16px 24px",
              }}
            >
              {headers.map((h) => (
                <TableCell
                  key={h}
                  style={{ fontWeight: 600, border: "none", padding: 0 }}
                >
                  {h}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} style={{ color: "#777" }}>
                  No completed donations
                </TableCell>
              </TableRow>
            ) : (
              items
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((item) => {
                  const receipt = item._id ? receiptMap[item._id] : undefined;
                  return (
                    <TableRow
                      key={item._id}
                      onClick={() => router.push(`DonationInfo/${item._id}/`)}
                      className="tableRow"
                      style={{
                        display: "grid",
                        gridTemplateColumns: gridCols,
                        padding: "0 24px",
                        alignItems: "center",
                        cursor: "pointer",
                        borderBottom: "1px solid #e5e5e5",
                      }}
                    >
                      <TableCell style={{ border: "none", padding: "12px 0" }}>
                        {item.name?.join(", ") || "N/A"}
                      </TableCell>
                      <TableCell style={{ border: "none", padding: "12px 0" }}>
                        <div>{item.address}</div>
                        <div>
                          {item.city}, {item.state} {item.zipCode}
                        </div>
                      </TableCell>
                      <TableCell style={{ border: "none", padding: "12px 0" }}>
                        {getDonorName(item)}
                      </TableCell>
                      <TableCell style={{ border: "none", padding: "12px 0" }}>
                        {moment(item.timeSubmitted).format(
                          "MM.DD.YYYY - h:mm A",
                        )}
                      </TableCell>
                      <TableCell
                        style={{ border: "none", padding: "12px 0" }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {receipt ? (
                          <button
                            onClick={() => handleDownload(receipt)}
                            style={downloadBtn}
                          >
                            Download
                          </button>
                        ) : (
                          <span style={{ color: "#aaa", fontSize: "13px" }}>
                            No receipt
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
            )}
          </TableBody>
        </Table>

        <TablePagination
          rowsPerPageOptions={[8, 10, 15]}
          component="div"
          count={items.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(+e.target.value);
            setPage(0);
          }}
        />
      </TableContainer>
    </div>
  );
}

const downloadBtn: React.CSSProperties = {
  padding: "5px 12px",
  backgroundColor: "#314d89",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "13px",
};
