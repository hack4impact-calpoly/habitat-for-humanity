import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";

type IParams = {
    params: {
        id: string
    }
}


export async function GET(req: Request, { params }: IParams) {
    const { id } = await params;

    try {
        const client = await clerkClient()
        const user = await client.users.getUser(id)
        const { firstName, lastName, primaryEmailAddress } = user;
        return NextResponse.json({ firstName, lastName, email: primaryEmailAddress?.emailAddress}, { status: 200 })
    } catch (err) {
        console.error('[CLERK_FETCH_ERROR]', err);
        return NextResponse.json({ error: 'Failed to fetch Clerk user' }, { status: 500 });
      }
}

export async function PUT(req: Request, { params }: IParams) {
    const { id } = await params;
    const userInfo = await req.json();
    try {
        const client = await clerkClient();
        const updatedUser = await client.users.updateUser(id, userInfo)
        return NextResponse.json({
            msg: `Updated user "${id}" with new info:`,
            updatedUser,
          });
    } catch (err) {
        console.error('[CLERK_UPDATE_ERROR]', err);
        return NextResponse.json({ error: 'Failed to update Clerk user' }, { status: 500 });
    }
}

