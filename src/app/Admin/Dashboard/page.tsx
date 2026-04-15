import Image from "next/image";
import AdminNavbar from "../../../components/admin/AdminNavbar/AdminNavbar"

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
        <h3 style={styles.title}>Donation Details</h3>
        <table style={styles.table}>
            <thead>
                <tr>
                    <th style={styles.th}>Item</th>
                    <th style={styles.th}>Location</th>
                    <th style={styles.th}>Donor</th>
                    <th style={styles.th}>Date - Time</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td style={styles.td}>Placeholder</td>
                    <td style={styles.td}>Placeholder</td>
                    <td style={styles.td}>Placeholder</td>
                    <td style={styles.td}>Placeholder</td>
                </tr>
            </tbody>
        </table>
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