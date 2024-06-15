import mongoose, { Schema } from "mongoose";

const taskSchema = new Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
		title: String,
		description: String,
		startDate: Date,
		endDate: Date,
		status: String,
  },
  { timestamps: true }
);

const Tasks = mongoose.models.Tasks || mongoose.model("Tasks", taskSchema);

export default Tasks;
