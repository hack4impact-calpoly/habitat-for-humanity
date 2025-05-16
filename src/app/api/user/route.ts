import { NextResponse } from "next/server";
import connect from "../../../../utils/db";
import Users from "../../../models/Users";

export async function POST(req: Request) {
    try {
        await connect();
        const { id, phone } = await req.json();
        const newUser = new Users({ id, phone });
        await newUser.save();
  
        return NextResponse.json({ msg: `User with id ${id} added to the userDB` });
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error("Error:", message);
        return NextResponse.json({ error: message }, { status: 400 });
    }
  }
