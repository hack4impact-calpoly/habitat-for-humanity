const express = require("express");
require("dotenv").config();
const multer = require("multer");
const nodemailer = require("nodemailer");
const sgMail = require("@sendgrid/mail");

const router = express.Router();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/* ---------------------- Nodemailer Routes ---------------------- */

// POST /api/email/
router.post("/", async (req, res) => {
  try {
    const { recipientEmail, subject, body, isHTML } = req.body;

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.email_address,
        pass: process.env.email_password,
      },
    });

    const mailOptions = {
      from: process.env.email_address,
      to: recipientEmail,
      subject,
      ...(isHTML ? { html: body } : { text: body }),
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Custom email sent successfully" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "An error occurred while sending the custom email" });
  }
});

// POST /api/email/attach-files
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/attach-files", upload.array("attachments"), async (req, res) => {
  try {
    const { recipientEmail, subject, body, isHTML } = req.body;
    const attachments = req.files;

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.email_address,
        pass: process.env.email_password,
      },
    });

    const mailOptions = {
      from: process.env.email_address,
      to: recipientEmail,
      subject,
      ...(isHTML === "true" ? { html: body } : { text: body }),
      attachments: attachments.map((file) => ({
        filename: file.originalname,
        content: file.buffer,
        contentType: file.mimetype,
      })),
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Custom email sent successfully" });
  } catch (error) {
    console.error("Email send error:", error);
    res
      .status(500)
      .json({ error: "An error occurred while sending the custom email" });
  }
});

// router.post("/attach-files", upload.array("attachments"), async (req, res) => {
//   try {
//     const { recipientEmail, subject, body, isHTML } = req.body;
//     const attachments = req.files;

//     const transporter = nodemailer.createTransport({
//       service: "Gmail",
//       auth: {
//         user: process.env.email_address,
//         pass: process.env.email_password,
//       },
//     });

//     const mailOptions = {
//       from: process.env.email_address,
//       to: recipientEmail,
//       subject: subject,
//       ...(isHTML ? { html: body } : { text: body }),
//       attachments: attachments.map((attachment) => ({
//         filename: attachment.originalname,
//         content: attachment.buffer,
//         contentType: attachment.mimetype,
//       })),
//     };

//     await transporter.sendMail(mailOptions);
//     res.status(200).json({ message: "Custom email sent successfully" });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: "An error occurred while sending the custom email" });
//   }
// });

/* ---------------------- SendGrid Route ---------------------- */

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

router.post("/sendgrid-attachment", async (req, res) => {
  try {
    const { recipientEmail, subject, body, pdfBase64, filename } = req.body;

    const msg = {
      to: recipientEmail,
      from: {
        name: "Habitat for Humanity SLO County",
        email: process.env.SENDGRID_SENDER_EMAIL,
      },
      subject,
      html: body,
      attachments: [
        {
          content: pdfBase64,
          filename,
          type: "application/pdf",
          disposition: "attachment",
        },
      ],
    };

    await sgMail.send(msg);
    res.status(200).json({ message: "SendGrid email with PDF sent!" });
  } catch (error) {
    console.error("SendGrid error:", error.response?.body || error.message);
    res.status(500).json({ error: "SendGrid email failed" });
  }
});

module.exports = router;
module.exports = router;
