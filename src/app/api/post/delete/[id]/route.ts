
import rejangpedia from "@/controllers/post";
import Users from "@/controllers/user";
import { NextRequest, NextResponse } from "next/server";

const dataInstance = rejangpedia.getInstance()
const userInstance = Users.getInstances()

export async function DELETE(req: NextRequest) {
        const user = await userInstance.authRequest(req);
        if (!user) return NextResponse.json({ msg: "Invalid Authentication." }, { status: 401 });
        const isRecruiterAdmin = await userInstance.checkAdmin(user.id || "");
        if(isRecruiterAdmin) {
            const id = req.nextUrl.pathname.split("/")
            await dataInstance.delete(id, false)
        }
}