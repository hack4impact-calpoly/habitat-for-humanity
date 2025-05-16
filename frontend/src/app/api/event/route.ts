import { NextResponse } from "next/server";
import connect from "../../../../utils/db";
import Events from "models/Events";
import Items from "models/Items";
import Users from "models/Users";
import { clerkClient } from "@clerk/nextjs/server";
import { verifyAdmin } from "hooks/verify";

export async function GET(req: Request) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 401 });
  }
  try {
    await connect();
    const events = await Events.find({});
    return NextResponse.json(events, { status: 200 });
  } catch (err) {
    console.error("[EVENT_FETCH_ERROR]", err);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 400 },
    );
  }
}

export async function POST(req: Request) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 401 });
  }
  const { title, startTime, endTime, itemId } = await req.json();

  try {
    await connect();
    const item = await Items.findOne({ _id: itemId });
    const donor = await Users.findOne({ id: item.donorId });
    const client = await clerkClient();
    const clerkUser = await client.users.getUser(item.donorId);

    const newEvent = new Events({
      title: title,
      startTime: startTime,
      endTime: endTime,
      itemId: itemId,
      address: item.address,
      city: item.city,
      zipCode: item.zipCode,
      donorFirstName: clerkUser.firstName,
      donorLastName: clerkUser.lastName,
      itemName: item.name,
      phone: donor.phone,
    });
    await newEvent.save();
    return NextResponse.json({ msg: `${newEvent} added` }, { status: 200 });
  } catch (err) {
    console.error("[EVENT_POST_ERROR]", err);
    return NextResponse.json(
      { error: "Failed to post event" },
      { status: 400 },
    );
  }
}
