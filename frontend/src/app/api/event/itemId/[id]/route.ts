import { NextResponse } from "next/server";
import connect from "../../../../../../utils/db";
import Events from "../../../../../models/Events";
import { verifyAdmin, verifyDonor } from "hooks/verify";

type IParams = {
  params: {
    id: string;
  };
};
// Get event by itemID
export async function GET(req: Request, { params }: IParams) {
  if (!((await verifyAdmin()) || (await verifyDonor()))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 401 });
  }
  const { id } = await params;

  try {
    await connect();
    const events = await Events.find({ itemId: id });
    return NextResponse.json(events, { status: 200 });
  } catch (err) {
    console.error("[EVENT_GET_ERROR]", err);
    return NextResponse.json({ error: "Failed to get event" }, { status: 400 });
  }
}

// Delete event by itemID
export async function DELETE(req: Request, { params }: IParams) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 401 });
  }
  const { id } = await params;

  try {
    await connect();
    await Events.deleteMany({ itemId: id });
    return NextResponse.json({ status: 200 });
  } catch (err) {
    console.error("[EVENT_DELETE_ERROR]", err);
    return NextResponse.json(
      { error: "Failed to delete event" },
      { status: 400 },
    );
  }
}
