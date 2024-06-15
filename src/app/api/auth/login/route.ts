import Users from "@/models/user";
import { dbConnect } from "@/utils/mongoose";
import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

interface UserInterface {
  email: string;
  password: string;
}

export async function POST(req: NextRequest, res: NextResponse) {
  await dbConnect();

  const { email, password }: UserInterface = await req.json();

  const user = await Users.findOne({ email });
	if (!user) {
		return NextResponse.json({
			success: false,
			message: "You are not registered",
			status: 404,
		});
	}

	const isPasswordMatch = await bcrypt.compare(password, user.password);
	if (!isPasswordMatch) {
		return NextResponse.json({
			success: false,
			message: "Your password is incorrect",
			status: 400,
		});
	}

	const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
		expiresIn: "1d",
	});

	return NextResponse.json({
    success: true,
    message: "Logged in successfully",
    status: 200,
    data: {
			user_id: user._id,
			token,
		}
  });
}
