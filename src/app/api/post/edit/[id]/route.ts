import rejangpedia from "@/controllers/post";
import Users from "@/controllers/user";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import imagekit from "@/utils/imagekit"; // Assuming ImageKit setup here

const dataInstance = rejangpedia.getInstance();
const userInstance = Users.getInstances();

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  // Handle Authorization Token
  const headersList: any = await headers();
  const authHeader = headersList.get("authorization");
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

  const checkToken = await userInstance.checkAccessToken(token);
  if (!checkToken) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
  const id = req.nextUrl.pathname.split("/")[4].replace("%20", " ")

  // Prepare Book Data from FormData
  const book: any = {
    id: id,
    Title: formData.get("title") as string,
    Diedit: formData.get("edit") as string,
    Link: formData.get("link") as string,
  };

  // Handle Content Parsing (String or Array)
  const content = formData.get("content") as string; // content serialized as JSON
  try {
    const parsedContent = JSON.parse(content);
    book.Content = Array.isArray(parsedContent) ? parsedContent : parsedContent || "";
  } catch (error) {
    console.error("Error parsing content:", error);
    book.Content = content || "";
  }

  const file = formData.get("image") as File | null;

  // Edit Book Data in Database
  const post = await dataInstance.edit(book);

  // Handle Image Upload if Provided
  if (file && post) {
    const buffer = await file.arrayBuffer();

    try {
      const uploadResult = await imagekit.upload({
        file: Buffer.from(buffer),
        fileName: `image-${post.id}.jpg`,
        useUniqueFileName: false,
        folder: "RejangPedia",
      });

      if (uploadResult && uploadResult.url) {
        console.log("Image uploaded successfully:", uploadResult.url);
      } else {
        console.warn("Image upload failed.");
      }
    } catch (uploadError) {
      console.error("Image upload error:", uploadError);
    }
  }

  return NextResponse.json({ post });
}
