const express = require("express");
const nodemailer = require("nodemailer");
const multer = require("multer");
const router = express.Router()

require("dotenv/config")

// POST /api/email/
router.post('/', async (req, res) => {
  try {
    const { recipientEmail, subject, body, isHTML } = req.body;

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.email_address,
        pass: process.env.email_password,
      },
    });

    let mailOptions = ''
    // Prepare the email message
    if (isHTML) {
      mailOptions = {
        from: process.env.email_address,
        to: recipientEmail,
        subject: subject ,
        html: body, // Use the provided body as HTML
      };
    } else {
      mailOptions = {
        from: process.env.email_address,
        to: recipientEmail,
        subject: subject ,
        text: body, // Use the provided body as plain text
      };
    }

    // Send the email
    await transporter.sendMail(mailOptions);
    
    res.status(200).json({ message: 'Custom email sent successfully' }); // Return a success response
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'An error occurred while sending the custom email' }); // Return an error response
  }
});


// POST /api/email/attach-files
const storage = multer.memoryStorage(); // Create a Multer storage configuration
const upload = multer({ storage });

router.post('/attach-files', upload.array('attachments'), async (req, res) => {
  try {
    const { recipientEmail, subject, body, isHTML } = req.body;
    const attachments = req.files;

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.email_address,
        pass: process.env.email_password,
      },
    });

    let mailOptions = '';
    // Prepare the email message
    if (isHTML) {
      mailOptions = {
        from: process.env.email_address,
        to: recipientEmail,
        subject: subject,
        html: body, // Use the provided body as HTML
        attachments: attachments.map((attachment) => ({
          filename: attachment.originalname,
          content: attachment.buffer,
          contentType: attachment.mimetype,
        })),
      };
    } else {
      mailOptions = {
        from: process.env.email_address,
        to: recipientEmail,
        subject: subject,
        text: body, // Use the provided body as plain text
        attachments: attachments.map((attachment) => ({
          filename: attachment.originalname,
          content: attachment.buffer,
          contentType: attachment.mimetype,
        })),
      };
    }

    // Send the email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Custom email sent successfully' }); // Return a success response
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'An error occurred while sending the custom email' }); // Return an error response
  }
});

// POST /api/email/donation-approved-scheduled
router.post('/donation-approved-scheduled', async (req, res) => {
  try {
    const { recipientEmail, donationDetails } = req.body;

    // Create a Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.email_address,
        pass: process.env.email_password,
      },
    });

    // Prepare the email message
    const mailOptions = {
      from: process.env.email_address,
      to: recipientEmail,
      subject: 'Donation Approved & Scheduled',
      html: `<p>${donationDetails.name},</p>
             <p>Thank you for your donation!</p>
             <p>Your donation has been approved and scheduled for pickup or drop-off. Here are the details:</p>
             <ul>
               <li>Date: ${donationDetails.date}</li>
               <li>Time: ${donationDetails.time}</li>
               <li>Location: ${donationDetails.location}</li>
             </ul>
             <p>Thank you for your contribution!</p>`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    // Return a success response
    res.status(200).json({ message: 'Donation approval and schedule email sent successfully' });
  } catch (error) {
    console.error('Error sending donation approval and schedule email:', error);
    // Return an error response
    res.status(500).json({ error: 'An error occurred while sending the donation approval and schedule email' });
  }
});

module.exports = router