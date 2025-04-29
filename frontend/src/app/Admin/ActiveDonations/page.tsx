// app/admin/active/page.tsx
import AdminNavbar from "components/admin/AdminNavbar/AdminNavbar";
import DonationsTable from "components/DonationTable/page";

export default function ActiveDonationsPage() {
  return (
    <div>
      <AdminNavbar />
      <DonationsTable viewType="active" />
    </div>
  );
}