import { NextResponse } from "next/server";
import connect from "../../../../../utils/db";
import Users from "../../../../models/Users";
import { User } from "@clerk/nextjs/dist/types/server";

type IParams = {
    params: {
        id: string
    }
}


export async function GET(req: Request, { params }: IParams) {
    const { id } = await params;

    try {
        await connect()
        const user = await Users.findOne({id});
        
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json(user, { status: 200 });

    } catch (err) {
        console.error("[USER_FETCH_ERROR]", err);
        return NextResponse.json({ error: "Failed to fetch user" }, { status: 400 });
    }
}

export async function PUT(req: Request, { params}: IParams) {
    const { id } = await params;
    const userData = await req.json()

    try {
        await connect()
        const updatedUser = await Users.findOneAndUpdate(
            { id },
            userData,
            { new: true }
        );
      
        if (!updatedUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
    
        return NextResponse.json({ msg: "User updated", updatedUser });
    } catch (err) {
        console.error("[USER_UPDATE_ERROR]", err);
        return NextResponse.json({ error: "Failed to update user" }, { status: 400 });
    }
}

