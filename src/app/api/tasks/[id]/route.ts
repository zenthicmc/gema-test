import Tasks from "@/models/task";
import { dbConnect } from "@/utils/mongoose";
import { NextResponse, NextRequest } from "next/server";

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

  const tasks = await Tasks.find();

  return NextResponse.json({
    success: true,
    message: "Tasks fetched successfully",
    status: 200,
    data: tasks,
  });
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();

  const { id } = params;
  const task = await Tasks.findById(id);

  if (!task) {
    return NextResponse.json({
      success: false,
      message: "Task not found",
      status: 404,
    });
  }

  if (task.status === "completed") {
    return NextResponse.json({
      success: false,
      message: "Task is already completed",
      status: 400,
    });
  }

  task.status = "completed";
  await task.save();

  return NextResponse.json({
    success: true,
    message: "Task completed successfully",
    status: 200,
  });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();

  const { id } = params;
  const { title, description, startDate, endDate }: TaskInterface = await req.json();

  const task = await Tasks.findById(id);
  if (!task) {
    return NextResponse.json({
      success: false,
      message: "Task not found",
      status: 404,
    });
  }

  if (new Date(endDate) < new Date(startDate)) {
    return NextResponse.json({
      success: false,
      message: "End date should be greater than start date",
      status: 400,
    });
  }

  // update task
  task.title = title;
  task.description = description;
  task.startDate = startDate;
  task.endDate = endDate;
  await task.save();

  return NextResponse.json({
    success: true,
    message: "Task updated successfully",
    status: 200,
    data: task,
  });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();

  const { id } = params;
  await Tasks.findByIdAndDelete(id);

  return NextResponse.json({
    success: true,
    message: "Task deleted successfully",
    status: 200,
  });
}