import React from "react";
// import Tabs from "@mui/material/Tabs";
// import Tab from "@mui/material/Tab";
// import PropTypes from "prop-types";
// import Typography from "@mui/material/Typography";
// import Box from "@mui/material/Box";
import receiptImage from "./receipt.png";

function ReceiptPage(): JSX.Element {
  return (
    <div
      style={{ display: "flex", justifyContent: "center", paddingTop: "2rem" }}
    >
      <img alt="receipt" src={receiptImage} style={{ width: "80%" }} />
    </div>
  );
}

export default ReceiptPage;
