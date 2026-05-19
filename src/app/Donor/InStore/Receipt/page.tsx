"use client";

import React, { Suspense, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "redux/store";
import { sendReceiptEmail } from "api/email";
import { saveReceipt } from "api/receipt";
import html2canvas from "html2canvas";
import JsPDF from "jspdf";
import Receipt from "components/admin/DonationInfoPage/Receipt/Receipt";
import { User } from "api/user";
import { Item } from "api/item";

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#005B99",
    display: "flex",
    justifyContent: "center",
    fontFamily: "Inter, sans-serif",
  },
  cardWrapper: {
    width: "100%",
    maxWidth: "561px",
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: "50px 46px 48px",
    display: "flex",
    flexDirection: "column" as const,
    gap: "41px",
  },
  zigzag: {
    height: "20px",
    backgroundImage: `
      linear-gradient(135deg, #FFFFFF 33.33%, transparent 33.33%),
      linear-gradient(-135deg, #FFFFFF 33.33%, transparent 33.33%)
    `,
    backgroundSize: "20px 20px",
    backgroundRepeat: "repeat-x" as const,
    backgroundColor: "#005B99",
  },
  heading: {
    fontWeight: 600,
    fontSize: "38px",
    lineHeight: "45px",
    textAlign: "center" as const,
    color: "#68B74C",
    margin: 0,
  },
  divider: {
    border: "none",
    borderTop: "2px dashed rgba(0,0,0,0.3)",
    margin: 0,
  },
  section: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "12px",
  },
  sectionHeading: {
    fontWeight: 600,
    fontSize: "24px",
    color: "#000000",
    margin: 0,
  },
  itemRow: {
    display: "flex",
    flexDirection: "row" as const,
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemText: {
    fontWeight: 500,
    fontSize: "20px",
    color: "#000000",
  },
  bodyText: {
    fontWeight: 500,
    fontSize: "20px",
    color: "#000000",
    margin: 0,
  },
  receiptNotice: {
    fontWeight: 400,
    fontSize: "16px",
    textAlign: "center" as const,
    color: "#000000",
    margin: 0,
  },
  buttonWrapper: {
    display: "flex",
    justifyContent: "center",
  },
  button: {
    backgroundColor: "#005B99",
    color: "#FFFFFF",
    fontFamily: "Inter, sans-serif",
    fontWeight: 600,
    fontSize: "16px",
    padding: "12px 32px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
} as const;

interface DonatedItem {
  name: string;
  estimatedValue: string;
}

function ReceiptContent(): React.ReactNode {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 1. Single selector call for all donor data
  const donorState = useSelector((state: RootState) => state.inStoreDonor);

  // 2. Destructure the specific fields needed for the UI and logic
  const {
    name,
    email,
    phone,
    categories,
    estimatedValue,
    address,
    city,
    state,
    zipCode,
    itemDetails,
    itemId,
  } = donorState;

  // 3. Construct the User object
  const nameParts = name.trim().split(/\s+/);
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ") || "";

  const donorUser: User = {
    id: "",
    firstName,
    lastName,
    email,
    phone,
    address: {
      street: address,
      city,
      state,
      zip: zipCode,
    },
  };

  // 4. Construct the Item object
  const donatedItem: Item = {
    name: categories,
    size: [],
    images: [],
    address,
    city,
    state,
    zipCode,
    scheduling: "InStore",
    timeAvailability: [],
    donorId: "",
    timeSubmitted: new Date(),
    status: "Completed",
    notes: "",
    itemDetails: itemDetails,
    estimatedValue: estimatedValue,
  };

  async function receiptBlob(): Promise<Blob | undefined> {
    const receiptElement = document.getElementById("formalReceiptCapture");
    if (!receiptElement) {
      console.log("ERROR");
      return;
    }

    // 1. Target specific elements to hide
    const elementsToHide = receiptElement.querySelectorAll(
      ".signature-field-flex, button",
    );

    // 2. Set them to display none
    elementsToHide.forEach((el) => {
      if (el instanceof HTMLElement) el.style.display = "none";
    });

    document
      .querySelectorAll(
        ".forFlex input, .signature-field input, .value-div input",
      )
      .forEach((el) => {
        if (el instanceof HTMLElement) {
          el.style.backgroundColor = "transparent";
        }
      });
    const canvas = await html2canvas(receiptElement, { scale: 5 });
    const imgData = canvas.toDataURL("image/jpeg");
    const pdfDOC = new JsPDF();
    const pdfWidth = pdfDOC.internal.pageSize.getWidth();
    const pdfHeight = pdfDOC.internal.pageSize.getHeight();

    // Get image properties
    const imgProps = pdfDOC.getImageProperties(imgData);
    const imgWidth = imgProps.width;
    const imgHeight = imgProps.height;

    // Calculate scale factor to preserve aspect ratio
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const scaledWidth = imgWidth * ratio;
    const scaledHeight = imgHeight * ratio;

    pdfDOC.addImage(imgData, "JPEG", 0, 0, scaledWidth, scaledHeight);

    const pdfBlob = pdfDOC.output("blob");
    return pdfBlob;
  }

  async function sendReceiptEmails() {
    const receipt = await receiptBlob();
    if (!receipt) {
      console.log("Failed to create receipt blob");
      return;
    }
    try {
      //note, currently have the emails just sent to 'h4ih4h@gmail.com' due to RESEND not accepting any other email in test mode,
      //this needs to be changed later so that users can get their receipt emails
      await sendReceiptEmail({
        to: "h4ih4h@gmail.com", //replace with email var (contains the user email)
        donationDetails: {
          name: name,
          phone: phone,
          contactEmail: "h4ih4h@gmail.com",
          officeLocation: "2790 Broad St, San Luis Obispo, CA 93401",
          officeHours: "Tuesday - Saturday, 10AM - 5PM",
          website: "https://www.habitatslo.org",
        },
        receipt: receipt,
      });
      console.log("Donor Email sent");
      await sendReceiptEmail({
        to: "h4ih4h@gmail.com", //replace with admin email
        donationDetails: {
          name: name,
          phone: phone,
          contactEmail: "h4ih4h@gmail.com",
          officeLocation: "2790 Broad St, San Luis Obispo, CA 93401",
          officeHours: "Tuesday - Saturday, 10AM - 5PM",
          website: "https://www.habitatslo.org",
        },
        receipt: receipt,
      });
      console.log("Admin email sent");
    } catch (error) {
      console.error("Error, receipts failed to send", error);
    }

    if (itemId) {
      try {
        await saveReceipt(receipt, itemId);
        console.log("Receipt saved to DB");
      } catch (error) {
        console.error("Error saving receipt to DB", error);
      }
    }
  }

  useEffect(() => {
    if (!email || categories.length === 0) return;

    //gives enough time for the html2canvas to screenshot dom
    const timer = setTimeout(() => {
      sendReceiptEmails();
    }, 300);

    return () => clearTimeout(timer);
  }, [email, categories]);

  return (
    <>
      <div id="receiptPage" style={styles.page}>
        <div style={styles.cardWrapper}>
          <div style={styles.card}>
            <h1 style={styles.heading}>Donation Complete!</h1>

            <hr style={styles.divider} />

            {/* Items */}
            <div style={styles.section}>
              <h2 style={styles.sectionHeading}>Items</h2>
              {categories.map((item, idx) => (
                <div key={idx} style={styles.itemRow}>
                  <span style={styles.itemText}>{item}</span>
                </div>
              ))}
              {itemDetails && (
                <p
                  style={{
                    ...styles.bodyText,
                    fontSize: "16px",
                    color: "#444",
                    marginTop: "8px",
                  }}
                >
                  {itemDetails}
                </p>
              )}
            </div>

            <hr style={styles.divider} />

            {/* Estimated Value */}
            <div style={styles.section}>
              <h2 style={styles.sectionHeading}>Estimated Value</h2>
              <p style={styles.bodyText}>${estimatedValue}</p>
            </div>

            <hr style={styles.divider} />

            {/* Contact */}
            <div style={styles.section}>
              <h2 style={styles.sectionHeading}>Contact</h2>
              <p style={styles.bodyText}>
                {name}
                <br />
                {phone}
                <br />
                {email}
              </p>
            </div>

            <p style={styles.receiptNotice}>Receipt sent to {email}</p>

            <div style={styles.buttonWrapper}>
              <button
                type="button"
                style={styles.button}
                onClick={() => router.push("/Donor/InStore/Donate")}
              >
                Return to Homepage
              </button>
            </div>
          </div>
          <div style={styles.zigzag} />
        </div>
      </div>
      <div
        id="formalReceiptCapture"
        style={{
          position: "absolute",
          top: "-9999px",
          left: "-9999px",
          width: "1190px",
        }}
      >
        <Receipt donor={donorUser} item={donatedItem} events={[]} />
      </div>
    </>
  );
}

export default function InStoreReceiptPage(): React.ReactNode {
  return (
    <Suspense>
      <ReceiptContent />
    </Suspense>
  );
}
