import { connect, connection } from "mongoose";

export async function dbConnect() {
  if (connection.readyState >= 1) return;

  return await connect(process.env.MONGODB_URL as string);
}

connection.on("connected", () => console.log("Mongodb connected to db"));

connection.on("error", (err) => console.error("Mongodb Errro:", err.message));
