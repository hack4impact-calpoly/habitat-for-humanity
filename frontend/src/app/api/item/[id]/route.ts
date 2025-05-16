import { NextResponse } from "next/server";
import connect from "../../../../../utils/db";
import Items from "../../../../models/Items";
import { verifyAdmin, verifyDonor } from "hooks/verify";

type IParams = {
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
    const item = await Items.findOne({ _id: id });
    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }
    return NextResponse.json(item, { status: 200 });
  } catch (err) {
    console.error("[ITEM_FETCH_ERROR]", err);
    return NextResponse.json(
      { error: "Failed to fetch items" },
      { status: 400 },
    );
  }
}

export async function PUT(req: Request, { params }: IParams) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 401 });
  }
  const { id } = await params;
  const itemData = await req.json();
  try {
    await connect();
    const updatedItem = await Items.findOneAndUpdate({ _id: id }, itemData, {
      new: true,
    });

    if (!updatedItem) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    return NextResponse.json(
      { msg: "Item updated", updatedItem },
      { status: 200 },
    );
  } catch (err) {
    console.error("[ITEM_UPDATE_ERROR]", err);
    return NextResponse.json(
      { error: "Failed to update item" },
      { status: 400 },
    );
  }
}
