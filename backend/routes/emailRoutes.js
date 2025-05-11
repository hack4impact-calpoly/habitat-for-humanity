const express = require("express");
const router = express.Router();
const multer = require("multer");
const nodemailer = require("nodemailer");
const sgMail = require("@sendgrid/mail");

require("dotenv").config();
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
      subject: subject,
      ...(isHTML ? { html: body } : { text: body }),
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Custom email sent successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred while sending the custom email" });
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
      subject: subject,
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
    res.status(500).json({ error: "An error occurred while sending the custom email" });
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

    const msg = {
      to: recipientEmail,
      from: {
        name: "Habitat for Humanity SLO County",
        email: process.env.SENDGRID_SENDER_EMAIL,
      },
      subject: "Donation Approved!",
      html: `
        <p>Hi ${donationDetails.name},</p>

        <p>Thank you for your generous donation to Habitat for Humanity!</p>

        <p>Your donation has been approved.</p>

        <p><strong>${donationDetails.itemNotes}</strong></p>

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
      trackingSettings: {
        clickTracking: {
          enable: false,
          enableText: false,
        },
      },
    };

    await sgMail.send(msg);
    res.status(200).json({ message: "Approval email sent successfully!" });
  } catch (error) {
    console.error("SendGrid error:", error.response?.body || error.message || error);
    res.status(500).json({ error: "Failed to send approval email." });
  }
});

// POST /api/email/reject
router.post("/reject", async (req, res) => {
  try {
    const { to, firstName, itemNotes } = req.body;

    const msg = {
      to: to,
      from: {
        name: "Habitat for Humanity SLO County",
        email: process.env.SENDGRID_SENDER_EMAIL,
      },
      subject: "Donation Rejection Notification",
      html: `
        <p>Hi ${firstName},</p>
    
        <p>Unfortunately, your donation request has been rejected for this reason: ${itemNotes}. We truly appreciate your generosity and support.</p>
    
        <p>If you have any questions, please contact us:</p>
        <ul>
          <li><strong>Phone:</strong> (805) 546-8699</li>
          <li><strong>Email:</strong> restoreslo@habitatslo.org</li>
          <li><strong>Location:</strong> 2790 Broad St, San Luis Obispo, CA 93401</li>
          <li><strong>Hours:</strong> Tuesday - Saturday, 10AM - 5PM</li>
          <li><strong>Website:</strong> <a href="https://www.habitatslo.org" target="_blank" rel="noopener noreferrer">habitatslo.org</a></li>
        </ul>
    
        <p>Thank you for thinking of us!</p>
        <p>- Habitat for Humanity Team</p>
      `,
      trackingSettings: {
        clickTracking: {
          enable: false,
          enableText: false,
        },
      },
    };
     
    console.log("🚀 Sending rejection email:", msg);
    await sgMail.send(msg);
    res.status(200).json({ message: "Rejection email sent via SendGrid!" });
  } catch (error) {
    console.error("SendGrid error:", error.response?.body || error.message || error);
    res.status(500).json({ 
      message: "Failed to send rejection email",
      details: error.response?.body || error.message || error
    });
  }
  
});

module.exports = router;