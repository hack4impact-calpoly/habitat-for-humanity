const emailURL: string = "/api/email"

// send rejection email
export async function sendRejectEmail({
  to,
  firstName,
  itemNotes,
}: {
  to: string;
  firstName: string;
  itemNotes: string;
}) {
  try {
    const response = await fetch(`${emailURL}/reject`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to,
        firstName,
        itemNotes,
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
    itemNotes: string;
  };
}) {
  try {
    const response = await fetch(`${emailURL}/approve`, {
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
