import React, { useState, useEffect } from "react";
import { Item } from "api/item";
import { User } from "api/user";
import html2canvas from "html2canvas";
import JsPDF from "jspdf";
import moment from "moment";
require("../../../../App.css");

const logo = "/images/logo.png";

const exportPdf = async (id: string): Promise<void> => {
  const input = document.getElementById(id);
  if (!input) return;
  const canvas = await html2canvas(input, { scale: 5 });
  const imgData = canvas.toDataURL("image/jpeg");
  const pdfDOC = new JsPDF();
  const width = pdfDOC.internal.pageSize.getWidth();
  const height = pdfDOC.internal.pageSize.getHeight();
  pdfDOC.addImage(imgData, "JPEG", 0, height / 50, width, height * 0.75);
  pdfDOC.save("receipt.pdf");
};

interface ReceiptTabProps {
  item: Item;
  donor: User;
}

// filler values for volunteer
const volunteerName = "Jane";
const volunteerEmail = "jane@gmail.com";

const habitatContact = {
  phone: "(805) 546-8699",
  email: "restoreslo@habitatslo.org",
  location: "2790 Broad St, San Luis Obispo, CA 93401",
  hours: "Tuesday-Saturday 10AM-5PM",
  website: "https://www.habitatslo.org/",
};

function Receipt(props: ReceiptTabProps): React.ReactNode {
  const { item, donor } = props;

  const fullName = `${donor?.firstName ?? ""} ${donor?.lastName ?? ""}`;
  const fullZip = `${item?.city ?? ""}, California ${item?.zipCode ?? ""}`;

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
    donatedItems: item?.name ?? "",
    value: "",
    signature: "",
    date: moment().format("MM/DD/YYYY"),
    pickupTime: moment().format("h:mm A"),
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
      donatedItems: item?.name ?? "",
    }));
  }, [props]);

  const sendEmailReceipt = async () => {
    try {
      const input = document.getElementById("receiptPage");
      if (!input) return;

      const canvas = await html2canvas(input, { scale: 5 });
      const imgData = canvas.toDataURL("image/jpeg");
      const pdf = new JsPDF();
      const width = pdf.internal.pageSize.getWidth();
      const height = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, "JPEG", 0, height / 50, width, height * 0.75);

      const pdfBase64 = pdf.output("datauristring").split(",")[1];

      const bodyForDonor = `Hi ${contract.firstName}, <br />
    
     <br />Your donation has been approved.<br />
    
     <ul>
     <li><strong>Date:</strong> ${contract.date}</li>
     <li><strong>Time:</strong> ${contract.pickupTime}</li>
     <li><strong>Location:</strong> ${contract.address}, ${contract.cityStateZipcode}</li>
     <li><strong>Volunteer:</strong> ${volunteerName}</li>
     </ul>
    
     <p><strong>Digital Receipt</strong> is attached to this email.</p>
    
     <h3>Habitat for Humanity Contact</h3>

     <ul>
     <li><strong>Phone:</strong> ${habitatContact.phone}</li>
     <li><strong>Email:</strong> ${habitatContact.email}</li>
     <li><strong>Location:</strong> ${habitatContact.location}</li>
     <li><strong>Hours:</strong> ${habitatContact.hours}</li>
     <li><strong>Website:</strong> ${habitatContact.website}</li>
     </ul>`;

      const bodyForVolunteer = `Hi ${volunteerName}, <br />
     <br />You are scheduled to assist with a donation pickup.<br />
    
     <ul>
     <li><strong>Donor:</strong> ${contract.firstName} ${contract.lastName}</li>
     <li><strong>Phone:</strong> ${contract.phone}</li>
     <li><strong>Date:</strong> ${contract.date}</li>
     <li><strong>Time:</strong> ${contract.pickupTime}</li>
     <li><strong>Address:</strong> ${contract.address}, ${contract.cityStateZipcode}</li>
    
     </ul>
    
     <p><strong>Digital Receipt</strong> is attached to this email.</p>
    
     <h3>Habitat for Humanity Contact</h3>

     <ul>
     <li><strong>Phone:</strong> ${habitatContact.phone}</li>
     <li><strong>Email:</strong> ${habitatContact.email}</li>
     <li><strong>Location:</strong> ${habitatContact.location}</li>
     <li><strong>Hours:</strong> ${habitatContact.hours}</li>
     <li><strong>Website:</strong> ${habitatContact.website}</li>
     </ul>`;

      const sendEmail = async (recipientEmail: string, body: string) => {
        await fetch("http://localhost:3001/api/email/sendgrid-attachment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            recipientEmail,
            subject: "Donation Receipt",
            body,
            pdfBase64,
            filename: "receipt.pdf",
          }),
        });
      };

      await sendEmail(contract.email, bodyForDonor);
      await sendEmail(volunteerEmail, bodyForVolunteer);

      alert("Emails sent to donor and volunteer with PDF attachment.");
    } catch (error) {
      console.error("SendGrid email error:", error);
      alert("Failed to send email.");
    }
  };

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
          onClick={sendEmailReceipt}
        >
          Send Email Receipt
        </button>
      </div>
    </div>
  );
}

export default Receipt;
