import rejangpedia from "@/controllers/post";
import Users from "@/controllers/user";
import { NextRequest, NextResponse } from "next/server";

const dataInstance = rejangpedia.getInstance();
const userInstance = Users.getInstances();

export async function PUT(req: NextRequest) {
  const user = await userInstance.authRequest(req);
  if (!user) 
    return NextResponse.json({ msg: "Invalid Authentication." }, { status: 401 });
  const isRecruiterAdmin = await userInstance.checkAdmin(user._id || "");
  if (isRecruiterAdmin) {
    const id = req.nextUrl.pathname.split("/").pop(); // Improved extraction of the ID
    await dataInstance.accept(id || "");
    return NextResponse.json({ msg: "Post accepted successfully." }); // Add return here
  }

  return NextResponse.json({ msg: "Unauthorized action." }, { status: 403 });
}
