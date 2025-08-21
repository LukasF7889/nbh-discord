import mongoose from "mongoose";
import dotenv from "dotenv";
import Mission from "./models/mission.js";
import Blackboard from "./models/blackboard.js";

dotenv.config();

async function getMissions() {
  try {
    mongoose.connect(process.env.MONGO_URI);
    const currMissions = await Mission.find();
    const updatedBlackBoard = Blackboard.findOneAndUpdate(
      {},
      {
        currentMissions: currMissions,
        lastUpdated: new Date(),
      },
      { upsert: true, new: true }
    );

    console.log("✅ Missionen zum Aushang hinzugefügt.");
    await mongoose.disconnect();
  } catch (error) {
    console.error(error);
  }
}

getMissions();
