// app/admin/history/page.tsx
import AdminNavbar from "components/admin/AdminNavbar/AdminNavbar";
import DonationsTable from "components/DonationTable/page";

export default function DonationHistoryPage() {
  return (
    <div>
      <AdminNavbar />
      <DonationsTable viewType="history" />
    </div>
  );
}