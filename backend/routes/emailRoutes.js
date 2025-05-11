const express = require("express");
const router = express.Router();

const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// POST /api/email/sendgrid-attachment
router.post("/sendgrid-attachment", async (req, res) => {
  try {
    const { recipientEmail, donationDetails, scheduledTime, pickupAddress, receiptBase64 } = req.body;

    const msg = {
      to: recipientEmail,
      from: {
        name: "Habitat for Humanity SLO County",
        email: process.env.SENDGRID_SENDER_EMAIL,
      },
      subject: "Donation Approved & Scheduled!",
      html: `
        <p>Hi ${donationDetails.firstName},</p>

        <p>Your donation has been approved and scheduled for pickup.</p>

        <h3>Pickup Details</h3>
        <ul>
          <li><strong>Date and Time:</strong> ${scheduledTime}</li>
          <li><strong>Address:</strong> ${pickupAddress}</li>
        </ul>

        <p><strong>Your digital receipt is attached to this email.</strong></p>

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
          content: receiptBase64,
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
    res.status(200).json({ message: "Email with receipt sent successfully!" });
  } catch (error) {
    console.error("SendGrid error:", error.response?.body || error.message || error);
    res.status(500).json({ error: "Failed to send email." });
  }
});

// POST /api/email/approved-scheduled
router.post("/approved-scheduled", async (req, res) => {
  try {
    const { recipientEmail, donationDetails } = req.body;

    console.log("Email request received:", { recipientEmail, donationDetails });

    const msg = {
      to: recipientEmail,
      from: {
        name: "Habitat for Humanity SLO County",
        email: process.env.SENDGRID_SENDER_EMAIL,
      },
      subject: "Donation Approved & Scheduled",
      html: `
        <p>Hi ${donationDetails.name},</p>
        <p>Your donation has been approved for pickup.</p>

        <h3>Pickup Information</h3>
        <ul>
          <li><strong>Date:</strong> ${donationDetails.date}</li>
          <li><strong>Time:</strong> ${donationDetails.time}</li>
          <li><strong>Location:</strong> ${donationDetails.location}</li>
          <li><strong>Volunteer:</strong> ${donationDetails.volunteer}</li>
        </ul>

        <h3>Digital Receipt</h3>
        <p>Your donation receipt is available in your account and was also generated when you submitted your donation. Please keep it for your records.</p>

        <h3>Habitat for Humanity Contact</h3>
        <ul>
          <li><strong>Phone:</strong> ${donationDetails.phone}</li>
          <li><strong>Email:</strong> ${donationDetails.contactEmail}</li>
          <li><strong>Office Location:</strong> ${donationDetails.officeLocation}</li>
          <li><strong>Office Hours:</strong> ${donationDetails.officeHours}</li>
          <li><strong>Website:</strong> <a href="${donationDetails.website}">${donationDetails.website}</a></li>
        </ul>

        <p>Thank you for your generosity and support!</p>
        <p>- Habitat for Humanity for San Luis Obispo County</p>
      `,
    };

    await sgMail.send(msg);
    res.status(200).json({ message: "Email sent via SendGrid!" });
  } catch (error) {
    console.error(
      "SendGrid error:",
      error.response?.body || error.message || error
    );
    res.status(500).json({ error: "Failed to send email via SendGrid." });
  }
});

module.exports = router;
