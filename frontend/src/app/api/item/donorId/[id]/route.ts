import { NextResponse } from "next/server";
import connect from "../../../../../../utils/db";
import Items from "../../../../../models/Items";
import { verifyAdmin, verifyDonor } from "hooks/verify";

export type IParams = {
  params: {
    id: string;
  };
};

export async function GET(req: Request, { params }: IParams) {
  if (!((await verifyAdmin()) || (await verifyDonor()))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 401 });
  }
  const { id } = await params;
  try {
    await connect();
    const items = await Items.find({ donorId: id });
    return NextResponse.json(items, { status: 200 });
  } catch (err) {
    console.error("[ITEM_FETCH_ERROR]", err);
    return NextResponse.json(
      { error: "Failed to fetch items" },
      { status: 400 },
    );
  }
}
