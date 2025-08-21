import mongoose from "mongoose";
import Mission from "./models/mission.js";
import dotenv from "dotenv";

dotenv.config();

async function clearMissions() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Mission.deleteMany({});
    console.log("✅ Alle Missionen gelöscht");
    await mongoose.disconnect();
  } catch (error) {
    console.error(error);
  }
}

clearMissions();
