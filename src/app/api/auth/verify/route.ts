import Users from "@/models/user";
import { dbConnect } from "@/utils/mongoose";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  await dbConnect();

  const { verificationCode } = await req.json();

	const user = await Users.findOne({ verificationCode });
	if (!user) {
		return NextResponse.json({
			success: false,
			message: "Invalid verification code",
			status: 400,
		});
	}

	user.verifiedAt = new Date();
	await user.save();

	return NextResponse.json({
		success: true,
		message: "Account verified successfully",
		status: 200,
	});
}
