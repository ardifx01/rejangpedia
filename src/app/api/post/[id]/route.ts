
import rejangpedia from "@/controllers/post";
import { NextRequest, NextResponse } from "next/server";

const dataInstance = rejangpedia.getInstance()

export async function GET(req: NextRequest) {
    const id = req.nextUrl.pathname.split("/")[3].replace("%20", " ")
    const data = await dataInstance.getDetails(id, false)
    console.log(id)
    if (!data) return NextResponse.json({ msg: "data not found!" }, { status: 404 })

    return NextResponse.json(data)
}