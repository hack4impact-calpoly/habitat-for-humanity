import { NextResponse } from "next/server";
import connect from "../../../../../../utils/db";
import Items from "../../../../../models/Items";

export type IParams = {
    params: {
        id: string
    }
}

export async function GET(req: Request, { params }: IParams) {
    const { id } = await params; 
    try {
        await connect();
        const items = await Items.find({ donorId: id});
        return NextResponse.json(items, { status: 200 });
    } catch (err) {
        console.error("[ITEM_FETCH_ERROR]", err);
        return NextResponse.json({ error: "Failed to fetch items" }, { status: 400 });
    }
}