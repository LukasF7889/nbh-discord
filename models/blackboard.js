import mongoose from "mongoose";
import { missionSchema } from "./mission.js";
import Blackboard from "../classes/entities/BlackBoardClass.js";

const blackboardSchema = new mongoose.Schema({
  currentMissions: [missionSchema],
  lastUpdated: Date,
  key: String,
});

export default mongoose.model("Blackboard", blackboardSchema);

// Converting mongoose document into a oop class
export function toBlackboardClass(mongooseMissionDoc) {
  // .toObject() removes mongoose specific fields
  return new Blackboard(mongooseMissionDoc.toObject());
}
