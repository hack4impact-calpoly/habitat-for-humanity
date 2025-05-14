import { NextResponse } from "next/server";
import connect from "../../../../../../utils/db";
import Items from "../../../../../models/Items";

type IParams = {
    params: {
        status: string
    }
}

export async function GET(req: Request, { params }: IParams) {
    const { status } = await params;
    try {
        await connect();
        let statuses: string[] = [];
        switch (status) {
            case "active":
                statuses = ["Approved and Scheduled", "Send Receipt"];
                break;
            case "approvals":
                statuses = ["Needs Approval"];
                break;
            case "history":
                statuses = ["Completed", "Rejected"];
                break;
            default:
                statuses = [];
        }
        const items = await Items.find({ status: { $in: statuses } });
        return NextResponse.json(items, { status: 200 });
    } catch (err) {
        console.error("[ITEM_FETCH_ERROR]", err);
        return NextResponse.json({ error: "Failed to fetch items" }, { status: 400 });
    }
}