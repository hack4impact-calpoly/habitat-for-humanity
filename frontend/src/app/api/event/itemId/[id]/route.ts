import { NextResponse } from "next/server";
import connect from "../../../../../../utils/db";
import Events from "../../../../../models/Events";

type IParams = {
    params: {
        id: string
    }
}
// Delete event by itemID
export async function DELETE(req: Request, { params }: IParams) {
    const { id } = await params;

    try {
        await connect();
        await Events.findOneAndDelete({ itemId: id });
        return NextResponse.json({ status: 200 });
    } catch (err) {
        console.error("[EVENT_DELETE_ERROR]", err);
        return NextResponse.json({ error: "Failed to delete event" }, { status: 400 });
    }
}