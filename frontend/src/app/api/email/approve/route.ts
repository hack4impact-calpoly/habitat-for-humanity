import * as sgMail from '@sendgrid/mail';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const { recipientEmail, donationDetails } = await req.json();
    try {
        sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

        const msg = {
            to: recipientEmail,
            from: {
            name: "Habitat for Humanity SLO County",
            email: process.env.SENDGRID_SENDER_EMAIL as string,
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
        return NextResponse.json({ message: "Approved email sent successfully!" }, { status: 200 });
    } catch (err) {
        console.error("[EMAIL_APPROV_SEND_ERROR]", err);
        return NextResponse.json({ error: "Failed to post event" }, { status: 400 });
    }
    
}