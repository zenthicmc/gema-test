import Users from "@/models/user";
import { dbConnect } from "@/utils/mongoose";
import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { transporter } from "@/utils/mail";

interface UserInterface {
	username: string;
	email: string;
	password: string;
	confirmPassword: string;
}

export async function POST(req: NextRequest) {
	await dbConnect();

	const { username, email, password, confirmPassword }: UserInterface = await req.json();
	
	if(password !== confirmPassword) {
		return NextResponse.json({
			success: false,
			message: "Confirmation password do not match",
			status: 400,
		});
	}

	// find user where email = email or username = username
	const user = await Users.findOne({ $or: [{ email }, { username }] });
	if(user) {
		return NextResponse.json({
			success: false,
			message: "User with this email or username is already exists",
			status: 400,
		});
	}

	const verificationCode = Math.floor(100000 + Math.random() * 900000);
	const hashedPassword = await bcrypt.hash(password, 15);
	const createUser = await Users.create({ username, email, password: hashedPassword, verificationCode });

	// send mail to user
	await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: email,
    subject: "Account Verification",
    html: `
			<h1>Account Verification</h1>
			<p>Use the following code to verify your account</p>
			<h2>${verificationCode}</h2>
		`,
  });

	return NextResponse.json({
    success: true,
    message: "User created successfully",
    status: 201,
    data: createUser,
  });
}