import React, { useState, useEffect } from "react";
import { Item, updateItem } from "api/item";
import { User } from "api/user";
import { Event } from "api/event";
import Image from "next/image";
import html2canvas from "html2canvas";
import JsPDF from "jspdf";
import moment from "moment";
import { saveOrUpdateReceipt } from "api/receipt";
require("../../../../App.css");

interface ReceiptTabProps {
  item: Item;
  donor: User;
  events: Event[];
}
function Receipt(props: ReceiptTabProps): React.ReactNode {
  const { item, donor } = props;
  const fullName = `${donor?.firstName} ${donor?.lastName}`;
  const fullZip = `${item?.city}, California ${item?.zipCode}`;
  const [contract, setContract] = useState({
    donationFor: fullName ?? "",
    firstName: donor?.firstName ?? "",
    lastName: donor?.lastName ?? "",
    businessName: "",
    address: item?.address ?? "",
    cityStateZipcode: fullZip ?? "",
    phone: donor?.phone ?? "",
    cell: "",
    email: donor?.email ?? "",
    donatedItems: item?.name.join(", ") ?? "",
    itemDetails: item?.itemDetails ?? "",
    value: item?.estimatedValue ?? "",
    signature: "",
    date: moment().format("MM/DD/YYYY"),
  });

  useEffect(() => {
    setContract((prevContract) => ({
      ...prevContract,
      donationFor: fullName ?? "",
      firstName: donor?.firstName ?? "",
      lastName: donor?.lastName ?? "",
      email: donor?.email ?? "",
      phone: donor?.phone ?? "",
      address: item?.address ?? "",
      cityStateZipcode: fullZip ?? "",
      donatedItems: item?.name.join(", ") ?? "",
      itemDetails: item?.itemDetails ?? "",
      value: item?.estimatedValue ?? "",
    }));
  }, [props]);

  const exportPdf = async (id: string) => {
    if (contract.value !== item.estimatedValue) {
      await updateItem({
        ...item,
        estimatedValue: contract.value,
      });
    }

    const input = document.getElementById(id);
    document
      .querySelectorAll(
        ".forFlex input, .signature-field input, .value-div input",
      )
      .forEach((el) => {
        if (el instanceof HTMLElement) el.style.backgroundColor = "transparent";
      });

    const canvas = await html2canvas(input!, { scale: 5 });
    const imgData = canvas.toDataURL("image/jpeg");
    const pdfDOC = new JsPDF();
    const pdfWidth = pdfDOC.internal.pageSize.getWidth();
    const pdfHeight = pdfDOC.internal.pageSize.getHeight();
    const imgProps = pdfDOC.getImageProperties(imgData);
    const imgWidth = imgProps.width;
    const imgHeight = imgProps.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const scaledWidth = imgWidth * ratio;
    const scaledHeight = imgHeight * ratio;
    pdfDOC.addImage(imgData, "JPEG", 0, 0, scaledWidth, scaledHeight);

    // Save to DB
    const pdfBlob = pdfDOC.output("blob");
    await saveOrUpdateReceipt(pdfBlob, item._id!);

    pdfDOC.save(
      `${contract.firstName}_${contract.lastName}_${contract.date}_receipt.pdf`,
    );

    document
      .querySelectorAll(
        ".forFlex input, .signature-field input, .value-div input",
      )
      .forEach((el) => {
        if (el instanceof HTMLElement) el.style.backgroundColor = "#d5f7ff";
      });
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div id="receiptPage" style={{ padding: "5%", maxWidth: "1190px" }}>
          <div id="receipt">
            <div className="head">
              <img
                alt="receipt"
                src="/images/logo.png"
                style={{
                  width: "25%",
                  height: "auto",
                  objectFit: "contain",
                  objectPosition: "left",
                  display: "block", // optional: remove inline gap
                }}
                width={445}
                height={148}
              />
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
                  <div style={{ display: "flex", width: "100%" }}>
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
                  <div style={{ display: "flex", width: "100%" }}>
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
                    style={{ width: "100%", padding: "0.5rem", resize: "none" }}
                    value={contract.donatedItems}
                    onChange={(event) =>
                      setContract((prevContract) => ({
                        ...prevContract,
                        donatedItems: event.target.value,
                      }))
                    }
                  />
                </div>
                <h2>Item Details</h2>
                <div className="form-field">
                  <textarea
                    rows={4}
                    style={{ width: "100%", padding: "0.5rem", resize: "none" }}
                    value={contract.itemDetails}
                    onChange={(event) =>
                      setContract((prevContract) => ({
                        ...prevContract,
                        itemDetails: event.target.value,
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
                      style={{ backgroundColor: "#d5f7ff" }}
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
                renovates homes to improve communities by partnering with
                families in need. Your gift will go to build homes or provide
                funds to build houses for families in our count.
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
      </div>
    </div>
  );
}
export default Receipt;
