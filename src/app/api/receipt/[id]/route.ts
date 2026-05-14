import { NextResponse } from "next/server";
import connect from "../../../../../utils/db";
import Receipts from "../../../../models/Receipts";
import { verifyAdmin } from "hooks/verify";

type IParams = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(req: Request, { params }: IParams) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 401 });
  }
  const { id } = await params;

  try {
    await connect();
    const receipt = await Receipts.findOne({ _id: id });
    if (!receipt) {
      return NextResponse.json({ error: "Receipt not found" }, { status: 404 });
    }
    return NextResponse.json(receipt, { status: 200 });
  } catch (err) {
    console.error("[RECEIPT_FETCH_ERROR]", err);
    return NextResponse.json(
      { error: "Failed to fetch receipt" },
      { status: 400 },
    );
  }
}
