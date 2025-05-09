import * as sgMail from '@sendgrid/mail';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const { to, firstName, itemNotes } = await req.json();
    try {
        sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

        const msg = {
            to: to,
            from: {
              name: "Habitat for Humanity SLO County",
              email: process.env.SENDGRID_SENDER_EMAIL as string,
            },
            subject: "Donation Rejection Notification",
            html: `
              <p>Hi ${firstName},</p>
          
              <p>Unfortunately, your donation request has been rejected for this reason: <strong>${itemNotes}</strong>. We truly appreciate your generosity and support.</p>
          
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

        await sgMail.send(msg);
        return NextResponse.json({ message: "Rejection email sent successfully!" }, { status: 200 });
    } catch (err) {
        console.error("[EMAIL_REJECT_SEND_ERROR]", err);
        return NextResponse.json({ error: "Failed to post event" }, { status: 400 });
    }
    
}