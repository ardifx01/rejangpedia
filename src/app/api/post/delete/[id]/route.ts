import rejangpedia from "@/controllers/post";
import Users from "@/controllers/user";
import { NextRequest, NextResponse } from "next/server";

const dataInstance = rejangpedia.getInstance();
const userInstance = Users.getInstances();

export async function DELETE(req: NextRequest) {
  const user = await userInstance.authRequest(req);
  if (!user)
    return NextResponse.json({ msg: "Invalid Authentication." }, { status: 401 });

  const isRecruiterAdmin = await userInstance.checkAdmin(user._id || "");
  if (isRecruiterAdmin) {
    const id = req.nextUrl.pathname.split("/").pop(); // Extracting the ID correctly
    await dataInstance.delete(id || "", false);
    return NextResponse.json({ msg: "Post deleted successfully." }); // Return after successful deletion
  }

  return NextResponse.json({ msg: "Unauthorized action." }, { status: 403 }); // Handle non-admin cases
}
