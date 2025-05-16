// app/admin/approvals/page.tsx
import AdminNavbar from "components/admin/AdminNavbar/AdminNavbar";
import DonationsTable from "components/DonationTable/page";

export default function DonationApprovalsPage() {
  return (
    <div>
      <AdminNavbar />
      <DonationsTable viewType="approvals" />
    </div>
  );
}