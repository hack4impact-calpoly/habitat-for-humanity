// send rejection email
export async function sendRejectEmail({
  to,
  firstName,
}: {
  to: string;
  firstName: string;
}) {
  try {
    const response = await fetch("http://localhost:3001/api/email/reject", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to,
        firstName,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to send email: ${response.statusText}`);
    }

    console.log("Rejection email successfully sent!");
    return response.json();
  } catch (error) {
    console.error("Error sending rejection email:", error);
    throw error;
  }
}

// send approval email
export async function sendApproveEmail({
  to,
  donationDetails,
}: {
  to: string;
  donationDetails: {
    name: string;
    phone: string;
    contactEmail: string;
    officeLocation: string;
    officeHours: string;
    website: string;
  };
}) {
  try {
    const response = await fetch("http://localhost:3001/api/email/approved-scheduled", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        recipientEmail: to,
        donationDetails,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to send approval email: ${response.statusText}`);
    }

    console.log("Approval email successfully sent!");
    return response.json();
  } catch (error) {
    console.error("Error sending approval email:", error);
    throw error;
  }
}
