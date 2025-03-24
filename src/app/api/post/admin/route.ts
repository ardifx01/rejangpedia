import Books from "@/controllers/post";
import Users from "@/controllers/user";
import { NextRequest, NextResponse } from "next/server";

const userInstance = Users.getInstances();
const bookInstance = Books.getInstance();

export async function GET(req: NextRequest) {
  const page = parseInt(req.nextUrl.searchParams.get("page") || "1", 10); // Default page = 1
  const limit = parseInt(req.nextUrl.searchParams.get("limit") || "5", 10); // Default limit = 5
    
  try {
    // Ambil buku berdasarkan userId dengan pagination
    const posts = await bookInstance.postList(page, limit);
    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Error fetching books:", error);
    return NextResponse.json({ msg: "Failed to fetch books." }, { status: 500 });
  }
}