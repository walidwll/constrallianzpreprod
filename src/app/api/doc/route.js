import connectDB from "@/lib/db";
import Documents from "@/models/Documents";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connectDB();
        const documents = await Documents.findOne();
        return NextResponse.json(documents || {});
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
