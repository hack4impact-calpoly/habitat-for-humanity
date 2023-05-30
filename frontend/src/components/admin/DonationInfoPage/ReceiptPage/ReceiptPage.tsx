import React, { useState } from "react";

import html2canvas from "html2canvas";
import JsPDF from "jspdf";

import logo from "./logo.png";

// import Tabs from "@mui/material/Tabs";
// import Tab from "@mui/material/Tab";
// import PropTypes from "prop-types";
// import Typography from "@mui/material/Typography";
// import Box from "@mui/material/Box";
require("./ReceiptPage.css");

const exportPdf = (id: string) => {
  const input = document.getElementById(id);

  html2canvas(input!, { scale: 5 }).then(
    (canvas: { toDataURL: (arg0: string) => any }) => {
      const imgData = canvas.toDataURL("image/jpeg");
      const pdfDOC = new JsPDF();

      const width = pdfDOC.internal.pageSize.getWidth();
      const height = pdfDOC.internal.pageSize.getHeight();

      pdfDOC.addImage(imgData, "JPEG", 0, 0, width, height);
      pdfDOC.save("receipt.pdf");
    }
  );
};

function ReceiptPage(): JSX.Element {
  const [contract, setContract] = useState({
    donationFor: "",
    firstName: "",
    lastName: "",
    businessName: "",
    address: "",
    cityStateZipcode: "",
    phone: "",
    cell: "",
    email: "",
    donatedItems: "",
    value: "",
    signature: "",
    date: "",
  });
  return (
    <div>
      <div id="receiptPage" style={{ padding: "5%" }}>
        <div id="receipt">
          <div className="head">
            <img alt="receipt" src={logo} />
            <div className="logo-input">
              <div className="header">
                <h1>Donation Receipt</h1>
              </div>
              <div className="forFlex">
                <div style={{ display: "flex", flex: 1 }}>
                  <h2>For</h2>
                  <input
                    type="text"
                    name="donationFor"
                    value={contract.donationFor}
                    onChange={(event) =>
                      setContract((prevContract) => ({
                        ...prevContract,
                        donationFor: event.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="form-body">
            <div className="form-section">
              <h2>Personal Information</h2>
              <div className="form-field">
                <div style={{ display: "flex", width: "50%" }}>
                  <h4>First Name:</h4>
                  <input
                    type="text"
                    name="firstName"
                    value={contract.firstName}
                    onChange={(event) =>
                      setContract((prevContract) => ({
                        ...prevContract,
                        firstName: event.target.value,
                      }))
                    }
                  />
                </div>
                <div style={{ display: "flex", width: "50%" }}>
                  <h4>Last Name:</h4>
                  <input
                    type="text"
                    name="lastName"
                    value={contract.lastName}
                    onChange={(event) =>
                      setContract((prevContract) => ({
                        ...prevContract,
                        lastName: event.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <div className="form-field">
                <div style={{ display: "flex", flex: 1 }}>
                  <h4>Business Name:</h4>
                  <input
                    id="businessName"
                    type="text"
                    name="businessName"
                    value={contract.businessName}
                    onChange={(event) =>
                      setContract((prevContract) => ({
                        ...prevContract,
                        businessName: event.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <div className="form-field">
                <div style={{ display: "flex" }}>
                  <h4>Address:</h4>
                  <input
                    type="text"
                    name="address"
                    value={contract.address}
                    onChange={(event) =>
                      setContract((prevContract) => ({
                        ...prevContract,
                        address: event.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <div className="form-field">
                <div style={{ display: "flex", flex: 1 }}>
                  <h4>City, State, Zipcode:</h4>
                  <input
                    type="text"
                    name="cityStateZipcode"
                    value={contract.cityStateZipcode}
                    onChange={(event) =>
                      setContract((prevContract) => ({
                        ...prevContract,
                        cityStateZipcode: event.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <div className="form-field">
                <div style={{ display: "flex", width: "50%" }}>
                  <h4>Phone:</h4>
                  <input
                    type="text"
                    name="phone"
                    value={contract.phone}
                    onChange={(event) =>
                      setContract((prevContract) => ({
                        ...prevContract,
                        phone: event.target.value,
                      }))
                    }
                  />
                </div>
                <div style={{ display: "flex", width: "50%" }}>
                  <h4>Cell:</h4>
                  <input
                    type="text"
                    name="cell"
                    value={contract.cell}
                    onChange={(event) =>
                      setContract((prevContract) => ({
                        ...prevContract,
                        cell: event.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <div className="form-field">
                <div style={{ display: "flex", flex: 1 }}>
                  <h4>Email Address:</h4>
                  <input
                    type="text"
                    name="email"
                    value={contract.email}
                    onChange={(event) =>
                      setContract((prevContract) => ({
                        ...prevContract,
                        email: event.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <h2>Donated Items</h2>
              <div className="form-field">
                <textarea
                  rows={4}
                  style={{ width: "100%", padding: "0.5rem" }}
                  value={contract.donatedItems}
                  onChange={(event) =>
                    setContract((prevContract) => ({
                      ...prevContract,
                      donatedItems: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="value-div">
                <div className="form-field">
                  <div style={{ display: "flex", flexDirection: "row" }}>
                    <h4>Value: </h4>
                    <h3 style={{ margin: 0, marginRight: -5, marginLeft: 5 }}>
                      $
                    </h3>
                  </div>
                  <input
                    type="text"
                    name="value"
                    value={contract.value}
                    onChange={(event) =>
                      setContract((prevContract) => ({
                        ...prevContract,
                        value: event.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            </div>
            <h2>
              Habitat for Humanity for San Luis Obispo County thanks you for
              your donation. Your generosity is appreciated!
            </h2>
            <h2>
              Habitat for Humanity for San Luis Obispo County builds and
              renovates homes to improve communities by partnering with families
              in need. Your gift will go to build homes or provide funds to
              build houses for families in our count.
            </h2>
            <div className="signature-field-flex">
              <div className="signature-field">
                <input
                  type="text"
                  name="signature"
                  value={contract.signature}
                  onChange={(event) =>
                    setContract((prevContract) => ({
                      ...prevContract,
                      signature: event.target.value,
                    }))
                  }
                />
                <h4 style={{ marginLeft: "0.5rem", marginTop: "0.5rem" }}>
                  Authorizing Signature
                </h4>
              </div>
              <div className="signature-field">
                <input
                  type="text"
                  name="date"
                  value={contract.date}
                  onChange={(event) =>
                    setContract((prevContract) => ({
                      ...prevContract,
                      date: event.target.value,
                    }))
                  }
                />
                <h4 style={{ marginLeft: "0.5rem", marginTop: "0.5rem" }}>
                  Date
                </h4>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "right",
        }}
      >
        <button
          style={{
            color: "#FFFFFF",
            backgroundColor: "#04B2D9",
            padding: "10px 15px",
            margin: "5px",
            fontFamily: "Rubik",
            fontSize: "16px",
            border: "2px solid #04B2D9",
            cursor: "pointer",
          }}
          type="button"
          onClick={() => exportPdf("receiptPage")}
        >
          Save Receipt PDF
        </button>
        <button
          style={{
            color: "#FFFFFF",
            backgroundColor: "#04B2D9",
            padding: "10px 15px",
            margin: "5px",
            fontFamily: "Rubik",
            fontSize: "16px",
            border: "2px solid #04B2D9",
            cursor: "pointer",
          }}
          type="button"
        >
          Send Email Receipt
        </button>
      </div>
    </div>
  );
}

export default ReceiptPage;
