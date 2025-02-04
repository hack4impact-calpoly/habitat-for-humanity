import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import { User, getUserByID } from "api/user";
import moment from "moment";
import "moment-timezone";
import { Auth } from "aws-amplify";
import { useSelector, useDispatch } from "react-redux";
import { updateDonorID } from "redux/donationSlice";
import { RootState } from "../../../redux/store";
import { Item, getItemsByDonorID } from "../../../api/item";
import DonorNavbar from "../DonorNavbar/DonorNavbar";

import Arrow from "../../../images/arrow.png";

require("./DonationHistory.css");

const header = [
  { label: "Donation Item", key: "name" },
  { label: "Type", key: "scheduling" },
  { label: "Date/Time Received", key: "timeSubmitted" },
  { label: "Date/Time Approved", key: "timeApproved" },
  { label: "Status", key: "status" },
];

function DonationHistory(): JSX.Element {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [items, setItems] = useState<Item[]>([]);
  const [donors, setDonors] = useState<User[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: string;
  }>({
    key: "timeSubmitted",
    direction: "desc",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const storedDonorID = useSelector(
    (state: RootState) => state.donation.donorID
  );

  const setCurrentUserID = async () => {
    try {
      const user = await Auth.currentUserInfo();
      if (user && user.attributes) {
        dispatch(updateDonorID(user.attributes["custom:id"]));
      } else {
        console.error("User info not available");
      }
    } catch (error) {
      console.error("Error fetching current user:", error);
    }
  };

  useEffect(() => {
    setCurrentUserID();
  }, []);

  useEffect(() => {
    if (storedDonorID) {
      getItemsByDonorID(storedDonorID)
        .then((res) => setItems(res || [])) // Ensure we always set an array
        .catch((error) => {
          console.error("Error fetching items:", error);
          setItems([]); // Fallback to empty array on error
        });

      getUserByID(storedDonorID)
        .then((res) => setDonors([res]))
        .catch((error) => {
          console.error("Error fetching donor:", error);
          setDonors([]); // Fallback to empty array on error
        });
    }
  }, [storedDonorID]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const convertTime = (time: Date) =>
    time ? moment(time).format("MMM Do [at] h:mm A") : "N/A";

  const handleSort = (key: string) => {
    setSortConfig((prevSort) => ({
      key,
      direction:
        prevSort.key === key && prevSort.direction === "asc" ? "desc" : "asc",
    }));
  };

  const sortedItems = [...items].sort((a, b) => {
    const key = sortConfig.key as keyof Item;

    const valueA = a[key] ?? ""; // Default to empty string if undefined
    const valueB = b[key] ?? ""; // Default to empty string if undefined

    if (valueA < valueB) return sortConfig.direction === "asc" ? -1 : 1;
    if (valueA > valueB) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <div>
      <DonorNavbar />
      <div id="DonHistoryPage">
        <h1 id="DonHistoryHeader">Donation History</h1>
        <TableContainer>
          <Table>
            <TableHead
              sx={{ minWidth: 650 }}
              aria-label="donation history table"
            >
              <TableRow>
                {header.map((h, index) => (
                  <TableCell
                    key={index}
                    onClick={() => handleSort(h.key)}
                    style={{
                      cursor: "pointer",
                      backgroundColor:
                        sortConfig.key === h.key ? "#f0f0f0" : "inherit", // Highlight sorted column
                    }}
                  >
                    <p className="tableCell">
                      {h.label}{" "}
                      <img
                        src={Arrow}
                        alt="Sort Icon"
                        style={{
                          width: 12,
                          marginLeft: 5,
                          opacity: 0.6, // Make arrows slightly faded
                        }}
                      />
                    </p>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedItems.length > 0 ? (
                sortedItems
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((d, index) => (
                    <TableRow
                      key={index}
                      onClick={() => navigate(`DonationInfo/${d._id}/`)}
                      className="tableRow"
                    >
                      <TableCell>{d.name}</TableCell>
                      <TableCell>{d.scheduling}</TableCell>
                      <TableCell>{convertTime(d.timeSubmitted)}</TableCell>
                      <TableCell>{convertTime(d.timeApproved)}</TableCell>
                      <TableCell>
                        <p
                          className={
                            d.status === "Approved and Scheduled"
                              ? "approved"
                              : "needApproval"
                          }
                        >
                          {d.status}
                        </p>
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No items found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[8, 10, 15]}
            component="div"
            count={items?.length}
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

export default DonationHistory;
