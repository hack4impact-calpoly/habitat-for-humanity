import { NextResponse } from "next/server";
import connect from "../../../../utils/db";
import Items from "../../../models/Items";

export async function GET(req: Request) {
    try {
        await connect();
        const items = await Items.find({});
        return NextResponse.json(items, { status: 200 });
    } catch (err) {
        console.error("[ITEM_FETCH_ERROR]", err);
        return NextResponse.json({ error: "Failed to fetch items" }, { status: 400 });
    }
}

export async function POST(req: Request) {
    const item = await req.json();

    try {
        await connect()
        const newItem = new Items(item);
        await newItem.save()
        return NextResponse.json({ msg: `${newItem} added` }, { status: 200 });
    } catch (err) {
        console.error("[ITEM_POST_ERROR]", err);
        return NextResponse.json({ error: "Failed to post item" }, { status: 400 });
    }
}