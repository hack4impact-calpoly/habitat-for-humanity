import { NextResponse } from "next/server";
import connect from "../../../../../../utils/db";
import Events from "../../../../../models/Events";

type IParams = {
    params: {
        id: string
    }
}
// Get event by itemID
export async function GET(req: Request, { params }: IParams) {
    const { id } = await params;

    try {
        await connect();
        const event = await Events.findOne({ itemId: id });
        return NextResponse.json(event, { status: 200 });
    } catch (err) {
        console.error("[EVENT_GET_ERROR]", err);
        return NextResponse.json({ error: "Failed to get event" }, { status: 400 });
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