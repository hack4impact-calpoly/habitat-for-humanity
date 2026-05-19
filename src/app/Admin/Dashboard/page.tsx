"use client";

import Image from "next/image";
import AdminNavbar from "../../../components/admin/AdminNavbar/AdminNavbar";
import DonationDetails from "../../../components/admin/DonationDetails/DonationDetails";
import DonationTrackerGraph from "../../../components/admin/DonationTrackerGraph/DonationTrackerGraph";
import Items from "models/Items";
import { getItemsByStatus, Item } from "api/item";
import { getClerkUser, getUserByID } from "api/user";
import { useState } from "react";
import { getReceipts } from "api/receipt";
import JSZip from "jszip";

type ExportType = "csv" | "receipts" | null;

const STATUS_OPTIONS = [
  { label: "Completed", value: "Completed" },
  { label: "History (completed + rejected)", value: "history" },
  { label: "Active (approved + scheduled)", value: "active" },
  { label: "Needs approval", value: "approvals" },
];

function downloadCSV(data: string, filename: string) {
  const blob = new Blob([data], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
const handleExportCSV = async (
  status: string,
  dateFrom: string,
  dateTo: string,
) => {
  let items = await getItemsByStatus(status);

  if (dateFrom || dateTo) {
    items = items.filter((item: Item) => {
      const created = new Date(item.timeSubmitted);
      if (dateFrom && created < new Date(dateFrom)) return false;
      if (dateTo && created > new Date(dateTo)) return false;
      return true;
    });
  }

  const headers = [
    "Item",
    "Donor Name",
    "Donor Email",
    "Donor Phone",
    "Address",
    "City",
    "State",
    "Zip Code",
    "Estimated Value",
    "Time Submitted",
    "Time Approved",
  ];

  const csvRows = [headers.join(",")];

  await Promise.all(
    items.map(async (item: Item) => {
      let donorName = item.donorName ?? "";
      let donorEmail = item.donorEmail ?? "";
      let donorPhone = item.donorPhone ?? "";
      let address = item.address ?? "";
      let city = item.city ?? "";
      let state = item.state ?? "";
      let zipCode = item.zipCode ?? "";

      if (item.donorId) {
        try {
          // Get phone/address from your DB
          const dbUser = await getUserByID(item.donorId);
          if (dbUser) {
            donorPhone = (donorPhone || dbUser.phone) ?? "";
            address = (address || dbUser.address?.street) ?? "";
            city = (city || dbUser.address?.city) ?? "";
            state = (state || dbUser.address?.state) ?? "";
            zipCode = (zipCode || dbUser.address?.zip) ?? "";
          }
        } catch {
          console.warn(`Failed to fetch DB user for donorId: ${item.donorId}`);
        }

        try {
          // Get name/email from Clerk
          const clerkUser = await getClerkUser(item.donorId);
          if (clerkUser) {
            donorName =
              donorName ||
              `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim();
            donorEmail =
              (donorEmail || clerkUser.emailAddresses?.[0]?.emailAddress) ?? "";
          }
        } catch {
          console.warn(
            `Failed to fetch Clerk user for donorId: ${item.donorId}`,
          );
        }
      }

      const row = [
        item.name,
        donorName,
        donorEmail,
        donorPhone,
        address,
        city,
        state,
        zipCode,
        item.estimatedValue ?? "",
        item.timeSubmitted,
        item.timeApproved ?? "",
      ];

      csvRows.push(row.map((field) => `"${field}"`).join(","));
    }),
  );

  const csvContent = csvRows.join("\n");
  const from = dateFrom ? dateFrom : "start";
  const to = dateTo ? dateTo : "end";
  downloadCSV(csvContent, `${status}-donations-${from}-to-${to}.csv`);
};

const handleDownloadReceipts = async (dateFrom: string, dateTo: string) => {
  let receipts = await getReceipts();

  if (dateFrom || dateTo) {
    receipts = receipts.filter((r) => {
      const created = new Date(r.createdAt!);
      if (dateFrom && created < new Date(dateFrom)) return false;
      if (dateTo && created > new Date(dateTo)) return false;
      return true;
    });
  }

  const zip = new JSZip();

  receipts.forEach((receipt) => {
    const bytes = Buffer.from(receipt.pdf, "base64");
    zip.file(`receipt_${receipt.itemId}.pdf`, bytes);
  });

  const from = dateFrom || "start";
  const to = dateTo || "end";

  const blob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `receipts-${from}-to-${to}.zip`;
  link.click();
  URL.revokeObjectURL(url);
};

export default function AdminDashboard() {
  const [exportModal, setExportModal] = useState<ExportType>(null);
  const [status, setStatus] = useState("Completed");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const handleExport = async () => {
    if (exportModal === "csv") await handleExportCSV(status, dateFrom, dateTo);
    if (exportModal === "receipts")
      await handleDownloadReceipts(dateFrom, dateTo);
    setExportModal(null);
  };

  return (
    <div>
      <AdminNavbar />
      <div style={styles.container}>
        <div style={styles.navbar}>
          {/* TODO: Replace placeholder buttons*/}
          <h2 style={styles.dash_title}>Dashboard</h2>
          <div style={styles.navButtons}>
            <button style={styles.navButton}>Manage Pickups</button>
            <button style={styles.navButton}>Pickup Requests</button>
            <button
              onClick={() => setExportModal("csv")}
              style={styles.navButton}
            >
              Export donations as CSV
            </button>
            <button
              onClick={() => setExportModal("receipts")}
              style={styles.navButton}
            >
              Download receipts
            </button>
          </div>
        </div>

        <div style={styles.summaryCards}>
          {/* TODO: Replace placeholder summary cards*/}
          <div style={styles.card}>
            <h4 style={styles.cardTitle}>Total Donations</h4>
            <p style={styles.cardValue}>0</p>
          </div>
          <div style={styles.card}>
            <h4 style={styles.cardTitle}>Estimated Value</h4>
            <p style={styles.cardValue}>0</p>
          </div>
          <div style={styles.card}>
            <h4 style={styles.cardTitle}>Most Common</h4>
            <p style={styles.cardValue}>0</p>
          </div>
          <div style={styles.card}>
            <h4 style={styles.cardTitle}>Pending Donations</h4>
            <p style={styles.cardValue}>0</p>
          </div>
        </div>
        <div style={styles.section}>
          <DonationTrackerGraph />
        </div>
        <div style={styles.section}>
          <DonationDetails />
        </div>
      </div>

      {exportModal && (
        <div style={modalStyles.backdrop}>
          <div style={modalStyles.modal}>
            <h2 style={modalStyles.title}>
              {exportModal === "csv"
                ? "Export donations as CSV"
                : "Download receipts"}
            </h2>

            {exportModal === "csv" && (
              <div style={modalStyles.field}>
                <label style={modalStyles.label}>Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  style={modalStyles.input}
                >
                  {STATUS_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              <div style={modalStyles.field}>
                <label style={modalStyles.label}>From</label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  style={modalStyles.input}
                />
              </div>
              <div style={modalStyles.field}>
                <label style={modalStyles.label}>To</label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  style={modalStyles.input}
                />
              </div>
            </div>

            <div style={modalStyles.actions}>
              <button
                onClick={() => setExportModal(null)}
                style={modalStyles.cancel}
              >
                Cancel
              </button>
              <button onClick={handleExport} style={modalStyles.confirm}>
                {exportModal === "csv" ? "Export CSV" : "Download receipts"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  dash_title: {
    fontSize: "28px",
    fontWeight: 600,
    color: "#1F2937",
    margin: 0,
  },

  container: {
    backgroundColor: "#f4f4f4",
    minHeight: "100vh",
    padding: "40px",
    fontFamily: "Arial, sans-serif",
  },

  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: "15px 40px",
    borderRadius: "8px",
    marginBottom: "30px",
  },

  navButtons: {
    display: "flex",
    gap: "40px",
  },

  navButton: {
    fontWeight: 500,
    cursor: "pointer",
    color: "#444",
  },

  title: {
    textAlign: "center",
    marginBottom: "30px",
    fontWeight: 500,
    color: "#333",
  },

  summaryCards: {
    display: "flex",
    gap: "20px",
    marginBottom: "40px",
  },

  card: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: "20px",
    borderRadius: "10px",
    textAlign: "center",
  },

  cardTitle: {
    fontSize: "14px",
    color: "#666",
    marginBottom: "10px",
  },

  cardValue: {
    fontSize: "22px",
    fontWeight: "bold",
    color: "#333",
  },

  section: {
    backgroundColor: "#ffffff",
    padding: "20px",
    borderRadius: "10px",
    marginBottom: "40px",
  },

  graphPlaceholder: {
    height: "200px",
    backgroundColor: "#eaeaea",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#777",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "15px",
  },

  th: {
    padding: "10px",
    backgroundColor: "#f0f0f0",
    fontSize: "14px",
  },

  td: {
    padding: "12px 10px",
    borderBottom: "1px solid #eee",
    fontSize: "14px",
  },
};

const modalStyles: { [key: string]: React.CSSProperties } = {
  backdrop: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modal: {
    background: "#fff",
    borderRadius: 12,
    padding: 24,
    width: 420,
    fontFamily: "Arial, sans-serif",
  },
  title: { fontSize: 18, fontWeight: 500, marginBottom: 20 },
  field: { marginBottom: 14 },
  label: { display: "block", fontSize: 13, color: "#666", marginBottom: 4 },
  input: {
    width: "100%",
    padding: "7px 10px",
    border: "1px solid #ddd",
    borderRadius: 6,
    fontSize: 14,
  },
  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 8,
    marginTop: 20,
  },
  cancel: {
    padding: "7px 16px",
    border: "1px solid #ddd",
    borderRadius: 6,
    background: "transparent",
    cursor: "pointer",
  },
  confirm: {
    padding: "7px 16px",
    border: "none",
    borderRadius: 6,
    background: "#04B2D9",
    color: "#fff",
    fontWeight: 500,
    cursor: "pointer",
  },
};
