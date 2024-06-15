import Tasks from "@/models/task";
import Users from "@/models/user";
import { dbConnect } from "@/utils/mongoose";
import { NextResponse, NextRequest } from "next/server";
import { decodeJWT } from "@/utils/decodejwt";
import type { JwtPayload } from "jsonwebtoken";

interface TaskInterface {
	user_id: string;
	title: string;
	description: string;
	startDate: Date;
	endDate: Date;
	status: string;
}

export async function GET(req: NextRequest) {
  await dbConnect();

  const token = req.headers.get("Authorization") as string;
  const decoded = decodeJWT(token) as JwtPayload;

  if(!decoded) {
    return NextResponse.json({
      success: false,
      message: "You are not authorized",
      status: 401,
    });
  }

  const user = await Users.findById(decoded.id);
  const tasks = await Tasks.find({ user_id: decoded.id });

  return NextResponse.json({
    success: true,
    message: "Tasks fetched successfully",
    status: 200,
    data: {
      tasks,
      user,
      taskCount: tasks.length,
      taskCompleted: tasks.filter((task) => task.status === "completed").length,
      taskUncompleted: tasks.filter((task) => task.status === "uncompleted").length,
    },
  });
}

export async function POST(req: NextRequest) {
  await dbConnect();

  const token = req.headers.get("Authorization") as string;
  const decoded = decodeJWT(token) as JwtPayload;

  if(!decoded) {
    return NextResponse.json({
      success: false,
      message: "You are not authorized",
      status: 401,
    });
  }

  const { title, description, startDate, endDate }: TaskInterface = await req.json();

  // end date should be greater than start date
  if(new Date(endDate) < new Date(startDate)) {
    return NextResponse.json({
      success: false,
      message: "End date should be greater than start date",
      status: 400,
    });
  }

  const tasks = await Tasks.create({ user_id: decoded.id, title, description, startDate, endDate, status: "uncompleted" });

  return NextResponse.json({
    success: true,
    message: "Tasks created successfully",
    status: 201,
    data: tasks,
  });
}
