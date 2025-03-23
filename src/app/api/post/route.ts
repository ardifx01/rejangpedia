
import rejangpedia from "@/controllers/post";
import Users from "@/controllers/user";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import imagekit from "@/utils/imagekit";; // Assuming you have ImageKit initialized here

const dataInstance = rejangpedia.getInstance()
const userInstance = Users.getInstances();

export async function GET(req: NextRequest) {
    const data = await dataInstance.getRecomendation()

    if (!data) return NextResponse.json({ msg: "data not found!" }, { status: 404 })

    return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const headersList: any = await headers();
  const authHeader = headersList.get("authorization");
  const token = authHeader && authHeader.split(" ")[1]; // Extract token from Bearer
  if (!token) return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  const checkToken = await userInstance.checkAccessToken(token);
  if (!checkToken) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
  const book = {
    Title: formData.get("title") as string,
    Pembuat: formData.get("pembuat") as string,
    Link: formData.get("link") as string,
    Content: formData.get("content") as string,
};

  const file = formData.get("image") as File | null; // Image file (optional)
  const post = await dataInstance.create(book);

  // If there is a file, process and upload it
  if (file) {
    const buffer = await file.arrayBuffer(); // Convert File object to buffer

    // Upload image to ImageKit (replace with your upload logic)
    const uploadResult = await imagekit.upload({
      file: Buffer.from(buffer), // Uploading buffer data
      fileName: `image-${post.id}.jpg`,
      useUniqueFileName: false,
      folder: "RejangPedia",
    });

    if (!uploadResult || !uploadResult.url) {
      throw new Error("Image upload failed");
    }
  }

  return Response.json({ post });
}
