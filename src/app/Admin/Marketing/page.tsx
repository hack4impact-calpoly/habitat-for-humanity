"use client";
import AdminNavbar from "components/admin/AdminNavbar/AdminNavbar";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import { useEffect, useState } from "react";
import { getClerkUser, getMarketingUsers, MongoUser, User } from "api/user";

const header = ["Donor", "Email", "Phone", "Address"];

export default function DonationApprovalsPage() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [users, setUsers] = useState<User[]>([]);
  useEffect(() => {
    const fetchMarketingUsers = async () => {
      try {
        const marketingUsers = await getMarketingUsers();

        const detailedUsers = await Promise.all(
          marketingUsers.map(async (user: MongoUser) => {
            const clerkData = await getClerkUser(user.id);

            return {
              id: user.id,
              phone: user.phone,
              address: user.address,
              firstName: clerkData.firstName,
              lastName: clerkData.lastName,
              email: clerkData.email,
            };
          }),
        );

        setUsers(detailedUsers);
      } catch (error) {
        console.error("Error combining user data: ", error);
      }
    };
    fetchMarketingUsers();
  }, []);

  const sortName = (a: User, b: User) => {
    const firstCompare = a.firstName.localeCompare(b.firstName);
    if (firstCompare !== 0) return firstCompare;
    return a.lastName.localeCompare(b.lastName);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <div>
      <AdminNavbar />
      <div id="activeDonPage">
        <h1 id="activeDonHeader">Donors for Marketing</h1>
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
              {users
                .sort((a, b) => sortName(a, b))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((d, index) => (
                  <TableRow
                    key={index}
                    style={{ textDecoration: "none", cursor: "default" }}
                    className="tableRow"
                  >
                    <TableCell scope="row">{`${d.firstName} ${d.lastName}`}</TableCell>
                    <TableCell>{d.email}</TableCell>
                    <TableCell>{d.phone}</TableCell>
                    <TableCell>
                      {d.address
                        ? `${d.address.street}, ${d.address.city} ${d.address.zip}`
                        : "N/A"}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[8, 10, 15]}
            component="div"
            count={users.length}
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
