import * as sgMail from "@sendgrid/mail";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const formData = await req.formData();
  const recipientEmail = formData.get("to") as string;
  const donationDetails = JSON.parse(formData.get("donationDetails") as string);
  const receipt = formData.get("receipt") as File;

  try {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

    const attachment = await receipt.arrayBuffer();
    const attachmentBase64 = Buffer.from(attachment).toString("base64");

    const msg = {
      to: recipientEmail,
      from: {
        name: "Habitat for Humanity SLO County",
        email: process.env.SENDGRID_SENDER_EMAIL as string,
      },
      subject: "Donation Receipt",
      html: `
            <p>Hi ${donationDetails.name},</p>
    
            <p>Thank you for your generous donation to Habitat for Humanity! Attached is your receipt.</p>
    
            <h3>Habitat for Humanity Contact Information</h3>
            <ul>
                <li><strong>Phone:</strong> ${donationDetails.phone}</li>
                <li><strong>Email:</strong> ${donationDetails.contactEmail}</li>
                <li><strong>Office Location:</strong> ${donationDetails.officeLocation}</li>
                <li><strong>Office Hours:</strong> ${donationDetails.officeHours}</li>
                <li><strong>Website:</strong> <a href="${donationDetails.website}" target="_blank" rel="noopener noreferrer">${donationDetails.website}</a></li>
            </ul>
    
            <p>Thank you again for supporting our mission!</p>
            <p>- Habitat for Humanity for San Luis Obispo County</p>
            `,
      attachments: [
        {
          content: attachmentBase64,
          filename: "receipt.pdf",
          type: "application/pdf",
          disposition: "attachment",
        },
      ],
      trackingSettings: {
        clickTracking: {
          enable: false,
          enableText: false,
        },
      },
    };

    await sgMail.send(msg);
    return NextResponse.json(
      { message: "Receipt email sent successfully!" },
      { status: 200 },
    );
  } catch (err) {
    console.error("[EMAIL_RECEIPT_SEND_ERROR]", err);
    return NextResponse.json(
      { error: "Failed to send receipt" },
      { status: 400 },
    );
  }
}
