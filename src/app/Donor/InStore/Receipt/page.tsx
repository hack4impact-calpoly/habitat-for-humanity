"use client";

import React, { Suspense, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "redux/store";
import { sendReceiptEmail } from "api/email";
import html2canvas from "html2canvas";
import JsPDF from "jspdf";

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

  const { name, email, phone, categories, estimatedValue } = useSelector(
    (state: RootState) => ({
      name: state.inStoreDonor.name,
      email: state.inStoreDonor.email,
      phone: state.inStoreDonor.phone,
      categories: state.inStoreDonor.categories,
      estimatedValue: state.inStoreDonor.estimatedValue,
    }),
  );

  let items: DonatedItem[] = [];
  try {
    const raw = searchParams.get("items");
    if (raw) items = JSON.parse(raw) as DonatedItem[];
  } catch {
    items = [];
  }

  async function receiptBlob(): Promise<Blob | undefined> {
    const receiptElement = document.getElementById("receiptPage");
    if (!receiptElement) {
      console.log("ERROR");
      return;
    }
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
        to: 'h4ih4h@gmail.com', //replace with email var (contains the user email)
        donationDetails: {
          name: name,
          phone: phone,
          contactEmail: 'h4ih4h@gmail.com',
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
          contactEmail: 'h4ih4h@gmail.com',
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
    <div id = "receiptPage" style={styles.page}>
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
  );
}

export default function InStoreReceiptPage(): React.ReactNode {
  return (
    <Suspense>
      <ReceiptContent />
    </Suspense>
  );
}
