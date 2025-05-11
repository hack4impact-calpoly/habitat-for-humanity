import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";

export async function PUT(req: Request) {
    const { userId } = await req.json();
    try {
        const client = await clerkClient()
        await client.users.updateUserMetadata(userId, {
            publicMetadata: {
                role: "Donor"
            }
        })
        return NextResponse.json({ success: true })
    } catch (err) {
        console.error('[CLERK_UPDATE_ROLE_ERROR]', err);
        return NextResponse.json({ error: 'Failed to update role for Clerk user' }, { status: 500 });
      }
}

