"use client";

import Image from "next/image";
import AdminNavbar from "../../../components/admin/AdminNavbar/AdminNavbar"
import DonationDetails from "../../../components/admin/DonationDetails/DonationDetails";
import Items from "models/Items";

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

const handleExportCSV = async () => {
  const res = await fetch("../api/item/status/Completed", { cache: "no-store",});
  const completedItems = await res.json();

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
      "Time Approved"
    ];

  const csvRows = [headers.join(",")];

  completedItems.forEach((item) => {
    const row = [
      item.name,
      item.donorName ?? "",
      item.donorEmail ?? "",
      item.donorPhone ?? "",
      item.address,
      item.city,
      item.state ?? "",
      item.zipCode,
      item.estimatedValue ?? "",
      item.timeSubmitted,
      item.timeApproved ?? "",
    ]
    csvRows.push(row.map((field) => `"${field}"`).join(","));
  });

  const csvContent = csvRows.join("\n");
  downloadCSV(csvContent, `completed-donations.csv`);
}


export default function AdminDashboard(){
    return(
    <div>
    <AdminNavbar/>
    <div style={styles.container}>
        <div style = {styles.navbar}>
        {/* TODO: Replace placeholder buttons*/}
        <h2 style={styles.dash_title}>Dashboard</h2>
        <div style={styles.navButtons}>
        <button style={styles.navButton}> 
            Manage Pickups
        </button>
        <button style={styles.navButton}>
            Pickup Requests
        </button>
        <button onClick={handleExportCSV} style={styles.navButton}>
            Export Donations as CSV
        </button>
        </div>
        </div>

        <div style = {styles.summaryCards}>
        {/* TODO: Replace placeholder summary cards*/}
        <div style={styles.card}>
            <h4 style={styles.cardTitle}>Total Donations</h4>
            <p style={styles.cardValue}>0</p>
        </div>
        <div style = {styles.card}>
            <h4 style={styles.cardTitle}>Estimated Value</h4>
            <p style={styles.cardValue}>0</p>
        </div>
        <div style = {styles.card}>
            <h4 style={styles.cardTitle}>Most Common</h4>
            <p style={styles.cardValue}>0</p>
        </div>
        <div style = {styles.card}>
            <h4 style={styles.cardTitle}>Pending Donations</h4>
            <p style={styles.cardValue}>0</p>
        </div>
        </div>
        {/* TODO: Replace placeholder donation graph and table*/}
        <div style={styles.section}>
            <h3 style={styles.title}>Donation Tracker</h3>
        <div style={styles.graphPlaceholder}>
        Donation Tracker Graph Placeholder
        </div>
        </div>
        <div style={styles.section}>
          <DonationDetails />
        </div>
    </div>
    </div>
    )
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