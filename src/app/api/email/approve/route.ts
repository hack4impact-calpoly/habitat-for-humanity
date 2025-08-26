import { Resend } from "resend";
import { verifyAdmin } from "hooks/verify";
import { NextResponse } from "next/server";
import { TimeSlot } from "components/admin/DonationInfoPage/DonationInfoTab";

export async function POST(req: Request) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 401 });
  }
  const { recipientEmail, donationDetails } = await req.json();
  try {
    const resend = new Resend(process.env.RESEND_API_KEY as string);

    const msg = {
      to: [recipientEmail],
      from: `Habitat for Humanity SLO County <${process.env.RESEND_SENDER_EMAIL as string}>`,
      subject: "DO NOT REPLY - Donation Approved!",
      html: `
            <p>Hi ${donationDetails.name},</p>
    
            <p>Thank you for your generous donation to Habitat for Humanity!</p>
    
            <p>Your donation has been approved for ${donationDetails.type}.</p>
    
            <p><strong>${donationDetails.itemNotes}</strong></p>

            ${
              donationDetails.type === "Pickup" &&
              donationDetails.timeSlots.length > 0
                ? `
                <h3>Available Pick Up Time(s)</h3>
                <ul>
                  ${donationDetails.timeSlots.map((slot: TimeSlot) => `<li>${slot.dayString}: ${slot.timeSlotString}</li>`).join("")}
                </ul>
              `
                : ""
            }
    
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
    };

    await resend.emails.send(msg);
    return NextResponse.json(
      { message: "Approved email sent successfully!" },
      { status: 200 },
    );
  } catch (err) {
    console.error("[EMAIL_APPROVE_SEND_ERROR]", err);
    return NextResponse.json(
      { error: "Failed to send approved email" },
      { status: 400 },
    );
  }
}
