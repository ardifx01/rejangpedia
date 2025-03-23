
import rejangpedia from "@/controllers/post";
import { NextRequest, NextResponse } from "next/server";

const dataInstance = rejangpedia.getInstance()

export async function GET(req: NextRequest) {
    const id = req.nextUrl.pathname.split("/")[4].replace("%20", " ")
    const data = await dataInstance.getDetails(id, true)
    if (!data) return NextResponse.json({ msg: "data not found!" }, { status: 404 })

    return NextResponse.json(data)
}