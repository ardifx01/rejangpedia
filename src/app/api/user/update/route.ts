import Users from "@/controllers/user";
import { NextRequest, NextResponse } from "next/server";
import imagekit from "@/utils/imagekit";

const userInstance = Users.getInstances();

/**
 * @param {NextRequest} req
 */
export async function POST(req: NextRequest) {
    const user = await userInstance.authRequest(req);
    if (!user) return NextResponse.json({ msg: "Invalid Authentication." }, { status: 401 });

    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
        return NextResponse.json({ msg: "Invalid content type. Expected multipart/form-data." }, { status: 400 });
    }

    try {
        // Parse the FormData
        const formData = await req.formData();
        const _id = formData.get("_id") as string;
        const desc = formData.get("desc") as string;

        // Update the user profile
        await userInstance.editProfile(
            {
                _id,
                desc,
                username: user.username,
            },
        );

        return NextResponse.json({ msg: "Profile updated successfully!" }, { status: 200 });
    } catch (error) {
        console.error("Error processing request:", error);
        return NextResponse.json({ msg: "Failed to process request." }, { status: 500 });
    }
}