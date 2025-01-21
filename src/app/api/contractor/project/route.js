import mongoose from "mongoose";
import { NextResponse } from "next/server";
import Project from "@/models/Project";
import connectDB from "@/lib/db";

export async function GET() {
    await connectDB();

    try {
        const projects = await Project.find({ companyId: req.user.companyId }).populate('companyId');
        return NextResponse.json(projects);
    } catch (error) {
        return NextResponse.json({ message: 'Error fetching sub-companies' }, { status: 500 });
    }
}
