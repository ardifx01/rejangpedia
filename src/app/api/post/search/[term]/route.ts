
import rejangpedia from "@/controllers/post";
import { NextRequest, NextResponse } from "next/server";

const dataInstance = rejangpedia.getInstance()

export async function GET(req: NextRequest) {
    const searchTerm = req.nextUrl.pathname.split("/")[4]
    const page = parseInt(req.nextUrl.searchParams.get("page") || "1", 10); 
    const limit = parseInt(req.nextUrl.searchParams.get("limit") || "5", 10);
    
    const data = await dataInstance.search(searchTerm, page, limit);
    if (!data) return NextResponse.json({ msg: "data not found!" }, { status: 404 })

    return NextResponse.json({data})
}