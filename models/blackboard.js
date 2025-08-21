import mongoose from "mongoose";
import { missionSchema } from "./mission.js";

const blackboardSchema = new mongoose.Schema({
  currentMissions: [missionSchema],
  lastUpdated: Date,
});

export default mongoose.model("Blackboard", blackboardSchema);
