import { NextResponse } from "next/server";
import connect from "../../../../../utils/db";
import Users from "../../../../models/Users";
import { verifyAdmin, verifyDonor } from "hooks/verify";

export async function GET(req: Request) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 401 });
  }

  try {
    await connect();
    const users = await Users.find({ marketingOption: true });

    if (!users) {
      return NextResponse.json({ error: "Users not found" }, { status: 404 });
    }

    return NextResponse.json(users, { status: 200 });
  } catch (err) {
    console.error("[USERS_MARKETING_FETCH_ERROR]", err);
    return NextResponse.json(
      { error: "Failed to fetch user with marketing allowed" },
      { status: 400 },
    );
  }
}
