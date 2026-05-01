import { NextResponse } from "next/server";
import connect from "../../../../utils/db";
import Items from "../../../models/Items";
import { verifyAdmin, verifyDonor, verifyInStore } from "hooks/verify";

export async function POST(req: Request) {
  if (!((await verifyAdmin()) || (await verifyDonor()) || (await verifyInStore()))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 401 });
  }
  const item = await req.json();

  try {
    await connect();
    const newItem = new Items(item);
    await newItem.save();
    return NextResponse.json({ msg: `${newItem} added` }, { status: 200 });
  } catch (err) {
    console.error("[ITEM_POST_ERROR]", err);
    return NextResponse.json({ error: "Failed to post item" }, { status: 400 });
  }
}
