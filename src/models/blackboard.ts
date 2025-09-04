import mongoose from "mongoose";
import { Document } from "mongodb";
import { missionSchema } from "./mission.js";
import BlackboardClass from "../classes/entities/BlackboardClass.js";
import MissionClass from "../classes/entities/MissionClass.js";

const blackboardSchema = new mongoose.Schema({
  currentMissions: [missionSchema],
  lastUpdated: Date,
  key: String,
  refreshTime: Number,
});

export default mongoose.model("Blackboard", blackboardSchema);

// Converting mongoose document into a oop class
export function toBlackboardClass(doc: Document | null) {
  if (!doc) return null;
  const obj = typeof doc.toObject === "function" ? doc.toObject() : doc;

  //check if lastUpdated ist a date object
  obj.lastUpdated = obj.lastUpdated ? new Date(obj.lastUpdated) : null;

  // map currentMissions into MissionClass objects
  obj.currentMissions = obj.currentMissions.map(
    (m: MissionClass) => new MissionClass(m)
  );

  return new BlackboardClass(obj);
}
