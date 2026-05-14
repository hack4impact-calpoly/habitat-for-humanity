import { NextResponse } from "next/server";
import connect from "../../../../utils/db";
import Receipts from "../../../models/Receipts";
import { verifyAdmin, verifyInStore } from "hooks/verify";

export async function POST(req: Request) {
  if (!(await verifyAdmin()) && !(await verifyInStore())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 401 });
  }
  const { pdf, itemId } = await req.json();

  try {
    await connect();
    const newReceipt = new Receipts({ pdf, itemId });
    await newReceipt.save();
    return NextResponse.json(
      { receiptId: newReceipt._id.toString() },
      { status: 200 },
    );
  } catch (err) {
    console.error("[RECEIPT_POST_ERROR]", err);
    return NextResponse.json(
      { error: "Failed to save receipt" },
      { status: 400 },
    );
  }
}

export async function GET() {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 401 });
  }

  try {
    await connect();
    const receipts = await Receipts.find({});
    return NextResponse.json(receipts, { status: 200 });
  } catch (err) {
    console.error("[RECEIPT_GET_ERROR]", err);
    return NextResponse.json(
      { error: "Failed to fetch receipts" },
      { status: 400 },
    );
  }
}
