
import rejangpedia from "@/controllers/post";
import { NextRequest, NextResponse } from "next/server";

const dataInstance = rejangpedia.getInstance()

export async function GET(req: NextRequest) {
    const data = await dataInstance.getRecomendation()

    if (!data) return NextResponse.json({ msg: "data not found!" }, { status: 404 })

    return NextResponse.json(data)
}